var express = require('express');
const db = require("../models/data-model");
var router = express.Router();

router.post('/', function(req, res, next) {
    if(req.authorized) {

        var handled = false;

        if(req.body.constructor === Object && Object.keys(req.body).length === 0){

            handled = true;

            db.searchNote([req.user_id,req.body["search_val"]], function(err,result){
                if(err) {
                    console.log(err);
                    res.respond(500);
                }
                else {
                    console.log(result);
                    title = "Notes found";
                    res.render('search_notes', {title: title, user_id: req.user_id, data: result});
                }
            })
        }

        if(req.body['search_type'] === "tag" ){

            handled = true;

            db.searchNoteByTag([req.user_id,req.body["search_val"]], function(err,result){
                if(err) {
                    console.log(err);
                    res.respond(500);
                }
                else {
                    console.log("tag search");
                    console.log(result);
                    title = "Notes found";
                    res.render('search_notes', {title: title, user_id: req.user_id, data: result});
                }
        });
        }

        if(req.body['search_type'] === "title" ){

            handled = true;

            db.searchNoteByTitle([req.user_id,req.body["search_val"]], function(err,result){
                if(err) {
                    console.log(err);
                    res.respond(500);
                }
                    else {
                        console.log("title search");
                        console.log(result);
                        title = "Notes found";
                        res.render('search_notes', {title: title, user_id: req.user_id, data: result});
                    }
            });
        }

        if(req.body['search_type'] === "content") {

            handled = true;

            db.searchNoteByContent([req.user_id, req.body["search_val"]], function (err, result) {
                if (err) {
                    console.log(err);
                    res.respond(500);
                }
                else {
                    console.log("content search");
                    console.log(result);
                    title = "Notes found";
                    res.render('search_notes', {title: title, user_id: req.user_id, data: result});
                }
            });
        }

        if(!handled) {
            res.render('search_notes', {title: "Notes not found", user_id: req.user_id, data: []});
        }

    } else {
        res.redirect('/login')
    }
});

module.exports = router;