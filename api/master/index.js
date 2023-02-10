'use strict';


var express = require('express');
var employee = require('./employee.controller');
var drug = require('./drug.controller');
var user = require('./user.controller');
var account = require('./account.controller');
var unitmeasure= require('./unitmeasure.controller');
const userMgmtSchema = require('../../apiSchema/userMgmtSchema');
const joiSchemaValidation = require('../../middleware/joiSchemaValidation');
const employeeMgmtSchema = require('../../apiSchema/employeeMgmtSchema');
const accountMgmtSchema = require('../../apiSchema/accountMgmtSchema');
const unitmeasureMgmtSchema = require('../../apiSchema/unitmeasureMgmtSchema');
const drugMgmtSchema = require('../../apiSchema/drugMgmtSchema');
var router = express.Router();

//Create Employee jwt 
router.post('/createEmployeeJwt',
joiSchemaValidation.validateBody(employeeMgmtSchema.createEmployeeJwt),
 employee.createEmployeeJwt
);

//Insert employee
router.post('/createEmployee', 
 joiSchemaValidation.validateBody(employeeMgmtSchema.createEmployee),
employee.createEmployee
);

//Delete employee Jwt
router.post('/deleteEmployeeJwt', 
joiSchemaValidation.validateBody(employeeMgmtSchema.deleteEmployeeJwt),
employee.deleteEmployeeJwt
);

//Delete employee
router.post('/deleteEmployee', 
joiSchemaValidation.validateBody(employeeMgmtSchema.deleteEmployee),
employee.deleteEmployee
);

//List employee Jwt
router.post('/listEmployeeJwt', 
joiSchemaValidation.validateBody(employeeMgmtSchema.listEmployeeJwt),
employee.listEmployeeJwt
);

//List employee
router.post('/listEmployee', 
joiSchemaValidation.validateBody(employeeMgmtSchema.listEmployee),
employee.listEmployee
);

//Editload employee Jwt
router.post('/editloadEmployeeJwt', 
joiSchemaValidation.validateBody(employeeMgmtSchema.editloadEmployeeJwt),
employee.editloadEmployeeJwt
);

//Editload employee
router.post('/editloadEmployee', 
joiSchemaValidation.validateBody(employeeMgmtSchema.editloadEmployee),
employee.editloadEmployee
);

//register Number checking Jwt
router.post('/registerCheckingJwt',
joiSchemaValidation.validateBody(employeeMgmtSchema.registerCheckingJwt),
employee.registerCheckingJwt
);

//register  Number checking
router.post('/registerChecking',
joiSchemaValidation.validateBody(employeeMgmtSchema.registerChecking),
employee.registerChecking
);
//Create User jwt 
router.post('/createUserJwt',
joiSchemaValidation.validateBody(userMgmtSchema.createUserJwt),
 user.createUserJwt
);

//Insert User
router.post('/createUser', 
joiSchemaValidation.validateBody(userMgmtSchema.createUser),
user.createUser
);

//Delete User Jwt
router.post('/deleteUserJwt', 
joiSchemaValidation.validateBody(userMgmtSchema.deleteUserJwt),
user.deleteUserJwt
);

//Delete User
router.post('/deleteUser', 
joiSchemaValidation.validateBody(userMgmtSchema.deleteUser),
user.deleteUser
);

//List User Jwt
router.post('/listUserJwt', 
joiSchemaValidation.validateBody(userMgmtSchema.listUserJwt),
user.listUserJwt
);

//List User
router.post('/listUser', 
joiSchemaValidation.validateBody(userMgmtSchema.listUser),
user.listUser
);

//Edit User Jwt
router.post('/editloadUserJwt', 
joiSchemaValidation.validateBody(userMgmtSchema.editloadUserJwt),
user.editloadUserJwt
);

//Edit User
router.post('/editloadUser', 
joiSchemaValidation.validateBody(userMgmtSchema.editloadUser),
user.editloadUser
);

//Search User Jwt
router.post('/searchUserJwt',
joiSchemaValidation.validateBody(userMgmtSchema.searchUserJwt),
user.searchUserJwt
);

//Search Appointment
router.post('/searchUser',
joiSchemaValidation.validateBody(userMgmtSchema.searchUser),
user.searchUser
);

//Reset User Jwt
router.post('/resetPasswordJwt',
joiSchemaValidation.validateBody(userMgmtSchema.resetPasswordJwt),
user.resetPasswordJwt
);

//Reset
router.post('/resetPassword',
joiSchemaValidation.validateBody(userMgmtSchema.resetPassword),
user.resetPassword
);

//Check Old password match for change User password Jwt
router.post('/oldPasswordCheckJwt',
joiSchemaValidation.validateBody(userMgmtSchema.oldPasswordCheckJwt),
user.oldPasswordCheckJwt
);

//Reset Appointment
router.post('/oldPasswordCheck',
joiSchemaValidation.validateBody(userMgmtSchema.oldPasswordCheck),
user.oldPasswordCheck
);

//Create Account Jwt
router.post('/createAccountJwt',
joiSchemaValidation.validateBody(accountMgmtSchema.createAccountJwt),
account.createAccountJwt
);

//Create Account
router.post('/createAccount',
joiSchemaValidation.validateBody(accountMgmtSchema.createAccount),
account.createAccount
);

//edit Account Jwt
router.post('/editloadAccountJwt',
joiSchemaValidation.validateBody(accountMgmtSchema.editloadAccountJwt),
account.editloadAccountJwt
);

//edit Account
router.post('/editloadAccount',
joiSchemaValidation.validateBody(accountMgmtSchema.editloadAccount),
account.editloadAccount
);
//list Account Jwt
router.post('/listAccountJwt',
joiSchemaValidation.validateBody(accountMgmtSchema.listAccountJwt),
account.listAccountJwt
);

//list Account
router.post('/listAccount',
joiSchemaValidation.validateBody(accountMgmtSchema.listAccount),
account.listAccount
);


//list Account Jwt
router.post('/deleteAccountJwt',
joiSchemaValidation.validateBody(accountMgmtSchema.deleteAccountJwt),
account.deleteAccountJwt
);

//list Account
router.post('/deleteAccount',
joiSchemaValidation.validateBody(accountMgmtSchema.deleteAccount),
account.deleteAccount
);

//Get Account Jwt
router.post('/getAccountDetailsJwt',
joiSchemaValidation.validateBody(accountMgmtSchema.getAccountDetailsJwt),
account.getAccountDetailsJwt
);

//Get Account
router.post('/getAccountDetails',
joiSchemaValidation.validateBody(accountMgmtSchema.getAccountDetails),
account.getAccountDetails
);

//Get Account  Module Jwt
router.post('/getAccountModuleJwt',
joiSchemaValidation.validateBody(accountMgmtSchema.getAccountModuleJwt),
account.getAccountModuleJwt
);

//Get Account Module
router.post('/getAccountModule',
joiSchemaValidation.validateBody(accountMgmtSchema.getAccountModule),
account.getAccountModule
);

//Company Code checkJwt
router.post('/companyCodeCheckJwt',
joiSchemaValidation.validateBody(accountMgmtSchema.companyCodeCheckJwt),
account.companyCodeCheckJwt
);

//Company Code check
router.post('/companyCodeCheck',
joiSchemaValidation.validateBody(accountMgmtSchema.companyCodeCheck),
account.companyCodeCheck
);
//Create Unitofmeasure Jwt
router.post('/createUnitmeasureJwt',
joiSchemaValidation.validateBody(unitmeasureMgmtSchema.createUnitmeasureJwt),
unitmeasure.createUnitmeasureJwt
);

//Create Unitofmeasure
router.post('/createUnitmeasure',
joiSchemaValidation.validateBody(unitmeasureMgmtSchema.createUnitmeasure),
unitmeasure.createUnitmeasure
);
//List Unitofmeasure Jwt
router.post('/listUnitmeasureJwt',
joiSchemaValidation.validateBody(unitmeasureMgmtSchema.listUnitmeasureJwt),
unitmeasure.listUnitmeasureJwt
);

//List Unitofmeasure
router.post('/listUnitmeasure',
joiSchemaValidation.validateBody(unitmeasureMgmtSchema.listUnitmeasure),
unitmeasure.listUnitmeasure
);
//Editload Unitofmeasure Jwt
router.post('/editloadUnitmeasureJwt',
joiSchemaValidation.validateBody(unitmeasureMgmtSchema.editloadUnitmeasureJwt),
unitmeasure.editloadUnitmeasureJwt
);

//Editload Unitofmeasure
router.post('/editloadUnitmeasure',
joiSchemaValidation.validateBody(unitmeasureMgmtSchema.editloadUnitmeasure),
unitmeasure.editloadUnitmeasure
);
//delete Unitofmeasure Jwt
router.post('/deleteUnitmeasureJwt',
joiSchemaValidation.validateBody(unitmeasureMgmtSchema.deleteUnitmeasureJwt),
unitmeasure.deleteUnitmeasureJwt
);

//delete Unitofmeasure
router.post('/deleteUnitmeasure',
joiSchemaValidation.validateBody(unitmeasureMgmtSchema.deleteUnitmeasure),
unitmeasure.deleteUnitmeasure
);

//Create Drug jwt 
router.post('/createDrugJwt',
joiSchemaValidation.validateBody(drugMgmtSchema.createDrugJwt),
drug.createDrugJwt
);

//Insert Drug
router.post('/createDrug', 
 joiSchemaValidation.validateBody(drugMgmtSchema.createDrug),
 drug.createDrug
);

router.post('/listDrugJwt' , 
joiSchemaValidation.validateBody(drugMgmtSchema.listDrugJwt),
drug.listDrugJwt
);

router.post('/listDrug' , 
joiSchemaValidation.validateBody(drugMgmtSchema.listDrug),
drug.listDrug
); 

router.post('/editDrugJwt' , 
joiSchemaValidation.validateBody(drugMgmtSchema.editDrugJwt),
drug.editDrugJwt
);

router.post('/editDrug' , 
joiSchemaValidation.validateBody(drugMgmtSchema.editDrug),
drug.editDrug
); 

router.post('/deleteDrugJwt' , 
joiSchemaValidation.validateBody(drugMgmtSchema.deleteDrugJwt),
drug.deleteDrugJwt
);

router.post('/deleteDrug' , 
joiSchemaValidation.validateBody(drugMgmtSchema.deleteDrug),
drug.deleteDrug
); 

router.post('/onchangeListJwt' , 
joiSchemaValidation.validateBody(drugMgmtSchema.onchangeListJwt),
drug.onchangeListJwt
);

router.post('/onchangeList' , 
joiSchemaValidation.validateBody(drugMgmtSchema.onchangeList),
drug.onchangeList
); 


//Reset User Pin Jwt
router.post('/resetPinJwt',
joiSchemaValidation.validateBody(userMgmtSchema.resetPinJwt),
user.resetPinJwt
);

//Reset Pin
router.post('/resetPin',
joiSchemaValidation.validateBody(userMgmtSchema.resetPin),
user.resetPin
);


//Import Drug jwt
router.post('/importDrugJwt',
joiSchemaValidation.validateBody(drugMgmtSchema.importDrugJwt),
drug.importDrugJwt
);

//Import Drug
router.post('/importDrug', 
 joiSchemaValidation.validateBody(drugMgmtSchema.importDrug),
 drug.importDrug
);

module.exports = router;