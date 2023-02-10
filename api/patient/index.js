'use strict';

var express = require('express');
var patient = require('./patient.contoller');
const patientMgmtSchema = require('../../apiSchema/patientMgmtSchema');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
var router = express.Router();

//Create Patient jwt 
router.post('/createPatientJwt',
joiSchemaValidation.validateBody(patientMgmtSchema.createPatientJwt),
patient.createPatientJwt
);

//Create Patient
router.post('/createPatient',
joiSchemaValidation.validateBody(patientMgmtSchema.createPatient),
patient.createPatient
);

//Delete Patient Jwt
router.post('/deletePatientJwt',
joiSchemaValidation.validateBody(patientMgmtSchema.deletePatientJwt),
patient.deletePatientJwt
);

//Delete Patient
router.post('/deletePatient',
joiSchemaValidation.validateBody(patientMgmtSchema.deletePatient),
patient.deletePatient
);

//List Patient Jwt
router.post('/listPatientJwt',
joiSchemaValidation.validateBody(patientMgmtSchema.listPatientJwt),
patient.listPatientJwt
);

//List Patient
router.post('/listPatient',
joiSchemaValidation.validateBody(patientMgmtSchema.listPatient),
patient.listPatient
);

//Edit Patient Jwt
router.post('/editloadPatientJwt',
joiSchemaValidation.validateBody(patientMgmtSchema.editloadPatientJwt),
patient.editloadPatientJwt
);

//Edit Patient
router.post('/editloadPatient',
joiSchemaValidation.validateBody(patientMgmtSchema.editloadPatient),
patient.editloadPatient
);

//Uhid Patient Jwt
router.post('/getUHIDJwt',
joiSchemaValidation.validateBody(patientMgmtSchema.getUHIDJwt),
patient.getUHIDJwt
);

//Uhid Patient
router.post('/getUHID',
joiSchemaValidation.validateBody(patientMgmtSchema.getUHID),
patient.getUHID
);
//patient search Jwt
router.post('/patientDetailsearchJwt',
joiSchemaValidation.validateBody(patientMgmtSchema.patientDetailsearchJwt),
patient.patientDetailsearchJwt
);

//patient search
router.post('/patientDetailsearch',
joiSchemaValidation.validateBody(patientMgmtSchema.patientDetailsearch),
patient.patientDetailsearch
);
module.exports = router;