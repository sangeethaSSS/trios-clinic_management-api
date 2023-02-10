const constants = require('../../constants');
const UserMgmtService = require('../../service/userMgmtService');

//Create JWt Module
module.exports.createUserJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UserMgmtService.createUserJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Create User Module
module.exports.createUser = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UserMgmtService.createUser(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

// Delete User  Module
module.exports.deleteUserJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UserMgmtService.deleteUserJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Delete User  Module
module.exports.deleteUser = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UserMgmtService.deleteUser(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

// List User  Module
module.exports.listUserJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UserMgmtService.listUserJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//List User  Module
module.exports.listUser = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UserMgmtService.listUser(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

// Edit  User  Module
module.exports.editloadUserJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UserMgmtService.editloadUserJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Edit User  Module
module.exports.editloadUser = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UserMgmtService.editloadUser(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//Search  User Jwt  Module
module.exports.searchUserJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UserMgmtService.searchUserJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//Search User  Module
module.exports.searchUser = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UserMgmtService.searchUser(req.body);
        if (!responseFromService.token) {
            response.status = 200;
            response.message = constants.userMessage.LIST_CREATED;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//resetPasswordJwt Module
module.exports.resetPasswordJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UserMgmtService.resetPasswordJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//resetPassword Module
module.exports.resetPassword = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UserMgmtService.resetPassword(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}

//oldPasswordCheckJwt Module
module.exports.oldPasswordCheckJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UserMgmtService.oldPasswordCheckJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}
//oldPasswordCheckJwt Module
module.exports.oldPasswordCheck = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UserMgmtService.oldPasswordCheck(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//resetPinJwt Module
module.exports.resetPinJwt = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UserMgmtService.resetPinJwt(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
    response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}


//resetPin Module
module.exports.resetPin = async (req, res) => {
    let response = {};
    try {
        const responseFromService = await UserMgmtService.resetPin(req.body);
        if (!responseFromService.token) {
            response.status = 200;
        }
        response.body = responseFromService;
    } catch (error) {
        response.message = error.message;
    }
    return res.send(response);
}