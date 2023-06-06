var mysql = require('mysql');
const db = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '0926',
    database : 'practice',
    port : 3306
});

module.exports = db;