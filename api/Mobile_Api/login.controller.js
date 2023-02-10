const constants = require('../../constants');
const AppLoginMgmtService = require('../../service/AppLoginMgmtService');


//Login JWt Module
module.exports.loginJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppLoginMgmtService.loginJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//Login User Module
module.exports.login = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppLoginMgmtService.login(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            // response.message = constants.userMessage.LOGIN_SUCCESS;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//Device Check
module.exports.deviceCheck = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppLoginMgmtService.deviceCheck(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            // response.message = constants.userMessage.LOGIN_SUCCESS;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}