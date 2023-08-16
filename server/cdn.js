const express = require("express");
const path = require("path");
const dbInstances = require("./dbInstances"); // possibly not needed, since it writes directly, but it may require token validation?
const middle = require("./middleware");

const app = express.Router();

app.post("/upload-file", middle.authenticateToken, (req, res) => {
    
})