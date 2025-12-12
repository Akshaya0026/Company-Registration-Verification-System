import db from '../db.js';

// Register or Update Company (Step-based or Full)
export const registerCompany = async (req, res) => {
    const {
        name,
        email, // Optional contact email
        phone,
        website,
        industry,
        foundedDate,
        address,
        city,
        state,
        country,
        postalCode
    } = req.body;

    const formattedDate = foundedDate === "" ? null : foundedDate;

    const userId = req.user.id; // From Auth Middleware

    try {
        // Check if company exists for user
        const existing = await db.query('SELECT * FROM companies WHERE owner_id = $1', [userId]);

        let result;
        if (existing.rows.length > 0) {
            // Update
            const query = `
        UPDATE companies 
        SET company_name = COALESCE($1, company_name),
            website = COALESCE($2, website),
            industry = COALESCE($3, industry),
            founded_date = COALESCE($4, founded_date),
            address = COALESCE($5, address),
            city = COALESCE($6, city),
            state = COALESCE($7, state),
            country = COALESCE($8, country),
            postal_code = COALESCE($9, postal_code),
            updated_at = CURRENT_TIMESTAMP
        WHERE owner_id = $10
        RETURNING *
      `;
            const values = [name, website, industry, formattedDate, address, city, state, country, postalCode, userId];
            result = await db.query(query, values);
        } else {
            // Insert
            const query = `
        INSERT INTO companies (owner_id, company_name, website, industry, founded_date, address, city, state, country, postal_code)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
            const values = [userId, name, website, industry, formattedDate, address, city, state, country, postalCode];
            result = await db.query(query, values);
        }

        res.status(200).json({ message: 'Company saved successfully', company: result.rows[0] });

    } catch (error) {
        console.error("Company Registration Error:", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// Upload Logo
export const uploadLogo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const userId = req.user.id;
        const logoUrl = req.file.path; // Cloudinary URL

        const query = 'UPDATE companies SET logo_url = $1 WHERE owner_id = $2 RETURNING *';
        const result = await db.query(query, [logoUrl, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Company not found. Register company details first.' });
        }

        res.json({ message: 'Logo uploaded successfully', logoUrl, company: result.rows[0] });

    } catch (error) {
        console.error("Logo Upload Error:", error);
        res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// Get Company Details
export const getMyCompany = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query('SELECT * FROM companies WHERE owner_id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.json({ message: 'No company registered' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}
