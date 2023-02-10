const constants = require('../../constants');
const RadiologyReportMgmtService = require('../../service/RadiologyReportMgmtService');


//List radiology Report Details jwt Module
module.exports.listRadiologyReportJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyReportMgmtService.listRadiologyReportJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//List radiology price Module
module.exports.listRadiologyReport = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyReportMgmtService.listRadiologyReport(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Create Radiology Report Module
module.exports.CreateRadiologyReport = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyReportMgmtService.CreateRadiologyReport(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//editLoad Radiology Images Jwt 
module.exports.editLoadRadiologyImagesJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyReportMgmtService.editLoadRadiologyImagesJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//editLoad Radiology Images
module.exports.editLoadRadiologyImages = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyReportMgmtService.editLoadRadiologyImages(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//List Radiology Images Jwt 
module.exports.ListRadiologyImagesJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyReportMgmtService.ListRadiologyImagesJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//List Radiology Images
module.exports.ListRadiologyImages = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await RadiologyReportMgmtService.ListRadiologyImages(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}