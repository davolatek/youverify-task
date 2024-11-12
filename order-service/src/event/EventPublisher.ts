import amqplib from "amqplib";
import logger from "../logs/Logger";

export const publishEvent = async (event: any) => {
  try {
    const connection = await amqplib.connect(process.env.RABBITMQ_URL!);
    const channel = await connection.createChannel();
    await channel.assertQueue("order-events");
    channel.sendToQueue("order-events", Buffer.from(JSON.stringify(event)));
    logger.info(
      `Published event to order-events queue: ${JSON.stringify(event)}`
    );
    await channel.close();
    await connection.close();
  } catch (error) {
    logger.error("Failed to publish event", error);
  }
};
