import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  itemId: string;
  quantity: number;
  status: string; // e.g., "PENDING", "CONFIRMED", "FAILED"
}

const OrderSchema = new Schema<IOrder>(
  {
    itemId: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
