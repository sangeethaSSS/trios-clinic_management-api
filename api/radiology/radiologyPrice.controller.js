const constants = require('../../constants');
const RadiologyPriceMgmtService = require('../../service/RadiologyPriceMgmtService');


//Create radiology price jwt Module
module.exports.createRadiologyPriceJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyPriceMgmtService.createRadiologyPriceJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//Create radiology price Module
module.exports.createRadiologyPrice = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyPriceMgmtService.createRadiologyPrice(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Edit radiology price jwt
module.exports.editloadRadiologyPriceJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyPriceMgmtService.editloadRadiologyPriceJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//Edit radiology price
module.exports.editloadRadiologyPrice = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyPriceMgmtService.editloadRadiologyPrice(req.body);
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

//List radiology price jwt
module.exports.listRadiologyPriceJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyPriceMgmtService.listRadiologyPriceJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//List radiology price
module.exports.listRadiologyPrice = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyPriceMgmtService.listRadiologyPrice(req.body);
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