/****************************
 Developed by : Shiva Software Solutions
 File    : constants
 Date    : 19-11-2021
 Purpose : constants variable 
 * ********************** */

 var AWSACCESS_KEY = '';
 var AWSSECRET_ACCESS_KEY = '';
 var AWSBUCKET_NAME = '';
 var AWSREGION = '';
 var FILEPATH = '';


module.exports = { 
  //Server Response
  defaultServerResponse: {
    status: 400,
    message: '',
    body: {}
  },
  //Database Connections
  connectionString: 'postgresql://postgres:Gudmedrds$123@gudmed-rds-test.cmogvoenzszz.ap-south-1.rds.amazonaws.com/gudmedtest',
  productMessage: {
    PRODUCT_CREATED: 'Product Created Successfully',
    PRODUCT_FETCHED: 'Product Fetched Successfully',
    PRODUCT_UPDATED: 'Product Updated Successfully',
    PRODUCT_DELETED: 'Product Deleted Successfully',
    PRODUCT_NOT_FOUND: 'Product Not Found'
  },

  //User Management
  userMessage: {
    LIST_CREATED: 'Listed Successfully',
    USER_CREATED: 'Created Successfully',
    USER_UPDATED:'Updated Successfully',
    USER_DELETED:'Deleted Successfully',
    PRINT_SUCESS:'Print Sucessfully',

    DUPLICATE_TESTGROUPNAME:'Test GroupName already exist',
    UNIQUE_TESTGROUPNAME:'Test GroupName is Unique',
    DUPLICATE_TESTNAME:'Test Name already exist',
    UNIQUE_REGNUMBER:'Register Number is Unique',
    USER_UPLOAD:'Upload Successfully',
    DUPLICATE_CODE:'Company code already in use ',
    UNIQUE_CODE:'Company code is Unique ',
    PAID_MESSAGE:'Fees already paid',
    PENDING_MESSAGE:'Fees not paid',
    SIGNUP_SUCCESS:'Signup Success',
    INACTIVE_USER:'Inactive user',
    STARTSESSION:'Session is Started',
    ENDSESSION:'Session is Ended',
    NOTENDSESSION:'Session is Not Started',
    NORECORDFOUND:'No record found',
    USER_NAME_CHECK:'Username already in use',
    DEVICE_NAME_CHECK:'Devices ID already in use',
    BOTH_NAME_CHECK:'Username or Devices ID already in use',
    PATIENT_NAME_CHECK:'Patient record already in used',
    RESET_PASWD: 'Password reset successfully',
    FINANCIAL_CHECK:'Financial year has transactions',
    FINANCIAL_MODULE_CHECK:'Module already in use',
    OLD_PASWD_CHECK: 'Old Password Incorrect',
    LOGIN_SUCCESS: 'Login Success',
    ALREADY_EXITS : 'Already exists',
    DUPLICATE_EMPLOYEE: 'Employee already in use',
    DUPLICATION_USER:'User already in use',
    DUPLICATE_REGNUMBER: 'Register Number already in use',
    UNIQUE_REGNUMBER:'Register Number is Unique',
    SKIPPEDPATIENT:'Patient token number paused',
    SKIPPEDRESUME:'Patient token number Resumed',
    DUPLICATE_PATIENT:'Patient is already in use',
    UNIQUE_PATIENT:'Patient  is Unique',
    USER_NOT_FOUND: 'User not found',
    USER_BLOCKED: 'User is blocked',
    FINANCIAL_MISSING: 'Financial year setting is missing',
    INVALID_PASSWORD: 'Username or password is incorrect',
    OLD_PASSWORD_INCORRECT: 'Old Password is incorrect',
    USERS_FETCHED: 'Users Fetched Successfully',
    ACCOUNTDETAILSMISSING:'Please create account details for the modules',
    DUPLICATE_OLDID: 'Old ID already in use',
   
    ONLINE_OFFLINE_STATUS:'User Online/Offline',
    OTP_ERROR:'This Agent ID is not registered with us',
   
    OTPEXPIRED:'Your OTP is expired , Please try again!',
    SESSION_LOG:'Insert Active Session',
    SYSTEMIP:'check system ip address',
    CHANGEMOBILE:'Mobile No. has been changed successfully'
  },

  //Patient Management
  patientDtlsMessage: {
    DUPLICATE_PATIENT :'Patient already exist',
    PATIENT_CREATED: 'Patient info created Successfully',
    PATIENT_FETCHED: 'Patient info fetched Successfully',
    PATIENT_DELETED:'Patient info deleted Successfully',
    PATIENT_UPDATED:'Patient info updated Successfully',
    PATIENT_NOT_FOUND:'Patient not found',
    PROFILE_UPDATE:'Profile Updated Successfully'
  },
  
  //ErrorLog Handling
  ErrorlogMessage: {
    PLAT_FORM_NAME: 'API'
  },
  //Validation input Messages
  requestValidationMessage: {
    BAD_REQUEST: 'Invalid fields',
    TOKEN_MISSING: 'Token missing from header'
  },
  
  //database 
  databaseMessage: {
    INVALID_ID: 'Invalid Id'
  },
  awscredentials: {
    AWS_ACCESS_KEY: AWSACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: AWSSECRET_ACCESS_KEY,
    AWS_BUCKET_NAME: AWSBUCKET_NAME,
    AWS_REGION: AWSREGION,
    AWS_FILE_PATH: FILEPATH
  },
  //settings
  defaultSettings: {
    seqId:1,
    reqId:1,
    patId_start:'pat_',
    erxId_start:'eRx_',
    docId_start:'doc_'
  },

  //Token 
  token: {
    INVALID_TOKEN:'INVALID TOKEN'
  },
  
  //Doctor Management
  doctorDtlsMessage: {
    DUPLICATE_DOCTOR :'Doctor already exist',   
    DOCTOR_CREATED: 'Doctor info created Successfully',
    DOCTOR_FETCHED: 'Doctor info fetched Successfully',
    DOCTOR_DELETED:'Doctor info deleted Successfully',
    DOCTOR_UPDATED:'Doctor info updated Successfully',
    DOCTOR_NOT_FOUND:'Doctor not found',
    SUCCESS:"SUCCESS"
  },
 patientMang:{
  INVALID_USER: 'Mobile No. or Password incorrect',
  ALREADY_EXIST:'Patient already exist',
  TOKEN_NOT_FOUND:'Token not found',
  DATA_EMPTY:'Data is empty',
  PATIENT_CREATED:'Patient created successfully',
  PATIENT_NOT_FOUND:'Patient not found',
  OTPINVALID:'Invalid OTP',
  OTPEXPIRED:'Your OTP is expired , Please try again!', 
  OTP_SUCCESS: 'OTP sent successfully',
  CHANGE_PASWD: 'Change password successfully',
  MOBILENO_NOT_FOUND: 'This Mobile No. does not exists in our records',
  MOBILENO_EXIST: 'This Mobile No. already exists in our records',
 },
 docMang:{
  INVALID_USER: 'Mobile No. or Password incorrect',
  ALREADY_EXIST:'Doctor already exist',
  TEST_EXIST:'Test already used',
  TOKEN_NOT_FOUND:'Token not found',
  DATA_EMPTY:'Data is empty',
  DOCTOR_CREATED:'Doctor created successfully',
  DOCTOR_NOT_FOUND:'Doctor not found',
  OTPINVALID:'Invalid OTP',
  OTPEXPIRED:'Your OTP is expired , Please try again!',
  SUCCESS:"SUCCESS",
  FETCHED: 'Data fetched Successfully',
  CHANGE_PASWD: 'Change password successfully',
  OTP_SUCCESS: 'OTP sent successfully',
  MOBILENO_NOT_FOUND: 'This Mobile No. does not exists in our records',
  MOBILENO_EXIST: 'This Mobile No. already exists in our records',
 },
  status: {
    PENDING :0,
    INPROGRESS:1,
    REJECTED:2,
    COMPLETED:3,
    SEND_TO_REVIEW:4,
    BACK_TO_REVIEW:5
  },
  loginStatus:{
    Active:1,
    Inactive:2,
    Blocked:0
  },
  rejectMesssage : 'Sorry we are not able to fulfill your prescription because ',
  callStatus: {
    PENDING :0,
    CALL_NOT_COMPLETED:1,
    CALL_COMPLETED:2,
  }
}

