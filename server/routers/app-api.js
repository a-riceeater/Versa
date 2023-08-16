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

        return {id: result}
    }
}

app.post("/create-server", middle.authenticateToken, (req, res) => {
    const name = req.body.name;
    
    if (name.trim().replaceAll(" ", "") == "") return res.send({
        error: "name must be supplied..."
    })

    const serverId = tokenHandler.createRandomId();
    const inviteId = new InviteId().id;

    
})


module.exports = app;