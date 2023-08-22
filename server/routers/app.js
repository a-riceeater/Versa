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
        <div class="lsl-serv-icon" data-name="${server.name}" data-id="${server.serverId}" data-invite="${server.inviteId}" id="sbt-l-${server.serverId}">${server.name.slice(0, 3)} </div>
        `
    }

    const data = `
    <div class="wrapper-sl-i">
        <img src="/versa.png">
        <span class="wsli-noti-icon">1</span>
    </div>

    <div class="section-sl-ser">
        <div class="border-wrap-ct-sl"></div>
        ${ssvs}

        <div class="wrapper-js-sl">+</div>
    </div>`

    res.send(data);
})

const friendDb = dbInstances.friendDb;

// friends main scroller
app.get("/widget/KjitLwgKq6AjPyLi28BSy7SXQ", middle.authenticateToken, (req, res) => {
    const friendRow = friendDb.getRowSync("friends", "userId", res.id);

    let pending = "";

    for (let i = 0; i < friendRow.pendingFrom.length; i++) {
        pending += friendRow.pendingFrom[i].username;
    }

    for (let i = 0; i < friendRow.pendingTo.length; i++) {
        pending += `
        <div class="scb-frmo-frbtn">
        <span class="title">${friendRow.pendingTo[i].username}</span>
        <span class="desc">Outgoing Friend Request</span>
        </div>
        `
    }

    const data = `
    <div class="scbar-fri-m-o">
    <button class="scb-frmo-btn online selected">Online</button>
    <button class="scb-frmo-btn all">All</button>
    <button class="scb-frmo-btn pending">Pending</button>
    <button class="scb-frmo-btn blocked">Blocked</button>
    <button class="scb-frmo-btn add">Add Friend</button>
    </div>

    <div class="scbar-fri-sect online selected">
        <p class="scfs-title">ONLINE - { online }</p>
    </div>

    <div class="scbar-fri-sect all">
        <p class="scfs-title">ALL - { all }</p>
    </div>

    <div class="scbar-fri-sect pending">
        <p class="scfs-title">PENDING - { pending }</p>
        ${pending}
    </div>

    <div class="scbar-fri-sect blocked">
        <p class="scfs-title">BLOCKED - { blocked }</p>
    </div>

    <div class="scbar-fri-sect add">
        <div>
            <h1>Add a friend</h1>
            <p>Insert your friends username and tag in the box below. It's case sensitive!</p>

            <br>
            <input type="text" id="scbar-fri-add-ival" placeholder="someone#1234" spellcheck="false" autocomplete="false">
            <button>Add friend</button>
        </div>
    </div>
    `

    res.send(data);

    // add all friends data including pending with different pannels in the xhr response
})

app.get("/widiget/wKB6K5GPlgnlKmYI0TsVFgOPO", middle.authenticateToken, (req, res) => {
    const data = `
    <div class="friend-to-ms-fl btn">
    <svg xmlns="http://www.w3.org/2000/svg" fill="var(--c5)" style="margin-right: 10px" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>
    Friends
    </div>
    `

    res.send(data);
    // add all friends buttons to go to dms when friends start
})

module.exports = app;