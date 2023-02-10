const constants = require('../../constants');
const patientLabDetailsMgmtService = require('../../service/patientLabDetailsMgmtService');


//Create Patient lab test jwt
module.exports.createPatientLabtestJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await patientLabDetailsMgmtService.createPatientLabtestJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Create Patient lab test 
module.exports.createPatientLabtest = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await patientLabDetailsMgmtService.createPatientLabtest(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

// Edit Patient lab test Module
module.exports.editloadPatientLabDetailsJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await patientLabDetailsMgmtService.editloadPatientLabDetailsJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Edit Patient lab test Module
module.exports.editloadPatientLabDetails = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await patientLabDetailsMgmtService.editloadPatientLabDetails(req.body);
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


//Get Payment Status JWt Module
module.exports.getPaymentStatusJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await patientLabDetailsMgmtService.getPaymentStatusJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Get Payment Status Module
module.exports.getPaymentStatus = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await patientLabDetailsMgmtService.getPaymentStatus(req.body);
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



//load Test Details JWt Module
module.exports.loadTestDetailsJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await patientLabDetailsMgmtService.loadTestDetailsJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//load Test Details Module
module.exports.loadTestDetails = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await patientLabDetailsMgmtService.loadTestDetails(req.body);
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
