
const constants = require('../constants');
const userMgmtService = require('../service/userMgmtService');
const logStreamName = 'userMgmtController';

//Create JWt Module
module.exports.createjwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await userMgmtService.createjwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
      response.message = constants.userMessage.USER_CREATED;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Create Module
module.exports.create = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await userMgmtService.create(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
      response.message = constants.userMessage.USER_CREATED;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//update JWt Module
module.exports.updatejwt = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await userMgmtService.updatejwt(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
      response.message = constants.userMessage.USER_CREATED;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}

//Update Module
module.exports.create = async (req, res) => {
  let response = {};
  try {   
    const responseFromService = await userMgmtService.update(req.body); 
    if(!responseFromService.token) {
      response.status = 200;
      response.message = constants.userMessage.USER_CREATED;
    }    
    response.body = responseFromService;
  } catch (error) {
    response.message = error.message;
  }
  return res.send(response);
}
