const Joi = require('@hapi/joi');

module.exports.createUserJwt = Joi.object().keys({ 
    user_code: Joi.number().required(), 
    username: Joi.string().required().allow(""), 
    password: Joi.string().required().allow(""),
    userrole_id:Joi.number().required().allow(0), 
    employee_id: Joi.number().required(), 
    devices_id:Joi.string().required().allow(""),
    pincode : Joi.string().required().allow(""),
    user_id: Joi.number().required(), 
    active_status: Joi.number().required(), 
    access_flag:Joi.number().required(),
  });

  module.exports.createUser = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.deleteUserJwt = Joi.object().keys({
    user_id: Joi.number().required(), 
    user_code: Joi.number().required(), 
  });
  module.exports.deleteUser = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.listUserJwt = Joi.object().keys({
    user_id: Joi.number().required(), 
    user_category: Joi.number().required(), 
    active_status: Joi.number().required(), 
  });
  module.exports.listUser = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.editloadUserJwt = Joi.object().keys({
    user_code: Joi.number().required(), 
  });
  module.exports.editloadUser = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  
  module.exports.searchUserJwt = Joi.object().keys({
    search_Value: Joi.string().required(),
  });
  module.exports.searchUser = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.resetPasswordJwt = Joi.object().keys({
    new_password: Joi.string().required(),
    user_code: Joi.number().required(), 
  });
  module.exports.resetPassword = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  //Change Password - Old password checking
  module.exports.oldPasswordCheckJwt = Joi.object().keys({
    old_password: Joi.string().required(),
    user_code: Joi.number().required(), 
  });
  module.exports.oldPasswordCheck = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.resetPinJwt = Joi.object().keys({
    new_password: Joi.string().required(),
    user_code: Joi.number().required(), 
  });
  module.exports.resetPin = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });