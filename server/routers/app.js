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
    const data = `
    <div class="wrapper-sl-i">
        <img src="/versa.png">
    </div>
    <div class="section-sl-ser">
        <div class="border-wrap-ct-sl"></div>
        <!-- Loop through user servers on sever, add later -->

        <div class="wrapper-js-sl">
        +
        </div>
    </div>
    `

    res.send(data)
})

module.exports = app;