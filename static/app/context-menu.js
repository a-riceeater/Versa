document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    document.querySelectorAll(".context-m").forEach(e => e.remove());

    switch (e.target.getAttribute("data-context-id")) {

        case "friend-button":
            const cm = new ContextMenu([
                {
                    title: "Message",
                    type: "default"
                },
                {
                    title: "Remove Friend",
                    type: "delete"
                }
            ], e);
    }
})

document.addEventListener("click", () => document.querySelectorAll(".context-m").forEach(e => e.remove()))

/**
 * The class to create a custom context menu
 */
class ContextMenu {
    element = null

    /**
     * 
     * @param {Array} buttons An array containg JSON objects which hold the information for each button
     * @param {Event} event The contextmenu event object, used to position contextmen
     */

    constructor(buttons, event) {
        this.element = document.createElement("div");
        this.element.classList.add("context-m");

        document.body.appendChild(this.element);

        buttons.forEach(button => {
            this.element.innerHTML += `
            <div class="cm-btn-o ${button.type}">
                ${button.title}
            </div>
            `

        })

        setTimeout(() => {
          this.element.childNodes.forEach(c => {
            c.addEventListener("click", (ev) => {
                alert("Ev")
            })
          })      
        })

        const x = event.pageX - event.target.offsetLeft;
        const y = event.pageY - event.target.offsetTop;

        this.element.style.top = event.pageY + "px";
        this.element.style.left = event.pageX + "px";

    }
}