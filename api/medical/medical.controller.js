const constants = require('../../constants');
const MedicalMgmtService = require('../../service/MedicalDataMgmtService');

//Create JWt Module
module.exports.creatMedicalJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await MedicalMgmtService.creatMedicalJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Create Medical Module
module.exports.creatMedical = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await MedicalMgmtService.creatMedical(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

// List Medical  Module
module.exports.listMedicalJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await MedicalMgmtService.listMedicalJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//List Medical  Module
module.exports.listMedical = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await MedicalMgmtService.listMedical(req.body);
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

// Edit  Medical  Module
module.exports.editloadMedicalJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await MedicalMgmtService.editloadMedicalJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Edit Medical  Module
module.exports.editloadMedical = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await MedicalMgmtService.editloadMedical(req.body);
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
