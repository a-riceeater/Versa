const express = require("express");
const path = require("path");
const dbInstances = require("../dbInstances");
const middle = require("../middleware");
const tokenHandler = require("../tokens");

const app = express.Router();

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

app.post("/create-server", middle.authenticateToken, (req, res) => {
    const name = req.body.name;

    if (name.trim().replaceAll(" ", "") == "") return res.send({
        error: "name must be supplied..."
    })

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
            }]
        })

        serverDb.updateRowSync("userServers", "userId", res.userId, uRow);

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


module.exports = app;