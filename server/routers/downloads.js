const express = require("express");
const path = require("path");

const app = express.Router();
const version = JSON.parse(require("fs").readFileSync(path.join(__dirname, "../", "../", "current_version.json"), "utf8")).version;

app.get("/windows", (req, res) => {
    res.download(path.join(__dirname, "../", "../", "app", "dist", "Versa-" + version + ".exe"));
})

app.get("/macos", (req, res) => {
    res.download(path.join(__dirname, "../", "../", "app", "dist", "Versa-" + version + ".dmg"));
})

app.get("linux", (req, res) => {
    res.download(path.join(__dirname, "../", "../", "app", "dist", "Versa-" + version + ".dmg"));
})

module.exports = app;