require("dotenv").config();
const express = require("express");
const http = require('http')
const path = require("path");
const databaseHandler = require("jdb");
const favicon = require('serve-favicon');
const cors = require("cors");
const middle = require("./server/middleware");
const dbInstances = require("./server/dbInstances")

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = require("socket.io")(server, { 'force new connection': true });

const version = JSON.parse(require("fs").readFileSync(path.join(__dirname, "current_version.json"), "utf8")).version;

const socketIds = dbInstances.socketIds;
const rooms = dbInstances.rooms;

app.use(express.static(path.join(__dirname, "static")));
app.use(express.json())
app.use("/cdn/", express.static(path.join(__dirname, "cdn")));
app.use("/cdn/", middle.authenticateToken);

app.use("/app/", require(path.join(__dirname, "server", "routers", "app.js")));
app.use("/auth/", require(path.join(__dirname, "server", "routers", "authentication.js")));
app.use("/app-api/", require(path.join(__dirname, "server", "routers", "app-api.js")));
app.use("/cdn-api/", require(path.join(__dirname, "server", "cdn.js")));
app.use("/download/", require(path.join(__dirname, "server", "routers", "downloads.js")));

app.use(favicon(path.join(__dirname, 'static', 'versa.png')));

const corsoptions = {
    origin: '*',
    credentials: true
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


io.on("connection", (socket) => {
    app.set("socket", socket);

    socket.on("disconnect", () => {
        Object.values(socketIds).forEach((key) => {
            if (key == socket.id) {
                delete socketIds[key]
            }
        });
        delete rooms[socket.id];
        socket.leaveAll();
    })
});

server.listen(6969, () => {
    console.log("Listening at http://localhost:6969")
})