const constants = require('../../constants');
const LabtestMgmtService = require('../../service/LabtestMgmtService');

//Create Test JWt Module
module.exports.createLabtestJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestMgmtService.createLabtestJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Create Test Module
module.exports.createLabtest = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestMgmtService.createLabtest(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

// Delete Test  Module
module.exports.deleteLabtestJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestMgmtService.deleteLabtestJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Delete Test  Module
module.exports.deleteLabtest = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestMgmtService.deleteLabtest(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

// List Test  Module
module.exports.listLabtestJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestMgmtService.listLabtestJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//List Test  Module
module.exports.listLabtest = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestMgmtService.listLabtest(req.body);
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

// Edit  Test  Module
module.exports.editloadLabtestJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestMgmtService.editloadLabtestJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Edit Test  Module
module.exports.editloadLabtest = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestMgmtService.editloadLabtest(req.body);
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

//Test Name Checking jwt 
module.exports.testnameCheckingJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestMgmtService.testnameCheckingJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Test Name Checking 
module.exports.testnameChecking = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestMgmtService.testnameChecking(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}