let completed = 0;

const sl_scroller = new XMLHttpRequest();

sl_scroller.open("GET", "/app/user-serv-scroll-l");
sl_scroller.send();

sl_scroller.addEventListener("load", () => {
    completed++;
    document.querySelector(".server-list-l").innerHTML = sl_scroller.responseText;
    vt.log("XS-Loader", "Completed load #" + completed)
})

const awaitingAllElementsLoad = setInterval(() => {
    if (completed != 4) return // replace with required amount of elements, when correct, add else and hide loading screen
}, 1200)