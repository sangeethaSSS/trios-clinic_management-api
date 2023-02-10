'use strict';

var express = require('express');
var consultation = require('./consultation.controller');
const consultationMgmtSchema = require('../../apiSchema/consultationMgmtSchema');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
var router = express.Router();

//Create Consultation jwt 
router.post('/createConsultationJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.createConsultationJwt),
consultation.createConsultationJwt
);

//Create Consultation
router.post('/createConsultation',
joiSchemaValidation.validateBody(consultationMgmtSchema.createConsultation),
consultation.createConsultation
);

//Get Consultation Jwt
router.post('/getDataConsultationJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.getDataConsultationJwt),
consultation.getDataConsultationJwt
);

//Get Consultation
router.post('/getDataConsultation',
joiSchemaValidation.validateBody(consultationMgmtSchema.getDataConsultation),
consultation.getDataConsultation
);

 //List Consultation Jwt
router.post('/listConsultationJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.listConsultationJwt),
consultation.listConsultationJwt
);

//List Consultation
router.post('/listConsultation',
joiSchemaValidation.validateBody(consultationMgmtSchema.listConsultation),
consultation.listConsultation
);

//Edit Consultation Jwt
router.post('/editloadConsultationJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.editloadConsultationJwt),
consultation.editloadConsultationJwt
);

//Edit Consultation
router.post('/editloadConsultation',
joiSchemaValidation.validateBody(consultationMgmtSchema.editloadConsultation),
consultation.editloadConsultation
);

//Clinic History Jwt
router.post('/clinicHistoryJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.clinicHistoryJwt),
consultation.clinicHistoryJwt
);

//Clinic History
router.post('/clinicHistory',
joiSchemaValidation.validateBody(consultationMgmtSchema.clinicHistory),
consultation.clinicHistory
);

//Previous Consultation JWt
router.post('/previousConsultationJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.previousConsultationJwt),
consultation.previousConsultationJwt
);

//Previous Consultation
router.post('/previousConsultation',
joiSchemaValidation.validateBody(consultationMgmtSchema.previousConsultation),
consultation.previousConsultation
);

//Next Consultation Jwt
router.post('/nextConsultationJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.nextConsultationJwt),
consultation.nextConsultationJwt
);

//Next Consultation 
router.post('/nextConsultation',
joiSchemaValidation.validateBody(consultationMgmtSchema.nextConsultation),
consultation.nextConsultation
);

//Update payement Jwt
router.post('/updatePaymentStatusJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.updatePaymentStatusJwt),
consultation.updatePaymentStatusJwt
);

///Update payement  
router.post('/updatePaymentStatus',
joiSchemaValidation.validateBody(consultationMgmtSchema.updatePaymentStatus),
consultation.updatePaymentStatus
);

// //clinical Photography Jwt
// router.post('/clinicalPhotographyJwt',
// joiSchemaValidation.validateBody(consultationMgmtSchema.clinicalPhotographyJwt),
// consultation.clinicalPhotographyJwt
// );

///clinical Photography  
router.post('/clinicalPhotography',
joiSchemaValidation.validateBody(consultationMgmtSchema.clinicalPhotography),
consultation.clinicalPhotography
);


//clinical Consultation Images Jwt
router.post('/getConsultationclinicalImagesJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.getConsultationclinicalImagesJwt),
consultation.getConsultationclinicalImagesJwt
);

///clinical Consultation Images
router.post('/getConsultationclinicalImages',
joiSchemaValidation.validateBody(consultationMgmtSchema.getConsultationclinicalImages),
consultation.getConsultationclinicalImages
);

//clinical Patient Images Jwt
router.post('/getPatientclinicalImagesJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.getPatientclinicalImagesJwt),
consultation.getPatientclinicalImagesJwt
);

//clinical Patient Images
router.post('/getPatientclinicalImages',
joiSchemaValidation.validateBody(consultationMgmtSchema.getPatientclinicalImages),
consultation.getPatientclinicalImages
);

//Financial Year setting checking
router.post('/getFinancial_yearJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.getFinancial_yearJwt),
consultation.getFinancial_yearJwt
);

//Financial Year setting checking
router.post('/getFinancial_year',
joiSchemaValidation.validateBody(consultationMgmtSchema.getFinancial_year),
consultation.getFinancial_year
);

//Account Master setting checking
router.post('/getAccountMasterJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.getAccountMasterJwt),
consultation.getAccountMasterJwt
);

//Account Master setting checking
router.post('/getAccountMaster',
joiSchemaValidation.validateBody(consultationMgmtSchema.getAccountMaster),
consultation.getAccountMaster
);
//lab Report Details Jwt
router.post('/loadtest_DetailsJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.loadtest_DetailsJwt),
consultation.loadtest_DetailsJwt
);

///lab Report Details
router.post('/loadtest_Details',
joiSchemaValidation.validateBody(consultationMgmtSchema.loadtest_Details),
consultation.loadtest_Details
);

//lab Report Details Jwt
router.post('/getpatient_idJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.getpatient_idJwt),
consultation.getpatient_idJwt
);

///lab Report Details
router.post('/getpatient_id',
joiSchemaValidation.validateBody(consultationMgmtSchema.getpatient_id),
consultation.getpatient_id
);
//Check payment status Jwt
router.post('/checkPaymentStatusJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.checkPaymentStatusJwt),
consultation.checkPaymentStatusJwt
);

///Check payment status 
router.post('/checkPaymentStatus',
joiSchemaValidation.validateBody(consultationMgmtSchema.checkPaymentStatus),
consultation.checkPaymentStatus
);

//onchange Drug List Jwt
router.post('/onchangeDrugListJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.onchangeDrugListJwt),
consultation.onchangeDrugListJwt
);

///onchange Drug List
router.post('/onchangeDrugList',
joiSchemaValidation.validateBody(consultationMgmtSchema.onchangeDrugList),
consultation.onchangeDrugList
);

//OLd Prescription Medicine Jwt
router.post('/oldPrescriptionJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.oldPrescriptionJwt),
consultation.oldPrescriptionJwt
);

//OLd Prescription Medicine
router.post('/oldPrescription',
joiSchemaValidation.validateBody(consultationMgmtSchema.oldPrescription),
consultation.oldPrescription
);

//Edit OLd Prescription Medicine Jwt
router.post('/editOldPrescriptionJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.editOldPrescriptionJwt),
consultation.editOldPrescriptionJwt
);

//Edit OLd Prescription Medicine
router.post('/editOldPrescription',
joiSchemaValidation.validateBody(consultationMgmtSchema.editOldPrescription),
consultation.editOldPrescription
);

// Report Photography service
router.post('/reportPhotography',
joiSchemaValidation.validateBody(consultationMgmtSchema.reportPhotography),
consultation.reportPhotography
);


//Consultation Report Image jwt 
router.post('/getConsultationReportImagesJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.getConsultationReportImagesJwt),
consultation.getConsultationReportImagesJwt
);

//Consultation Report Image
router.post('/getConsultationReportImages',
joiSchemaValidation.validateBody(consultationMgmtSchema.getConsultationReportImages),
consultation.getConsultationReportImages
);

//Consultation Report Image jwt 
router.post('/editReportImagesJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.editReportImagesJwt),
consultation.editReportImagesJwt
);

//Consultation Report Image
router.post('/editReportImages',
joiSchemaValidation.validateBody(consultationMgmtSchema.editReportImages),
consultation.editReportImages
);

//Update Report Image
router.post('/updateReportImage',
joiSchemaValidation.validateBody(consultationMgmtSchema.updateReportImage),
consultation.updateReportImage
);

//Delete Report Image Jwt
router.post('/deleteReportImageJwt',
joiSchemaValidation.validateBody(consultationMgmtSchema.deleteReportImageJwt),
consultation.deleteReportImageJwt
);

//Update Report Image
router.post('/deleteReportImage',
joiSchemaValidation.validateBody(consultationMgmtSchema.deleteReportImage),
consultation.deleteReportImage
);

module.exports = router;