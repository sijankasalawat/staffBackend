const router = require('express').Router();
const userController = require('../controller/userController');
// const authGuard = require('../middleware/auth');

router.post('/createPredefinedAdmin', userController.createPredefinedAdmin);
router.post('/adminLogin', userController.adminLogin);

module.exports=router;