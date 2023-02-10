'use strict';

var express = require('express');
var labtest = require('./lab_test.controller');
var labtestgroup = require('./lab_testgroup.controller');
var transaction = require('./transaction.controller');
var patientlab = require('./patient_lab_details.controller');
var labreport = require('./lab_report.controller');
const patientLabDetailsMgmtSchema = require('../../apiSchema/patientLabDetailsMgmtSchema')
const labtestgroupMgmtSchema = require('../../apiSchema/labtestgroupMgmtSchema')
const labtestMgmtSchema = require('../../apiSchema/labtestMgmtSchema')
const transactionMgmtSchema = require('../../apiSchema/transactionMgmtSchema')
const labreportMgmtSchema = require('../../apiSchema/labreportMgmtSchema')
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');

var router = express.Router();

//Create Test jwt 
router.post('/createLabtestJwt',
    joiSchemaValidation.validateBody(labtestMgmtSchema.createLabtestJwt),
    labtest.createLabtestJwt
);

//Insert Test
router.post('/createLabtest',
    joiSchemaValidation.validateBody(labtestMgmtSchema.createLabtest),
    labtest.createLabtest
);

//Delete Test Jwt
router.post('/deleteLabtestJwt',
    joiSchemaValidation.validateBody(labtestMgmtSchema.deleteLabtestJwt),
    labtest.deleteLabtestJwt
);

//Delete Test
router.post('/deleteLabtest',
    joiSchemaValidation.validateBody(labtestMgmtSchema.deleteLabtest),
    labtest.deleteLabtest
);

//List Test Jwt
router.post('/listLabtestJwt',
    joiSchemaValidation.validateBody(labtestMgmtSchema.listLabtestJwt),
    labtest.listLabtestJwt
);

//List Test
router.post('/listLabtest',
    joiSchemaValidation.validateBody(labtestMgmtSchema.listLabtest),
    labtest.listLabtest
);

//Test Name Checking jwt 
router.post('/testnameCheckingJwt',
    joiSchemaValidation.validateBody(labtestMgmtSchema.testnameCheckingJwt),
    labtest.testnameCheckingJwt
);

//Test Name Checking 
router.post('/testnameChecking',
    joiSchemaValidation.validateBody(labtestMgmtSchema.testnameChecking),
    labtest.testnameChecking
);
//Editload Test Jwt
router.post('/editloadLabtestJwt',
    joiSchemaValidation.validateBody(labtestMgmtSchema.editloadLabtestJwt),
    labtest.editloadLabtestJwt
);

//Editload Test
router.post('/editloadLabtest',
    joiSchemaValidation.validateBody(labtestMgmtSchema.editloadLabtest),
    labtest.editloadLabtest
);

//Test GroupName Checking jwt 
router.post('/TestgroupnameJwt',
    joiSchemaValidation.validateBody(labtestgroupMgmtSchema.TestgroupnameJwt),
    labtestgroup.TestgroupnameJwt
);

//Test GroupName Checking 
router.post('/Testgroupname',
    joiSchemaValidation.validateBody(labtestgroupMgmtSchema.Testgroupname),
    labtestgroup.Testgroupname
);
//Create Test Group jwt 
router.post('/createLabtestgroupJwt',
    joiSchemaValidation.validateBody(labtestgroupMgmtSchema.createLabtestgroupJwt),
    labtestgroup.createLabtestgroupJwt
);

//Insert Test Group Group
router.post('/createLabtestgroup',
    joiSchemaValidation.validateBody(labtestgroupMgmtSchema.createLabtestgroup),
    labtestgroup.createLabtestgroup
);

//Delete Test Group Jwt
router.post('/deleteLabtestgroupJwt',
    joiSchemaValidation.validateBody(labtestgroupMgmtSchema.deleteLabtestgroupJwt),
    labtestgroup.deleteLabtestgroupJwt
);

//Delete Test Group Group
router.post('/deleteLabtestgroup',
    joiSchemaValidation.validateBody(labtestgroupMgmtSchema.deleteLabtestgroup),
    labtestgroup.deleteLabtestgroup
);

//List Test Group Jwt
router.post('/listLabtestgroupJwt',
    joiSchemaValidation.validateBody(labtestgroupMgmtSchema.listLabtestgroupJwt),
    labtestgroup.listLabtestgroupJwt
);

//List Test Group Group
router.post('/listLabtestgroup',
    joiSchemaValidation.validateBody(labtestgroupMgmtSchema.listLabtestgroup),
    labtestgroup.listLabtestgroup
);

//Editload Test Group Jwt
router.post('/editloadLabtestgroupJwt',
    joiSchemaValidation.validateBody(labtestgroupMgmtSchema.editloadLabtestgroupJwt),
    labtestgroup.editloadLabtestgroupJwt
);

//Editload Test Group 
router.post('/editloadLabtestgroup',
    joiSchemaValidation.validateBody(labtestgroupMgmtSchema.editloadLabtestgroup),
    labtestgroup.editloadLabtestgroup
);

//Get Test by Group Jwt
router.post('/getTestbygroupJwt',
    joiSchemaValidation.validateBody(labtestgroupMgmtSchema.getTestbygroupJwt),
    labtestgroup.getTestbygroupJwt
);

//Get Test by Group
router.post('/getTestbygroup',
    joiSchemaValidation.validateBody(labtestgroupMgmtSchema.getTestbygroup),
    labtestgroup.getTestbygroup
);

//Create Transaction jwt 
router.post('/createTransactionJwt',
    joiSchemaValidation.validateBody(transactionMgmtSchema.createTransactionJwt),
    transaction.createTransactionJwt
);

//Create Transaction 
router.post('/createTransaction',
    joiSchemaValidation.validateBody(transactionMgmtSchema.createTransaction),
    transaction.createTransaction
);


//Create Patient lab test jwt 
router.post('/createPatientLabtestJwt',
    joiSchemaValidation.validateBody(patientLabDetailsMgmtSchema.createPatientLabtestJwt),
    patientlab.createPatientLabtestJwt
);

//Create Patient lab test 
router.post('/createPatientLabtest',
    joiSchemaValidation.validateBody(patientLabDetailsMgmtSchema.createPatientLabtest),
    patientlab.createPatientLabtest
);

//Editload Patient lab jwt 
router.post('/editloadPatientLabDetailsJwt',
    joiSchemaValidation.validateBody(patientLabDetailsMgmtSchema.editloadPatientLabDetailsJwt),
    patientlab.editloadPatientLabDetailsJwt
);

//Editload Patient lab 
router.post('/editloadPatientLabDetails',
    joiSchemaValidation.validateBody(patientLabDetailsMgmtSchema.editloadPatientLabDetails),
    patientlab.editloadPatientLabDetails
);

//Get Payment Status jwt 
router.post('/getPaymentStatusJwt',
    joiSchemaValidation.validateBody(patientLabDetailsMgmtSchema.getPaymentStatusJwt),
    patientlab.getPaymentStatusJwt
);

//Get Payment Status 
router.post('/getPaymentStatus',
    joiSchemaValidation.validateBody(patientLabDetailsMgmtSchema.getPaymentStatus),
    patientlab.getPaymentStatus
);


//load Test Details jwt 
router.post('/loadTestDetailsJwt',
    joiSchemaValidation.validateBody(patientLabDetailsMgmtSchema.loadTestDetailsJwt),
    patientlab.loadTestDetailsJwt
);

//load Test Details 
router.post('/loadTestDetails',
    joiSchemaValidation.validateBody(patientLabDetailsMgmtSchema.loadTestDetails),
    patientlab.loadTestDetails
);

//list Lab report jwt 
router.post('/listLabReportJwt',
    joiSchemaValidation.validateBody(labreportMgmtSchema.listLabReportJwt),
    labreport.listLabReportJwt
);

//list Lab report
router.post('/listLabReport',
    joiSchemaValidation.validateBody(labreportMgmtSchema.listLabReport),
    labreport.listLabReport
);

//editload Lab report jwt 
router.post('/editloadLabReportgroupJwt',
    joiSchemaValidation.validateBody(labreportMgmtSchema.editloadLabReportgroupJwt),
    labreport.editloadLabReportgroupJwt
);

//editload Lab report
router.post('/editloadLabReportgroup',
    joiSchemaValidation.validateBody(labreportMgmtSchema.editloadLabReportgroup),
    labreport.editloadLabReportgroup
);
//editload Lab report jwt 
router.post('/createLabreportgroupJwt',
    joiSchemaValidation.validateBody(labreportMgmtSchema.createLabreportgroupJwt),
    labreport.createLabreportgroupJwt
);

//editload Lab report
router.post('/createLabreportgroup',
    joiSchemaValidation.validateBody(labreportMgmtSchema.createLabreportgroup),
    labreport.createLabreportgroup
);

//create Lab Report service
router.post('/createLabReport',
    joiSchemaValidation.validateBody(labreportMgmtSchema.createLabReport),
    labreport.createLabReport
);

//editload Lab report jwt 
router.post('/editLoadLabReportImagesJwt',
    joiSchemaValidation.validateBody(labreportMgmtSchema.editLoadLabReportImagesJwt),
    labreport.editLoadLabReportImagesJwt
);

//editload Lab report
router.post('/editLoadLabReportImages',
    joiSchemaValidation.validateBody(labreportMgmtSchema.editLoadLabReportImages),
    labreport.editLoadLabReportImages
);

//List Lab Images Jwt 
router.post('/ListLabImagesJwt',
    joiSchemaValidation.validateBody(labreportMgmtSchema.ListLabImagesJwt),
    labreport.ListLabImagesJwt
);

//List Lab Images 
router.post('/ListLabImages',
    joiSchemaValidation.validateBody(labreportMgmtSchema.ListLabImages),
    labreport.ListLabImages
);
module.exports = router;