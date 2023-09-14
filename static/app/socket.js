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
        .catch((err) => {
            console.error(err);
            const em = new ErrorModal();
            em.title = "Failed to connect"
            em.body = err;
            em.spawn()
        })
}, 200)

socket.on("recieve-message", (d) => {
    const messageId = d.messageId;
    const from = d.from;
    const content = d.message;

    if (document.querySelector(".cm-mainbox").contains(document.querySelector(".cm-mainbox > .cm-msgs > #" + d.tempId))) {
        setTimeout(() => {
            const message = document.querySelector(".cm-mainbox > .cm-msgs > #" + d.tempId);
            message.id = messageId;
            message.classList.remove("sending")
        }, Math.floor(Math.random() * 200))

    } else {
        const message = document.createElement("div");
        message.classList.add("cm-mb-mse");
        message.id = messageId;

        message.innerHTML = `${content}`

        document.querySelector(".cm-mainbox > .cm-msgs").appendChild(message);
    }
})