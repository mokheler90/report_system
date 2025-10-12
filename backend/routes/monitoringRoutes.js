const express = require('express');
const {
  submitAttendance,
  getMyAttendance,
  getClassAttendance
} = require('../controllers/monitoringController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/attendance', authorize('student'), submitAttendance);
router.get('/my-attendance', authorize('student'), getMyAttendance);
router.get('/class-attendance/:classId', authorize('lecturer', 'principal_lecturer', 'program_leader'), getClassAttendance);

module.exports = router;