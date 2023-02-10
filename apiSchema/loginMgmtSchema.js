const Joi = require('@hapi/joi');

//Check input schema
module.exports.loginJwt = Joi.object().keys({
  username: Joi.string().required(), 
  password: Joi.string().required(), 
});
module.exports.login = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});