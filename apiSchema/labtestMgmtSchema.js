const Joi = require('@hapi/joi');

module.exports.createLabtestJwt = Joi.object().keys({ 
    test_id: Joi.number().required(), 
    test_name: Joi.string().required(), 
    rate:Joi.number().required(), 
    unit_name: Joi.string().required().allow(""),
    user_id: Joi.number().required(), 
    active_status: Joi.number().required(), 
    test_Condition:Joi.array().required().allow([]),
  });

  module.exports.createLabtest = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.deleteLabtestJwt = Joi.object().keys({
    user_id: Joi.number().required(), 
    test_id: Joi.number().required(), 
  });
  module.exports.deleteLabtest = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.listLabtestJwt = Joi.object().keys({
    user_id: Joi.number().required(), 
  });
  
  module.exports.listLabtest = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.editloadLabtestJwt = Joi.object().keys({
    test_id: Joi.number().required(), 
  });
  module.exports.editloadLabtest = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.testnameCheckingJwt = Joi.object().keys({
    test_name: Joi.string().required(),
    test_id: Joi.number().required(), 
  });
  module.exports.testnameChecking = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
