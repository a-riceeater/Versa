const express = require("express");
const path = require("path");
const databaseHandler = require("jdb");
const middle = require("../middleware");
const tokenHandler = require("../tokens");

const app = express.Router();

const serverDb = databaseHandler.database(path.join(__dirname, "../", "../", "database", "servers.json"));

app.post("/create-server", middle.authenticateToken, (req, res) => {
    const name = req.body.name;
    
    if (name.trim().replaceAll(" ", "") == "") return res.send({
        error: "name must be supplied..."
    })

    const serverId = tokenHandler.createRandomId();
})


module.exports = app;