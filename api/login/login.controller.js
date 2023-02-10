const constants = require('../../constants');
const LoginMgmtService = require('../../service/LoginMgmtService');


//Login JWt Module
module.exports.loginJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await LoginMgmtService.loginJwt(req.body);
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
        const responseFromService = await LoginMgmtService.login(req.body);
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