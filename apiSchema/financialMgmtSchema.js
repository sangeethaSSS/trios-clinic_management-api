const Joi = require('@hapi/joi');

module.exports.createFinancialJwt = Joi.object().keys({ 
    financial_year_id: Joi.number().required(), 
    end_date:Joi.number().required(),  
    start_date:Joi.number().required(), 
    user_id: Joi.number().required(), 
    active_status:Joi.number().required(), 
    financialSettingArray:Joi.array().required().allow([]),
  });

  module.exports.createFinancial = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.editloadFinancialJwt = Joi.object().keys({ 
    financial_year_id: Joi.number().required(), 
  });

  module.exports.editloadFinancial = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.listFinancialJwt = Joi.object().keys({ 
    user_id: Joi.number().required(), 
  });

  module.exports.listFinancial = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.deleteFinancialJwt = Joi.object().keys({ 
    user_id: Joi.number().required(), 
    financial_year_id: Joi.number().required(), 
  });
  
  module.exports.deleteFinancial = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.deleteModuleJwt = Joi.object().keys({ 
    financial_year_id: Joi.number().required(), 
    module_id: Joi.number().required(), 
  });
  
  module.exports.deleteModule = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });