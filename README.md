# Food Delivery System

## Overview
This is a full-stack food delivery system built with React.js for the frontend and Node.js with Express.js for the backend. It allows users to browse menu items, add items to a cart, place orders, and track their orders. Admins can manage the menu and orders.

## Features
- User authentication (Register/Login with JWT authentication)
- Menu management (Admin can add, update, and delete menu items)
- Order management (Users can place orders, admins can update order status)
- Cart functionality for users
- Responsive UI using TailwindCSS

## Tech Stack
### Frontend:
- React.js
- Axios for API calls
- React Context API/Redux for state management
- TailwindCSS for styling

### Backend:
- Node.js with Express.js
- MongoDB with Mongoose ORM
- JWT-based authentication

## Installation & Setup

### Prerequisites:
Ensure you have the following installed:
- Node.js (>= 14.x)
- MongoDB (local or MongoDB Atlas)
- Git

### Backend Setup:
1. Clone the repository:
   ```sh
   git clone https://github.com/Sujaltalreja29/full-stack-task-management-app.git
   ```
2. Navigate to the backend folder:
   ```sh
   cd food-delivery-app/backend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file in the `backend` folder and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
5. Start the backend server:
   ```sh
   npm start
   ```
   The API will be running on `http://localhost:5000`

### Frontend Setup:
1. Navigate to the frontend folder:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend:
   ```sh
   npm start
   ```
   The frontend will be running on `http://localhost:3000`

## API Endpoints

### Authentication:
- `POST /register` - Register a new user
- `POST /login` - Login and receive a JWT token

### Menu Management:
- `GET /menu` - Fetch all menu items
- `POST /menu` - Add a new menu item (Admin only)
- `PUT /menu/:id` - Update a menu item (Admin only)
- `DELETE /menu/:id` - Delete a menu item (Admin only)

### Order Management:
- `POST /order` - Place an order
- `GET /order` - Fetch all orders for a logged-in user
- `PUT /order/:id` - Update order status (Admin only)

## Deployment
- **Frontend Deployment:** Deployed on [Vercel](https://sujal-talreja-app.vercel.app/)
- **Backend Deployment:** Deployed on [Heroku/Railway/Render](https://full-stack-task-management-app-backend-7uv2.onrender.com)
- **MongoDB:** Hosted on MongoDB Atlas

## Live Demo
[Live Website](https://sujal-talreja-app.vercel.app)

## Challenges & Learnings
- Implementing JWT authentication and secure API calls
- State management using Context API
- Handling CRUD operations efficiently with MongoDB
- Ensuring responsive design using TailwindCSS

## Contributing
Contributions are welcome! Feel free to fork the repo and submit a pull request.

## License
MIT License

