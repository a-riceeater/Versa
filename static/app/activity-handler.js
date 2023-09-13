vt.log("Activity", "Setting active to online...")
fetch("/app-api/update-active/online", { method: "GET" });

window.addEventListener("beforeunload", () => {
    vt.log("Activity", "Setting active to offline...")
    // fetch("/app-api/update-active/offline", { method: "GET" });
    // removed due to using socket to change offline, since if user disconnects from server,
    // they cannot update activity from client side
})

window.addEventListener("online", (e) => {
    vt.log("WS", "Reconnecting...")
})

window.addEventListener("offline", (e) => {
    console.log("OFFLINE")
})