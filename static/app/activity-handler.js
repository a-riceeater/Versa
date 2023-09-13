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
    const a = setInterval(() => {
        if (!socket.id) return

        vt.log("WS", "Socket ID: " + socket.id)
        clearInterval(a);
        fetch("/socket-api/connect", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: socket.id
            })
        })
            .then((d) => d.json())
            .then((d) => {
                vt.log("WS", "Connected to WS")
            })
            .catch((err) => {
                console.error(err);
                const em = new ErrorModal();
                em.title = "Failed to connect"
                em.body = err;
                em.spawn()
            })
    }, 200)
})

window.addEventListener("offline", (e) => {
    console.log("OFFLINE")
})