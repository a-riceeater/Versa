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

app.get("/:p", middle.authenticateToken, (req, res) => {
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
        <span class="wsli-noti-icon" style="display: ${total == 0 ? "none" : "flex"}">${total}</span>
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
            <div class="scb-frmo-frbtn" data-context-id="friend-button" data-friend="${friend.user}" data-cid="${friend.chatId}">
            <img src="/cdn/pfps/default.png" class="profile-picture">
            <span class="title">${friend.user}</span>
            <span class="desc">${status.text || ""}</span>
            </div>
            `
        }

        allF += `
        <div class="scb-frmo-frbtn" data-context-id="friend-button" data-friend="${friend.user}" data-cid="${friend.chatId}">
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
        <div class="frcl-btn" data-cid="${friend.chatId}" data-context-id="friend-button">
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

app.get("/chat/dm/:chatId", middle.authenticateToken, (req, res) => {
    const chatHistory = messageDb.getRowSync("messages", "chatId", req.params.chatId);
    const selfFriends = friendDb.getRowSync("friends", "userId", res.id).friends;
    if (!chatHistory || !selfFriends) return res.send("This chat does not exist.");

    let otherUser;
    for (let i = 0; i < selfFriends.length; i++) {
        if (selfFriends[i].chatId == req.params.chatId) {
            otherUser = selfFriends[i].user
        }
    }

    const messages = messageDb.getRowSync("messages", "chatId", req.params.chatId).messages;
    let md = "";

    for (let i = 0; i < messages.length; i++) {
        md += `
        <div class="cm-mb-mtt">
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z"/></svg>
                        <svg class="cmb-mt-bo edit" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg>
                        <svg class="cmb-mt-bo delete" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
                    </div>
                    <img src="/cdn/pfps/default.png" class="profile-picture">
                    <div class="cm-mb-muser">
                        <span class="cm-mb-muu">${messages[i].from}</span> <!-- Replace with user later, figure out how to do so, and also don't show user if same user message -->
                        <span class="cm-mb-timestamp">timstamp</span>
                    </div>
                    <div class="cm-mb-mcontent">
                        ${messages[i].content}
                    </div>
        `
    }

    const status = statusDb.getRowSync("statuses", "user", otherUser);

    const data = `
    <div class="tbar-ch">
        <img src="/cdn/pfps/default.png" alt="@" class="profile-picture">
        <span class="tbch-uname">${otherUser}</span> ${status.text.trim() != "" ? `<span class="tbch-sep">|</span> <span class="tbch-stext"> ${status.text}</span>` : ""}
        <span class="tbch-sact">${status.active.toString().toUpperCase()}</span>
    </div>
    <div class="scroller cm-mainbox">
        <div class="cm-msgs">
            <img src="/cdn/pfps/default.png" alt="${otherUser}" class="profile-picture" id="pfp-cmut">
            <h1 class="cmb-utitle">${otherUser}</h1>
            <p class="cmb-startdesc">This is the start of your message history.</p>
            <button class="cmfrb-dft remove-fr">Remove Friend</button>
            <button class="cmfrb-dft block-fr">Block</button>
            <div class="cm-divider"></div>
            ${md}
        </div>
        <div class="cm-ed-reply">
        Replying to<span class="cm-eb-rply">otheruser</span>
        <svg class="cd-rp-cl" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>
        </div>
        <div class="cm-editor">
            <div class="cm-e-textbox" style="height: 42px">
                <div class="cm-e-edit" contenteditable spellcheck="false" autocomplete="off"> </div>
            </div>
            <p class="cm-e-placeholder">Message @${otherUser.replace("#" + otherUser.split("#").pop(), "")}</p>
        </div>
    </div>
    `;

    res.send(data);
})

module.exports = app;