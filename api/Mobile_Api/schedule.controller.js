const constants = require('../../constants');
const AppScheduleMgmtService = require('../../service/AppScheduleMgmtService');

//Device Check
module.exports.schedule = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await AppScheduleMgmtService.schedule(req.body);
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