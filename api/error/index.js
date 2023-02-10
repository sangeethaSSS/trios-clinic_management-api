'use strict';

var express = require('express');
var error = require('./error.controller');
const ErrorLogMgmtSchema = require('../../apiSchema/ErrorLogMgmtSchema');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
var router = express.Router();

//Login user
router.post('/errorLog', 
joiSchemaValidation.validateBody(ErrorLogMgmtSchema.errorLog),
error.errorLog
);

module.exports = router;