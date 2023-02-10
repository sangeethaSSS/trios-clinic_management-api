/****************************
 Developed by : Shiva Software Solutions
 File    : connection.js 
 Date    : 23-11-2022
 Purpose : Database connection
 * ********************** */
 //UAT Database Connection

const connectionString ={
    user: 'postgres',
    host: '172.16.1.200',
    database: 'trios-clinicmgmt',
    // Test Database Name
    // database:'db_clinic_management_test',
    password: 'postgres',
    port: 5432,
  }

// //AWS HOSTING Live
//   const connectionString ={
//     user: 'postgres',
//     host: 'localhost',
//     database:'dbhms',
//     password: 'Shiva@88685',
//     port: 5432,
//   }
module.exports = connectionString;

