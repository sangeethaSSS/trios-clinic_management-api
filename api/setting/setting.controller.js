const constants = require('../../constants');
const SettingMgmtService = require('../../service/SettingMgmtService');

//Create setting JWt Module
module.exports.createSettingJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await SettingMgmtService.createSettingJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//Create setting Module
module.exports.createSetting = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await SettingMgmtService.createSetting(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//EDitload setting JWt Module
module.exports.editloadSettingJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await SettingMgmtService.editloadSettingJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//EDitload setting Module
module.exports.editloadSetting = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await SettingMgmtService.editloadSetting(req.body);
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
//Delete  Module Jwt
module.exports.deleteModuleJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await FinancialMgmtService.deleteModuleJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Delete  Module
module.exports.deleteModule = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await FinancialMgmtService.deleteModule(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}