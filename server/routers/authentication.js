const express = require("express");
const path = require("path");
const databaseHandler = require("jdb");

const app = express.Router();

app.get("/start", (req, res) => {
    res.sendFile(path.join(__dirname, "../../", "html", "authentication", "start.html"));
})

app.post("/create-account", (req, res) => {
    
})

module.exports = app;