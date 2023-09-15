const express = require("express");
const path = require("path");
const dbInstances = require("../dbInstances");
const tokenHandler = require("../tokens")
const middle = require("../middleware");
const fs = require("fs");

const accountDb = dbInstances.accountDb;
const serverDb = dbInstances.serverDb;
const friendDb = dbInstances.friendDb;

const app = express.Router();

app.get("/start", middle.authAlready, (req, res) => {
    res.sendFile(path.join(__dirname, "../../", "html", "authentication", "start.html"));
})

app.get("/login", middle.authAlready, (req, res) => {
    res.sendFile(path.join(__dirname, "../", "../", "html", "authentication", "login.html"))
})

app.post("/login", middle.authAlready, (req, res) => {
    setTimeout(() => {
        const email = req.body.email;
        const password = req.body.password;

        if (email.trim() == "" || password.trim() == "") return res.send({ error: "all inputs required...." });

        try {
            const user = accountDb.getRowSync("accounts", "email", email);

            if (user.password === password) {
                const token = tokenHandler.createToken(user.username, email, user.userId);
                res.cookie("token", token);
                res.send({ success: true })
            } else {
                res.send({ success: false });
            }
        } catch (e) {
            res.send({ success: false })
        }
    }, 2000)
})

const statusDb = dbInstances.statusDb;

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

            const userId = tokenHandler.createRandomId();
            info.userId = userId;

            accountDb.addRowSync("accounts", info);
            serverDb.addRowSync("userServers", {
                user: info.username,
                userId: userId,
                owned: [],
                in: []
            })

            friendDb.addRowSync("friends", {
                user: info.username,
                userId: userId,
                friends: [],
                pendingTo: [],
                pendingFrom: []
            });

            statusDb.addRowSync("statuses", {
                user: info.username,
                id: userId,
                text: "",
                active: "offline"
            });

            fs.mkdirSync(path.join(__dirname, "../", "../", "cdn", userId));

            const token = tokenHandler.createToken(info.username, info.email, userId);

            res.cookie("token", token);
            res.send({
                error: false
            });
        }
    }, 2000)
})

app.get("/logout", middle.authenticateToken, (req, res) => {
    res.clearCookie("token");
    tokenHandler.deleteToken(res.token);
    res.redirect("/auth/login");
})

module.exports = app;