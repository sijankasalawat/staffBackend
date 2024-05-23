const router = require('express').Router();
const userController = require('../controller/userController');
const attendanceController = require('../controller/attendenceController');
// const authGuard = require('../middleware/auth');

router.post('/createPredefinedAdmin', userController.createPredefinedAdmin);
router.post('/adminLogin', userController.adminLogin);
router.post('/createNewUser', userController.createNewUser);
router.post('/markAttendance', attendanceController.markAttendance); // Changed the path to /markAttendance for marking attendance
router.post('/updateAttendance', attendanceController.updateAttendance); // New route for updating attendance

router.get('/getUserById', userController.getUserById);
router.get('/getAllUsers', userController.getAllUsers);

module.exports = router;
