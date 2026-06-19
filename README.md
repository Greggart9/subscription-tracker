Below is a cleaner, strictly professional README without the personal learning narrative.

# Subscription Tracker API

A RESTful API for managing users, recurring subscriptions, renewal schedules, and automated reminder notifications.

The application provides secure authentication, subscription management, scheduled workflows, email notifications, request protection, and centralized error handling.

## Features

* User registration and authentication
* Password hashing with bcrypt
* JWT-based authorization
* Protected API endpoints
* User ownership validation
* Subscription creation and management
* Automatic renewal-date calculation
* Subscription status tracking
* Scheduled renewal reminders
* Email notifications with Nodemailer
* Request protection and rate limiting with Arcjet
* Background workflows with Upstash QStash
* MongoDB Atlas integration
* Centralized error handling
* Environment-specific configuration

## Technology Stack

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JSON Web Token
* bcrypt
* Arcjet
* Upstash QStash
* Nodemailer
* Day.js
* Render

## Project Structure

```text
subscription-tracker/
├── config/
│   ├── arcjet.js
│   ├── env.js
│   ├── nodemailer.js
│   └── upstash.js
├── controllers/
│   ├── auth.controller.js
│   ├── subscription.controller.js
│   ├── user.controller.js
│   └── workflow.controller.js
├── database/
│   └── mongodb.js
├── middlewares/
│   ├── arcjet.middleware.js
│   ├── auth.middleware.js
│   └── error.middleware.js
├── models/
│   ├── subscription.model.js
│   └── user.model.js
├── routes/
│   ├── auth.routes.js
│   ├── subscription.routes.js
│   ├── user.routes.js
│   └── workflow.routes.js
├── utils/
│   ├── email-templates.js
│   └── send-email.js
├── app.js
├── package.json
└── README.md
```

## Requirements

Before running the project, ensure the following are available:

* Node.js
* npm
* MongoDB Atlas account
* Arcjet account
* Upstash QStash account
* SMTP email account or supported email provider

## Installation

Clone the repository:

```bash
git clone https://github.com/your-username/subscription-tracker.git
```

Navigate into the project:

```bash
cd subscription-tracker
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env.development.local` file in the project root:

```env
NODE_ENV=development
PORT=5500

DB_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development

QSTASH_TOKEN=your_qstash_token
QSTASH_URL=http://127.0.0.1:8080

SERVER_URL=http://127.0.0.1:5500

EMAIL_USER=your_email_address
EMAIL_PASSWORD=your_email_app_password
```

Variable names must match the values exported from `config/env.js`.

Never commit environment files or secrets to source control.

## Running the Application

Start the development server:

```bash
npm run dev
```

Start the production server:

```bash
npm start
```

The local API is available at:

```text
http://localhost:5500
```

## Scripts

```json
{
  "scripts": {
    "dev": "nodemon app.js",
    "start": "node app.js"
  }
}
```

## API Endpoints

### Authentication

#### Register a user

```http
POST /api/v1/auth/sign-up
```

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Sign in

```http
POST /api/v1/auth/sign-in
```

Request body:

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Users

#### Retrieve all users

```http
GET /api/v1/users
```

#### Retrieve a user

```http
GET /api/v1/users/:id
```

### Subscriptions

#### Create a subscription

```http
POST /api/v1/subscriptions
```

This endpoint requires authentication.

Request body:

```json
{
  "name": "Netflix Premium",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "category": "entertainment",
  "startDate": "2026-02-01",
  "paymentMethod": "Credit Card"
}
```

#### Retrieve a user’s subscriptions

```http
GET /api/v1/subscriptions/user/:id
```

#### Retrieve a subscription

```http
GET /api/v1/subscriptions/:id
```

#### Update a subscription

```http
PUT /api/v1/subscriptions/:id
```

#### Delete a subscription

```http
DELETE /api/v1/subscriptions/:id
```

#### Cancel a subscription

```http
PUT /api/v1/subscriptions/:id/cancel
```

#### Retrieve upcoming renewals

```http
GET /api/v1/subscriptions/upcoming-renewals
```

### Workflows

#### Process subscription reminders

```http
POST /api/v1/workflows/subscription/reminder
```

This endpoint is used by the workflow service to process scheduled reminder notifications.

## Authentication

Protected endpoints require a valid JWT access token.

Include the token in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

The authorization middleware:

1. Reads the bearer token from the request.
2. Verifies the token using the JWT secret.
3. Retrieves the associated user.
4. Assigns the user to `req.user`.
5. Continues or rejects the request.

## Subscription Model

A subscription can include:

* Name
* Price
* Currency
* Billing frequency
* Category
* Payment method
* Status
* Start date
* Renewal date
* Associated user

Supported billing frequencies:

```text
daily
weekly
monthly
yearly
```

Supported statuses:

```text
Active
Paused
Cancelled
Expired
```

When a renewal date is not provided, it is calculated automatically from the subscription’s start date and billing frequency.

## Reminder Workflows

Upstash QStash is used to schedule and trigger subscription reminder workflows.

For local development, start the QStash development server in a separate terminal:

```bash
npx @upstash/qstash-cli dev
```

The local QStash service runs on:

```text
http://127.0.0.1:8080
```

Production must use the hosted QStash service instead of the local development server.

Example production configuration:

```env
QSTASH_URL=https://qstash.upstash.io
SERVER_URL=https://your-api.onrender.com
```

## Email Notifications

Nodemailer is used to send subscription renewal emails.

Reminder messages can include:

* User name
* Subscription name
* Renewal date
* Price and currency
* Billing frequency
* Payment method

Email templates are maintained separately from the email transport configuration.

## Security

The API includes:

* bcrypt password hashing
* JWT authentication
* Protected routes
* User ownership checks
* Arcjet request protection
* Rate limiting
* Environment-based secret management
* Centralized error handling

Password fields should never be included in API responses.

Example:

```js
const users = await User.find().select("-password");
```

The password field can also be excluded by default in the schema:

```js
password: {
  type: String,
  required: true,
  select: false,
}
```

## Deployment

The API can be deployed as a Render Web Service.

Recommended deployment architecture:

```text
Client Application
        │
        ▼
Express API on Render
        │
        ├── MongoDB Atlas
        ├── Upstash QStash
        ├── Arcjet
        └── SMTP Email Provider
```

Use the following Render configuration:

```text
Build Command: npm install
Start Command: npm start
```

Add all production environment variables through the Render dashboard.

Example:

```env
NODE_ENV=production
DB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRES_IN=7d
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=production
QSTASH_TOKEN=your_production_qstash_token
QSTASH_URL=https://qstash.upstash.io
SERVER_URL=https://your-service.onrender.com
EMAIL_USER=your_email_address
EMAIL_PASSWORD=your_email_app_password
```

## Error Responses

Errors follow a consistent JSON structure:

```json
{
  "success": false,
  "error": "Error message"
}
```

Successful responses follow this structure:

```json
{
  "success": true,
  "data": {}
}
```

## Roadmap

* Complete subscription CRUD operations
* Add pagination and filtering
* Add renewal analytics
* Add email verification
* Add password reset functionality
* Add automated testing
* Add OpenAPI or Swagger documentation
* Add role-based authorization
* Add structured production logging
* Add a frontend dashboard

## Author

Oluwadamilare Ogundare

## License

This project is available for portfolio and educational use.
