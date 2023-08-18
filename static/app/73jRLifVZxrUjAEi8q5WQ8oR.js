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
            tooltip.textContent = el.getAttribute('title');

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

        completed++;
    })
})

const awaitingAllElementsLoad = setInterval(() => {
    if (completed != 1) return // replace with required amount of elements, when correct, add else and hide loading screen

    document.querySelector(".versa-dftm-loads").style.opacity = "0"
    setTimeout(() => {
        document.querySelector(".versa-dftm-loads").style.display = "none"
    }, 200)
}, 1200)