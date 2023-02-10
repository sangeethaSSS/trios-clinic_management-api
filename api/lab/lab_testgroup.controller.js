const constants = require('../../constants');
const LabtestgroupMgmtService = require('../../service/LabtestgroupMgmtService');

//Create Test Group JWt Module
module.exports.createLabtestgroupJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestgroupMgmtService.createLabtestgroupJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Create Test Group Module
module.exports.createLabtestgroup = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestgroupMgmtService.createLabtestgroup(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

// Delete Test Group  Module
module.exports.deleteLabtestgroupJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestgroupMgmtService.deleteLabtestgroupJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Delete Test Group  Module
module.exports.deleteLabtestgroup = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestgroupMgmtService.deleteLabtestgroup(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

// List Test Group  Module
module.exports.listLabtestgroupJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestgroupMgmtService.listLabtestgroupJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//List Test Group  Module
module.exports.listLabtestgroup = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestgroupMgmtService.listLabtestgroup(req.body);
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

// Edit  Test Group  Module
module.exports.editloadLabtestgroupJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestgroupMgmtService.editloadLabtestgroupJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Edit Test Group  Module
module.exports.editloadLabtestgroup = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestgroupMgmtService.editloadLabtestgroup(req.body);
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

//Get Test by Group
module.exports.getTestbygroupJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestgroupMgmtService.getTestbygroupJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Get Test by Group Module
module.exports.getTestbygroup = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestgroupMgmtService.getTestbygroup(req.body);
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
//Test GroupName Checking jwt 
module.exports.TestgroupnameJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestgroupMgmtService.TestgroupnameJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Test GroupName Checking 
module.exports.Testgroupname = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LabtestgroupMgmtService.Testgroupname(req.body);
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