const express = require("express");
const chatControllers = require("../controllers/chat");
const isAuth = require("../middlewares/isAuth");

const Router = express.Router();

Router.post("/getUserDetails", chatControllers.getUserDetails);
Router.post("/chat", isAuth, chatControllers.getChatList);
Router.post("/new-chat", chatControllers.createNewChat);
Router.post("/messages", chatControllers.getMessages);
Router.post("/mark-as-resolved", isAuth, chatControllers.markAsResolved);
Router.post("/requests", chatControllers.getRequests);
Router.post("/add-to-resolve", chatControllers.addChatToResolve);
module.exports = Router;
