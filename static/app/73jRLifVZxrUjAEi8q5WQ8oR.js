/*
    Elijah Bantugan
    MIT License

    xml-loader-ml.js
*/

let completed = 0;
const userMessagesSent = [];

const sl_scroller = new XMLHttpRequest();

sl_scroller.open("GET", "/app/widget/k1tBte9Ob");
sl_scroller.send();

sl_scroller.addEventListener("load", () => {
    document.querySelector(".server-list-l").innerHTML = sl_scroller.responseText;
    vt.log("XS-Loader", "Completed load #" + completed)

    setTimeout(() => {
        document.querySelectorAll(".lsl-serv-icon").forEach((el, index) => {
            const tooltip = document.createElement('div');
            tooltip.classList.add("tooltip-sli-sv-h");
            tooltip.textContent = el.getAttribute('data-name');

            document.body.appendChild(tooltip);

            el.addEventListener('mouseover', () => {
                tooltip.style.transform = 'scale(1)';
            });

            el.addEventListener('mouseleave', () => {
                tooltip.style.transform = 'scale(0)';
            });

            const buttonHeight = 55;
            const topOffset = 100;
            const tooltipTop = topOffset + index * buttonHeight + 15 * index;

            tooltip.style.top = `${tooltipTop}px`;

            el.addEventListener("click", (e) => {
                // go to server
            })
        })

        document.querySelector(".scroller.server-list-l > .section-sl-ser > .wrapper-js-sl").addEventListener("click", () => {
            document.querySelector(".shade").style.display = "block"
            document.querySelector(".serv-create-modal").style.display = "block"
        })

        document.querySelector(".scroller.server-list-l > .wrapper-sl-i").addEventListener("mouseover", () => document.querySelector(".tooltip-sli-vp-h").style.transform = "scale(1)")

        document.querySelector(".scroller.server-list-l > .wrapper-sl-i").addEventListener("mouseleave", () => document.querySelector(".tooltip-sli-vp-h").style.transform = "scale(0)")

        document.querySelector(".scroller.server-list-l > .section-sl-ser > .wrapper-js-sl").addEventListener("mouseover", () => document.querySelector(".tooltip-sli-csp-h").style.transform = "scale(1)")

        document.querySelector(".scroller.server-list-l > .section-sl-ser > .wrapper-js-sl").addEventListener("mouseleave", () => document.querySelector(".tooltip-sli-csp-h").style.transform = "scale(0)")

        completed++;
    })
})

const friendsMSQ = new XMLHttpRequest();
friendsMSQ.open("GET", "/app/widget/KjitLwgKq6AjPyLi28BSy7SXQ");
friendsMSQ.send();

friendsMSQ.addEventListener("load", () => {
    document.querySelector(".scroller.main-container").innerHTML = friendsMSQ.responseText;

    setTimeout(() => {
        document.querySelector(".fr-chan-list-l > .friend-to-ms-fl.btn").classList.add("selected");
        document.querySelectorAll(".frcl-b-container > .frcl-btn.selected").forEach(b => b.classList.remove("selected"));

        document.querySelectorAll(".main-container > .scbar-fri-m-o > .scb-frmo-btn").forEach(e => {

            e.addEventListener("click", (evt) => {
                document.querySelectorAll(".main-container > .scbar-fri-m-o > .scb-frmo-btn.selected").forEach(el => el.classList.remove("selected"));

                evt.target.classList.add("selected");

                document.querySelectorAll(".scbar-fri-sect.selected").forEach(e => e.classList.remove("selected"))
                document.querySelector(`.main-container > .scbar-fri-sect.${evt.target.getAttribute("class").split(" ")[1]}`).classList.add("selected")
            })
        })

        document.addEventListener("keydown", (evt) => {
            const tb = document.querySelector(".main-container > .cm-mainbox > .cm-editor > .cm-e-textbox > .cm-e-edit");
            if (document.body.contains(tb) && tb != document.activeElement) {
                console.log(evt.key.toString().length)
                if (evt.key.toString().length > 1 && evt.key != "Space") return
                document.querySelector(".main-container > .cm-mainbox > .cm-editor > .cm-e-placeholder").style.display = "none"
                tb.focus();
            }
        })

        document.querySelector(".main-container > .scbar-fri-sect.add > div > input").addEventListener("keyup", (e) => {
            if (e.key == "Enter") submit();
        })

        document.querySelector(".main-container > .scbar-fri-sect.add > div > button").addEventListener("click", submit);

        function submit(e) {
            document.querySelector(".main-container > .scbar-fri-sect.add > div > button").classList.add("disabled");
            const input = document.querySelector(".main-container > .scbar-fri-sect.add > div > input");
            if (input.value.trim() == "") return

            input.blur();
            if (e) e.target.blur();

            fetch("/app-api/send-friend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    to: input.value
                })
            })
                .then((d) => d.json())
                .then((d) => {
                    document.querySelector(".main-container > .scbar-fri-sect.add > div > button").classList.remove("disabled");
                    if (d.error) {
                        const q = document.querySelector(".main-container > .scbar-fri-sect.add.selected > div > .error");
                        //q.innerText = d.error;
                        //setTimeout(() => q.innerText = "", 1500)
                        const em = new ErrorModal();
                        em.title = "Friend request failed"
                        em.body = d.error;
                        em.spawn(() => input.focus());
                    } else {
                        const re = new ErrorModal();
                        re.title = "Friend request sent"
                        re.body = "Your friend request was sucessfully sent to " + input.value
                        re.spawn(() => input.focus());
                    }
                })
            completed++;
        }

        // Friend Pending buttons

        document.querySelectorAll(".main-container > .scbar-fri-sect.pending > .scb-frmo-frbtn > .cancel-fr").forEach(el => {
            el.addEventListener("click", (ev) => {
                fetch("/app-api/cancel-outgoing-fr", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        to: el.getAttribute("data-to")
                    })
                })
                    .then((d) => d.json())
                    .then((d) => {
                        if (d.completed) el.parentNode.remove();
                    })
            })
        })

        document.querySelectorAll(".main-container > .scbar-fri-sect.pending > .scb-frmo-frbtn > .accept-fr").forEach(el => {
            el.addEventListener("click", (ev) => {
                fetch("/app-api/accept-incoming-fr", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        from: el.getAttribute("data-from")
                    })
                })
            })
        })

        // Friend btn click

        document.querySelectorAll(".main-container > .scbar-fri-sect.online > .scb-frmo-frbtn").forEach(btn => {
            btn.addEventListener("click", () => joinDM(btn));
        })

        document.querySelectorAll(".main-container > .scbar-fri-sect.all > .scb-frmo-frbtn").forEach(btn => {
            btn.addEventListener("click", () => joinDM(btn));
        })
    })
})

const friendLBar = new XMLHttpRequest();
friendLBar.open("GET", "/app/widiget/wKB6K5GPlgnlKmYI0TsVFgOPO");
friendLBar.send();

friendLBar.addEventListener("load", () => {
    document.querySelector('.fr-chan-list-l').innerHTML = friendLBar.responseText;
    completed++;

    setTimeout(() => {
        document.querySelectorAll(".fr-chan-list-l > .frcl-b-container > .frcl-btn").forEach(btn => {
            btn.addEventListener("click", () => joinDM(btn));
        })

        document.querySelector(".fr-chan-list-l > .friend-to-ms-fl.btn").addEventListener("click", () => {
            friendsMSQ.open("GET", "/app/widget/KjitLwgKq6AjPyLi28BSy7SXQ");
            friendsMSQ.send();
        })
    });
})

function joinDM(btn) {
    const xhr = new XMLHttpRequest();

    fetch("/app-api/join-room/" + btn.getAttribute("data-cid"))
        .then((d) => d.json())
        .then((d) => {
            if (d.error) {
                const em = new ErrorModal();
                em.title = "Failed to connect..."
                em.body = "Try rejoining the channel."
                em.spawn();
                return
            }
            document.querySelector(".scroller.fr-chan-list-l > .btn.friend-to-ms-fl").classList.remove("selected");
            document.querySelectorAll(".frcl-b-container > .frcl-btn.selected").forEach(b => b.classList.remove("selected"))
            btn.classList.add("selected")

            xhr.open("GET", "/app/chat/dm/" + btn.getAttribute("data-cid"));
            xhr.send();
        })

    xhr.addEventListener("load", () => {
        vt.navigate("@" + btn.innerText.replace("#" + btn.innerText.split("#").pop(), "").trim(), btn.getAttribute("data-cid"));
        document.querySelector(".scroller.main-container").innerHTML = xhr.responseText;

        setTimeout(() => {
            document.querySelector(".main-container > .cm-mainbox .cm-editor > .cm-e-textbox").addEventListener("click", () => document.querySelector(".main-container > .cm-mainbox > .cm-editor > .cm-e-textbox > .cm-e-edit").focus())

            document.querySelector(".main-container > .cm-mainbox > .cm-editor > .cm-e-textbox > .cm-e-edit").addEventListener("keydown", (e) => {
                setTimeout(() => {
                    document.querySelector(".main-container > .cm-mainbox > .cm-editor > .cm-e-placeholder").style.display = e.target.innerText == "" ? "block" : "none";
                })

                if (e.key == "Enter"/* && !e.shiftKey*/) {
                    e.preventDefault();

                    if (e.target.innerText.trim() == "") return

                    const tempId = vt.createRandomId();
                    const message = document.createElement("div");
                    message.classList.add("cm-mb-mse");
                    message.classList.add("sending");
                    message.innerHTML = `
                    <div class="cm-mb-mtt">
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64H336c97.2 0 176 78.8 176 176c0 113.3-81.5 163.9-100.2 174.1c-2.5 1.4-5.3 1.9-8.1 1.9c-10.9 0-19.7-8.9-19.7-19.7c0-7.5 4.3-14.4 9.8-19.5c9.4-8.8 22.2-26.4 22.2-56.7c0-53-43-96-96-96H224v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z"/></svg>
                        <svg class="cmb-mt-bo edit" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg>
                        <svg class="cmb-mt-bo delete" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
                    </div>
                    <img src="/cdn/pfps/default.png" class="profile-picture">
                    <div class="cm-mb-muser">
                        <span class="cm-mb-muu">a</span> <!-- Replace with user later, figure out how to do so, and also don't show user if same user message -->
                        <span class="cm-mb-timestamp">${new Timestamp("short").text}</span>
                    </div>
                    <div class="cm-mb-mcontent">
                        ${e.target.innerText.trim()}
                    </div>`
                    message.id = "t" + tempId;

                    document.querySelector(".cm-mainbox > .cm-msgs").appendChild(message);
                    document.querySelector(".cm-mainbox > .cm-msgs").scrollBottom();

                    const content = e.target.innerText.trim();
                    e.target.innerText = "";

                    fetch("/message-api/send-message", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            message: content,
                            chatId: btn.getAttribute("data-cid"),
                            tempId: "t" + tempId
                        })
                    })
                        .then((d) => d.json())
                        .then((d) => {
                            if (d.limiter) {
                                e.target.blur();
                                const em = new ErrorModal();
                                em.title = "Slow down!"
                                em.body = "You are sending messages too fast!"
                                em.spawn();

                                message.classList.remove("sending");
                                message.classList.add("failed");
                            }
                            else if (d.error) {
                                const em = new ErrorModal();
                                em.title = "An error occured..."
                                em.body = d.error;
                                em.spawn();
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                            const em = new ErrorModal();
                            em.title = "Failed to send"
                            em.body = "The message failed to send."
                            em.spawn();
                        })
                }

                /*
                if (e.key == "Enter" && e.shiftKey) {
                    const brs = e.target.innerHTML.match(new RegExp("<br>", "g")) || ["a"]
                    e.target.parentNode.style.height = (brs.length * 15.5) + "px"
                    console.log(brs.length, brs.length * 15.5, e.target.innerHTML)
                }*/
            })

            document.querySelector(".main-container > .cm-mainbox > .cm-msgs > .cmfrb-dft.remove-fr").addEventListener("click", () => {
                fetch("/app-api/remove-friend", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        friend: document.querySelector(".main-container > .cm-mainbox > .cmb-utitle").innerText.trim()
                    })
                })
                    .then((d) => d.json())
                    .then((d) => {
                        if (d.removed) {
                            friendsMSQ.open("GET", "/app/widget/KjitLwgKq6AjPyLi28BSy7SXQ");
                            friendsMSQ.send();

                            friendLBar.open("GET", "/app/widiget/wKB6K5GPlgnlKmYI0TsVFgOPO");
                            friendLBar.send();
                        }
                    })
                    .catch((err) => {
                        const em = new ErrorModal();
                        em.title = "An error occured"
                        em.body = "Please try again later..."
                        em.spawn();

                        console.error(err);
                    })
            });
        })
    });
}

const awaitingAllElementsLoad = setInterval(() => {
    if (completed != 4) return // replace with required amount of elements when finished

    document.querySelector(".versa-dftm-loads").style.opacity = "0"
    setTimeout(() => {
        document.querySelector(".versa-dftm-loads").style.display = "none"
    }, 200)
}, 1200);