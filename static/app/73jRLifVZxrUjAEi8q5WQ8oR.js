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
        document.querySelectorAll(".lsl-serv-icon").forEach(el => {
            el.addEventListener("click", (e) => {})
            el.addEventListener("mouseover", (e) => {
            })
        })

        document.querySelector(".scroller.server-list-l > .section-sl-ser > .wrapper-js-sl").addEventListener("click", () => {
            document.querySelector(".shade").style.display = "block"
            document.querySelector(".serv-create-modal").style.display = "block"
        })
        
        completed++;
    })
})

const awaitingAllElementsLoad = setInterval(() => {
    if (completed != 1) return // replace with required amount of elements, when correct, add else and hide loading screen

    document.querySelector(".versa-dftm-loads").style.opacity = "0"
}, 1200)