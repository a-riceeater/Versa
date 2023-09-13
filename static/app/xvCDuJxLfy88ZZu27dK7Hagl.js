const w = setInterval(() => {
    try {
        fetch('/app-api/versa')
            .then((e) => {
                if (e.status == 200 || e.status == 304) {
                    vt.log('Connection', 'Connection status stable; Code', e.status)
                    document.querySelector('.versa-dftm-loads').style.opacity = '0'
                    setTimeout(() => {
                        document.querySelector('.versa-dftm-loads').style.display = 'none'
                        const a = setInterval(() => {
                            if (!socket.id) return

                            vt.log("WS", "Socket ID: " + socket.id)
                            clearInterval(a);
                            fetch("/socket-api/connect", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    id: socket.id
                                })
                            })
                                .then((d) => d.json())
                                .then((d) => {
                                    vt.log("WS", "Connected to WS")
                                })
                                .catch((err) => {
                                    console.error(err);
                                    const em = new ErrorModal();
                                    em.title = "Failed to connect"
                                    em.body = err;
                                    em.spawn()
                                })
                        }, 200)
                    }, 200)
                }
            })
            .catch((d) => {
                console.error(d)
                vt.log('Connection', 'Connection failed')
                document.querySelector('.versa-dftm-loads').style.opacity = '1'
                document.querySelector('.versa-dftm-loads').style.display = 'block'
                document.querySelector('.versa-dftm-loads > div > p').innerText =
                    'Connection Failed...'
            })
    } catch (d) {
        console.error(d)
        vt.log('Connection', 'Connection failed')
        document.querySelector('.versa-dftm-loads').style.opacity = '1'
        document.querySelector('.versa-dftm-loads').style.display = 'block'
        document.querySelector('versa-dftm-loads > div > p').innerText =
            'Connection Failed...'
    }
}, 10000)
