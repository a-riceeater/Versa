/*
    Elijah Bantugan
    MIT License
    
    vtools.js
*/

const vt = {
    log: function (a, ...l) {
        let b = "";
        l.forEach(c => b += " " + c);
        console.log(`%c[${a}]`, "color: purple", b);
    },
    createRandomId: () => {
        const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        let result = "r-";

        for (let i = 0; i < 5; i++) {
            for (let i = 0; i < 7; i++) {
                result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            }

            if (i != 4) result += "-"
        }

        return result;
    }
}

class ErrorModal {
    title = "An error occured."
    body = "Error details will appear here."
    callback = null

    __modal = document.createElement("div")

    spawn = function (cb) {
        this.__modal.classList.add("dft-err-mod")
        this.__modal.classList.add("modal")
        this.__modal.id = vt.createRandomId();

        this.__modal.innerHTML = `
        <p class="err-mod-title">${this.title}</p>
        <p class="err-mod-body">${this.body}</p>

        <div class="dft-err-footer">
            <button class="err-mod-close">Okay</button>
        </div>
        `

        this.__modal.style.display = "block"

        document.querySelector(".shade").style.display = "block"
        document.body.appendChild(this.__modal);

        setTimeout(() => {
            document.querySelector("#" + this.__modal.id + " > .dft-err-footer > .err-mod-close").addEventListener("click", () => {
                this.__modal.remove();
                document.querySelector(".shade").style.display = "none";
                if (cb) cb();
            })
        })
    }

    hide = function () {
        this.__modal.style.display = "none"
        document.querySelector(".shade").style.display = "none"
    }

    remove = function () {
        this.__modal.remove();
        document.querySelector(".shade").style.display = "none";
    }
}