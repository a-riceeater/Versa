vt.log("WS", "Connecting to WS...")
const socket = io();

const scI = setInterval(() => {
    if (!socket.id) return

    vt.log("WS", "Socket ID: " + socket.id)
    clearInterval(scI);
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
}, 200)
