const commonService = require('../service/commonService')
const errorlogService = require('../service/ErrorLogMgmtService');
const constants = require('../constants');
const connectionString = require('../database/connection');
//Connect Postgres
const { Client } = require('pg');
const { Console } = require('console');


//list Main Menu Jwt 
module.exports.listMainMenuJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Userrole", error, "listMainMenuJwt");
        throw new Error(error);
    }
}
//list MainMenu 
module.exports.listMainMenu = async (req) => {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {
        if (req.jwtToken) {
            const decoded = await commonService.jwtVerify(req.jwtToken);
            if (decoded) {
                const list_Mainmenu = await client.query(`select a.main_menu_id, a.main_menu_name, a.active_status,b.status_name from tbl_def_mainmenu as a inner join tbl_def_status as b on a.active_status=b.status_id ORDER BY main_menu_id`);
                if (client) {
                    client.end();
                }
                let list_Mainmenuarray = list_Mainmenu && list_Mainmenu.rows ? list_Mainmenu.rows : [];
                if (list_Mainmenuarray) {
                    return list_Mainmenuarray;
                }
                else {
                    return '';
                }
            }
            else {
                if (client) { client.end(); }
            }
        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Userrole", error, "listMainMenu");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//list Sub Menu Jwt 
module.exports.listSubMenuJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Userrole", error, "listSubMenuJwt");
        throw new Error(error);
    }
}
//list Sub Menu 
module.exports.listSubMenu = async (req) => {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {
        if (req.jwtToken) {
            const decoded = await commonService.jwtVerify(req.jwtToken);
            const { main_menu_id } = decoded.data;
            var response = {}
            if (decoded) {
                const list_Submenu = await client.query(`select a.sub_menu_id,a.sub_menu_name,a.active_status,b.main_menu_id, b.main_menu_name,c.status_name
                from  tbl_def_submenu as a 
                inner join tbl_def_mainmenu as b on a.main_menu_id=b.main_menu_id 
                inner join tbl_def_status as c on a.active_status=c.status_id where a.main_menu_id= $1`,[main_menu_id]);
                if (client) {
                    client.end();
                }
                let list_Submenuarray = list_Submenu && list_Submenu.rows ? list_Submenu.rows : [];
                if (list_Submenuarray) {
                    return list_Submenuarray;
                }
                else {
                    return '';
                }
            }
            else {
                if (client) { client.end(); }
            }
        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Userrole", error, "listSubMenu");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//create User role Jwt
module.exports.createUserroleJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Userrole", error, "createUserroleJwt");
        throw new Error(error);
    }
}
//create User role
module.exports.createUserrole = async (req) => {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {
        if (req.jwtToken) {
            const decoded = await commonService.jwtVerify(req.jwtToken);
            const { user_role_id, userrole_name, active_status, user_id,user_role_array } = decoded.data;
            var createupdate_date = new Date().setHours(0, 0, 0, 0);
            if (decoded) {
                if (user_role_id == 0) {
                  var makerid = await commonService.insertLogs(user_id, "Insert Test");
                  const max = await client.query(`select coalesce(max(userrole_id),0) + 1 as mr FROM tbl_userrole_master`)
                  var maxuserrole_id = max && max.rows[0].mr;
                  const create_result = await client.query(`INSERT INTO "tbl_userrole_master"("userrole_id","userrole_name","active_status","maker_id","user_id","created_date") values ($1,Upper($2),$3,$4,$5,$6) `, [maxuserrole_id, userrole_name, active_status, makerid, user_id, createupdate_date]);
        
                  if (user_role_array && user_role_array.length > 0) {
                    for (let i = 0; i < user_role_array.length; i++) {
                      const userrole_max = await client.query(`select coalesce (max(user_role_menu_id),0) + 1 as mr FROM tbl_userrole_menu`)
                      var maxuserrolemenu_id = userrole_max && userrole_max.rows[0].mr;
                      const Userroleresult = await client.query(`INSERT INTO "tbl_userrole_menu"("user_role_menu_id","user_role_id","main_menu_id","sub_menu_id","active_status") values ($1, $2, $3, $4, $5) `, [maxuserrolemenu_id, maxuserrole_id, user_role_array[i].main_menu_id, user_role_array[i].sub_menu_id, active_status]);
                      let Userrole_code = Userroleresult && Userroleresult.rowCount ? Userroleresult.rowCount : 0;
                      console.log(Userrole_code)
                    }
                  }
                  if (client) {
                    client.end();
                  }
                  let create_usercode = create_result && create_result.rowCount ? create_result.rowCount : 0;
                  if (create_usercode == 1) {
                    return constants.userMessage.USER_CREATED
                  }
                  else { return '' }
                }
                else {
                  var makerid = await commonService.insertLogs(user_id, "Update Test");
                  
                  const userrole_Count = await client.query(`select count(*) as count FROM tbl_userrole_master where userrole_id =` + user_role_id)
                  var userrole_Check = userrole_Count && userrole_Count.rows[0].count
                  if (userrole_Check != 0 && userrole_Check != null && userrole_Check != undefined && userrole_Check != "") {
                     const update_result = await client.query(`UPDATE "tbl_userrole_master" set "userrole_name"= Upper($1), "active_status"=$2,"maker_id"=$3, "user_id"=$4, "updated_date"=$5 where "userrole_id" = $6`, [userrole_name, active_status, makerid, user_id, createupdate_date, user_role_id]);
                    
                    if (user_role_array && user_role_array.length > 0) {
                      await client.query(`DELETE FROM tbl_userrole_menu where user_role_id=$1`,
                        [user_role_id])
                      for (let i = 0; i < user_role_array.length; i++) {
                        const user_role_max = await client.query(`select coalesce (max(user_role_menu_id),0) + 1 as mr FROM tbl_userrole_menu`)
                        var maxuser_role_id = user_role_max && user_role_max.rows[0].mr;
                        const Userrole_result = await client.query(`INSERT INTO "tbl_userrole_menu"("user_role_menu_id","user_role_id","main_menu_id","sub_menu_id","active_status") values ($1, $2, $3, $4, $5) `, [maxuser_role_id, user_role_id, user_role_array[i].main_menu_id, user_role_array[i].sub_menu_id,active_status]);

                        let User_role_code = Userrole_result && Userrole_result.rowCount ? Userrole_result.rowCount : 0;
                        console.log(User_role_code)
                      }
                    }
                    if (client) {
                      client.end();
                    }
                    let update_code = update_result && update_result.rowCount ? update_result.rowCount : 0;
                    if (update_code == 1) {
                      return constants.userMessage.USER_UPDATED
                    }
                    else { return '' }
                  }
                }
              }
            else {
                if (client) { client.end(); }
            }
        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Userrole", error, "createUserrole");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}

//Edit User role jwt 
module.exports.editUserroleJwt = async (req) => {
    try {
      const token = await commonService.jwtCreate(req);
      return { token };
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Userrole", error, "editUserroleJwt");
      throw new Error(error);
    }
  }

//Edit User role List
module.exports.editUserrole = async (req) => {
const client = new Client({
    user: connectionString.user,
    host: connectionString.host,
    database: connectionString.database,
    password: connectionString.password,
    port: connectionString.port,
});
await client.connect();
try {
    if (req.jwtToken) {
    const decoded = await commonService.jwtVerify(req.jwtToken);
    const { user_role_id } = decoded.data;
    var response = {}
    if (decoded) {
        const edit_userrole_menu = await client.query(`select a.userrole_id as user_role_id, a.userrole_name, a.active_status,b.status_name from tbl_userrole_master as a inner join tbl_def_status as b on a.active_status=b.status_id where a.userrole_id = $1 ORDER BY a.userrole_id`, [user_role_id]);
        
        const edit_userrole = await client.query(`select a.main_menu_id,b.main_menu_name,string_agg(a.sub_menu_id::text,','order by a.sub_menu_id asc)  as sub_menu_id,string_agg(c.sub_menu_name,','order by a.sub_menu_id asc) as sub_menu_name from tbl_userrole_menu as a inner join tbl_def_mainmenu as b on a.main_menu_id=b.main_menu_id inner join tbl_def_submenu as c on 
         a.sub_menu_id=c.sub_menu_id where a.user_role_id= $1  group by a.main_menu_id,b.main_menu_name,b.visibility_order order by b.visibility_order`, [user_role_id]);
      
        const editUserRoleList= await client.query(`select a.main_menu_id,b.main_menu_name,a.sub_menu_id ,c.sub_menu_name from tbl_userrole_menu
        as a inner join tbl_def_mainmenu as b on a.main_menu_id=b.main_menu_id inner join 
        tbl_def_submenu as c on a.sub_menu_id=c.sub_menu_id 
        where a.user_role_id= $1`, [user_role_id]);

        if (client) {
        client.end();
        }
        let edit_userrole_array= edit_userrole_menu && edit_userrole_menu.rows ? edit_userrole_menu.rows : [];
        let edit_userrolearray = edit_userrole && edit_userrole.rows ? edit_userrole.rows : [];
        let edit_userroleList = editUserRoleList && editUserRoleList.rows ? editUserRoleList.rows : [];

        response = { "Userrole": edit_userrole_array,"UserroleArray": edit_userrolearray, "editUserRoleList":edit_userroleList };
        if (response) {
        return response
        }
        else {
        return '';
        }
    }
    else {
        if (client) { client.end(); }
    }
    } else {
    if (client) { client.end(); }
    throw new Error(constants.userMessage.TOKEN_MISSING);
    }
} catch (error) {
    await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Userrole", error, "editUserrole");
    if (client) { client.end(); }
    throw new Error(error);
}
finally {
    if (client) { client.end(); }// always close the resource
}
}

//list Userrole Jwt 
module.exports.listUserroleJwt = async (req) => {
    try {
        const token = await commonService.jwtCreate(req);
        return { token };
    } catch (error) {
        throw new Error(error);
    }
}
//list Userrole 
module.exports.listUserrole = async (req) => {
    const client = new Client({
        user: connectionString.user,
        host: connectionString.host,
        database: connectionString.database,
        password: connectionString.password,
        port: connectionString.port,
    });
    await client.connect();
    try {
        if (req.jwtToken) {
            const decoded = await commonService.jwtVerify(req.jwtToken);
            if (decoded) {
                const list_userrole = await client.query(`select a.userrole_id  as user_role_id, a.userrole_name, a.active_status,b.status_name from tbl_userrole_master as a inner join tbl_def_status as b on a.active_status=b.status_id ORDER BY a.userrole_id`);

                if (client) {
                    client.end();
                }
                let list_userrole_array = list_userrole && list_userrole.rows ? list_userrole.rows : [];
                if (list_userrole_array) {
                    return list_userrole_array;
                }
                else {
                    return '';
                }
            }
            else {
                if (client) { client.end(); }
            }
        } else {
            if (client) { client.end(); }
            throw new Error(constants.userMessage.TOKEN_MISSING);
        }
    } catch (error) {
        await errorlogService.errorlog(constants.ErrorlogMessage.PLAT_FORM_NAME,"Userrole", error, "listUserrole");
        if (client) { client.end(); }
        throw new Error(error);
    }
    finally {
        if (client) { client.end(); }// always close the resource
    }
}