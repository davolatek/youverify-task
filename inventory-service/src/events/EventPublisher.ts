import amqp from "amqplib";

export class EventPublisher {
  static async publish(event: string, data: any) {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://localhost"
    );
    const channel = await connection.createChannel();
    await channel.assertExchange("stock-update-exchange", "fanout", {
      durable: false,
    });
    channel.publish(
      "stock-update-exchange",
      "",
      Buffer.from(JSON.stringify({ event, data }))
    );
    await channel.close();
    await connection.close();
  }
}
