# Order and Inventory Services Documentation

## Overview

    This project consists of two microservices: Order Service and Inventory Service. The Order Service handles order creation, retrieves orders, and interacts with the Inventory Service to check stock and update inventory levels. The Inventory Service manages the inventory and ensures that stock levels are maintained.

    Both services are built with Node.js, Express, and MongoDB. They communicate via HTTP APIs, and the Order Service integrates with the Inventory Service to check the stock and update inventory after an order is placed.

# Table of Contents

    Assumptions and Design Choices
    Prerequisites
    Service Structure
    Running the Application
    Building the Application
    Testing the Application
    Unit Tests
    Integration Tests
    End-to-End Tests
    Dockerization

### Assumptions and Design Choices

Domain-Driven Design (DDD) Principles
This project follows Domain-Driven Design (DDD) principles to structure the business logic and ensure that the design is aligned with the core business operations. Below are the main concepts used:

Entities: The Order entity represents a customer order, including attributes like itemId, quantity, and status. Each order is uniquely identified by an orderId.

Value Objects: The Item can be considered a value object, representing the characteristics of an item that may change over time (e.g., stock levels), but do not have their own identity.

Aggregates: An aggregate root in this system is the Order entity, which encapsulates the rules around the order creation and inventory checking.

Repositories: The OrderService acts as the repository for managing orders. It handles the creation, retrieval, and updates of order records in the database.

Services: Both OrderService and InventoryService are services that encapsulate the business logic around orders and inventory.

Event-Driven Architecture: The system is designed to be event-driven. When an order is created, an event like OrderCreated is published to notify other systems or services about the change.

### Prerequisites

Before running or building the application, ensure you have the following installed:

Docker

### Service Structure

1. Inventory Service (inventory-service)
   Responsibilities: Manage inventory levels, provide stock availability, and update stock when items are ordered.
   Main Components:
   REST API endpoints for checking inventory.
   MongoDB model for inventory items.
   Business logic for checking stock and updating quantities.
2. Order Service (order-service)
   Responsibilities: Handle order creation, check stock via Inventory Service, and update stock in Inventory Service after order confirmation.
   Main Components:
   REST API endpoints for creating and retrieving orders.
   Interaction with Inventory Service to verify stock before creating an order.
   MongoDB model for orders.

### Running the Application

1.  Ensure you add the following details to a created .env file on the inventory service

    ###

        MONGO_URL=mongodb://mongo:27017/inventory

        # RabbitMQ connection URL
        RABBITMQ_URL=amqp://rabbitmq

        # Elasticsearch URL
        ELASTICSEARCH_URL=http://elasticsearch:9200

        # Server port
        PORT=3000

2.  Ensure you add the following to a created .env file on the order service

    ###

3.  With the docker compose file present, run the following command
    ###
    docker-compose up --build

## NB:

All test cases are written in the order service
