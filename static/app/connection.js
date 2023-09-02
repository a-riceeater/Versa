const connectionInterval = setInterval(() => {
    try {
        fetch("/app-api/versa")
            .then((d) => {
                if (d.status == 200 || d.status == 304) {
                    vt.log("Connection", "Connection status stable; Code", d.status);
                    document.querySelector(".versa-dftm-loads").style.opacity = "0"
                    setTimeout(() => {
                        document.querySelector(".versa-dftm-loads").style.display = "none"
                    }, 200)
                }
            })
            .catch((err) => {
                console.error(err);
                vt.log("Connection", "Connection failed");
                document.querySelector(".versa-dftm-loads").style.opacity = "1"
                document.querySelector(".versa-dftm-loads").style.display = "block"
                document.querySelector(".versa-dftm-loads > div > p").innerText = "Connection Failed..."
            })
    } catch (err) {
        console.error(err);
        vt.log("Connection", "Connection failed");
        document.querySelector(".versa-dftm-loads").style.opacity = "1"
        document.querySelector(".versa-dftm-loads").style.display = "block"
        document.querySelector("versa-dftm-loads > div > p").innerText = "Connection Failed..."
    }
}, 10 * 1000);