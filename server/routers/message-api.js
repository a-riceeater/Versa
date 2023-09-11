const express = require("express");
const path = require("path");
const dbInstances = require("../dbInstances");
const middleware = require("../middleware");
const { rateLimit } = require('express-rate-limit')

const app = express.Router();

const socketIds = dbInstances.socketIds;
const rooms = dbInstances.rooms;

const messageDb = dbInstances.messageDb;
const friendDb = dbInstances.friendDb;

const messageLimit = rateLimit({
	windowMs: 5 * 1000, // 5 seconds
	max: 10,
	standardHeaders: true,
	legacyHeaders: false, 
    statusCode: 429,
    message: {
        error: "Too many messages",
        limiter: true,
        type: "error"
    }
})

app.post("/send-message", (middleware.authenticateToken, messageLimit), (req, res) => {
    const message = req.body.message;
    const chatId = req.body.chatId;
    
    // determine if user has access to channel
    
    res.send({ sent: true })
})

module.exports = app;