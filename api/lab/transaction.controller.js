const constants = require('../../constants');
const TransactiongroupMgmtService = require('../../service/TransactionMgmtService');


//Create Transaction JWt Module
module.exports.createTransactionJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await TransactiongroupMgmtService.createTransactionJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Create Transaction Group Module
module.exports.createTransaction = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await TransactiongroupMgmtService.createTransaction(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

