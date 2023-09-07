const express = require("express");
const path = require("path");

const app = express.Router();

app.get("/windows", (req, res) => {
    
})

app.get("/macos", (req, res) => {
    res.sendFile(path.join(__dirname, "../", "../", "app", "dist"))
})

app.get("linux", (req, res) => {
    
})

module.exports = app;