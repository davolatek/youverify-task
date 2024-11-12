import request from "supertest";
import app from "../../src/app";

describe("E2E Tests for Order Service", () => {
  let createdOrderId: string;

  test("should create an order and update inventory", async () => {
    const itemId = "123";
    const quantity = 3;

    const response = await request(app)
      .post("/api/orders")
      .send({ itemId, quantity });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    createdOrderId = response.body.order.id;
  });

  test("should retrieve an order by ID", async () => {
    const response = await request(app).get(`/api/orders/${createdOrderId}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: createdOrderId,
      itemId: "123",
      quantity: 3,
      status: "CONFIRMED",
    });
  });

  test("should return 404 for a non-existent order", async () => {
    const response = await request(app).get("/api/orders/nonexistent");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Order not found" });
  });
});
