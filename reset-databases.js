const dbInstances = require("./server/dbInstances");

const start = new Date();
console.log("Purging Databases...")

dbInstances.accountDb.clearTable("accounts");
dbInstances.serverDb.clearTable("servers");
dbInstances.serverDb.clearTable("userServers");
dbInstances.tokens.clearTable("tokens");

const end = new Date();
console.log("Cleared all databases in " + (end - start) + "ms")