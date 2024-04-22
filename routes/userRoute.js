const router = require('express').Router();
const userController = require('../controller/userController');
const authGuard = require('../middleware/auth');

module.exports=router;