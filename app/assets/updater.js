(async () => {
    const { ipcRenderer } = require("electron");

    const version = JSON.parse(require("fs").readFileSync(require("path").join(__dirname, "preferences.json"))).version;
    let interval = 5;
    let v;
    const productionURL = await ipcRenderer.invoke("productionURL");

    const update = async () => {
        try {
            document.querySelector("#title").innerText = "Updating..."
            const status = await (await fetch(`${productionURL}/api/verify-version/${version}`)).json();
            console.dir(status);
            clearInterval(v);

            if (status == true || status == "true") {
                document.querySelector("#title").innerText = "Starting..."
                setTimeout(() => {
                    console.log("%c[App]", "color: purple", "Starting app...")
                    ipcRenderer.invoke("open-app")
                }, 1500)

            }
        } catch (err) {
            setTimeout(update, interval * 1000);
            document.querySelector("#title").innerText = "Retrying in " + interval + "s"
            if (interval < 60) interval += 5;
        }
    }

    setTimeout(() => {
        update();
    }, 1000);
})();