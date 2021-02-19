var mysql = require("mysql");
const host = "localhost";
const database = "users"
const user = "root";
const password = "";

var con = mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
});
con.connect();
module.exports = con;