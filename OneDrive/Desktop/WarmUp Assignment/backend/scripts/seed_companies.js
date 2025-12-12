import db from "../src/db.js";

async function seed() {
    try {
        const companies = [
            {
                owner_id: 2,
                company_name: "Acme Corp",
                address: "123 Main St",
                city: "Mumbai",
                state: "MH",
                country: "India",
                postal_code: "400001",
                website: "https://acme.example"
            },
            {
                owner_id: 2,
                company_name: "Beta Ltd",
                address: "456 Park Ave",
                city: "Pune",
                state: "MH",
                country: "India",
                postal_code: "411001",
                website: "https://beta.example"
            }
        ];

        for (const c of companies) {
            await db.query(
                `INSERT INTO companies 
          (owner_id, company_name, address, city, state, country, postal_code, website, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8, now(), now())`,
                [
                    c.owner_id,
                    c.company_name,
                    c.address,
                    c.city,
                    c.state,
                    c.country,
                    c.postal_code,
                    c.website
                ]
            );
        }

        console.log("Companies seeded");
        process.exit(0);
    } catch (err) {
        console.error("Companies seed failed:", err);
        process.exit(1);
    }
}

seed();
