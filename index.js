require("dotenv").config();
const express = require("express");
const path = require("path");
const favicon = require('serve-favicon');
const cors = require("cors");
const middle = require("./server/middleware");
const dbInstances = require("./server/dbInstances")

const app = dbInstances.mainApp;
const server = dbInstances.server;
const io = dbInstances.io;

const version = JSON.parse(require("fs").readFileSync(path.join(__dirname, "current_version.json"), "utf8")).version;

const socketIds = dbInstances.socketIds;
const rooms = dbInstances.rooms;

app.disable('x-powered-by');

app.use(express.static(path.join(__dirname, "static")));
app.use(express.json())
app.use("/cdn/", express.static(path.join(__dirname, "cdn")));
app.use("/cdn/", middle.authenticateToken);

app.use("/app/", require(path.join(__dirname, "server", "routers", "app.js")));
app.use("/auth/", require(path.join(__dirname, "server", "routers", "authentication.js")));
app.use("/app-api/", require(path.join(__dirname, "server", "routers", "app-api.js")));
app.use("/cdn-api/", require(path.join(__dirname, "server", "cdn.js")));
app.use("/message-api/", require(path.join(__dirname, "server", "routers", "message-api.js")))
app.use("/download/", require(path.join(__dirname, "server", "routers", "downloads.js")));

app.use(favicon(path.join(__dirname, 'static', 'versa.png')));

const corsoptions = {
    origin: '*',
    // credentials: true ?
};

app.use(cors(corsoptions));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html/index.html"));
})

app.get("/cdn", (req, res) => {
    res.redirect("/");
})

app.get("/legal/terms", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "legal", "terms.html"))
})

app.get("/legal/privacy", (req, res) => {
    res.sendFile(path.join(__dirname, "html", "legal", "privacy.html"))
})

app.get("/invite/:inviteId", (req, res) => { })

app.get("/api/verify-version/:version", (req, res) => {
    res.send(req.params.version == version);
})

app.post("/socket-api/connect", middle.authenticateToken, (req, res) => {
    const socketId = req.body.id;
    socketIds[res.id] = socketId;

    res.status(200).send({ connected: true });
})

app.get("*", (req, res) => {
    res.sendStatus(404);
})

const statusDb = dbInstances.statusDb;

io.on("connection", (socket) => {
    app.set("socket", socket);

    socket.on("disconnect", () => {
        var keys = Object.keys(socketIds);
        var values = Object.values(socketIds);

        for (var i = 0; i < values.length; i++) {
            if (values[i] === socket.id) {
                const statusRow = statusDb.getRowSync("statuses", "id", keys[i]);
                statusRow.active = "offline"
                statusDb.updateRowSync("statuses", "id", keys[i], statusRow);
            }
        }
        
        Object.values(socketIds).forEach((value) => {
            if (value == socket.id) {
                delete socketIds[value]
            }
        });
        socket.leaveAll();

    })
});

server.listen(3000, () => {
    console.log("Listening at http://localhost:6969")
})
