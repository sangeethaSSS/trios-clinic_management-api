
const constants = require('../../constants');
const App_AppointmentMgmtService = require('../../service/App_AppointmentMgmtService');


//Search  Appointment Jwt  Module
module.exports.searchPatientsJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await App_AppointmentMgmtService.searchPatientsJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//Search Appointment  Module
module.exports.searchPatients = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await App_AppointmentMgmtService.searchPatients(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


// createBooking  Module
module.exports.createBooking = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await App_AppointmentMgmtService.createBooking(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = "Inserted Successfully";
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//UPDATE BOOKING 
module.exports.updateBooking = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await App_AppointmentMgmtService.updateBooking(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = "Updated Successfully";
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

// listBooking  Module
module.exports.listBooking = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await App_AppointmentMgmtService.listBooking(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = "Listed Successfully";
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//DOCTOR LIST DATA 
module.exports.listDoctor = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await App_AppointmentMgmtService.listDoctor(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = "Listed Successfully";
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
 


