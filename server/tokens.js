const dbInstances = require("./dbInstances");
const path = require("path");

const tokens = dbInstances.tokens;

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

    createToken: function (username, email, userId) {
        const token = this.createRandomId();

        tokens.addRowSync("tokens", {
            "token": token,
            "email": email,
            "username": username,
            "userId": userId
        })

        return token;
    },

    verifyToken: (token) => tokens.getRowSync("tokens", "token", token),

    deleteToken: (token) => {
        try {
            tokens.deleteRow("tokens", "token", token);
        } catch (e) { }
    }
}

console.log("\u001b[31mSESSION ID: \u001b[0m" + module.exports.createRandomId());