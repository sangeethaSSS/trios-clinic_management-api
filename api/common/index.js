'use strict';

var express = require('express');
var controller = require('./common_data.controller');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
const commonMgmtSchema = require('../../apiSchema/commonMgmtSchema');

var router = express.Router();
//Create CommonData jwt 
router.post('/fetchcommonDataJwt',
 joiSchemaValidation.validateBody(commonMgmtSchema.fetchcommonDataJwt),
 controller.fetchcommonDataJwt
);
//Fetch Common Data
router.post('/fetchcommonData', 
joiSchemaValidation.validateBody(commonMgmtSchema.fetchcommonData),
controller.fetchcommonData
);

//Create Doctor jwt 
router.post('/fetchdoctorDataJwt',
 joiSchemaValidation.validateBody(commonMgmtSchema.fetchdoctorDataJwt),
 controller.fetchdoctorDataJwt
);

//Fetch Doctor Data
router.post('/fetchdoctorData', 
joiSchemaValidation.validateBody(commonMgmtSchema.fetchdoctorData),
controller.fetchdoctorData
);

//Create Patient jwt 
router.post('/fetchpatientDataJwt',
 joiSchemaValidation.validateBody(commonMgmtSchema.fetchpatientDataJwt),
 controller.fetchpatientDataJwt
);

//Fetch Patient Data
router.post('/fetchpatientData', 
joiSchemaValidation.validateBody(commonMgmtSchema.fetchpatientData),
controller.fetchpatientData
);

//Create consultation jwt 
router.post('/fetchconsultationDataJwt',
 joiSchemaValidation.validateBody(commonMgmtSchema.fetchconsultationDataJwt),
 controller.fetchconsultationDataJwt
);

//Fetch consultation Data
router.post('/fetchconsultationData', 
joiSchemaValidation.validateBody(commonMgmtSchema.fetchconsultationData),
controller.fetchconsultationData
);


//Bind City jwt 
router.post('/bindCityDataJwt',
 joiSchemaValidation.validateBody(commonMgmtSchema.bindCityDataJwt),
 controller.bindCityDataJwt
);

//Bind City Data
router.post('/bindCityData', 
joiSchemaValidation.validateBody(commonMgmtSchema.bindCityData),
controller.bindCityData
);

//Bind Doctor jwt 
router.post('/bindDoctorDataJwt',
 joiSchemaValidation.validateBody(commonMgmtSchema.bindDoctorDataJwt),
 controller.bindDoctorDataJwt
);

//Bind Doctor Data
router.post('/bindDoctorData', 
joiSchemaValidation.validateBody(commonMgmtSchema.bindDoctorData),
controller.bindDoctorData
);

//Bind Doctor jwt 
router.post('/getFinancialyearJwt',
 joiSchemaValidation.validateBody(commonMgmtSchema.getFinancialyearJwt),
 controller.getFinancialyearJwt
);

//Bind Doctor Data
router.post('/getFinancialyear', 
joiSchemaValidation.validateBody(commonMgmtSchema.getFinancialyear),
controller.getFinancialyear
);

//Create Company Data jwt 
router.post('/companyDataJwt',
 joiSchemaValidation.validateBody(commonMgmtSchema.companyDataJwt),
 controller.companyDataJwt
);
//Fetch Company Data
router.post('/companyData', 
joiSchemaValidation.validateBody(commonMgmtSchema.companyData),
controller.companyData
);

//List Telephone jwt 
router.post('/telephoneListJwt',
 joiSchemaValidation.validateBody(commonMgmtSchema.telephoneListJwt),
 controller.telephoneListJwt
);
//List Telephone
router.post('/telephoneList', 
joiSchemaValidation.validateBody(commonMgmtSchema.telephoneList),
controller.telephoneList
);

module.exports = router;
