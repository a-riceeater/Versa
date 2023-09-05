const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

let updateWindow;
let appWindow;

const productionURL = "http://localhost:6969";

app.whenReady().then(() => {
    updateWindow = new BrowserWindow({
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
})

ipcMain.handle('open-app', async () => {
    updateWindow.close();  
    
    appWindow = new BrowserWindow({
        height: "90%",
        width: "90%",
        webPreferences: {
            devTools: true,
            nodeIntegration: true,
            contextIsolation: false
        },
        darkTheme: true
    })

    appWindow.loadURL(`${productionURL}/app/self`);
    appWindow.maximize();
})

ipcMain.handle('update-app', async () => {
    
})

ipcMain.handle("productionURL", async () => {
    return productionURL.toString();
})