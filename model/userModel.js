const moongose = require("mongoose");
const crypto = require("crypto");
const { type } = require("os");

const userSchema = new moongose.Schema({
    avatar: {
      type: String,
    },
    username:{
      type:String,
    },
    fName: {
      type: String,
      
    },
    lName: {
      type: String,
      
    },
    email: {
      type: String,
    
    },
    address:{
      type:String
    },
    phoneNumber: {
      type: String,
  
    },
    password: {
      type: String,
    },
    designation: {
      enum:['Accountant','hr','Developer','Manager','Sale','Support','Designer'],
      type: String,
    },
    role: {
      type: String,
      enum: ['admin', 'employee', 'hr'],
      required: true
    },
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