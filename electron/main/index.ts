import { app, BrowserWindow, shell, ipcMain,
  nativeImage,
  Tray, Menu} from 'electron'
import { release } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { update } from './update'
import {createMyNotification, setGlobalStyle2App} from "../notification";
import {runEngine} from '../engine'

globalThis.__filename = fileURLToPath(import.meta.url)
globalThis.__dirname = dirname(__filename)

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let tray: Tray = null;
let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.mjs')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')
// console.log("process.env.DIST", process.env.DIST);

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    show: false,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    },
  })

  if (url) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })


  win.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault(); // Prevent the window from closing
      win?.hide(); // Hide the window
    }

    return false;
  });


  // Apply electron-updater
  update(win)

  const icon = nativeImage.createFromDataURL('data:image/png;base64,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')
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Exit TMEN',
      click: function() {
        app.quit();
      }
    }
  ])

  tray.setToolTip('token-tmen')
  tray.setContextMenu(contextMenu)

  tray.on('click', () => {
    win?.isVisible() ? win.hide() : win?.show();
  });

}

app.whenReady().then(() => {
  createWindow();
  runEngine();

  // ---------- set notification settings --------------
  setGlobalStyle2App();
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})




app.on('before-quit', () => app.isQuitting = true);


// Ensure a single instance of the app is running
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  // ... (rest of your app.whenReady() code)
}
