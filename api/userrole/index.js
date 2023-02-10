'use strict';

var express = require('express');
var userrole = require('./userrole.controller');
const userroleMgmtSchema = require('../../apiSchema/userroleMgmtSchema');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
var router = express.Router();


//List Userrole MainMenu jwt 
router.post('/listMainMenuJwt',
joiSchemaValidation.validateBody(userroleMgmtSchema.listMainMenuJwt),
userrole.listMainMenuJwt
);

//List Userrole MainMenu
router.post('/listMainMenu',
joiSchemaValidation.validateBody(userroleMgmtSchema.listMainMenu),
userrole.listMainMenu
);

//List Userrole Sub-Menu jwt 
router.post('/listSubMenuJwt',
joiSchemaValidation.validateBody(userroleMgmtSchema.listSubMenuJwt),
userrole.listSubMenuJwt
);

//List Userrole Sub-Menu
router.post('/listSubMenu',
joiSchemaValidation.validateBody(userroleMgmtSchema.listSubMenu),
userrole.listSubMenu
);

//create Userrole Jwt
router.post('/createUserroleJwt',
joiSchemaValidation.validateBody(userroleMgmtSchema.createUserroleJwt),
userrole.createUserroleJwt
);

//create Userrole
router.post('/createUserrole',
joiSchemaValidation.validateBody(userroleMgmtSchema.createUserrole),
userrole.createUserrole
);

//Edit Userrole Jwt
router.post('/editUserroleJwt',
joiSchemaValidation.validateBody(userroleMgmtSchema.editUserroleJwt),
userrole.editUserroleJwt
);

//Edit Userrole
router.post('/editUserrole',
joiSchemaValidation.validateBody(userroleMgmtSchema.editUserrole),
userrole.editUserrole
);

//Edit Userrole Jwt
router.post('/listUserroleJwt',
joiSchemaValidation.validateBody(userroleMgmtSchema.listUserroleJwt),
userrole.listUserroleJwt
);

//Edit Userrole
router.post('/listUserrole',
joiSchemaValidation.validateBody(userroleMgmtSchema.listUserrole),
userrole.listUserrole
);

module.exports = router;