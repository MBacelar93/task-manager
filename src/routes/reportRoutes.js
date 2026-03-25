
const express = require('express');
const router = express.Router();
const ReportController = require('../controller/reportController');

router.get('/full', ReportController.getFullReport);
router.get('/chart', ReportController.getStatsForChart);
router.get('/csv', ReportController.getCSVData);
router.get('/pdf', ReportController.getPDFData);

module.exports = router;