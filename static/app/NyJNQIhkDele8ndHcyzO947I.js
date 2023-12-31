/*
    Elijah Bantugan
    MIT License

    modals.js
*/

const modal = document.querySelector(".serv-create-modal");
let listeners = [];

const originalHTML = `
<p class="serv-mo-t">Create a space</p>
        <p id="serv-mo-d">A space is where you and your friends or co-workers can discuss projects, or just chat.</p>

        <div class="create-serv-btn serv-btn">
            <span class="serv-btn-content">Create your own space</span>
            <span class="serv-btn-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>            
            </span>
        </div>

        <div class="join-serv-btn serv-btn">
            <span class="serv-btn-content">Join a space</span>
            <span class="serv-btn-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>     
            </span>
        </div>`.trim();

function createListeners() {
    document.querySelector(".serv-create-modal > .join-serv-btn").addEventListener("click", () => {
        modal.innerHTML = `
        <p class="serv-mo-t">Enter invite</p>
        <p class="serv-mo-d">Input the invite ID/invite link to the input below.</p>
        <p class="serve-c-lab">Invite ID/URL</p>
    
        <input type="text" id="join-serv-nainp" placeholder="ex. wDSv8Sl or /invite/wDSv8Sl">
    
        <div class="c-serv-footer">
        <p class="csv-f-back">Back</p>
        <button class="create-serv-confirm">Join</button>
        </div>
        `

        setTimeout(() => {
            document.querySelector(".serv-create-modal > .c-serv-footer > .csv-f-back").addEventListener("click", () => { modal.innerHTML = originalHTML; createListeners(); })

            document.querySelector(".serv-create-modal > .c-serv-footer > .create-serv-confirm").addEventListener("click", () => {
                const invite = document.querySelector(".serv-create-modal > #join-serv-nainp").value;

                if (invite.trim() == "") {
                    document.querySelector(".serv-create-modal > .serve-c-lab").innerText = "Invite must be supplied..."
                    document.querySelector(".serv-create-modal > .serve-c-lab").style.color = "red"
                    return
                }

                fetch("/app-api/join-server", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        invite: invite
                    })
                })
                    .then((d) => d.json())
                    .then((d) => {
                        if (d.joined) {
                            document.querySelectorAll(".modal").forEach(el => el.style.display = "none")
                            document.querySelector(".shade").style.display = "none"
                            modal.innerHTML = originalHTML;
                            createListeners();

                            sl_scroller.open("GET", "/app/widget/k1tBte9Ob");
                            sl_scroller.send();

                        } else if (d.already) {
                            // redirect/xhr to the serer instead of error message when servers load
                            document.querySelector(".serv-create-modal > .serve-c-lab").innerText = "you are already in this server!"
                            document.querySelector(".serv-create-modal > .serve-c-lab").style.color = "red"
                        } else {
                            document.querySelector(".serv-create-modal > .serve-c-lab").innerText = d.error;
                            document.querySelector(".serv-create-modal > .serve-c-lab").style.color = "red"
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                        document.querySelector(".serv-create-modal > .serve-c-lab").innerText = "Failed to join server. Try again later."
                        document.querySelector(".serv-create-modal > .serve-c-lab").style.color = "red"
                        return
                    })
            })
        })
    })

    document.querySelector(".serv-create-modal > .create-serv-btn").addEventListener("click", () => {
        modal.innerHTML = `
        <p class="serv-mo-t">Name your space</p>
        <p class="serv-mo-d">A name is essential to your space. Now your friends can know what its all about!</p>
        <p class="serve-c-lab">Space name</p>
        <input type="text" id="create-serv-nainp" placeholder="Your awesome space name">

        <div class="c-serv-footer">
        <p class="csv-f-back">Back</p>
        <button class="create-serv-confirm">Create</button>
        </div>
        `

        setTimeout(() => {
            document.querySelector(".serv-create-modal > .c-serv-footer > .csv-f-back").addEventListener("click", () => { modal.innerHTML = originalHTML; createListeners(); })

            let listener = document.querySelector(".serv-create-modal > .c-serv-footer > .create-serv-confirm").addEventListener("click", () => {
                const name = document.querySelector(".serv-create-modal > #create-serv-nainp").value;

                if (name.trim() == "") {
                    document.querySelector(".serv-create-modal > .serve-c-lab").innerText = "Name must be supplied..."
                    document.querySelector(".serv-create-modal > .serve-c-lab").style.color = "red"
                } else {
                    fetch("/app-api/create-server", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name: name
                        })
                    })
                        .then((d) => d.json())
                        .then((d) => {
                            if (d.error) {
                                document.querySelector(".serv-create-modal > .serve-c-lab").innerText = d.error;
                                document.querySelector(".serv-create-modal > .serve-c-lab").style.color = "red"
                            } else {
                                document.querySelectorAll(".modal").forEach(el => el.style.display = "none")
                                document.querySelector(".shade").style.display = "none"
                                modal.innerHTML = originalHTML;
                                createListeners();

                                sl_scroller.open("GET", "/app/widget/k1tBte9Ob");
                                sl_scroller.send();
                            }
                        })
                        .catch((e) => {
                            console.error(e);
                            document.querySelector(".serv-create-modal > .serve-c-lab").innerText = "an error occured... try again later"
                            document.querySelector(".serv-create-modal > .serve-c-lab").style.color = "red"
                        })
                }
            })

            listeners.push(listener);
        })
    })

}

document.querySelector(".shade").addEventListener("click", (e) => {
    document.querySelectorAll(".modal").forEach(el => el.style.display = "none")
    e.target.style.display = "none"

    modal.innerHTML = originalHTML;
    createListeners();
})

createListeners();