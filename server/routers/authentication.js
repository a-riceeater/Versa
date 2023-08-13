const express = require("express");
const path = require("path");
const databaseHandler = require("jdb");

const accountDb = databaseHandler.database(path.join(__dirname, "../", "../", "database", "accounts.json"))
const app = express.Router();

app.get("/start", (req, res) => {
    res.sendFile(path.join(__dirname, "../../", "html", "authentication", "start.html"));
})

app.post("/create-account", (req, res) => {
    setTimeout(() => {
        const info = req.body;

        if (info.email.trim() == "") return res.send({ error: "all inputs required...." })
        if (info.username.trim() == "") return res.send({ error: "all inputs required..." })
        if (info.password.trim() == "") return res.send({ error: "all inputs required..." })


        if (accountDb.getRowSync("accounts", "email", info.email)) {
            res.send({
                error: "email already in use"
            })
        } else {
            accountDb.addRowSync("accounts", info);
        }
    }, 2000)
})

module.exports = app;