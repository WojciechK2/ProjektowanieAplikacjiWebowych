var express = require('express');;
var router = express.Router();

var db = require('../models/data-model');

/* GET for view note page */
router.get('/',function(req,res,next){
    if(req.authorized) {
        db.fetchNote([req.user_id,req.query.id], (err,data) => {
            if(err) {console.log(err);
                res.respond(500);}
            else {
                console.log(data);
                res.render('edit_note', {title: "Note", note_title: data[0], note_content: data[1], note_tags: data[2], note_id: data[3]});
            }
        })
    } else {
        res.redirect("/")
    }
})

router.post('/',function(req,res,next){
    if(req.authorized) {

        db.updateNote([req.user_id,req.body["tags"],req.body["title"],req.body["contents"],req.query.id], function (err){
            if (err) {console.log(err);
                res.respond(500);}
            else {
                res.redirect("/")
            }
        })
    } else {
        res.redirect("/")
    }
})

module.exports = router;