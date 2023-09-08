document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    document.querySelectorAll(".context-m").forEach(e => e.remove());

    switch (e.target.getAttribute("data-context-id")) {

        case "friend-button":
            new ContextMenu([
                {
                    title: "Message",
                    type: "default",
                    callback: () => { }
                },
                {
                    title: "Remove Friend",
                    type: "delete",
                    callback: (ev) => {
                        fetch("/app-api/remove-friend", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                friend: e.target.getAttribute("data-friend")
                            })
                        })
                            .then((d) => d.json())
                            .then((d) => {
                                if (d.removed) {
                                    friendsMSQ.open("GET", "/app/widget/KjitLwgKq6AjPyLi28BSy7SXQ");
                                    friendsMSQ.send();
                                }
                            })
                            .catch((err) => {
                                const em = new ErrorModal();
                                em.title = "An error occured"
                                em.body = "Please try again later..."
                                em.spawn();

                                console.error(err);
                            })
                    }
                }
            ], e);
            break;
        case "serverl-button":
            new ContextMenu([
                {
                    title: "Leave Server",
                    type: "delete",
                    callback: () => {
                        fetch("/app-api/leave-server", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                server: e.target.getAttribute("data-id")
                            })
                        })
                            .then((d) => d.json())
                            .then((d) => {
                                //alert(d.left)
                                if (d.error || !d.left) {
                                    const em = new ErrorModal();
                                    em.title = "An error occured."
                                    em.body = d.error || "Please try again...";
                                    em.spawn();
                                }

                                if (d.left) {
                                    document.querySelectorAll(".tooltip-sli-sv-h").forEach(el => el.remove())
                                    sl_scroller.open("GET", "/app/widget/k1tBte9Ob");
                                    sl_scroller.send();
                                }
                            })
                            .catch((err) => {
                                alert(err);
                            })
                    }
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
            const option = document.createElement("div");
            option.classList.add("cm-btn-o");
            option.classList.add(button.type);
            option.innerHTML = button.title;

            if (button.callback) option.addEventListener("click", button.callback);

            this.element.appendChild(option);
        })


        // const x = event.pageX - event.target.offsetLeft;
        // const y = event.pageY - event.target.offsetTop; if offset is wanted

        this.element.style.top = event.pageY + "px";
        this.element.style.left = event.pageX + "px";
    }
}