const mongoose = require('mongoose');
require('dotenv').config()
const conn = mongoose.connect(process.env.MONGO_URI)
    .then(db => {
        console.log("Databse Connected");
        return db;
    }).catch(err => {
        console.log("Connection Error: " + err);
    })

    module.exports = conn;