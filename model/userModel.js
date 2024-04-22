const moongose = require("mongoose");
const crypto = require("crypto");

const userSchema = new moongose.Schema({
    avatar: {
      type: String,
    },
    fName: {
      type: String,
      require: true,
    },
    lName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    address:{
      type:String
    },
    phoneNumber: {
      type: String,
  
    },
    password: {
      type: String,
      require: true,
    },
    product:[
      {
        type:moongose.Schema.Types.ObjectId,
        ref:'Product'
      }
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  });  

  
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };

  
const User =moongose.model('User',userSchema);
module.exports=User;