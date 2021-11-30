const { USERS, INFORMATION, REFRESHTOKENS } = require("../../src/db");

const jwt = require("jsonwebtoken");

const express = require("express");

const router = express.Router();

router.get("/v1/information", (req, res) => {
    const accessToken = req.get("Authorization").split(" ")[1];
    if(accessToken == null) {
        res.statusCode = 401;
        res.send("Access Token Required");
    }
    jwt.verify(accessToken, "DORACCESSTOKEN", (err, user) => {
        if (err) {
            res.statusCode = 403;
            res.send("Invalid Access Token");
        }
        INFORMATION.forEach(obj => {
            if(obj.email === user.email){
                res.send([{email:obj.email, info:obj.info}]);
            }
        });
      });
});
router.get("/v1/users", (req, res) => {
    const accessToken = req.get("Authorization").split(" ")[1];
    console.log(accessToken);
    if(accessToken == null) {
        res.statusCode = 401;
        res.send("Access Token Required");
    }
    jwt.verify(accessToken, "DORACCESSTOKEN", (err, user) => {
        if(err){
            res.statusCode = 403;
            console.log(err);
            res.send("Invalid Access Token");
        }
        console.log(user);
        if(user.isAdmin){
            res.json(USERS);
        }
    });
});
module.exports = router;
