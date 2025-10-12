const express = require('express');
const {
  createReport,
  getMyReports,
  getStreamReports,
  getAllReports,
  submitToPRL,
  approveReport,
  searchReports
} = require('../controllers/reportController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', authorize('lecturer'), createReport);
router.get('/my-reports', authorize('lecturer'), getMyReports);
router.get('/stream-reports', authorize('principal_lecturer'), getStreamReports);
router.get('/all-reports', authorize('program_leader'), getAllReports);
router.put('/:reportId/submit-prl', authorize('lecturer'), submitToPRL);
router.put('/:reportId/approve', authorize('principal_lecturer', 'program_leader'), approveReport);
router.get('/search', searchReports);

module.exports = router;