const Joi = require('@hapi/joi');

module.exports.createAccountJwt = Joi.object().keys({
    account_id: Joi.number().required(),
    city_id: Joi.number().required(),
    city_name: Joi.string().required().allow(""),
    state_id: Joi.number().required(),
    company_code: Joi.string().required(),
    company_name: Joi.string().required(),
    email_id: Joi.string().required().allow(""),
    area_name: Joi.string().required().allow(""),
    street_name: Joi.string().required().allow(""),
    gstin_number: Joi.string().required().allow(""),
    mobile_number: Joi.string().required().allow(""),
    whatsapp_number: Joi.string().required().allow(""),
    telephone_number1: Joi.string().required().allow(""),
    telephone_number2: Joi.string().required().allow(""),
    pincode: Joi.string().required().allow(""),
    reg_number: Joi.string().required().allow(""),
    website: Joi.string().required().allow(""),
    user_id: Joi.number().required(),
    active_status: Joi.number().required(),
    moduleArray:Joi.array().required().allow([])
});
module.exports.createAccount = Joi.object().keys({
    jwtToken: Joi.string().required(),
});

  module.exports.deleteAccountJwt = Joi.object().keys({
    account_id: Joi.number().required(), 
    user_id: Joi.number().required(),
  });
  module.exports.deleteAccount = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.listAccountJwt = Joi.object().keys({
    user_id: Joi.number().required(),
  });
  module.exports.listAccount = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.editloadAccountJwt = Joi.object().keys({ 
    account_id: Joi.number().required(), 
  });
  module.exports.editloadAccount= Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.getAccountDetailsJwt = Joi.object().keys({ 
    module_id: Joi.number().required(), 
  });
  module.exports.getAccountDetails= Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });           

  module.exports.getAccountModuleJwt = Joi.object().keys({ 
    account_id: Joi.number().required(), 
  });
  module.exports.getAccountModule = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });   
  module.exports.companyCodeCheckJwt = Joi.object().keys({ 
    account_id: Joi.number().required().allow(0),
    company_code: Joi.string().required(),
  });
  
  module.exports.companyCodeCheck = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });