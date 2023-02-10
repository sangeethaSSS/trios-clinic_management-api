const constants = require('../../constants');
const cashModuleMgmtService = require('../../service/cashModuleMgmtService');


//list Cash Module Jwt
module.exports.listCashModuleJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await cashModuleMgmtService.listCashModuleJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//list Cash Module Module
module.exports.listCashModule = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await cashModuleMgmtService.listCashModule(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

