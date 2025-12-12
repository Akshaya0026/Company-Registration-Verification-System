import db from "../db.js";

export async function createCompanyRow(values) {
    const q = `
    INSERT INTO companies (owner_id, company_name, address, city, state, country, postal_code, website, created_at, updated_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8, now(), now())
    RETURNING *`;
    const { rows } = await db.query(q, values);
    return rows[0];
}

// ... add other helpers as needed
