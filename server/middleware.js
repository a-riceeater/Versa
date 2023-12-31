const tokenHandler = require("./tokens");

module.exports = {
    authenticateToken: function (req, res, next) {
        if (!req.headers.cookie) return res.redirect("/auth/login");
        if (!req.headers.cookie.includes("token=")) return res.redirect("/auth/login");

        const token = req.headers.cookie.split("token=")[1];
        if (!token) return res.redirect("/auth/login");

        const status = tokenHandler.verifyToken(token);
        if (status) {
            res.user = status.username;
            res.email = status.email;
            res.token = token;
            res.id = status.userId;
        } else {
            res.clearCookie("token");
            res.redirect("/auth/login");
        }

        return next();
    },

    authAlready: function (req, res, next) {
        if (!req.headers.cookie) return next();
        if (!req.headers.cookie.includes("token=")) return next();

        const token = req.headers.cookie.split("token=")[1];
        if (tokenHandler.verifyToken(token)) res.redirect("/app/self")
        else next()
    }
}