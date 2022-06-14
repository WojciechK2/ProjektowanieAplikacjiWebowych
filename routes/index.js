var express = require('express');
const db = require("../models/data-model");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.authorized) {;
    db.getUserLogin(req.user_id, (err,result) => {

      if(err) {console.log(err);
        res.respond(500);}
      else {
        db.fetchUserNotes(req.user_id,(err,result2) => {
          if(err) {console.log(err);
            res.respond(500);}
          else {
            res.render('index', {title: 'Your Notes', user_id: result[0].Login, data: result2});
          }
        })
      }
    });
  } else {
    res.redirect('/login')
  }
});

module.exports = router;
