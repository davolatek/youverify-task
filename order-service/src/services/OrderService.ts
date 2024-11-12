import axios from "axios";
import Order, { IOrder } from "../models/Order";
import logger from "../logs/Logger";
import { publishEvent } from "../event/EventPublisher";

export class OrderService {
  async createOrder(itemId: string, quantity: number) {
    const inventoryUrl = `${process.env.INVENTORY_SERVICE_URL}/api/inventory/${itemId}`;

    try {
      const response = await axios.get(inventoryUrl);
      const stock = response.data.stock;

      if (stock < quantity) {
        logger.info(`Insufficient stock for item ${itemId}`);
        publishEvent({ type: "OrderFailed", itemId, quantity });
        return { success: false, message: "Insufficient stock" };
      }

      const order: IOrder = await Order.create({
        itemId,
        quantity,
        status: "CONFIRMED",
      });
      await axios.patch(`${inventoryUrl}`, { quantity: -quantity });
      publishEvent({ type: "OrderCreated", order });
      return { success: true, order };
    } catch (error) {
      logger.error("Order creation failed", error);
      return { success: false, message: "Order creation failed" };
    }
  }

  async getOrder(orderId: string) {
    return await Order.findById(orderId);
  }
}
