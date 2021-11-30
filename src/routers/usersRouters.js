const { USERS, INFORMATION, REFRESHTOKENS } = require("../../src/db");

const jwt = require("jsonwebtoken");
const bycrypt = require("bcrypt");
const salt = genMySalt();

const express = require("express");

const router = express.Router();

router.post("/register", async (req, res) => {
  USERS.forEach((user) => {
    if (user.email === req.body.email) {
      res.statusCode = 409;
      res.json("user already exists");
    }
  });

  try {
    const hashedPassword = await bycrypt.hash(req.body.password, await salt)

    let newUser = {
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      isAdmin: false,
    };
    USERS.push(newUser);
    INFORMATION.push({email:newUser.email, info:newUser.name});
    res.statusCode = 201;
    res.json("Register Success");
  } catch (err) {
    res.statusCode = 400;
    res.json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    let userExist = false;
    const hashedPassword = await bycrypt.hash(req.body.password, await salt);
    console.log(hashedPassword);
    USERS.forEach((user) => {
      if (user.email === req.body.email) {
        if (
          user.password === hashedPassword ||
          user.password === req.body.password
        ) {
          userExist = true;
          const response = {
            accessToken: generateAccessToken(user),
            refreshToken: jwt.sign(user, "DORREFRESHTOKEN"),
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin || false,
          };
          REFRESHTOKENS.push(response.refreshToken);
          res.json(response);
        } else {
          res.statusCode = 403;
          res.json("User or Password incorrect");
        }
      }
    });
    if (!userExist) {
      res.statusCode = 404;
      res.json("cannot find user");
    }
  } catch (err) {
    res.json(err);
  }
});

router.post("/logout", (req, res) => {
  if (req.body.token == null) {
    res.statusCode = 400;
    res.send("Refresh Token Required");
  }
  if (!REFRESHTOKENS.includes(req.body.token)) {
    res.statusCode = 400;
    res.send("Invalid Refresh Token");
  }
  const index = REFRESHTOKENS.indexOf(req.body.token);
  if (index > -1) {
    REFRESHTOKENS.splice(index, 1);
  }
  res.send("User Logged Out Successfully");
});

router.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) {
    res.statusCode = 401;
    res.send("Refresh Token Required");
  }
  if (!REFRESHTOKENS.includes(refreshToken)) {
    res.statusCode = 403;
    res.send("Invalid Refresh Token");
  }
  jwt.verify(refreshToken, "DORREFRESHTOKEN", (err, user) => {
    if (err) res.sendStatus(403);
    const accessToken = generateAccessToken({
      email: user.email,
      name: user.name,
      password: user.password,
      isAdmin: user.isAdmin,
    });
    res.json({ accessToken: accessToken });
  });
});

router.post("/tokenValidate", (req, res) => {
  const accessToken = req.get("Authorization").split(" ")[1];
  if (!accessToken) {
    res.statusCode = 401;
    res.send("Access Token Required");
  }
  jwt.verify(accessToken, "DORACCESSTOKEN", (err, user) => {
    if (err) {
      res.statusCode = 401;
      res.send("Invalid Access Token");
    }
    res.json({ valid: true });
  });
  res.send(accessToken);
});

function generateAccessToken(userEmail) {
  return jwt.sign(userEmail, "DORACCESSTOKEN", {expiresIn:"10s"});
}
async function genMySalt() {
  try {
    const salt = await bycrypt.genSalt(10);
    return salt;
  } catch (err) {
    return false;
  }
}

module.exports = router;
