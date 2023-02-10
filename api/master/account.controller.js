
const constants = require('../../constants');
const AccountMgmtService = require('../../service/AccountMgmtService');

//Create JWt Module
module.exports.createAccountJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AccountMgmtService.createAccountJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Create Account Module
module.exports.createAccount = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AccountMgmtService.createAccount(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Delete Account Module
module.exports.deleteAccountJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AccountMgmtService.deleteAccountJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Delete Account Module
module.exports.deleteAccount = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AccountMgmtService.deleteAccount(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//List Account Jwt Module
module.exports.listAccountJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AccountMgmtService.listAccountJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//List Account Module
module.exports.listAccount = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AccountMgmtService.listAccount(req.body);
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

//Editload JWt Module
module.exports.editloadAccountJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AccountMgmtService.editloadAccountJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Editload Account Module
module.exports.editloadAccount= async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AccountMgmtService.editloadAccount(req.body);
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


//Get Account JWt Module
module.exports.getAccountDetailsJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AccountMgmtService.getAccountDetailsJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Get Account Module
module.exports.getAccountDetails = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AccountMgmtService.getAccountDetails(req.body);
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


//Get Account Module
module.exports.getAccountModuleJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AccountMgmtService.getAccountModuleJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Get Account Module
module.exports.getAccountModule = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AccountMgmtService.getAccountModule(req.body);
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
//Company Code check
module.exports.companyCodeCheckJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AccountMgmtService.companyCodeCheckJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Company Code Check
module.exports.companyCodeCheck = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AccountMgmtService.companyCodeCheck(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}