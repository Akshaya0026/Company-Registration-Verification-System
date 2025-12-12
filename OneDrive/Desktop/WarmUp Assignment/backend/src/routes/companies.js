import express from "express";
import db from "../db.js";
import upload from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.js";
import { protect } from "../middleware/auth.js"; // your auth middleware

const router = express.Router();

// GET /api/companies?page=1&limit=10&q=searchTerm
router.get("/", protect, async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(100, parseInt(req.query.limit || "10", 10));
    const offset = (page - 1) * limit;
    const q = (req.query.q || "").trim();

    let baseQuery = `SELECT * FROM companies WHERE owner_id = $1`;
    const params = [ownerId];

    if (q) {
      params.push(`%${q}%`);
      baseQuery += ` AND (company_name ILIKE $${params.length} OR city ILIKE $${params.length})`;
    }

    // count total
    const countResult = await db.query(`SELECT COUNT(*) FROM (${baseQuery}) AS sub`, params);
    const total = parseInt(countResult.rows[0].count, 10);

    // add order/limit/offset
    params.push(limit, offset);
    const rowsQuery = `${baseQuery} ORDER BY id DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;
    const final = await db.query(rowsQuery, params);

    res.json({
      rows: final.rows,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
});

// Create company — accepts multipart/form-data (logo optional)
router.post("/", protect, upload.single("logo"), async (req, res, next) => {
  try {
    const ownerId = req.user.id;
    const {
      company_name, address='', city='', state='', country='', postal_code='', website=''
    } = req.body;

    let logo_url = null;
    if (req.file) {
      // upload buffer to cloudinary
      const result = await cloudinary.uploader.upload_stream_async
        ? await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: `companies/${ownerId}` },
              (error, res) => (error ? reject(error) : resolve(res))
            );
            stream.end(req.file.buffer);
          })
        : await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: `companies/${ownerId}` },
              (error, res) => (error ? reject(error) : resolve(res))
            );
            stream.end(req.file.buffer);
          });
      logo_url = result.secure_url;
    }

    const q = `INSERT INTO companies (owner_id, company_name, address, city, state, country, postal_code, website, logo_url)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;
    const values = [ownerId, company_name, address, city, state, country, postal_code, website, logo_url];
    const insert = await db.query(q, values);
    res.status(201).json(insert.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Update company (including optional logo)
router.put("/:id", protect, upload.single("logo"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.id;

    // ensure owner
    const check = await db.query("SELECT * FROM companies WHERE id=$1 AND owner_id=$2", [id, ownerId]);
    if (check.rows.length === 0) return res.status(404).json({ message: "Not found" });

    const {
      company_name = check.rows[0].company_name,
      address = check.rows[0].address,
      city = check.rows[0].city,
      state = check.rows[0].state,
      country = check.rows[0].country,
      postal_code = check.rows[0].postal_code,
      website = check.rows[0].website,
    } = req.body;

    let logo_url = check.rows[0].logo_url;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: `companies/${ownerId}` },
          (error, res) => (error ? reject(error) : resolve(res))
        );
        stream.end(req.file.buffer);
      });
      logo_url = result.secure_url;
    }

    const q = `UPDATE companies SET company_name=$1, address=$2, city=$3, state=$4, country=$5,
                postal_code=$6, website=$7, logo_url=$8 WHERE id=$9 RETURNING *`;
    const vals = [company_name, address, city, state, country, postal_code, website, logo_url, id];
    const updated = await db.query(q, vals);
    res.json(updated.rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
