# Full Stack E-Commerce Application

This is a full-stack e-commerce application built using **TypeScript**, **Sass**, **Express**, **MongoDB**, and **EJS**. The app is designed to provide a smooth and scalable platform for online shopping with features like user authentication, product management, order processing, and more. 

## [Live Preview](https://ecommercestore-hi4n.onrender.com/)

![Nexus Store Demo Image](client/public/assets/nexusDemoImage.png)

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Frontend](#frontend)
- [Backend](#backend)
- [Database](#database)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

### Frontend
- **Responsive Design**: Fully responsive and mobile-friendly design with **Sass** styling.
- **Product Display**: Displays product listings with images, descriptions, prices, and available quantities.
- **User Authentication**: Login, registration, and user profile management. 
- **Shopping Cart**: Users can add/remove products to/from their cart and view a summary of selected items.
- **Checkout Process**: Integration of a secure checkout flow with an option for users to confirm shipping details and payment method.
- **Order History**: Registered users can view their previous orders and statuses.

### Backend
- **Express.js**: Node.js framework for building the server and API endpoints.
- **EJS Templating**: Dynamic rendering of HTML content using **EJS** templates.
- **Session Management**: **Express-session** used for managing user sessions, including user authentication, login states, and cart data.
- **Middleware**: Various middleware for handling authentication, logging, and security (e.g., CORS, helmet).
- **Product Management**: Admin functionality for adding, updating, and deleting products.
- **Cart & Order Management**: Allows users to add products to a cart, place orders, and track order statuses.
- **Email Notifications**: Sends confirmation emails upon order placement and shipping updates.
- **Error Handling**: Centralized error-handling middleware for managing application errors.

### Database (MongoDB)
- **MongoDB Database**: Stores user data, products, orders, and shopping cart information.
- **Transactions**: Uses **MongoDB transactions** for handling order processing, ensuring data consistency (especially when processing payments and order confirmations).
- **Schemas**: Mongoose-based schemas for users, products, orders, reviews, and carts.
- **Indexes**: Indexed fields for improving query performance (e.g., searching products by category, name).
- **Data Validation**: Mongoose schema validation for ensuring valid data input from users.

## Technologies Used

- **Frontend**:
  - **TypeScript**: Strongly-typed language for improved maintainability and scalability.
  - **Sass**: CSS preprocessor for modular, reusable, and maintainable styles.
  - **EJS**: Embedded JavaScript templating engine for rendering dynamic HTML pages.

- **Backend**:
  - **Express.js**: Web framework for Node.js to handle routing, middleware, and API endpoints.
  - **MongoDB**: NoSQL database used for storing data about users, products, orders, etc.
  - **Mongoose**: ODM (Object Document Mapper) for MongoDB to model data and interact with the database.
  - **Express-session**: Manages user sessions for authentication and cart persistence.
  - **bcryptjs**: Used for hashing and verifying passwords securely.
  - **nodemailer**: For sending emails (e.g., order confirmation, shipping updates).
  
## Frontend

The frontend is responsible for the user interface and interactions, including the shopping experience, user authentication, and display of data fetched from the backend.

- **TypeScript** ensures type safety and prevents common JavaScript errors.
- **Sass** is used for modular, maintainable CSS with features like variables, nesting, and mixins.
- **EJS Templates**: Used to render dynamic HTML content on the frontend (e.g., product listings, order details).
- **State Management**: Uses local storage for managing shopping cart data, ensuring persistence across sessions.

### Key Frontend Features
- Product listings with filters for categories, price, and more.
- Login/Signup forms with client-side validation.
- User-friendly cart and checkout interface.
- Order history and status tracking.
- Error handling with user-friendly notifications.

## Backend

The backend serves as the API server and handles business logic, data management, user sessions, and security.

### Key Backend Features
- **Express.js** routing system to handle HTTP requests.
- **Session Management**: Using **express-session** for user authentication and storing user-related data like cart information.
- **User Authentication**: Users can register, log in, and log out. Passwords are hashed using **bcryptjs**.
- **Order Processing**: Uses **MongoDB transactions** to ensure consistency during order creation, stock updates, and payment processing.
- **Product Management**: Admin users can add, update, and delete products through the backend.
- **Payment Integration**: Integrates with **Stripe** or **PayPal** for secure payment processing.
- **Email Notifications**: **Nodemailer** sends email notifications upon successful order placement and shipping updates.

## Database

### MongoDB
- **MongoDB** stores the application data in a NoSQL format, making it highly flexible and scalable.
- **Mongoose** is used for defining models, interacting with the database, and validating input data.
  
### Transactions in MongoDB
- **Atomic Transactions**: MongoDB's support for multi-document transactions ensures that order-related operations (like inventory update, payment processing, and order creation) are handled atomically to prevent inconsistencies.
  
### MongoDB Collections
- **Users**: Stores user information (email, hashed password, shipping address, etc.).
- **Products**: Product data including name, price, description, and stock count.
- **Orders**: Stores orders, including user details, items purchased, and payment status.
- **Shopping Cart**: Stores the current cart data for logged-in users.

## Setup & Installation

### Prerequisites
- Node.js (>= 14.x)
- MongoDB (Local or Cloud Instance)


### Steps to Set Up

1. Clone the repository:
   ```bash
   git clone https://github.com/MAliHassanDev/ecommerceStore.git
   cd ecommerceStore
2. Install dependencies:
   ```bash 
   npm install:dev
3. Set up environment variables: Create a `.env` file in the root directory with the 
   following keys:
 - `DATABASE_NAME`=your-mongodb-database-name
 - `MONGODB_URI`=your-mongodb-connection-string
 - `NODE_ENV`=DEV (DEV=development,PROD=production,TEST=testing)
 - `SESSION_SECRET`=your-express-session-secret
4. Start the development server:
   ```bash 
   npm run dev

## Usage

- Visit the home page to browse products.
- Create an account or log in to access personalized features.
- Add items to your cart and proceed to checkout.
- Make a payment using Stripe or PayPal.
- View order history and track the status of previous orders.

## Contributing

We welcome contributions to improve this project! If you'd like to contribute, follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to your branch (`git push origin feature-name`).
5. Create a pull request.

Please ensure your code adheres to the existing coding standards and includes tests where applicable.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🧭 Navigation
- My next project [Whiteboard](https://github.com/MAliHassanDev/WhiteBoard)
- My previous project [SingUp Form](https://github.com/MAliHassanDev/login-and-signup-form-in-expressjs)
