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

        let ml = -105;
        ml = ml + (-7.5 * from.replace("#" + from.split("#").pop(), "").toString().length);

        message.innerHTML = `
        <div class="cm-mb-mtt">
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z"/></svg>
        <svg class="cmb-mt-bo edit" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg>
        <svg class="cmb-mt-bo delete" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
        </div>
        <img src="/cdn/pfps/default.png" class="profile-picture">
        <div class="cm-mb-muser">
            <span class="cm-mb-muu">${from.replace("#" + from.split("#").pop(), "")}</span>
            <span class="cm-mb-timestamp">${new Timestamp("short").text}</span>
        </div>
        <div class="cm-mb-mcontent" style="margin-left: ${ml}px">
            ${content}
        </div>`
        message.id = messageId

        document.querySelector(".cm-mainbox > .cm-msgs").appendChild(message);
        document.querySelector(".cm-mainbox > .cm-msgs").scrollBottom();
    }
})