const constants = require('../../constants');
const ReportService = require('../../service/reportMgmtService');


//Get Consolidated Report jwt Module
module.exports.getConsolidatedReportJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ReportService.getConsolidatedReportJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Get Consolidated Report Module
module.exports.getConsolidatedReport = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ReportService.getConsolidatedReport(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Detailed cash Report Module
module.exports.DetailedCashReportJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ReportService.DetailedCashReportJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

// Detailed cash Report Module
module.exports.DetailedCashReport = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await ReportService.DetailedCashReport(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

