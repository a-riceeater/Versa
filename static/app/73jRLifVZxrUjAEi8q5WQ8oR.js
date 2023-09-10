/*
    Elijah Bantugan
    MIT License

    xml-loader-ml.js
*/

let completed = 0;

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
        document.querySelectorAll(".main-container > .scbar-fri-m-o > .scb-frmo-btn").forEach(e => {

            e.addEventListener("click", (evt) => {
                document.querySelectorAll(".main-container > .scbar-fri-m-o > .scb-frmo-btn.selected").forEach(el => el.classList.remove("selected"));

                evt.target.classList.add("selected");

                document.querySelectorAll(".scbar-fri-sect.selected").forEach(e => e.classList.remove("selected"))
                document.querySelector(`.main-container > .scbar-fri-sect.${evt.target.getAttribute("class").split(" ")[1]}`).classList.add("selected")
            })
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
    })
})

const friendLBar = new XMLHttpRequest();
friendLBar.open("GET", "/app/widiget/wKB6K5GPlgnlKmYI0TsVFgOPO");
friendLBar.send();

friendLBar.addEventListener("load", () => {
    document.querySelector('.fr-chan-list-l').innerHTML = friendLBar.responseText;
    completed++;

    /*const dmUreadPendingAmt = new XMLHttpRequest();
    dmUreadPendingAmt.open("GET", "/app-api/user-ureaddm-pending-amt");
    dmUreadPendingAmt.send();

    dmUreadPendingAmt.addEventListener("load", () => {
        const amount = parseInt(dmUreadPendingAmt.responseText);
        const notiElement = document.querySelector(".scroller.server-list-l > .wrapper-sl-i > .wsli-noti-icon");

        if (amount <= 0) notiElement.style.display = "none"
        else {
            notiElement.style.display = "flex"
            notiElement.innerText = amount
        }
    })*/

    setTimeout(() => {
        document.querySelectorAll(".fr-chan-list-l > .frcl-b-container > .frcl-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", "/app/chat/dm/" + btn.getAttribute("data-cid"));
                xhr.send();

                xhr.addEventListener("load", () => {
                    vt.navigate("@" + btn.innerText.replace("#" + btn.innerText.split("#").pop(), "").trim(), btn.getAttribute("data-cid"));
                    document.querySelector(".scroller.main-container").innerHTML = xhr.responseText;

                    setTimeout(() => {
                        document.querySelector(".main-container > .cm-mainbox > .cm-editor > .cm-e-textbox > .cm-e-edit").addEventListener("keydown", (e) => {
                            setTimeout(() => {
                                document.querySelector(".main-container > .cm-mainbox > .cm-editor > .cm-e-placeholder").style.display = e.target.innerText.trim() == "" ? "block" : "none";
                            })
                        })

                        document.querySelector(".main-container > .cm-mainbox > .cmfrb-dft.remove-fr").addEventListener("click", () => {
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
            });
        })
    });
})

const awaitingAllElementsLoad = setInterval(() => {
    if (completed != 4) return // replace with required amount of elements when finished

    document.querySelector(".versa-dftm-loads").style.opacity = "0"
    setTimeout(() => {
        document.querySelector(".versa-dftm-loads").style.display = "none"
    }, 200)
}, 1200);