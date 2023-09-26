const express = require("express");
const path = require("path");
const dbInstances = require("../dbInstances");
const middleware = require("../middleware");
const { rateLimit } = require('express-rate-limit');
const tokenHandler = require("../tokens");

const app = express.Router();

const socketIds = dbInstances.socketIds;
const rooms = dbInstances.rooms;
const io = dbInstances.io;

const messageDb = dbInstances.messageDb;
const friendDb = dbInstances.friendDb;

const messageLimit = rateLimit({
	windowMs: 5 * 1000, // 5 seconds
	max: 10,
	standardHeaders: true,
	legacyHeaders: false, 
    statusCode: 429,
    message: {
        error: "Too many messages!",
        sent: false,
        limiter: true
    }
})

const charAlpha = "abcdefghijklmnopqrstuvwxyz"

app.post("/send-message", middleware.authenticateToken, messageLimit, (req, res) => {
    const message = req.body.message;
    const chatId = req.body.chatId;

    if (!rooms[res.id]) return res.send({ sent: false, error: "You are not connected to a channel!" })
    if (rooms[res.id] != chatId) return res.send({ sent: false, error: "You are not connected to this channel!" })
    // determine if user has access to channel

    const messageId = charAlpha.charAt(Math.floor(Math.random() * charAlpha.length)) + tokenHandler.createRandomId();

    const messageRow = messageDb.getRowSync("messages", "chatId", chatId);
    messageRow.messages.push({
        from: res.user,
        fromId: res.id,
        content: message,
        messageId: messageId
    })

    messageDb.updateRowSync("messages", "chatId", chatId, messageRow);
    
    io.to(chatId).emit("recieve-message", {
        from: res.user,
        fromId: res.id,
        message: message,
        messageId: messageId,
        tempId: req.body.tempId
    })

    res.send({ sent: true, messageId: messageId })
})

module.exports = app;