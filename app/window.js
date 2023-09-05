const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')

app.whenReady().then(() => {
    const updateWindow = new BrowserWindow({
        width: 350,
        height: 500,
        webPreferences: {
            devTools: true,
            nodeIntegration: true,
            contextIsolation: false
        },
        frame: false,
        darkTheme: true
    })

    updateWindow.loadFile(path.join(__dirname, "updates.html"));
}) // replace with dev url

ipcMain.handle('open-window', async () => {
     
})

ipcMain.handle('update-app', async () => {
    
})