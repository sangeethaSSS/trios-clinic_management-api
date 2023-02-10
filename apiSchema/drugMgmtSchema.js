const Joi = require('@hapi/joi');

module.exports.createDrugJwt = Joi.object().keys({ 
    DrugArray :Joi.array().required().allow([]),
    user_id: Joi.number().required(), 
    active_status:Joi.number().required(),
    display_flag:Joi.number().required()
  });

  module.exports.createDrug = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });

  module.exports.listDrugJwt = Joi.object().keys({
    user_id: Joi.number().required(),
    offset:Joi.number().required(),
    pagesize:Joi.number().required(),
    search_value: Joi.string().required().allow(''),
    active_status: Joi.number().required(),
  });

  module.exports.listDrug = Joi.object().keys({
    jwtToken:Joi.string().required()
  });

  module.exports.editDrugJwt = Joi.object().keys({
    drug_id: Joi.number().required()
  });

  module.exports.editDrug = Joi.object().keys({
    jwtToken:Joi.string().required()
  });

  module.exports.deleteDrugJwt = Joi.object().keys({
    drug_id: Joi.number().required(),
    user_id: Joi.number().required()
  });

  module.exports.deleteDrug = Joi.object().keys({
    jwtToken:Joi.string().required()
  });

  module.exports.onchangeListJwt = Joi.object().keys({
    user_id: Joi.number().required()
  });

  module.exports.onchangeList = Joi.object().keys({
    jwtToken:Joi.string().required()
  });

  module.exports.importDrugJwt = Joi.object().keys({ 
    ImportDrugArray :Joi.array().required().allow([]),
    user_id: Joi.number().required(), 
    active_status:Joi.number().required(),
    display_flag:Joi.number().required()
  });

  module.exports.importDrug = Joi.object().keys({ 
    jwtToken: Joi.string().required(), 
  });