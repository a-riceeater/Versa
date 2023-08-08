const express = require('express');
const path = require("path");
const fs = require("fs");

const app = express.Router();

app.get("/self", (req, res) => {
    res.send(200);
})

module.exports = app;