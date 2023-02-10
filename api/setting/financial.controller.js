const constants = require('../../constants');
const FinancialMgmtService = require('../../service/FinancialMgmtService');

//create Financial JWt Module
module.exports.createFinancialJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await FinancialMgmtService.createFinancialJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//create Financial Module
module.exports.createFinancial = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await FinancialMgmtService.createFinancial(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//EDitload Financial JWt Module
module.exports.editloadFinancialJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await FinancialMgmtService.editloadFinancialJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//EDitload Financial Module
module.exports.editloadFinancial = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await FinancialMgmtService.editloadFinancial(req.body);
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

//List Financial JWt Module
module.exports.listFinancialJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await FinancialMgmtService.listFinancialJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//List Financial Module
module.exports.listFinancial = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await FinancialMgmtService.listFinancial(req.body);
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
//Delete Financial Module
module.exports.deleteFinancialJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await FinancialMgmtService.deleteFinancialJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Delete Financial Module
module.exports.deleteFinancial = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await FinancialMgmtService.deleteFinancial(req.body);
        if (!responseFromService.token) {
            response.status = 200;
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