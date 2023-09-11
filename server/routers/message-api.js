const express = require("express");
const path = require("path");
const dbInstances = require("../dbInstances");
const middleware = require("../middleware")

const app = express.Router();

const socketIds = dbInstances.socketIds;
const rooms = dbInstances.rooms;

app.post("/send-message", middleware.authenticateToken, (req, res) => {
    const message = req.body.message;
    const chatId = req.body.chatId;
    
    // determine if user has access to channel
})

module.exports = app;