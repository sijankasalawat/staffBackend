const User = require('../model/userModel');
const bcrypt = require('bcrypt');

const createPredefinedAdmin = async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Predefined admin user already exists' });
    }
    const newAdmin = new User({
      username: 'admin',
      password: 'adminpassword',
      role: 'admin'
    });

    const salt = await bcrypt.genSalt(10);
    newAdmin.password = await bcrypt.hash(newAdmin.password, salt);

    await newAdmin.save();

    res.status(201).json({ message: 'Predefined admin user created successfully' });
  } catch (error) {
    console.error('Error creating predefined admin user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const adminUser = await User.findOne({ username, role: 'admin' });
    console.log('adminUser: ', adminUser);
    if (!adminUser) {
      return res.status(404).json({ message: 'Admin user not found' });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password,);
    console.log('isMatch: ', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    res.status(200).json({ message: 'Admin login successful' , success:true, token:'jwt token' });
  } catch (error) {
    console.error('Error logging in admin user:', error);
    res.status(500).json({ message: error?.message || 'Internal server error', success:false });
  }
};

module.exports = { createPredefinedAdmin, adminLogin };
