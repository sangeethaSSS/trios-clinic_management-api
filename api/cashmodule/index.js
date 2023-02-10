'use strict';

var express = require('express');
var cashmodule = require('./cashmodule.controller');
const cashmoduleMgmtSchema = require('../../apiSchema/cashModuleMgmtSchema')
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
var router = express.Router();

//List Cash module jwt 
router.post('/listCashModuleJwt',
    joiSchemaValidation.validateBody(cashmoduleMgmtSchema.listCashModuleJwt),
    cashmodule.listCashModuleJwt
);

//List Cash module
router.post('/listCashModule',
    joiSchemaValidation.validateBody(cashmoduleMgmtSchema.listCashModule),
    cashmodule.listCashModule
);

module.exports = router;