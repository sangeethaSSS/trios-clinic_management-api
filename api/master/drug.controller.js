const constants = require('../../constants');
const DrugMgmtService = require('../../service/DrugMgmtService');

//Create Drug JWt Module
module.exports.createDrugJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await DrugMgmtService.createDrugJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.USER_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Create Drug Module
module.exports.createDrug = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await DrugMgmtService.createDrug(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//List Drug Jwt
module.exports.listDrugJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await DrugMgmtService.listDrugJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//List Drug
module.exports.listDrug = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await DrugMgmtService.listDrug(req.body);
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


//Edit Drug Jwt
module.exports.editDrugJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await DrugMgmtService.editDrugJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Edit Drug
module.exports.editDrug = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await DrugMgmtService.editDrug(req.body);
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


//Delete Drug Jwt
module.exports.deleteDrugJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await DrugMgmtService.deleteDrugJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Delete Drug
module.exports.deleteDrug = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await DrugMgmtService.deleteDrug(req.body);
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

//onchange List Jwt
module.exports.onchangeListJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await DrugMgmtService.onchangeListJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//onchange List
module.exports.onchangeList = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await DrugMgmtService.onchangeList(req.body);
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

//Import Drug jwt
module.exports.importDrugJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await DrugMgmtService.importDrugJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.USER_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Import Drug 
module.exports.importDrug = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await DrugMgmtService.importDrug(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}