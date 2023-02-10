'use strict';

var express = require('express');
var appointment = require('./appointment.controller');
const appointmentMgmtSchema = require('../../apiSchema/appointmentMgmtSchema');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
var router = express.Router();

//Create Appointment jwt 
router.post('/createAppointmentJwt',
joiSchemaValidation.validateBody(appointmentMgmtSchema.createAppointmentJwt),
appointment.createAppointmentJwt
);

//Create Appointment
router.post('/createAppointment',
joiSchemaValidation.validateBody(appointmentMgmtSchema.createAppointment),
appointment.createAppointment
);

//Delete Appointment Jwt
router.post('/deleteAppointmentJwt',
joiSchemaValidation.validateBody(appointmentMgmtSchema.deleteAppointmentJwt),
appointment.deleteAppointmentJwt
);

//Delete Appointment
router.post('/deleteAppointment',
joiSchemaValidation.validateBody(appointmentMgmtSchema.deleteAppointment),
appointment.deleteAppointment
);

 //List Appointment Jwt
router.post('/listAppointmentJwt',
joiSchemaValidation.validateBody(appointmentMgmtSchema.listAppointmentJwt),
appointment.listAppointmentJwt
);

//List Appointment
router.post('/listAppointment',
joiSchemaValidation.validateBody(appointmentMgmtSchema.listAppointment),
appointment.listAppointment
);

//Edit Appointment Jwt
router.post('/editloadAppointmentJwt',
joiSchemaValidation.validateBody(appointmentMgmtSchema.editloadAppointmentJwt),
appointment.editloadAppointmentJwt
);

//Edit Appointment
router.post('/editloadAppointment',
joiSchemaValidation.validateBody(appointmentMgmtSchema.editloadAppointment),
appointment.editloadAppointment
);

//Search Appointment Jwt
router.post('/searchPatientsJwt',
joiSchemaValidation.validateBody(appointmentMgmtSchema.searchPatientsJwt),
appointment.searchPatientsJwt
);

//Search Appointment
router.post('/searchPatients',
joiSchemaValidation.validateBody(appointmentMgmtSchema.searchPatients),
appointment.searchPatients
);

//Session Jwt
router.post('/createSessionJwt',
joiSchemaValidation.validateBody(appointmentMgmtSchema.createSessionJwt),
appointment.createSessionJwt
);

//Create Session 
router.post('/createSession',
joiSchemaValidation.validateBody(appointmentMgmtSchema.createSession),
appointment.createSession
);

//Get Session Jwt
router.post('/getSessionidJwt',
joiSchemaValidation.validateBody(appointmentMgmtSchema.getSessionidJwt),
appointment.getSessionidJwt
);
//Get Session id
router.post('/getSessionid',
joiSchemaValidation.validateBody(appointmentMgmtSchema.getSessionid),
appointment.getSessionid
);

//Skip & Resume Patient status Jwt
router.post('/skipResumePatientJwt',
joiSchemaValidation.validateBody(appointmentMgmtSchema.skipResumePatientJwt),
appointment.skipResumePatientJwt
);

//Skip & Resume Patient status Jwt
router.post('/skipResumePatient',
joiSchemaValidation.validateBody(appointmentMgmtSchema.skipResumePatient),
appointment.skipResumePatient
);

//Get Token Jwt
router.post('/getTokenJwt',
joiSchemaValidation.validateBody(appointmentMgmtSchema.getTokenJwt),
appointment.getTokenJwt
);
//Get Token 
router.post('/getToken',
joiSchemaValidation.validateBody(appointmentMgmtSchema.getToken),
appointment.getToken
);

//Get Sessions Jwt
router.post('/getSessionsJwt',
joiSchemaValidation.validateBody(appointmentMgmtSchema.getSessionsJwt),
appointment.getSessionsJwt
);
//Get Sessions 
router.post('/getSessions',
joiSchemaValidation.validateBody(appointmentMgmtSchema.getSessions),
appointment.getSessions
);

//Prescription Upload Jwt
// router.post('/PrescriptionUploadJwt',
// joiSchemaValidation.validateBody(appointmentMgmtSchema.PrescriptionUploadJwt),
// appointment.PrescriptionUploadJwt
// );
//Prescription Upload
router.post('/PrescriptionUpload',
joiSchemaValidation.validateBody(appointmentMgmtSchema.PrescriptionUpload),
appointment.PrescriptionUpload
);

//List the Prescription Images Jwt
router.post('/ListPrescriptionImagesJwt',
joiSchemaValidation.validateBody(appointmentMgmtSchema.ListPrescriptionImagesJwt),
appointment.ListPrescriptionImagesJwt
);

//List the Prescription Images
router.post('/ListPrescriptionImages',
joiSchemaValidation.validateBody(appointmentMgmtSchema.ListPrescriptionImages),
appointment.ListPrescriptionImages
);

//edit Load Prescription Images Jwt
router.post('/editLoadPrescriptionImagesJwt',
joiSchemaValidation.validateBody(appointmentMgmtSchema.editLoadPrescriptionImagesJwt),
appointment.editLoadPrescriptionImagesJwt
);

//Prescription Upload
router.post('/editLoadPrescriptionImages',
joiSchemaValidation.validateBody(appointmentMgmtSchema.editLoadPrescriptionImages),
appointment.editLoadPrescriptionImages
);

module.exports = router;