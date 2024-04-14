# MERN-Hotel

hotel e-Commerce with features:
  * Implemented with MERN (React, Redux Toolkit, Node.js, Express, MongoDB, Mongoose)
  * Includes CRUD (Create, Read, Update, and Delete) operations
  * Utilizes JWT Authentication (JSON Web Token) with HTTP-Only cookies
  * Integrated with Google OAuth using Firebase authentication
  * Allows for uploading images/files with Firebase Cloud Storage
  * Full-featured shopping cart with credit card payments
  * Offers advanced search capabilities, including filtering by title, sorting options, and limiting search results

## Installation

### Server

```bash
npm install
```

Add a config.env file in root directory

```
PORT=your_port_num
DATABASE=your_mongodb_url
DATABASE_PASSWORD=your_mongodb_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=10d
JWT_COOKIE_EXPIRES_IN=90

STRIPE_SECRET_KEY=your_strip_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### Client

Navigate to the client/ directory

```bash
cd client/
npm install
```
Add a .env file in client/ directory

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
```
To build client side (create "dist" folder)

```
npm run build
```
