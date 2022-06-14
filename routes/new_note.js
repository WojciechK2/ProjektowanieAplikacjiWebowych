var express = require('express');;
var router = express.Router();

var db = require('../models/data-model');

/* GET for new note page */
router.get('/',function(req,res,next){
    if(req.authorized) {
        res.render('new_note', {title: "Create New Note"})
    } else {
        res.redirect("/")
    }
})

router.post('/',function(req,res,next){
    if(req.authorized) {

        db.createNote([req.user_id,req.body["tags"],req.body["title"],req.body["contents"]], function (err){
            if (err) {
                console.log(err);
                res.respond(500);
            }
            else {
                res.redirect("/")
            }
        })
    } else {
        res.redirect("/login")
    }
})

module.exports = router;