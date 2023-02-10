'use strict';

var express = require('express');
var report = require('./report.controller');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
const reportSchema = require('../../apiSchema/reportMgmtSchema');

var router = express.Router();

//Get Consolidated Report jwt Module
router.post('/getConsolidatedReportJwt',
joiSchemaValidation.validateBody(reportSchema.getConsolidatedReportJwt),
report.getConsolidatedReportJwt
);

//Get Consolidated Report Module
router.post('/getConsolidatedReport', 
 joiSchemaValidation.validateBody(reportSchema.getConsolidatedReport),
 report.getConsolidatedReport
);

//Detailed cash Report jwt Module
router.post('/DetailedCashReportJwt',
joiSchemaValidation.validateBody(reportSchema.DetailedCashReportJwt),
report.DetailedCashReportJwt
);

//Detailed cash Report jwt Module
router.post('/DetailedCashReport', 
 joiSchemaValidation.validateBody(reportSchema.DetailedCashReport),
 report.DetailedCashReport
);
module.exports = router;