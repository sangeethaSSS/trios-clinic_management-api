const Joi = require('@hapi/joi');


//Check input schema
module.exports.deviceCheck = Joi.object().keys({
  device_id: Joi.string().required()
});
//Check input schema
module.exports.loginJwt = Joi.object().keys({

  user_code:Joi.string().required(), 
  username: Joi.string().required(), 
  pincode: Joi.string().required() 
 // device_id: Joi.string().required(),
});
module.exports.login = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});

