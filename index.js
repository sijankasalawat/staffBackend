const express = require('express');
const dotenv=require('dotenv');
const connectToDB = require('./database/db');
const cors = require('cors')
const cloudinary = require('cloudinary');
const acceptMultimedia = require('connect-multiparty');
const bodyParser = require('body-parser');

const app = express();

dotenv.config();
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
});
app.use(acceptMultimedia());

const corsOptions={
  origin:true,
  credentials:true,
  optionSuccessStatus:200
}
connectToDB();
app.use(express.json());

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }))


app.use('/api/user',require('./routes/userRoute'))



const PORT = process.env.PORT;
//running the server on port 5000
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`)
});

module.exports = app;