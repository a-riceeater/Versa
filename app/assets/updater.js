const version = JSON.parse(require("fs").readFileSync(require("path").join(__dirname, "preferences.json"))).version;
let interval = 5;
let v;

const update = async () => {
    try {
        document.querySelector("#title").innerText = "Updating..."
        const status = await(await fetch(`http://localhost:6969/api/verify-version/${version}`)).json();
        console.dir(status);
        clearInterval(v);
    } catch (err) {
        setTimeout(update, interval * 1000);
        document.querySelector("#title").innerText = "Retrying in " + interval + "s"
        if (interval < 60) interval += 5;
    }
}

setTimeout(() => {
    update();
}, 1000);
