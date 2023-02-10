'use strict';

var express = require('express');
var login = require('./login.controller');
var schedule = require('./schedule.controller');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
const ApploginMgmtSchema = require('../../apiSchema/ApploginMgmtSchema');
const AppScheduleMgmtSchema = require('../../apiSchema/AppScheduleMgmtSchema');

const App_AppointmentMgmtSchema = require('../../apiSchema/App_AppointmentMgmtSchema');
var router = express.Router();
var appointment = require('./appointment.controller');

//deviceCheck  
router.post('/deviceCheck',
joiSchemaValidation.validateBody(ApploginMgmtSchema.deviceCheck),
login.deviceCheck
);

//Login jwt 
router.post('/apploginJwt',
joiSchemaValidation.validateBody(ApploginMgmtSchema.loginJwt),
login.loginJwt
);

//Login user
router.post('/applogin', 
 joiSchemaValidation.validateBody(ApploginMgmtSchema.login),
 login.login
);


//Schedule
router.post('/schedule', 
 joiSchemaValidation.validateBody(AppScheduleMgmtSchema.sheduleCheck),
 schedule.schedule
);
schedule
module.exports = router;


//Search Appointment Jwt
router.post('/searchPatientsJwt',
joiSchemaValidation.validateBody(App_AppointmentMgmtSchema.searchPatientsJwt),
appointment.searchPatientsJwt
);

//Search Appointment
router.post('/searchPatients',
joiSchemaValidation.validateBody(App_AppointmentMgmtSchema.searchPatients),
appointment.searchPatients
);

//Save Booking JWT 
router.post('/saveBookingJwt',
joiSchemaValidation.validateBody(App_AppointmentMgmtSchema.saveBookingJwt),
appointment.searchPatientsJwt
);


//Save Booking  
router.post('/saveBooking',
joiSchemaValidation.validateBody(App_AppointmentMgmtSchema.saveBooking),
appointment.createBooking);

//UPDATE Booking  
router.post('/updateBooking',
joiSchemaValidation.validateBody(App_AppointmentMgmtSchema.updateBooking),
appointment.updateBooking);

//List Booking  
router.post('/listBooking',
joiSchemaValidation.validateBody(App_AppointmentMgmtSchema.listBooking),
appointment.listBooking);

//List Booking  
router.post('/listDoctor',
joiSchemaValidation.validateBody(App_AppointmentMgmtSchema.listDoctor),
appointment.listDoctor);
