var express = require('express');;
var router = express.Router();

var db = require('../models/data-model');

/* GET for view note page */
router.get('/',function(req,res,next){
    if(req.authorized) {
        db.fetchNote([req.user_id,req.query.id], (err,data) => {
            if(err) {
                console.log(err);
                res.respond(500);
            }
            else {
                console.log(data);
                res.render('view_note', {title: "Note", note_title: data[0], note_content: data[1], note_tags: data[2], note_id: data[3]});
            }
        })
    } else {
        res.redirect("/")
    }
})

module.exports = router;