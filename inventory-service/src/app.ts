import express from "express";
import mongoose from "mongoose";
import { InventoryController } from "./controllers/InventoryController";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL || "mongodb://mongo:27017/inventory";
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.post("/items", InventoryController.addItem);
app.put("/items/:id/stock", InventoryController.updateStock);
app.get("/items/:id", InventoryController.getItem);

export default app;
