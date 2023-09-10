const express = require('express');
const path = require("path");
const fs = require("fs");
const middle = require("../middleware")
const dbInstances = require("../dbInstances")

const app = express.Router();

const clientVersion = JSON.parse(fs.readFileSync(path.join(__dirname, "../", "../", "current_version.json"))).version;
const friendDb = dbInstances.friendDb;

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
        <div class="lsl-serv-icon" data-name="${server.name}" data-id="${server.serverId}" data-invite="${server.inviteId}" data-context-id="serverl-button" id="sbt-l-${server.serverId}">${server.name.slice(0, 3)} </div>
        `
    }

    const r = friendDb.getRowSync("friends", "userId", res.id);
    const pendingAmount = r.pendingFrom.length;

    const total = pendingAmount;

    const data = `
    <div class="wrapper-sl-i">
        <img src="/versa.png">
        <span class="wsli-noti-icon" style="display: ${total == 0 ? "none" : "block"}">${total}</span>
    </div>

    <div class="section-sl-ser">
        <div class="border-wrap-ct-sl"></div>
        ${ssvs}

        <div class="wrapper-js-sl">+</div>
    </div>`

    res.send(data);
})

const statusDb = dbInstances.statusDb;

// friends main scroller
app.get("/widget/KjitLwgKq6AjPyLi28BSy7SXQ", middle.authenticateToken, (req, res) => {
    const friendRow = friendDb.getRowSync("friends", "userId", res.id);

    let pending = "";
    let onlineF = "";
    let allF = "";

    for (let i = 0; i < friendRow.pendingFrom.length; i++) {
        if (!friendRow.pendingFrom[i]) continue
        pending += `
        <div class="scb-frmo-frbtn">
        <span class="title">${friendRow.pendingFrom[i].username}</span>
        <span class="desc">Incoming Friend Request</span>
        <button class="accept-fr" data-from="${friendRow.pendingFrom[i].username}">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
        </button>
        </div>`
    }

    for (let i = 0; i < friendRow.pendingTo.length; i++) {
        if (!friendRow.pendingTo[i]) continue
        pending += `
        <div class="scb-frmo-frbtn">
        <span class="title">${friendRow.pendingTo[i].username}</span>
        <span class="desc">Outgoing Friend Request</span>
        <button class="cancel-fr" data-to="${friendRow.pendingTo[i].username}">X</button>
        </div>
        `
    }

    for (let i = 0; i < friendRow.friends.length; i++) {
        if (!friendRow.friends[i]) continue
        const friend = friendRow.friends[i];
        const status = statusDb.getRowSync("statuses", "user", friend.user);

        if (status.active.toLowerCase() === "online") {
            onlineF += `
            <div class="scb-frmo-frbtn" data-context-id="friend-button" data-friend="${friend.user}">
            <span class="title">${friend.user}</span>
            <span class="desc">${status.text || ""}</span>
            </div>
            `
        }

        allF += `
        <div class="scb-frmo-frbtn" data-context-id="friend-button" data-friend="${friend.user}">
        <span class="title">${friend.user}</span>
        <span class="desc">${status.text || ""}</span>
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
        <p class="scfs-title">ONLINE -  ${onlineF.toString().includes("<div") ? onlineF.toString().match(new RegExp("<div", "g")).length || [].length : "0"}</p>
        ${onlineF.toString().trim()}
    </div>

    <div class="scbar-fri-sect all">
        <p class="scfs-title">ALL - ${allF.toString().includes("<div") ? allF.toString().match(new RegExp("<div", "g")).length || [].length : "0"}</p>
        ${allF.toString().trim()}
    </div>

    <div class="scbar-fri-sect pending">
        <p class="scfs-title">PENDING - ${(friendRow.pendingFrom.length + friendRow.pendingTo.length).toString()}</p>
        ${pending.toString().trim()}
    </div>

    <div class="scbar-fri-sect blocked">
        <p class="scfs-title">BLOCKED - { blocked }</p>
    </div>

    <div class="scbar-fri-sect add">
        <div>
            <h1>Add a friend</h1>
            <p>Insert your friends username and tag in the box below. It's case sensitive!</p>

            <br>
            <span class="error"></span>
            <input type="text" id="scbar-fri-add-ival" placeholder="someone#1234" spellcheck="false" autocomplete="off">
            <button class="send-fr">Add friend</button>
        </div>
    </div>
    `

    res.send(data);

    // add all friends data including pending with different pannels in the xhr response
})

app.get("/widiget/wKB6K5GPlgnlKmYI0TsVFgOPO", middle.authenticateToken, (req, res) => {
    let friends = "";
    const uf = friendDb.getRowSync("friends", "userId", res.id).friends;

    for (let i = 0; i < uf.length; i++) {
        const friend = uf[i];
        const userStatus = statusDb.getRowSync("statuses", "user", friend.user);

        friends += `
        <div class="frcl-btn" data-cid="${friend.chatId}">
        <img src="/cdn/pfps/default.png" class="profile-picture">
        <span class="frcl-bt-un" ${userStatus.text == "" ? `style="margin-top: 0 !important"` : ""}">
        ${friend.user}
        </span>
        <br>
        <span class="frcl-bt-statust">${userStatus.text}</span>
        </div> 
        `
    }

    const data = `
    <div class="friend-to-ms-fl btn selected">
    <svg xmlns="http://www.w3.org/2000/svg" fill="var(--c5)" style="margin-right: 10px" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>
    Friends
    </div>

    <div class="frcl-b-container">
        <p class="frlc-b-t">Direct Messages</p>
        ${friends}
    </div>
    `

    res.send(data);
})

const messageDb = dbInstances.messageDb;

app.get("/chat/dm/:chatId", middle.authenticateToken, (req ,res) => {
    const chatHistory = messageDb.getRowSync("messages", "chatId", req.params.chatId);
    const selfFriends = friendDb.getRowSync("friends", "userId", res.id).friends;
    if (!cd || !selfFriends) return res.send("This chat does not exist.");

    let otherUser;
    for (let i = 0; i < selfFriends.length; i++) {
        if (selfFriends[i].chatId == req.params.chatId) {
            otherUser = selfFriends[i].user
        }
    }

    const data = `
    <div class="tbar-ch">
        <img src="/cdn/pfps/default.png" alt="@">
        <span class="tbch-uname">${otherUser}</span>
    </div>
    `;

    res.send(data);
})

module.exports = app;