vt.log("Activity", "Setting active to online...")
fetch("/app-api/update-active/online", { method: "GET" });

window.addEventListener("beforeunload", () => {
    vt.log("Activity", "Setting active to offline...")
    fetch("/app-api/update-active/offline", { method: "GET" });
})

window.addEventListener("online", (e) => {
    console.log("NOW ONLINE")
})

window.addEventListener("offline", (e) => {
    console.log("OFFLINE")
})