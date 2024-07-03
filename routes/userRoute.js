const router = require('express').Router();
const userController = require('../controller/userController');
const attendanceController = require('../controller/attendenceController');
const eventController = require('../controller/eventController');
const leaveRequestController = require('../controller/leaveRequestController');
const addProjectController = require("../controller/addProjectController");
const addDocumentController = require("../controller/addDocumentController");
// const authGuard = require('../middleware/auth');

router.post('/createPredefinedAdmin', userController.createPredefinedAdmin);
router.post('/adminLogin', userController.adminLogin);
router.post('/createNewUser', userController.createNewUser);
router.post('/markAttendance', attendanceController.markAttendance); // Changed the path to /markAttendance for marking attendance
router.post('/updateAttendance', attendanceController.updateAttendance); 
router.get('/attendanceRecord/:id', attendanceController.attendanceRecords);// New route for fetching attendance records, expecting user ID as a parameter
router.get('/getUserById/:id', userController.getUserById);
router.get('/getAllUsers', userController.getAllUsers);
router.post('/userLogout',userController.userLogout,);
router.delete('/userDeleteById/:id', userController.deleteUserById);
router.get('/getTotalPresentById/:id', attendanceController.getTotalPresentById);
router.get('/getTotalAbsentById/:id', attendanceController.getTotalAbsentById);
router.put('/updateUserById/:id', userController.updateUserProfile);

//event
router.post('/createEvent', eventController.createEvent);
router.get('/getAllEvents', eventController.getAllEvents);
router.delete('/deleteEvent/:id', eventController.deleteEvent);

//leave Request
router.post('/createLeaveRequest/:userId', leaveRequestController.createLeaveRequest);
router.put('/leaveRequestUpdate/:id', leaveRequestController.updateLeaveRequest);
router.get('/getAllLeaveRequests', leaveRequestController.getAllLeaveRequests);
router.get('/getLeaveRequestsByUserId/:userId', leaveRequestController.getLeaveRequestsByUserId);
router.delete('/deleteLeaveRequest/:id', leaveRequestController.deleteLeaveRequest);

//document
router.post('/addDocument/:userId',addDocumentController.addDocument)
router.put('/changePassword/:userId', userController.changePassword);
router.post('/changeadminpassword',userController.resetAdminPassword);

// forgot password
router.route("/forgot/password").post(userController.forgotPassword);

//project
router.post("/createProject",addProjectController.addProject);




module.exports = router;
