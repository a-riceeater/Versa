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

socket.on("recieve-message", (d) => {
    const messageId = d.messageId;
    const from = d.from;
    const content = d.message;

    const message = document.createElement("div");
    message.classList.add("cm-mb-mse");
    message.id = messageId;

    message.innerHTML = `${content}`

    console.log(messageId, from, content);
    
    // document.querySelector(".cm-mainbox > hitory thing box").appendChild(message);
})