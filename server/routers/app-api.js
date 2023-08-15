const express = require("express");
const path = require("path");
const databaseHandler = require("jdb");
const middle = require("../middleware")

const app = express.Router();

app.post("/create-server", middle.authenticateToken, (req, res) => {

})


module.exports = app;