"use strict";

function submit() {
    let failed = false;

    document.querySelectorAll(".text-inp").forEach(e => {
        if (e.value.trim() == "") return error(), failed = true;
    })

    if (failed) return
    fetch("/auth/create-account", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: document.getElementById("email_inp").value,
            username: document.getElementById("username_inp").value,
            password: document.getElementById("password_inp").value
        })
    })
}

function error() {
    document.querySelectorAll(".label").forEach(e => {
        let old = e.innerText;
        e.innerText = "all inputs are required..."

        setTimeout(() => {
            if (old == "ALL INPUTS ARE REQUIRED...") return;

            e.innerText = old
        }, 1500);
    })
}

document.querySelector("#confirm-button").addEventListener("click", submit);

document.querySelectorAll(".text-inp").forEach(e => {
    e.addEventListener("keyup", (e) => {
        if (e.key === "Enter") submit();
    })
})