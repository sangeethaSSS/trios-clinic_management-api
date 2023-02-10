const Joi = require('@hapi/joi');

// list Main Menu
module.exports.listMainMenuJwt = Joi.object().keys({
    user_id: Joi.number().required(), 
  });
module.exports.listMainMenu = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});

// list Sub Menus 
module.exports.listSubMenuJwt = Joi.object().keys({
  main_menu_id: Joi.number().required(), 
});
module.exports.listSubMenu = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});

//create User role
module.exports.createUserroleJwt = Joi.object().keys({
  user_role_id: Joi.number().required(), 
  userrole_name: Joi.string().required(), 
  active_status: Joi.number().required(),
  user_id: Joi.number().required(),
  user_role_array:Joi.array().required().allow([]), 
});
module.exports.createUserrole = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});

//Edit User role List
module.exports.editUserroleJwt = Joi.object().keys({
  user_role_id: Joi.number().required(), 
});
module.exports.editUserrole = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});

//List User role
module.exports.listUserroleJwt = Joi.object().keys({
  user_id: Joi.number().required(), 
});
module.exports.listUserrole = Joi.object().keys({ 
  jwtToken: Joi.string().required(), 
});