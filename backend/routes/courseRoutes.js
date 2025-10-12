const express = require('express');
const { getAllCourses, getStreamCourses, createCourse } = require('../controllers/courseController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllCourses);
router.get('/stream/:streamId', getStreamCourses);
router.post('/', authorize('program_leader'), createCourse);

module.exports = router;