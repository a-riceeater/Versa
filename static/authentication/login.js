"use strict";

function submit() {
    let failed = false;
    document.getElementById("confirm-button").innerHTML = `
    <div class="dot bounce1"></div>
    <div class="dot bounce2"></div>
    <div class="dot bounce3"></div>
    `

    document.querySelectorAll(".text-inp").forEach(e => {
        if (e.value.trim() == "") return error(), failed = true;
    })

    if (failed) return

    fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: document.getElementById("email_inp").value,
            password: document.getElementById("password_inp").value
        })
    })
        .then((d) => d.json())
        .then((d) => {
            if (d.success) window.location = "/app/self"
            else {
                document.getElementById("confirm-button").innerHTML = "Confirm"

                document.querySelectorAll(".label").forEach(e => {
                    e.innerText = "email/password is invalid"
                    e.style.color = "red"
                })
            }
        })
        .catch((err) => {
            console.error(err);
            document.getElementById("confirm-button").innerHTML = "Confirm"

            document.querySelectorAll(".label").forEach(e => {
                let old = e.innerText;
                e.innerText = "an error occured. try again later"
                e.style.color = "red"

                setTimeout(() => {
                    if (old == "AN ERROR OCCURED. TRY AGAIN LATER") return;

                    e.innerText = old
                    e.style.color = "white"
                }, 2500);
            })
        })
}

document.querySelector("#confirm-button").addEventListener("click", submit);

document.querySelectorAll(".text-inp").forEach(e => {
    e.addEventListener("keyup", (e) => {
        if (e.key === "Enter") submit();
    })
})

function error() {
    document.getElementById("confirm-button").innerHTML = "Confirm"

    document.querySelectorAll(".label").forEach(e => {
        let old = e.innerText;
        e.innerText = "all inputs are required..."
        e.style.color = "red"

        setTimeout(() => {
            if (old == "ALL INPUTS ARE REQUIRED...") return;

            e.innerText = old
            e.style.color = "white"
        }, 2500);
    })
}
