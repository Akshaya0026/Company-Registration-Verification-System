import request from "supertest";
import app from "../../src/server.js";
import db from "../../src/db.js";

describe("Companies endpoints", () => {
  let token;
  const testUser = { email: "test_company@example.com", password: "password123" };
  const companyData = { name: "Test Co", city: "Mumbai" };

  beforeAll(async () => {
    await db.query("DELETE FROM users WHERE email = $1", [testUser.email]);

    // Register & Login
    await request(app).post("/api/auth/register").send(testUser);
    const loginRes = await request(app).post("/api/auth/login").send(testUser);
    token = loginRes.body.token;
  });

  test("GET /api/companies/me should be protected", async () => {
    await request(app).get("/api/companies/me").expect(401);
  });

  test("POST /api/companies creates a company", async () => {
    const res = await request(app)
      .post("/api/companies")
      .set("Authorization", `Bearer ${token}`)
      .send(companyData)
      .expect(200); // Controller returns 200 for upsert

    expect(res.body).toHaveProperty("message");
    expect(res.body.company).toHaveProperty("company_name", companyData.name);
  });

  test("GET /api/companies/me returns company details", async () => {
    const res = await request(app)
      .get("/api/companies/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty("company_name", companyData.name);
  });

  // Clean up
  afterAll(async () => {
    // Cascade delete user -> company
    await db.query("DELETE FROM users WHERE email = $1", [testUser.email]);
    await db.end();
  });
});
