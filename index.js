const express = require('express');
const dotenv=require('dotenv');
const connectToDB = require('./database/db');
const cloudinary = require('cloudinary');

// const cors = require('cors');
const app = express();

dotenv.config();
connectToDB();
app.use(express.json());
app.get('/hello', (req, res) => {
    //res.send('Hello World2!');
    res.status(200).send({
        message: 'Hello World!'
    });
});
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
  });

const PORT = process.env.PORT;
//running the server on port 5000
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
});

module.exports = app;