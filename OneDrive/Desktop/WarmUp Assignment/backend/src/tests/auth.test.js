import request from "supertest";

// Mock or setup app
// We need to ensure server doesn't start listening if imported
import app from "../../src/server.js";
import db from "../../src/db.js";

describe("Auth routes", () => {

  // We can seed a user or just trust correct environment
  const testUser = { email: "test_auth@example.com", password: "password123" };
  let token;

  beforeAll(async () => {
    // Optional: cleanup or seed
    await db.query("DELETE FROM users WHERE email = $1", [testUser.email]);

    // Register first to ensure user exists (since we use a real DB)
    await request(app)
      .post("/api/auth/register")
      .send(testUser);
  });

  test("POST /api/auth/login should return token for valid creds", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send(testUser)
      .expect(200);

    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  test("GET /api/auth/me should return user when authorized", async () => {
    const me = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    // My controller returns the user object directly
    expect(me.body).toHaveProperty("email", testUser.email);
    expect(me.body).toHaveProperty("id");
  });

  test("GET /api/auth/me unauthorized without token", async () => {
    await request(app).get("/api/auth/me").expect(401);
  });

  afterAll(async () => {
    await db.query("DELETE FROM users WHERE email = $1", [testUser.email]);
    await db.end(); // Close pool
  });
});
