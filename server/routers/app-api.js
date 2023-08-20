const express = require("express");
const path = require("path");
const dbInstances = require("../dbInstances");
const middle = require("../middleware");
const tokenHandler = require("../tokens");
const rateLimit = require('express-rate-limit')

const app = express.Router();

const smallRequests = rateLimit({
	windowMs: 30 * 1000,
	max: 15,
	standardHeaders: true,
	legacyHeaders: false, 
    message: { error: "too many requests. slow down!" }
})

const medRequests = rateLimit({
	windowMs: 60 * 1000,
	max: 30,
	standardHeaders: true,
	legacyHeaders: false, 
    message: { error: "too many requests. slow down!" }
})

const lotsRequest = rateLimit({
    windowMs: 60 * 1000,
    max: 45,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "too many requests. slow down!" }
})

const serverDb = dbInstances.serverDb;

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
class InviteId {
    constructor() {
        let result = "";

        for (let i = 0; i < 7; i++) {
            result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }

        return { id: result }
    }
}

app.post("/create-server", middle.authenticateToken, smallRequests, (req, res) => {
    const name = req.body.name;

    if (name.trim().replaceAll(" ", "") == "") return res.send({ error: "name must be supplied..." })

    const serverId = tokenHandler.createRandomId();
    const inviteId = new InviteId().id;

    const uRow = serverDb.getRowSync("userServers", "userId", res.id);
    const userServersOwned = uRow.owned;

    function write() {
        uRow.owned.push({
            name: name,
            serverId: serverId,
            inviteId: inviteId
        })

        uRow.in.push({
            name: name,
            serverId: serverId,
            inviteId: inviteId
        })

        serverDb.addRowSync("servers", {
            name: name,
            serverId: serverId,
            inviteId: inviteId,
            users: [{
                name: res.user,
                id: res.id
            }],
            members: 1,
            owner: res.id
        })

        serverDb.updateRowSync("userServers", "userId", res.id, uRow);

        res.send({ created: true })
    }

    if (userServersOwned.length == 0) write();
    else {
        for (let i = 0; i < userServersOwned.length; i++) {
            const s = userServersOwned[i];
    
    
            if (s.name == name) return res.send({ error: "you already have a server with this name" })
            if (i == userServersOwned.length - 1) write();
        }
    }
})

app.post("/join-server", middle.authenticateToken, (req, res) => {
    const inviteId = req.body.invite;

    if (!inviteId || inviteId.trim().replaceAll(" ", "") == "") return res.send({ error: "invite id required" })
    const uRow = serverDb.getRowSync("userServers", "userId", res.id);
    const userServers = uRow.in;

    const server = serverDb.getRowSync("servers", "inviteId", inviteId);

    function write() {
        uRow.in.push({
            name: server.name,
            serverId: server.serverId,
            inviteId: server.inviteId
        });
        serverDb.updateRowSync("userServers", "userId", res.id, uRow);

        server.members++;
        serverDb.updateRowSync("servers", "serverId", server.serverId, server);

        res.send({ joined: true })
    }

    if (userServers.length == 0) write();
    else {
        for (let i = 0; i < userServers.length; i++) {
            const s = userServers[i];
            if (!s) continue
            if (s.serverId == server.serverId) return res.send({ already: true })
            if (i == userServers.length - 1) return write();
        }
    }
})

module.exports = app;