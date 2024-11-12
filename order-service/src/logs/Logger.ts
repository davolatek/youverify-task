import { createLogger, format, transports } from "winston";
import { ElasticsearchTransport } from "winston-elasticsearch";

const esTransportOptions = {
  level: "info",
  clientOpts: {
    node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
  },
};

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new ElasticsearchTransport(esTransportOptions) as any,
  ],
});

export default logger;
