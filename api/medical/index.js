'use strict';

var express = require('express');
var medical = require('./medical.controller');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
const medicalMgmtSchema = require('../../apiSchema/medicalMgmtSchema');
var router = express.Router();

//Create Medical jwt 
router.post('/creatMedicalJwt',
joiSchemaValidation.validateBody(medicalMgmtSchema.creatMedicalJwt),
medical.creatMedicalJwt
);

//Insert employee
router.post('/createMedical', 
 joiSchemaValidation.validateBody(medicalMgmtSchema.createMedical),
 medical.createMedical
);


// //List employee Jwt
// router.post('/listMedicalJwt', 
// joiSchemaValidation.validateBody(medicalMgmtSchema.listMedicalJwt),
// medical.listMedicalJwt
// );

// //List employee
// router.post('/listMedical', 
// joiSchemaValidation.validateBody(medicalMgmtSchema.listMedical),
// medical.listMedical
// );

// //Editload employee Jwt
// router.post('/editloadMedicalJwt', 
// joiSchemaValidation.validateBody(medicalMgmtSchema.editloadMedicalJwt),
// medical.editloadMedicalJwt
// );

// //Editload employee
// router.post('/editloadMedical', 
// joiSchemaValidation.validateBody(medicalMgmtSchema.editloadMedical),
// medical.editloadMedical
// );


module.exports = router;