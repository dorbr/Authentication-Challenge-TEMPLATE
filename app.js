const usersRouter = require("./src/routers/usersRouters");
const apiRouter = require("./src/routers/apiRouter");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

app.use(express.static("client/build"));

app.options("/", (req, res) => {
  let accessToken = undefined;
  if (req.get("Authorization")) {
    accessToken = req.get("Authorization").split(" ")[1];
  }
  res.header("Allow", "GET, POST, OPTIONS");
  if (accessToken == null || accessToken == undefined) {
    res.json([
      {
        method: "post",
        path: "/users/register",
        description: "Register, Required: email, name, password",
        example: {
          body: { email: "user@email.com", name: "user", password: "password" },
        },
      },
      {
        method: "post",
        path: "/users/login",
        description: "Login, Required: valid email and password",
        example: { body: { email: "user@email.com", password: "password" } },
      },
    ]);
  }
  jwt.verify(accessToken, "DORACCESSTOKEN", (err, user) => {
    if (err) {
      res.json([
        {
          method: "post",
          path: "/users/register",
          description: "Register, Required: email, name, password",
          example: {
            body: {
              email: "user@email.com",
              name: "user",
              password: "password",
            },
          },
        },
        {
          method: "post",
          path: "/users/login",
          description: "Login, Required: valid email and password",
          example: { body: { email: "user@email.com", password: "password" } },
        },
        {
          method: "post",
          path: "/users/token",
          description: "Renew access token, Required: valid refresh token",
          example: { headers: { token: "*Refresh Token*" } },
        },
      ]);
    }
    if (!user.isAdmin) {
      res.json([
        {
          method: "post",
          path: "/users/register",
          description: "Register, Required: email, name, password",
          example: {
            body: {
              email: "user@email.com",
              name: "user",
              password: "password",
            },
          },
        },
        {
          method: "post",
          path: "/users/login",
          description: "Login, Required: valid email and password",
          example: { body: { email: "user@email.com", password: "password" } },
        },
        {
          method: "post",
          path: "/users/token",
          description: "Renew access token, Required: valid refresh token",
          example: { headers: { token: "*Refresh Token*" } },
        },
        {
          method: "post",
          path: "/users/tokenValidate",
          description: "Access Token Validation, Required: valid access token",
          example: { headers: { Authorization: "Bearer *Access Token*" } },
        },
        {
          method: "get",
          path: "/api/v1/information",
          description:
            "Access user's information, Required: valid access token",
          example: { headers: { Authorization: "Bearer *Access Token*" } },
        },
        {
          method: "post",
          path: "/users/logout",
          description: "Logout, Required: access token",
          example: { body: { token: "*Refresh Token*" } },
        },
      ]);
    } else {
      res.json([
        {
          method: "post",
          path: "/users/register",
          description: "Register, Required: email, name, password",
          example: {
            body: {
              email: "user@email.com",
              name: "user",
              password: "password",
            },
          },
        },
        {
          method: "post",
          path: "/users/login",
          description: "Login, Required: valid email and password",
          example: { body: { email: "user@email.com", password: "password" } },
        },
        {
          method: "post",
          path: "/users/token",
          description: "Renew access token, Required: valid refresh token",
          example: { headers: { token: "*Refresh Token*" } },
        },
        {
          method: "post",
          path: "/users/tokenValidate",
          description: "Access Token Validation, Required: valid access token",
          example: { headers: { Authorization: "Bearer *Access Token*" } },
        },
        {
          method: "get",
          path: "/api/v1/information",
          description:
            "Access user's information, Required: valid access token",
          example: { headers: { Authorization: "Bearer *Access Token*" } },
        },
        {
          method: "post",
          path: "/users/logout",
          description: "Logout, Required: access token",
          example: { body: { token: "*Refresh Token*" } },
        },
        {
          method: "get",
          path: "api/v1/users",
          description:
            "Get users DB, Required: Valid access token of admin user",
          example: { headers: { authorization: "Bearer *Access Token*" } },
        },
      ]);
    }
  });
});

app.use("/users", usersRouter);
app.use("/api", apiRouter);

module.exports = app;
