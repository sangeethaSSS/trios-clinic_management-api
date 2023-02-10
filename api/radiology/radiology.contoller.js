
const constants = require('../../constants');
const RadiologyMgmtService = require('../../service/RadiologyMgmtService');

//Create radiology jwt Module
module.exports.createRadiologyJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyMgmtService.createRadiologyJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//Create radiology Module
module.exports.createRadiology = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyMgmtService.createRadiology(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Edit Load radiology jwt Module
module.exports.editloadRadiologyJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyMgmtService.editloadRadiologyJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//Edit Load radiology Module
module.exports.editloadRadiology = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyMgmtService.editloadRadiology(req.body);
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

//get Radiology PaymentStatus jwt Module
module.exports.getRadiologyPaymentStatusJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyMgmtService.getRadiologyPaymentStatusJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//get Radiology PaymentStatus Module
module.exports.getRadiologyPaymentStatus = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyMgmtService.getRadiologyPaymentStatus(req.body);
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

//Load radiology Details jwt Module
module.exports.loadRadiologyDetailsJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyMgmtService.loadRadiologyDetailsJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//Load radiology Details Module
module.exports.loadRadiologyDetails = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyMgmtService.loadRadiologyDetails(req.body);
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