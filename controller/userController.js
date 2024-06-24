const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
const { sendEmail } = require("../middleware/sendEmail");


const createPredefinedAdmin = async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Predefined admin user already exists" });
    }
    const newAdmin = new User({
      username: "admin",
      password: "adminpassword",
      role: "admin",
    });

    const salt = await bcrypt.genSalt(10);
    newAdmin.password = await bcrypt.hash(newAdmin.password, salt);

    await newAdmin.save();

    res
      .status(201)
      .json({ message: "Predefined admin user created successfully" });
  } catch (error) {
    console.error("Error creating predefined admin user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const adminLogin = async (req, res) => {
  try {
    console.log("req.body: ", req.body);
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    console.log("adminUser: ", user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("isMatch: ", isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({
      message: "Admin login successful",
      success: true,
      token: token, // Send the generated token in the response
      user,
    });
  } catch (error) {
    console.error("Error logging in admin user:", error);
    res.status(500).json({
      message: error?.message || "Internal server error",
      success: false,
    });
  }
};
const createNewUser = async (req, res) => {
  console.log(req.body);
  const {
    fName,
    lName,
    email,
    designation,
    phoneNumber,
    username,
    password,
    role,
  } = req.body;

  // Check if all required fields are provided
  if (
    !fName ||
    !lName ||
    !email ||
    !designation ||
    !phoneNumber ||
    !username ||
    !password ||
    !role
  ) {
    return res.json({
      success: false,
      message: "All fields are required",
    });
  } else {
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ username: username });
      if (existingUser) {
        return res.json({
          success: false,
          message: "User already exists",
        });
      }

      // Encrypt the password
      const randomSalt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, randomSalt);

      // Create a new user instance
      const newUser = new User({
        fName,
        lName,
        email,
        designation,
        phoneNumber,
        username,
        role,
        password: encryptedPassword,
      });

      // Save the new user to the database
      await newUser.save();

      // Return success response
      return res.json({
        success: true,
        message: "User created successfully",
      });
    } catch (error) {
      console.error("Error creating new user:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
      message: "Users fetched successfully",
    });
  
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
     });
  }

 

}

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id; // Ensure req.params.id is correctly assigned
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      user,
      message: 'User fetched successfully',
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
  
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    let avatarUrl = null;
    if (typeof req.body.avatar !== 'string' && req.files.avatar) {
      const { avatar } = req.files;
      console.log(' avatar: ',  avatar);
      const uploadedAvatar = await cloudinary.uploader.upload(avatar.path, { folder: 'avatars' });
      if (!uploadedAvatar || !uploadedAvatar.secure_url) {
        return res.status(500).json({
          success: false,
          message: 'Failed to upload avatar to Cloudinary',
        });
      }
      avatarUrl = uploadedAvatar.secure_url;
    } else {
      avatarUrl = req.body.avatar;
    }

    // Update user profile with new data
    user.fName = req.body.fName || user.fName;
    user.lName = req.body.lName || user.lName;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.address = req.body.address || user.address;
    user.avatar = avatarUrl || user.avatar;

    // Save the updated user profile
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully.',
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};
const deleteUserById = async (req, res) => {
  try {
    
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const userLogout = async (req, res) => {
  try {
  
    res.status(200).json({ message: "User logged out successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

const forgotPassword = async (req, res)=>{
  console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      return res.json({
        success: false,
        message: "Email not found.",
      });
    }
    const resetPasswordToken = user.getResetPasswordToken();

    await user.save();

    // Assuming you have a configuration variable for the frontend URL
    const frontendBaseUrl = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
    const resetUrl = `${frontendBaseUrl}/password/reset/${resetPasswordToken}`;

    const message = `Reset Your Password by clicking on the link below: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Reset Password",
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createPredefinedAdmin, adminLogin, createNewUser, getUserById, getAllUsers, userLogout, deleteUserById,updateUserProfile,forgotPassword };
