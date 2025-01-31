const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();  // Load .env variables

const app = express();
const { errorHandler, notFound } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/order');

const port = process.env.PORT || 5000;

// ✅ FIX: Bind to 0.0.0.0 instead of localhost
const host = "0.0.0.0";  

// ✅ FIX: Ensure CORS works for deployed frontend
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

const corsOptions = {
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ MongoDB Connection
const con = require('./db/connection');

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/order', orderRoutes);

// ✅ Error handlers
app.use(notFound);
app.use(errorHandler);

// ✅ FIX: MongoDB Connection and Server Start
con.then(db => {
    if (!db) {
        console.error("MongoDB connection failed!");
        return process.exit(1);
    } else {
        app.listen(port, host, () => {
            console.log(`✅ Server is running on port ${port}`);
        });
        app.on('error', err => console.error("❌ Server error:", err));
    }
}).catch(error => {
    console.error("❌ MongoDB Connection Failed:", error);
});
