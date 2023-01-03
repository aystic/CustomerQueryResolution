const express = require("express");
const loginControllers = require("../controllers/login");
const isAuth = require("../middlewares/isAuth");
const Router = express.Router();

Router.post("/", isAuth, loginControllers.login);
module.exports = Router;
