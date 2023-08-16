const databaseHandler = require("jdb");
const path = require("path");

module.exports = {
    tokens: databaseHandler.database(path.join(__dirname, "../", "database", "tokens.json")),
    accountDb: databaseHandler.database(path.join(__dirname, "../", "database", "accounts.json")),
    serverDb: databaseHandler.database(path.join(__dirname, "../", "database", "servers.json"))
}