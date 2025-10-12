const express = require('express');
const { getAllStreams, assignPrincipalLecturer } = require('../controllers/streamController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAllStreams);
router.put('/:streamId/assign-prl', authorize('program_leader'), assignPrincipalLecturer);

module.exports = router;