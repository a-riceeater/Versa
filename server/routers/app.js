const express = require('express');
const path = require("path");
const fs = require("fs");
const middle = require("../middleware")

const app = express.Router();

app.get("/", middle.authenticateToken, (req, res) => {
    res.redirect("/self")
})

app.get("/self", middle.authenticateToken, (req, res) => {
    const data = fs.readFileSync(path.join(__dirname, "../../", "html", "app", "self.html"), "utf8")
        .replaceAll("{{ username }}", res.user)
        .replaceAll("{{ email }}", res.email);
    
    res.send(data);
})

app.get("/user-serv-scroll-l", middle.authenticateToken, (req, res) => {
    res.send("Asd")
})

module.exports = app;