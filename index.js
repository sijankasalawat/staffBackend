const express = require('express');
const dotenv=require('dotenv');
const connectToDB = require('./database/db');
const cloudinary = require('cloudinary');
const cors = require('cors')

// const cors = require('cors');
const app = express();

dotenv.config();
connectToDB();
app.use(express.json());

const corsOptions={
  origin:true,
  credentials:true,
  optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use('/api/user',require('./routes/userRoute'))

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