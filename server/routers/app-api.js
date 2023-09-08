const express = require("express");
const path = require("path");
const dbInstances = require("../dbInstances");
const middle = require("../middleware");
const tokenHandler = require("../tokens");
const rateLimit = require('express-rate-limit')

const app = express.Router();

const smallRequests = rateLimit({
    windowMs: 30 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "too many requests. slow down!" }
})

const medRequests = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "too many requests. slow down!" }
})

const lotsRequest = rateLimit({
    windowMs: 60 * 1000,
    max: 45,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "too many requests. slow down!" }
})

const serverDb = dbInstances.serverDb;
const accountDb = dbInstances.accountDb;

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
class InviteId {
    constructor() {
        let result = "";

        for (let i = 0; i < 7; i++) {
            result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }

        return { id: result }
    }
}

app.post("/create-server", middle.authenticateToken, smallRequests, (req, res) => {
    const name = req.body.name;

    if (name.trim().replaceAll(" ", "") == "") return res.send({ error: "name must be supplied..." })

    const serverId = tokenHandler.createRandomId();
    const inviteId = new InviteId().id;

    const uRow = serverDb.getRowSync("userServers", "userId", res.id);
    const userServersOwned = uRow.owned;

    function write() {
        uRow.owned.push({
            name: name,
            serverId: serverId,
            inviteId: inviteId
        })

        uRow.in.push({
            name: name,
            serverId: serverId,
            inviteId: inviteId
        })

        serverDb.addRowSync("servers", {
            name: name,
            serverId: serverId,
            inviteId: inviteId,
            users: [{
                name: res.user,
                id: res.id
            }],
            members: 1,
            owner: res.id
        })

        serverDb.updateRowSync("userServers", "userId", res.id, uRow);

        res.send({ created: true })
    }

    if (userServersOwned.length == 0) write();
    else {
        for (let i = 0; i < userServersOwned.length; i++) {
            const s = userServersOwned[i];


            if (s.name == name) return res.send({ error: "you already have a server with this name" })
            if (i == userServersOwned.length - 1) write();
        }
    }
})

app.post("/join-server", middle.authenticateToken, (req, res) => {
    const inviteId = req.body.invite;

    if (!inviteId || inviteId.trim().replaceAll(" ", "") == "") return res.send({ error: "invite id required" })
    const uRow = serverDb.getRowSync("userServers", "userId", res.id);
    const userServers = uRow.in;

    const server = serverDb.getRowSync("servers", "inviteId", inviteId);

    function write() {
        uRow.in.push({
            name: server.name,
            serverId: server.serverId,
            inviteId: server.inviteId
        });
        serverDb.updateRowSync("userServers", "userId", res.id, uRow);

        server.members++;
        serverDb.updateRowSync("servers", "serverId", server.serverId, server);

        res.send({ joined: true })
    }

    if (userServers.length == 0) write();
    else {
        for (let i = 0; i < userServers.length; i++) {
            const s = userServers[i];
            if (!s) continue
            if (s.serverId == server.serverId) return res.send({ already: true })
            if (i == userServers.length - 1) return write();
        }
    }
})

const friendDb = dbInstances.friendDb;
const messageDb = dbInstances.messageDb;

app.post("/send-friend", middle.authenticateToken, (req, res) => {
    const to = req.body.to;

    const toUser = accountDb.getRowSync("accounts", "username", to);
    if (!toUser) return res.send({ error: "This user does not exist!" })

    const toUserFriends = friendDb.getRowSync("friends", "userId", toUser.userId);

    const tuf = toUserFriends.friends;

    if (tuf.length == 0) write();
    for (let i = 0; i < tuf.length; i++) {
        if (tuf.userId == toUser.userId) return res.send({ error: "You are already friends with this user!" })
        if (i == tuf.length - 1) return write();
    }

    function write() {
        const selfRow = friendDb.getRowSync("friends", "userId", res.id);

        selfRow.pendingTo.push({
            username: toUser.username,
            userId: toUser.userId
        })

        toUserFriends.pendingFrom.push({
            username: res.user,
            userId: res.id
        })

        friendDb.updateRowSync("friends", "userId", res.id, selfRow);
        friendDb.updateRowSync("friends", "userId", toUser.userId, toUserFriends);

        res.send({ added: true });
    }
})

app.post("/remove-friend", middle.authenticateToken, (req, res) => {
    const friend = req.body.friend;

    const toUser = accountDb.getRowSync("accounts", "username", friend);
    if (!toUser) return res.send({ error: "This user does not exist!" })

    const friendRow = friendDb.getRowSync("friends", "userId", toUser.userId);
    const selfRow = friendDb.getRowSync("friends", "userId", res.id);
    const sfFriends = selfRow.friends;
    const tuf = friendRow.friends;

    if (sfFriends.length == 0) res.send({ error: "You are not friends with this user!" });

    for (let i = 0; i < sfFriends.length; i++) {
        if (sfFriends[i].user == toUser.username) return write()
        if (i == tuf.length - 1) return res.send({ error: "You are not friends with this user!" });
    }

    function write() {

        for (let i = 0; i < sfFriends.length; i++) {
            if (sfFriends[i].user == friend) selfRow.friends.splice(i, 1);
        }

        for (let i = 0; i < tuf; i++) {
            if (tuf[i].user == res.user) toUser.friends.splice(i, 1);
        }

        friendDb.updateRowSync("friends", "userId", res.id, selfRow);
        friendDb.updateRowSync("friends", "userId", toUser.userId, friendRow);

        res.send({ removed: true });
    }
})

app.get("/user-ureaddm-pending-amt", middle.authenticateToken, (req, res) => {
    const r = friendDb.getRowSync("friends", "userId", res.id);
    const pendingAmount = r.pendingFrom.length;

    const total = pendingAmount; // add from unread dms, etc

    res.send(total.toString());
})

app.post("/cancel-outgoing-fr", middle.authenticateToken, (req, res) => {
    const to = req.body.to;
    const userFriend = friendDb.getRowSync("friends", "userId", res.id);
    const pendingTo = userFriend.pendingTo;

    const rowThem = friendDb.getRowSync("friends", "user", to);

    for (let i = 0; i < pendingTo.length; i++) {
        if (!pendingTo[i]) continue
        if (pendingTo[i].username == to) {
            userFriend.pendingTo.splice(i, 1);

            for (let ii = 0; ii < rowThem.pendingFrom.length; ii++) {
                if (!rowThem.pendingFrom[ii]) continue
                if (rowThem.pendingFrom[ii].username == res.user) {
                    rowThem.pendingFrom.splice(ii, 1);

                    friendDb.updateRowSync("friends", "userId", res.id, userFriend);
                    friendDb.updateRowSync("friends", "userId", rowThem.userId, rowThem);

                    res.send({ completed: true });
                    return
                } else if (ii == rowThem.pendingFrom.length - 1) return res.send({ completed: false });
            }
        } else if (i == pendingTo.length - 1) return res.send({ completed: false });
    }
})

app.post("/accept-incoming-fr", middle.authenticateToken, (req, res) => {
    const from = req.body.from;
    const rowSelf = friendDb.getRowSync("friends", "userId", res.id);
    const rowThem = friendDb.getRowSync("friends", "user", from);

    for (let i = 0; i < rowSelf.pendingFrom.length; i++) {
        if (!rowSelf.pendingFrom[i]) continue
        if (rowSelf.pendingFrom[i].username == from) {
            rowSelf.pendingFrom.splice(i, 1);

            const chatId = tokenHandler.createRandomId();
            rowSelf.friends.push({
                user: from,
                chatId: chatId
            })

            for (let ii = 0; ii < rowThem.pendingTo.length; ii++) {
                if (!rowThem.pendingTo[ii]) continue
                if (rowThem.pendingTo[ii].username == res.user) {
                    rowThem.pendingTo.splice(ii, 1);

                    rowThem.friends.push({
                        user: res.user,
                        chatId: chatId
                    })

                    friendDb.updateRowSync("friends", "userId", res.id, rowSelf);
                    friendDb.updateRowSync("friends", "userId", rowThem.userId, rowThem);

                    res.send({ success: true })
                } else if (ii == rowThem.pendingTo.length - 1) return res.send({ success: false });
            }
        } else if (i == rowSelf.pendingFrom.length - 1) return res.send({ success: false });
    }
})

const statusDb = dbInstances.statusDb;
const validStatusActive = ["online", "offline"]

app.get("/update-active/:active", middle.authenticateToken, (req, res) => {
    const row = statusDb.getRowSync("statuses", "user", res.user);

    if (!validStatusActive.includes(req.params.active)) row.active = "online"
    else row.active = req.params.active;

    statusDb.updateRowSync("statuses", "user", res.user, row);
})

app.get("/activity/get-user-status/:user", middle.authenticateToken, (req, res) => {
    console.log(req.params.user)
    res.send(statusDb.getRowSync("statuses", "user", req.params.user));
})

app.get("/versa", middle.authenticateToken, (req, res) => {
    res.sendStatus(200);
})

app.post("/leave-server", middle.authenticateToken, (req, res) => {
    const serverId = req.body.server;
    const serverRow = serverDb.getRowSync("servers", "serverId", serverId);
    const selfRow = serverDb.getRowSync("userServers", "userId", res.id);

    if (!serverRow) return res.send({ error: "This server does not exist!" });


    serverRow.members--;
    for (let i = 0; i < serverRow.users.length; i++) {
        if (serverRow.users[i].id == res.id) {
            serverRow.users.splice(i, 1); break
        }
    }

    serverDb.updateRowSync("servers", "serverId", serverId, serverRow);

    for (let i = 0; i < selfRow.in.length; i++) {
        if (selfRow.in[i].serverId == serverId) {
            selfRow.in.splice(i, 1);
            break
        }
    }

    serverDb.updateRowSync("userServers", "userId", res.id, selfRow);

    res.send({ left: true })
})

module.exports = app;