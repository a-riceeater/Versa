const { app, BrowserWindow } = require('electron')
const path = require('path')

// win.loadFile('update.html')
app.whenReady().then(() => {
    const updateWindow = new BrowserWindow({
        width: 350,
        height: 500,
        webPreferences: {
            devTools: true
        },
        frame: false,
        darkTheme: true
    })

    updateWindow.loadFile(path.join(__dirname, "updates.html"));
}) // replace with dev url