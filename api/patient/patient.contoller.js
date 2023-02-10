const constants = require('../../constants');
const PatientMgmtService = require('../../service/PatientMgmtService');

//Create Patient JWt Module
module.exports.createPatientJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await PatientMgmtService.createPatientJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//Create Patient Module
module.exports.createPatient = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await PatientMgmtService.createPatient(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Delete Patient Module
module.exports.deletePatientJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await PatientMgmtService.deletePatientJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Delete Patient Module
module.exports.deletePatient = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await PatientMgmtService.deletePatient(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

// List Patient  Module
module.exports.listPatientJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await PatientMgmtService.listPatientJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//List Patient  Module
module.exports.listPatient = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await PatientMgmtService.listPatient(req.body);
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

// Edit  Patient  Module
module.exports.editloadPatientJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await PatientMgmtService.editloadPatientJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Edit Patient  Module
module.exports.editloadPatient = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await PatientMgmtService.editloadPatient(req.body);
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

//Uhid Patient Jwt
module.exports.getUHIDJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await PatientMgmtService.getUHIDJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Uhid Patient  Module
module.exports.getUHID = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await PatientMgmtService.getUHID(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//patient search Jwt
module.exports.patientDetailsearchJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await PatientMgmtService.patientDetailsearchJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//patient search  Module
module.exports.patientDetailsearch = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await PatientMgmtService.patientDetailsearch(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}