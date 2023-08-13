"use strict";

function submit() {
     
}

document.querySelector("#confirm-button").addEventListener("click", submit);

document.querySelectorAll(".text-inp").forEach(e => {
    e.addEventListener("keyup", (e) => {
        if (e.key === "Enter") submit();
    })
})