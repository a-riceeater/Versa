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

        function submit() {
            document.querySelector(".main-container > .scbar-fri-sect.add > div > button").classList.add("disabled");
            const input = document.querySelector(".main-container > .scbar-fri-sect.add > div > input");
            if (input.value.trim() == "") return

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
                        q.innerText = d.error;
                        setTimeout(() => q.innerText = "", 1500)
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
                        from: ev.target.getAttribute("data-from")
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
})

const dmUreadPendingAmt = new XMLHttpRequest();
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
})

const awaitingAllElementsLoad = setInterval(() => {
    if (completed != 4) return // replace with required amount of elements when finished

    document.querySelector(".versa-dftm-loads").style.opacity = "0"
    setTimeout(() => {
        document.querySelector(".versa-dftm-loads").style.display = "none"
    }, 200)
}, 1200);