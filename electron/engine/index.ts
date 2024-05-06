import {createMyNotification} from "../notification";
import notification from "../notification/Notification";
import {BrowserWindow, BrowserWindowConstructorOptions, ipcMain, screen} from "electron";
import path from "path";
import {Defined} from "@definedfi/sdk";

let window: BrowserWindow | null = null;
const CONTAINER_WIDTH = 400;
const FETCH_INTERVAL = 1000 * 20;
const DEFINED_API_KEY = '9dac34318cfc1c1a3d4f7dd76a126a7d17882d81';
let ready = false;
const sdk = new Defined(DEFINED_API_KEY || "");

const createWindow = () => {

    const display = screen.getPrimaryDisplay();
    const displayWidth = display.workArea.x + display.workAreaSize.width;
    const displayHeight = display.workArea.y + display.workAreaSize.height;
    let options: BrowserWindowConstructorOptions = {};

    options.height = displayHeight;
    options.width = CONTAINER_WIDTH;
    options.alwaysOnTop = true;
    options.skipTaskbar = true;
    options.resizable = false;
    options.minimizable = false;
    options.fullscreenable = false;
    options.focusable = false;
    options.show = false;
    options.frame = false;
    options.transparent = true;
    options.x = displayWidth - CONTAINER_WIDTH;
    options.y = displayHeight - 30;
    options.webPreferences = {
        nodeIntegration: true,
        contextIsolation: false,
    }; // Since we're not displaying untrusted content
       // (all links are opened in a real browser window), we can enable this.

    window = new BrowserWindow(options);
    window.setVisibleOnAllWorkspaces(true);
    window.loadURL(path.join("file://", __dirname, "../../electron/notification/container.html"));
    window.setIgnoreMouseEvents(true, { forward: true });
    window.showInactive();
    window.webContents.openDevTools({ mode: 'detach' });

    ipcMain.on("make-clickable", (e: any) => {
        window && window.setIgnoreMouseEvents(false);
    });

    ipcMain.on("make-unclickable", (e: any) => {
        window && window.setIgnoreMouseEvents(true, { forward: true });
    });

    window.webContents.on("did-finish-load", () => {
        ready = true;
    });

    window.on("closed", () => {
        window = null;
    });
}

const fetchPrices = () => {
    setInterval(() => {

        sdk.queries
            .price({
                inputs: [
                    { address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", networkId: 1 }, // WBTC
                    { address: "0x576e2bed8f7b46d34016198911cdf9886f78bea7", networkId: 1 }, // MAGA
                    { address: "0x7039cd6d7966672f194e8139074c3d5c4e6dcf65", networkId: 1 }, // str
                    { address: "0x79ebc9a2ce02277a4b5b3a768b1c0a4ed75bd936", networkId: 56 }, // cg
                    { address: "0x6982508145454ce325ddbe47a25d4ec3d2311933", networkId: 1 }, // pepe
                    { address: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5", networkId: 1399811149 }, // mew
                    { address: "AVLhahDcDQ4m4vHM4ug63oh7xc8Jtk49Dm5hoe9Sazqr", networkId: 1399811149 }, // slm
                ],
            })
            .then((response) => {
                console.log("update", response);
                window?.webContents.send('update-message', response.getTokenPrices)
            });


    }, FETCH_INTERVAL);
}


export const runEngine = () => {
    createWindow();
    fetchPrices();
/*
    setTimeout(() => {
        window?.webContents.send('update-message', {
            token0: 0.33
        })
    }, 2000);
*/
}
