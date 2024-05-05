const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

module.exports = { createPredefinedAdmin, adminLogin, createNewUser };
