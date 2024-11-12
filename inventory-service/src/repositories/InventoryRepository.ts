import { Item } from "../models/Item";

export class InventoryRepository {
  static async addItem(name: string, quantity: number, price: number) {
    const item = new Item({ name, quantity, price });
    return await item.save();
  }

  static async updateStock(id: string, quantity: number) {
    return await Item.findByIdAndUpdate(id, { quantity }, { new: true });
  }

  static async getItem(id: string) {
    return await Item.findById(id);
  }
}
