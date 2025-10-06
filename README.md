Scheduler API

A NestJS-based API server with integrated Swagger documentation for development.

Features

NestJS framework for scalable server-side applications

Swagger documentation available at /api/docs (development only)

Global validation using NestJS ValidationPipe

Custom authentication via x-scheduler-header API key

Getting Started

Prerequisites

Node.js (v16+ recommended)

npm

Installation

npm install

Running the Application

npm run start

The server runs on http://localhost:3000 by default.

API Documentation

Swagger UI is available in development mode at:

http://localhost:3000/api/docs

Authentication

All requests require an API key in the header:

x-scheduler-header: <your-token>

Validation

Global validation is enforced:

Only properties defined in DTOs are allowed (whitelist)

Unexpected properties are forbidden (forbidNonWhitelisted)

Payloads are automatically transformed to DTO instances (transform)

Environment

Swagger docs are disabled in production for security.

License

MIT