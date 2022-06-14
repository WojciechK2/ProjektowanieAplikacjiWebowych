var express = require('express');;
var router = express.Router();

var db = require('../models/data-model');

/* GET for signup page */
router.get('/',function(req,res,next){
   if(!req.authorized) {
      res.render('signup', {title: "Sign Up"})
   } else {
      res.redirect("/")
   }
})

/* POST to create user */
router.post('/', function(req, res, next) {
   if(!req.authorized) {
      var values = [req.body["username"], req.body["password"]];
      db.createUser(values, (err) => {
         if (err) {
            console.log(err);
            res.sendStatus(500);
         } else res.redirect("/login");
      });
   } else {
      res.redirect("/");
   }
});

module.exports = router;
