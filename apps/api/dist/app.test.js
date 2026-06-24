import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "./app.js";
import { InMemoryStore } from "./store-inmemory.js";
async function login() {
    const store = new InMemoryStore();
    const app = createApp(store);
    const response = await request(app).post("/api/auth/login").send({ email: "demo@finsphere.ai", password: "Demo@12345" });
    return { app, token: response.body.token };
}
describe("auth", () => {
    it("logs in demo user", async () => {
        const { app } = await login();
        const response = await request(app).post("/api/auth/login").send({ email: "demo@finsphere.ai", password: "Demo@12345" });
        expect(response.status).toBe(200);
        expect(response.body.token).toBeTruthy();
    });
    it("rejects protected routes without token", async () => {
        const store = new InMemoryStore();
        const app = createApp(store);
        const response = await request(app).get("/api/dashboard/summary");
        expect(response.status).toBe(401);
    });
});
describe("finance modules", () => {
    it("creates and lists an expense", async () => {
        const { app, token } = await login();
        const created = await request(app)
            .post("/api/expenses")
            .set("Authorization", `Bearer ${token}`)
            .send({ amount: 999, category: "Food", description: "Coffee subscription", date: "2026-06-24" });
        expect(created.status).toBe(201);
        const listed = await request(app).get("/api/expenses").set("Authorization", `Bearer ${token}`);
        expect(listed.body.expenses.some((expense) => expense.description === "Coffee subscription")).toBe(true);
    });
    it("returns dashboard summary", async () => {
        const { app, token } = await login();
        const response = await request(app).get("/api/dashboard/summary").set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.financialHealthScore).toBeGreaterThan(0);
    });
});
