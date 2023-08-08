const express = require("express");
const path = require("path");
const databaseHandler = require("jdb");

const app = express();

app.use(express.static(path.join(__dirname, "static")));
app.use("/cdn/", express.static(path.join(__dirname, "cdn")));

app.use("/app/", require(path.join(__dirname, "server", "routers", "app.js")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "html/index.html"));
})

app.get("/cdn", (req, res) => {
    res.redirect("/");
})

app.listen(6969, () => {
    console.log("Listening at http://localhost:6969")
})