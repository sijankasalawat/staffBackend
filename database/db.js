const mongoose =require('mongoose');

const connectedToDb =()=>{
    mongoose.connect(process.env.DB_URL).then(()=>{
        console.log("connect to database")
    })
}
module.exports=connectedToDb;