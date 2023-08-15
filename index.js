const express = require("express");
const path = require("path");
const databaseHandler = require("jdb");
const favicon = require('serve-favicon');
const cors = require("cors");

const app = express();

app.use(express.static(path.join(__dirname, "static")));
app.use(express.json())
app.use("/cdn/", express.static(path.join(__dirname, "cdn")));

app.use("/app/", require(path.join(__dirname, "server", "routers", "app.js")));
app.use("/auth/", require(path.join(__dirname, "server", "routers", "authentication.js")))

app.use(favicon(path.join(__dirname, 'static', 'versa.png')));

var corsoptions = {
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

app.get("*", (req, res) => {
    res.sendStatus(404);
})

app.listen(6969, () => {
    console.log("Listening at http://localhost:6969")
})