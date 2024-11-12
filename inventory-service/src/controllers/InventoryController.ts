import { Request, Response } from "express";
import { InventoryRepository } from "../repositories/InventoryRepository";
import { EventPublisher } from "../events/EventPublisher";
import logger from "../logs/Logger";

export class InventoryController {
  static async addItem(req: Request, res: Response) {
    const { name, quantity, price } = req.body;
    try {
      const item = await InventoryRepository.addItem(name, quantity, price);

      // Publish stock creation event
      await EventPublisher.publish("stock-created", {
        itemId: item._id,
        quantity,
      });

      // Log the stock creation
      logger.info(`Stock created for item ${item._id}`, { item });

      res.status(201).json(item);
    } catch (error) {
      logger.error("Error adding item", { error });
      res.status(500).json({ error: "Failed to add item" });
    }
  }

  static async updateStock(req: Request, res: Response) {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
      const item = await InventoryRepository.updateStock(id, quantity);

      // Publish stock update event
      await EventPublisher.publish("stock-updated", { itemId: id, quantity });

      // Log the stock update
      logger.info(`Stock updated for item ${id}`, { item });

      res.json(item);
    } catch (error) {
      logger.error("Error updating stock", { error });
      res.status(500).json({ error: "Failed to update stock" });
    }
  }

  static async getItem(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const item = await InventoryRepository.getItem(id);
      res.json(item);
    } catch (error) {
      logger.error("Error fetching item", { error });
      res.status(500).json({ error: "Failed to fetch item" });
    }
  }
}
