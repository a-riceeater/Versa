const express = require('express');
const path = require("path");
const fs = require("fs");
const middle = require("../middleware")
const dbInstances = require("../dbInstances")

const app = express.Router();

const clientVersion = JSON.parse(fs.readFileSync(path.join(__dirname, "../", "../", "current_version.json"))).version;

app.get("/", middle.authenticateToken, (req, res) => {
    res.redirect("/app/self")
})

app.get("/self", middle.authenticateToken, (req, res) => {
    const data = fs.readFileSync(path.join(__dirname, "../../", "html", "app", "self.html"), "utf8")
        .replaceAll("{{ username }}", res.user)
        .replaceAll("{{ email }}", res.email)
        .replaceAll("{{ clientVersion }}", clientVersion);
    
    res.send(data);
})

const serverDb = dbInstances.serverDb;
// user left scroller
app.get("/widget/k1tBte9Ob", middle.authenticateToken, (req, res) => {
    let ssvs = '';
    const userServers = serverDb.getRowSync("userServers", "userId", res.id).in;

    for (let i = 0; i < userServers.length; i++) {
        const server = userServers[i];
        ssvs += `
        <div class="lsl-serv-icon" data-name="${server.name}" data-id="${server.serverId}" data-invite="${server.inviteId}" id="sbt-l-${server.serverId}" title="${server.name}">${server.name.slice(0, 3)}</div>
        `
    }

    const data = `
    <div class="wrapper-sl-i">
        <img src="/versa.png">
    </div>

    <div class="section-sl-ser">
        <div class="border-wrap-ct-sl"></div>
        ${ssvs}

        <div class="wrapper-js-sl">+</div>
    </div>`

    res.send(data);
})

module.exports = app;