const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwt_secret = "BzhJ%Rrgrv*q%6C!3Fdn2e^XPay0y74P";
const users = require("./users.json");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const fs = require("fs");

router.use(express.urlencoded({ extended: true }));
router.use(cookieparser());

function verify(token) {
    if (token) {
        return jwt.verify(token, jwt_secret);
    } else return null;
};

router.post("/login", (req, res) => {
    const { username, pass } = req.body;
    const user = users.users.find(user => user.username === username);
    if (user) {
        const result = bcrypt.compareSync(pass, user.pass);
        if (result) {
            res.json({token: jwt.sign({ user: username, admin: user.admin }, jwt_secret)});
        } else res.json({ success: false });
    } else res.json({ success: false });
});

router.post("/register", (req, res) => {
    if (verify(req.body.authToken).admin) {
        bcrypt.genSalt(10).then(salt => {
            bcrypt.hash(req.body.pass, salt).then(hash => {
                users.users.push({ username: req.body.username, pass: hash, admin: false });
                fs.writeFile(`${__dirname}/users.json`, JSON.stringify(users, null, 2), (err) => {
                    if (err) console.log(err);
                    res.json({ success: true, token: jwt.sign({ user: username, admin: false }, jwt_secret)});
                });
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    } else res.json({ success: false });
});

module.exports = { router };