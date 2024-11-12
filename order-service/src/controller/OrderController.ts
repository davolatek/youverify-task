import { Request, Response, RequestHandler } from "express";
import { OrderService } from "../services/OrderService";

const orderService = new OrderService();

export const createOrder: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { itemId, quantity } = req.body;
  const result = await orderService.createOrder(itemId, quantity);
  res.status(result.success ? 201 : 400).json(result);
};

export const getOrder: RequestHandler = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = await orderService.getOrder(orderId);
  if (!order) res.status(404).json({ message: "Order not found" });
  res.json(order);
};
