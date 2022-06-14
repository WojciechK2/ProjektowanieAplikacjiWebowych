var db = require("../database/config");
var bcrypt = require('bcrypt');
var uuid = require('uuid');
//might be useful to add schema

function readTableValue(value, table, cb) {
    let sql = `SELECT ${value.toString()} FROM ${table}`; //here might be wrong if the types are different
    let data = [];
    db.all(sql, function (err, rows) {
        if (err) throw (err);
        rows.forEach(function (row) {
            data.push(row);
        });
        cb(data);
    });
}

function getUserId(value, cb){
    let sql = `SELECT ID FROM Users WHERE Login ="${value}"`;
    db.all(sql, function (err,rows){
        if(err) cb(err);
        else cb(null,rows);
    })
}

function getUserLogin(value, cb){
    let sql = `SELECT Login FROM Users WHERE ID = "${value}"`;
    db.all(sql, function (err,rows){
        if(err) cb(err);
        else cb(null,rows);
    })
}

function createUser(values, cb) {
    let sql = `INSERT INTO Users (Login,Password) VALUES (?,?)`;

    bcrypt.hash(values[1], 10, function (err, hash) {
        if (err) {
            res.sendStatus(500);
        } else {
            values[1] = hash;
            db.run(sql, values, cb);
        }
    });
}

function loggingIn(values, cb) { //to be rewritten
    let sql = `SELECT ID, Password FROM Users WHERE Login = "${values[0]}"`;

    db.all(sql, [], function (err, rows) {
        if (err) {
            cb(err, null);
        }
        else {
            if(rows.length === 1) {
                bcrypt.compare(values[1], rows[0].Password, (err, result) => {
                    if (err) {
                        cb(err);
                    } else {
                        if(result){
                            const user_id = rows[0].ID;

                            const session_id = uuid.v4();

                            cb(null,result,[user_id,session_id]);

                        } else {
                            cb(err,null);
                        }
                    }
                });
            } else {
                cb(err,null);
            }
        }
    });

}

function writeSessionStorage(values,cb) {
    let sql = `INSERT INTO Sessions (UserID,UUID,Validity) VALUES (?,?,?)`;
    db.run(sql,values,cb);
}

function readSessionStorage(session_id,cb) {
    let sql = `SELECT UserId,Validity FROM Sessions WHERE UUID="${session_id}"`;
    db.all(sql, (err,rows) => {
        if(err) cb(err,null);
        else cb(null,rows);
    })
}

function getUserIDSessionStorage(session_id,cb){
    let sql = `SELECT UserID FROM Sessions WHERE UUID="${session_id}"`;
    db.all(sql, (err,rows) => {
        if(err) cb(err,null);
        else cb(null,rows);
    })

}

function deleteFromSessionStorage(session_id,cb){
    let sql = `DELETE FROM Sessions WHERE UUID="${session_id}"`;
    db.all(sql,(err) => {
        if(err) cb(err);
        else {
            console.log(session_id + " deleted");
        }
    });
}

function sessionsTableCleanup(cb){
    console.log("Cleanup");
    var date = Date.now();
    console.log(date.toString());
    let sql = `DELETE FROM Sessions WHERE Validity < ${date}`;

    db.all(sql,(err,rows) =>{
        if(err) cb(err);
        else {
            console.log("DELETED ROWS");
            console.log(rows);
        }
    });
}

function fetchUserNotes(userID,cb){
    sql =`SELECT Title, Content, 1, 10, Tags, NoteID, TIMESTAMP FROM Notes WHERE UserID=${userID} ORDER BY(TIMESTAMP) DESC LIMIT 5;`;
    db.all(sql,function (err,rows){
        if(err) cb(err);
        else {
            console.log(rows);
            var result=[]
            for (var i=0; i<rows.length; i++){
                result.push([rows[i].Title,rows[i].Content.slice(0,15) + "...",rows[i].Tags,rows[i].NoteID,rows[i].TIMESTAMP]);
            }
            cb(null,result)
        }
    });

}

function createNote(data,cb){
    sql = `INSERT INTO Notes (UserID, Tags, Title, Content) VALUES ('${data[0]}','${data[1]}','${data[2]}','${data[3]}')`;
    db.all(sql,(err) => {
        if(err) cb(err);
        else {
            console.log("note_created");
            cb(null);
        }
    });
}

function fetchNote(data,cb){
    sql = `SELECT * FROM Notes WHERE UserID = ${data[0]} AND NoteID = ${data[1]}`;
    db.all(sql,(err,result) => {
        if(err) cb(err);
        else {
            cb(null,[result[0].Title,result[0].Content,result[0].Tags,result[0].NoteID]);
        }
    })

}

function updateNote(data,cb){
    sql = `UPDATE Notes SET Tags='${data[1]}', Title='${data[2]}', Content='${data[3]}' Where UserID='${data[0]}' and NoteID='${data[4]}';`;
    db.all(sql,(err) => {
        if(err) cb(err);
        else {
            console.log("note_updated");
            cb(null);
        }
    });
}

function searchNote(data,cb) {
    sql = `SELECT * FROM Notes WHERE Tags LIKE '%${data[1]}%' AND UserID='${data[0]}';`
    //sql2 = `SELECT * FROM Notes WHERE Title LIKE '%${data[1]}%' AND UserID='${data[0]}';`
    sql2 = `SELECT * FROM Notes WHERE Content LIKE '%${data[1]}%' AND UserID='${data[0]}';`

    db.all(sql, (err, rows) => {
        if (err) cb(err);
        else {
            if (rows.length != 0) {
                console.log('search performed');
                var result = []
                for (var i = 0; i < rows.length; i++) {
                    result.push([rows[i].Title, rows[i].Content.slice(0, 15) + "...", rows[i].Tags, rows[i].NoteID, rows[i].TIMESTAMP]);
                }
                cb(null, result)
            } else {
                //content search
                db.all(sql2, (err, rows) => {
                    if (err) cb(err);
                        console.log('search2 performed');
                        var result = []
                        for (var i = 0; i < rows.length; i++) {
                            result.push([rows[i].Title, rows[i].Content.slice(0, 15) + "...", rows[i].Tags, rows[i].NoteID, rows[i].TIMESTAMP]);
                        }
                        cb(null, result)
                });
            }
        }
    });
}

function searchNoteByTag(data,cb){
    sql = `SELECT * FROM Notes WHERE Tags LIKE '%${data[1]}%' AND UserID='${data[0]}';`

    db.all(sql,(err,rows) => {
        if(err) cb(err);
        else {
            console.log('search performed');
            var result = []
            for (var i = 0; i < rows.length; i++) {
                result.push([rows[i].Title, rows[i].Content.slice(0, 15) + "...", rows[i].Tags, rows[i].NoteID, rows[i].TIMESTAMP]);
            }
            cb(null, result)
        }
    });
}
function searchNoteByTitle(data,cb){
    sql = `SELECT * FROM Notes WHERE Title LIKE '%${data[1]}%' AND UserID='${data[0]}';`

    db.all(sql,(err,rows) => {
        if(err) cb(err);
        else {
            console.log('search performed');
            var result = []
            for (var i = 0; i < rows.length; i++) {
                result.push([rows[i].Title, rows[i].Content.slice(0, 15) + "...", rows[i].Tags, rows[i].NoteID, rows[i].TIMESTAMP]);
            }
            cb(null, result)
        }
    });
}
function searchNoteByContent(data,cb){
    sql = `SELECT * FROM Notes WHERE Content LIKE '%${data[1]}%' AND UserID='${data[0]}';`

    db.all(sql,(err,rows) => {
        if(err) cb(err);
        else {
            console.log('search performed');
            var result = []
            for (var i = 0; i < rows.length; i++) {
                result.push([rows[i].Title, rows[i].Content.slice(0, 15) + "...", rows[i].Tags, rows[i].NoteID, rows[i].TIMESTAMP]);
            }
            cb(null, result)
        }
    });

}

module.exports = {
    readTableValue,
    createUser,
    loggingIn,
    writeSessionStorage,
    readSessionStorage,
    deleteFromSessionStorage,
    sessionsTableCleanup,
    getUserIDSessionStorage,
    getUserLogin,
    createNote,
    fetchUserNotes,
    fetchNote,
    updateNote,
    getUserId,
    searchNote,
    searchNoteByTag,
    searchNoteByTitle,
    searchNoteByContent
};