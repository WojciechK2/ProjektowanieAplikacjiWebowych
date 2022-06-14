var express = require('express');

var db = require('../models/data-model');

var router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {
    if (!req.authorized) {
        res.render('login', {title: 'Login Page'});
    } else {
        res.redirect("/");
    }
});

/* POST requests */
router.post('/', function (req, res, next) {
    if (!req.authorized) {

        var values = [req.body["username"], req.body["password"]];

        db.loggingIn(values, function (err, result, data) {

            if (err) {

                res.sendStatus(500);

            } else if (result) {

                var date = new Date();
                date.setTime(Date.now() + 1000 * 120);

                res.cookie("session", data[1], {
                    secure: false,
                    httpOnly: false,
                    sameSite: false,
                    path: "/",
                    expires: date
                });

                db.writeSessionStorage([data[0], data[1], date], (err) => {

                    if (err) {

                        res.sendStatus("500");

                    }

                });

                res.status = 200;
                res.redirect("/");

            } else if (!result) {
                res.sendStatus(403);
                res.redirect("/");
            };
        });
    } else {
        res.status = 403;
        res.redirect("/");
    }
});

module.exports = router;