'use strict';

var express = require('express');
var login = require('./login.controller');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
const loginMgmtSchema = require('../../apiSchema/loginMgmtSchema');
var router = express.Router();


//Login jwt 
router.post('/loginJwt',
joiSchemaValidation.validateBody(loginMgmtSchema.loginJwt),
login.loginJwt
);

//Login user
router.post('/login', 
 joiSchemaValidation.validateBody(loginMgmtSchema.login),
 login.login
);

module.exports = router;