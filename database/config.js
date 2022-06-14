const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("database/Notes.db",null,(err) =>{
    if (err) throw err;
});

console.log("lesss go")

db.all( "SELECT ID FROM Users" , (err,data) =>{
    if (err) {
        throw (err);
    } else {
        data.forEach(function(row){
        console.log(row);
    });
    }
}) /* ------  THIS WAS FOR TESTING PURPOSES -------------------- */

module.exports = db;