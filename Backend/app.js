const express = require('express');
const app = express();
const cors = require('cors');
const { errorHandler, notFound } = require('./middleware/errorHandler');
// const path = require('path');
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
require('dotenv').config();
const port = process.env.PORT || 5000;

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
  };

// // use middlewares
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
const con = require('./db/connection');

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);

//Error handlers
app.use(notFound);
app.use(errorHandler);

con.then(db => {
    if (!db) return process.exit(1);
    else {
        // listen to the http server
        app.listen(port, function (err) {
            if (err) { console.error(err); }
            else {
                console.log(`Server is running on: http://localhost:${port}`);
            }
        });
        app.on('error', err => console.log("Failed to Connect with HTTP Server: " + err));
    }
    // error in mongodb connection
}).catch(error => {
    console.log("Connection failed...!" + error);
})
