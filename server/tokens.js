const databaseHandler = require("jdb");
const path = require("path");

const tokens = databaseHandler.database(path.join(__dirname, "../", "database", "tokens.json"));

module.exports = {
    createRandomId: function () {
        const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"

        let result = "";

        for (let i = 0; i < 5; i++) {
            for (let i = 0; i < 7; i++) {
                result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            }

            if (i != 4) result += "-"
        }

        return result;
    },

    createToken: function (username, email) {
        const token = this.createRandomId();

        tokens.addRowSync("tokens", {
            "token": token,
            "email": email,
            "username": username
        })

        return token;
    },

    verifyToken: (token) => tokens.getRowSync("tokens", "token", token)
}

console.log(module.exports.createRandomId());