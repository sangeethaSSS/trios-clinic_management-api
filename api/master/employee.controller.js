
const constants = require('../../constants');
const EmployeeMgmtService = require('../../service/EmployeeMgmtService');

//Create JWt Module
module.exports.createEmployeeJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await EmployeeMgmtService.createEmployeeJwt(req.body);
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

//Create Employee Module
module.exports.createEmployee = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await EmployeeMgmtService.createEmployee(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Delete Employee Module
module.exports.deleteEmployeeJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await EmployeeMgmtService.deleteEmployeeJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Delete Employee Module
module.exports.deleteEmployee = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await EmployeeMgmtService.deleteEmployee(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//List Employee Jwt Module
module.exports.listEmployeeJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await EmployeeMgmtService.listEmployeeJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//List Employee Module
module.exports.listEmployee = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await EmployeeMgmtService.listEmployee(req.body);
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
module.exports.editloadEmployeeJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await EmployeeMgmtService.editloadEmployeeJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Editload Employee Module
module.exports.editloadEmployee = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await EmployeeMgmtService.editloadEmployee(req.body);
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
//Regitser  Number checking JWt Module
module.exports.registerCheckingJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await EmployeeMgmtService.registerCheckingJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Resister Number checking Module
module.exports.registerChecking = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await EmployeeMgmtService.registerChecking(req.body);
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