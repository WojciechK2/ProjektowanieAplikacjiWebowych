var express = require('express');
const db = require("../models/data-model");
var router = express.Router();

router.post("/",function(req,res,next){
    if(req.authorized) {
        res.clearCookie("session");
        db.deleteFromSessionStorage(req.cookies.session,(err) => {
            if(err) {
                console.log(err);
                res.respond(500);
            }
        });
        res.redirect("/login");
    } else {
        res.redirect("/login");
    }
});

module.exports = router;