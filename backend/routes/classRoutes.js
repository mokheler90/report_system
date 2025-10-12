const express = require('express');
const { getMyClasses, getAllClasses } = require('../controllers/classController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/my-classes', authorize('lecturer'), getMyClasses);
router.get('/all-classes', authorize('principal_lecturer', 'program_leader'), getAllClasses);

module.exports = router;