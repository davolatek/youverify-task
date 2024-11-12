import axios from "axios";
import { OrderService } from "../../src/services/OrderService";
import Order from "../../src/models/Order";
import { publishEvent } from "../../src/event/EventPublisher";

jest.mock("axios");
jest.mock("../models/Order");
jest.mock("../event/EventPublisher");

describe("OrderService", () => {
  const orderService = new OrderService();
  const itemId = "123";
  const quantity = 2;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should create an order when stock is sufficient", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { stock: 5 } });
    (Order.create as jest.Mock).mockResolvedValue({
      id: "order-id",
      itemId,
      quantity,
      status: "CONFIRMED",
    });

    const result = await orderService.createOrder(itemId, quantity);

    expect(result.success).toBe(true);
    expect(result.order).toMatchObject({
      itemId,
      quantity,
      status: "CONFIRMED",
    });
    expect(publishEvent).toHaveBeenCalledWith({
      type: "OrderCreated",
      order: result.order,
    });
    expect(axios.patch).toHaveBeenCalledWith(
      `${process.env.INVENTORY_SERVICE_URL}/api/inventory/${itemId}`,
      { quantity: -quantity }
    );
  });

  test("should not create an order when stock is insufficient", async () => {
    (axios.get as jest.Mock).mockResolvedValue({ data: { stock: 1 } });

    const result = await orderService.createOrder(itemId, quantity);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Insufficient stock");
    expect(publishEvent).toHaveBeenCalledWith({
      type: "OrderFailed",
      itemId,
      quantity,
    });
    expect(axios.patch).not.toHaveBeenCalled();
  });

  test("should handle errors gracefully", async () => {
    (axios.get as jest.Mock).mockRejectedValue(new Error("Network error"));

    const result = await orderService.createOrder(itemId, quantity);

    expect(result.success).toBe(false);
    expect(result.message).toBe("Order creation failed");
    expect(publishEvent).not.toHaveBeenCalledWith({
      type: "OrderCreated",
      order: expect.anything(),
    });
  });
});
