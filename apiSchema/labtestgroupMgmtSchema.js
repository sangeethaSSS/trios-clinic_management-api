const Joi = require('@hapi/joi');

module.exports.createLabtestgroupJwt = Joi.object().keys({ 
    group_id: Joi.number().required(), 
    group_name: Joi.string().required(), 
    rate:Joi.number().required(), 
    user_id: Joi.number().required(), 
    active_status: Joi.number().required(), 
    grouptest_Array:Joi.array().required().allow([]),
  });

  module.exports.createLabtestgroup = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.deleteLabtestgroupJwt = Joi.object().keys({
    user_id: Joi.number().required(), 
    group_id: Joi.number().required(), 
  });
  module.exports.deleteLabtestgroup = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.listLabtestgroupJwt = Joi.object().keys({
    user_id: Joi.number().required(), 
  });
  module.exports.listLabtestgroup = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.editloadLabtestgroupJwt = Joi.object().keys({
    group_id: Joi.number().required(), 
  });
  module.exports.editloadLabtestgroup = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.getTestbygroupJwt = Joi.object().keys({
    group_id: Joi.number().required(), 
  });
  module.exports.getTestbygroup = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });
  module.exports.TestgroupnameJwt = Joi.object().keys({
    group_name: Joi.string().required(), 
    group_id: Joi.number().required(), 
  });
  module.exports.Testgroupname = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });