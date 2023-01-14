const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');


//connect to mongo
const uri = process.env.DB_URI
mongoose.set('strictQuery',false)
mongoose.connect(uri,err=>{
    if(err)throw err
})
const connection = mongoose.connection;
connection.once('open',()=>{
    console.log("Database connect successfully")
})

//Middleware
app.use(cookieParser());
app.use(express.json());

//routes
app.use("/user",authRoutes)

app.listen(3001,()=> {
    console.log("Server running on port 3001")
})