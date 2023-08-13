const express = require("express");
const path = require("path");
const databaseHandler = require("jdb");
const tokenHandler = require("../tokens")
const middle = require("../middleware")

const accountDb = databaseHandler.database(path.join(__dirname, "../", "../", "database", "accounts.json"))
const app = express.Router();

app.get("/start", middle.authAlready, (req, res) => {
    res.sendFile(path.join(__dirname, "../../", "html", "authentication", "start.html"));
})

app.post("/create-account", middle.authAlready, (req, res) => {
    setTimeout(() => {
        const info = req.body;

        if (info.email.trim() == "") return res.send({ error: "all inputs required...." })
        if (info.username.trim() == "") return res.send({ error: "all inputs required..." })
        if (info.password.trim() == "") return res.send({ error: "all inputs required..." })


        if (accountDb.getRowSync("accounts", "email", info.email) != null) {
            res.send({
                error: "email already in use"
            })
        } else {
            info.username += `#${Math.floor(Math.random() * (10000 - 1000) + 1000)}`
            accountDb.addRowSync("accounts", info);

            const token = tokenHandler.createToken(info.username, info.email);
            
            res.cookie("token", token);
            res.send({
                error: false
            });
        }
    }, 2000)
})

module.exports = app;