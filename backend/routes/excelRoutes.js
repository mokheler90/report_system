const express = require('express');
const { exportReportsToExcel } = require('../controllers/excelController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/export-reports', exportReportsToExcel);

module.exports = router;