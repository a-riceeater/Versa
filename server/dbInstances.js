const databaseHandler = require("./jdb/index");
const path = require("path");

const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { 'force new connection': true });

module.exports = {
    tokens: databaseHandler.database(path.join(__dirname, "../", "database", "tokens.json")),
    accountDb: databaseHandler.database(path.join(__dirname, "../", "database", "accounts.json")),
    serverDb: databaseHandler.database(path.join(__dirname, "../", "database", "servers.json")),
    friendDb: databaseHandler.database(path.join(__dirname, "../", "database", "friends.json")),
    messageDb: databaseHandler.database(path.join(__dirname, "../", "database", "messages.json")),
    statusDb: databaseHandler.database(path.join(__dirname, "../", "database", "statuses.json")),
    socketIds: {},
    rooms: {},
    mainApp: app,
    server: server,
    io: io
}