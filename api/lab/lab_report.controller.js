const constants = require('../../constants');
const labreportMgmtService = require('../../service/labreportMgmtService');


// List Test  Module
module.exports.listLabReportJwt = async (req, res) => {
    let response = {};
    
    try {
        const responseFromService = await labreportMgmtService.listLabReportJwt(req.body);
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
module.exports.listLabReport = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await labreportMgmtService.listLabReport(req.body);
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

// List Test  Module
module.exports.editloadLabReportgroupJwt = async (req, res) => {
    let response = {};
    
    try {
        const responseFromService = await labreportMgmtService.editloadLabReportgroupJwt(req.body);
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
module.exports.editloadLabReportgroup = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await labreportMgmtService.editloadLabReportgroup(req.body);
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
// create lab Test Module jwt
module.exports.createLabreportgroupJwt = async (req, res) => {
    let response = {};
    
    try {
        const responseFromService = await labreportMgmtService.createLabreportgroupJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//create lab Test Module
module.exports.createLabreportgroup = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await labreportMgmtService.createLabreportgroup(req.body);
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

//create Lab Report service
module.exports.createLabReport = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await labreportMgmtService.createLabReport(req.body);
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

// edit Load Lab Report Module jwt
module.exports.editLoadLabReportImagesJwt = async (req, res) => {
    let response = {};
    
    try {
        const responseFromService = await labreportMgmtService.editLoadLabReportImagesJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//editLoad Lab Report Module
module.exports.editLoadLabReportImages = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await labreportMgmtService.editLoadLabReportImages(req.body);
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


// List Lab Images Module jwt
module.exports.ListLabImagesJwt = async (req, res) => {
    let response = {};
    
    try {
        const responseFromService = await labreportMgmtService.ListLabImagesJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//List Lab Images Module
module.exports.ListLabImages = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await labreportMgmtService.ListLabImages(req.body);
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