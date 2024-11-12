import express, { Express } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./logs/Logger";
import * as orderController from "./controller/OrderController";

dotenv.config();

const app: Express = express();
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL || "mongodb://mongo:27017/inventory";
mongoose
  .connect(MONGO_URL)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("MongoDB connection error", err));

app.post("/api/orders", orderController.createOrder);
app.get("/api/orders/:orderId", orderController.getOrder);

export default app;
