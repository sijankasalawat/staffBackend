const router = require('express').Router();
const userController = require('../controller/userController');
const attendanceController = require('../controller/attendenceController');
const eventController = require('../controller/eventController');
// const authGuard = require('../middleware/auth');

router.post('/createPredefinedAdmin', userController.createPredefinedAdmin);
router.post('/adminLogin', userController.adminLogin);
router.post('/createNewUser', userController.createNewUser);
router.post('/markAttendance', attendanceController.markAttendance); // Changed the path to /markAttendance for marking attendance
router.post('/updateAttendance', attendanceController.updateAttendance); 
router.get('/attendanceRecord/:id', attendanceController.attendanceRecords);// New route for fetching attendance records, expecting user ID as a parameter

router.get('/getUserById', userController.getUserById);
router.get('/getAllUsers', userController.getAllUsers);


//event
router.post('/createEvent', eventController.createEvent);
router.get('/getAllEvents', eventController.getAllEvents);

module.exports = router;
