/*
    Elijah Bantugan
    MIT License

    modals.js
*/

const modal = document.querySelector(".serv-create-modal");
let listeners = [];

const originalHTML = `

<p id="serv-mo-t">Create a space</p>
        <p class="serv-mo-d">A space is where you and your friends or co-workers can discuss projects, or just chat.</p>

        <div class="create-serv-btn serv-btn">
            <span class="serv-btn-content">Create your own space</span>
            <span class="serv-btn-arrow">
                <img src="/right-arrow.webp" alt="&#8594">
            </span>
        </div>

        <div class="join-serv-btn serv-btn">
            <span class="serv-btn-content">Join a space</span>
            <span class="serv-btn-arrow">
                <img src="/right-arrow.webp" alt="&#8594">
            </span>
        </div>`.trim();

document.querySelector(".serv-create-modal > .create-serv-btn").addEventListener("click", (e) => {
    modal.innerHTML = `
    <p class="serv-mo-t">Name your space</p>
    <p class="serv-mo-d">A name is essential to your space. Now your friends can know what its all about!</p>
    <p class="serve-c-lab">Space name</p>
    <input type="text" id="create-serv-nainp" placeholder="Your awesome space name">

    <div class="c-serv-footer">
    <button class="create-serv-confirm">Confirm</button>
    </div>
    `

    setTimeout(() => {
        let listener = document.querySelector(".serv-create-modal > .c-serv-footer > .create-serv-confirm").addEventListener("click", (e) => {
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

document.querySelector(".shade").addEventListener("click", (e) => {
    document.querySelectorAll(".modal").forEach(el => el.style.display = "none")
    e.target.style.display = "none"
})