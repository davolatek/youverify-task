import request from "supertest";
import axios from "axios";
import Order from "../../src/models/Order";
import app from "../../src/app";

jest.mock("axios");
jest.mock("../models/Order");

describe("Order API Integration Tests", () => {
  const itemId = "123";
  const quantity = 2;
  const order = { id: "order-id", itemId, quantity, status: "CONFIRMED" };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("POST /api/orders should create an order if inventory stock is sufficient", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { stock: 5 } });
    (Order.create as jest.Mock).mockResolvedValue(order);

    const response = await request(app)
      .post("/api/orders")
      .send({ itemId, quantity });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ success: true, order });
    expect(axios.patch).toHaveBeenCalledWith(
      `${process.env.INVENTORY_SERVICE_URL}/api/inventory/${itemId}`,
      { quantity: -quantity }
    );
  });

  test("POST /api/orders should not create an order if inventory stock is insufficient", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { stock: 1 } });

    const response = await request(app)
      .post("/api/orders")
      .send({ itemId, quantity });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      message: "Insufficient stock",
    });
  });
});
