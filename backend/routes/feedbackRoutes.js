const express = require('express');
const { addFeedback, getReportFeedback, getMyFeedback } = require('../controllers/feedbackController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', authorize('principal_lecturer'), addFeedback);
router.get('/report/:reportId', getReportFeedback);
router.get('/my-feedback', authorize('principal_lecturer'), getMyFeedback);

module.exports = router;