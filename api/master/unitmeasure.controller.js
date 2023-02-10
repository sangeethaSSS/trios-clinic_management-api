const constants = require('../../constants');
const UnitmeasureMgmtService = require('../../service/UnitmeasureMgmtService');

//Create unitmeasure JWt Module
module.exports.createUnitmeasureJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UnitmeasureMgmtService.createUnitmeasureJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Create unitmeasure Module
module.exports.createUnitmeasure = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UnitmeasureMgmtService.createUnitmeasure(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//List Unit of measure Jwt Module
module.exports.listUnitmeasureJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UnitmeasureMgmtService.listUnitmeasureJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//List Unit of measure Module
module.exports.listUnitmeasure = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UnitmeasureMgmtService.listUnitmeasure(req.body);
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

//Editload unimeasureJWt Module
module.exports.editloadUnitmeasureJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UnitmeasureMgmtService.editloadUnitmeasureJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Editload unitmeasure Module
module.exports.editloadUnitmeasure= async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UnitmeasureMgmtService.editloadUnitmeasure(req.body);
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

//Delete Unitmeasure Module
module.exports.deleteUnitmeasureJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UnitmeasureMgmtService.deleteUnitmeasureJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Delete Unitmeasure Module
module.exports.deleteUnitmeasure = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UnitmeasureMgmtService.deleteUnitmeasure(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}