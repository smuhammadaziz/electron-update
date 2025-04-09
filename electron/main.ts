import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

// Configure logging
log.transports.file.resolvePath = () => path.join(app.getPath('userData'), 'logs/main.log');
log.info('App starting...');

// Disable GPU Acceleration for Windows 7 (Optional)
// if (process.platform === 'win32' && release().startsWith('6.1')) {
//   app.disableHardwareAcceleration()
// }

// Set application name for Windows 10+ notifications (Optional)
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null = null
const viteDevServerUrl = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'), // Change icon path
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Use the compiled preload script
      // nodeIntegration: false, // Keep false for security
      // contextIsolation: true, // Keep true for security
    },
  })

  // --- Auto Update Setup ---
  // Run update checks only in production
  if (app.isPackaged) {
    // Configuration (optional, defaults are usually good)
    autoUpdater.logger = log; // Use electron-log for updater events
    autoUpdater.autoDownload = false; // We want to show a modal first

    // --- Check for updates ---
    // VERY IMPORTANT: Checking every minute is *highly* discouraged.
    // It hits GitHub's servers frequently and uses user resources.
    // Check on startup and then maybe every few hours.
    // Example: Check on startup
    autoUpdater.checkForUpdatesAndNotify().catch(err => {
        log.error('Error checking for updates', err);
    });

    // Example: Check every 4 hours (more reasonable)
    // setInterval(() => {
    //   log.info('Checking for update (interval)...');
    //   autoUpdater.checkForUpdates().catch(err => {
    //       log.error('Error checking for updates interval', err);
    //   });
    // }, 4 * 60 * 60 * 1000); // 4 hours in milliseconds

    // --- Listener for update available ---
    autoUpdater.on('update-available', (info) => {
      log.info('Update available:', info);
      // Send message to renderer process to show modal
      win?.webContents.send('update-available', info);
    });

    // --- Listener for download progress ---
    autoUpdater.on('download-progress', (progressInfo) => {
      log.info('Download progress:', progressInfo);
      // Send progress to renderer process
      win?.webContents.send('download-progress', progressInfo);
    });

    // --- Listener for update downloaded ---
    autoUpdater.on('update-downloaded', (info) => {
      log.info('Update downloaded:', info);
      // Send message to renderer to show 'Install & Restart' button
      win?.webContents.send('update-downloaded', info);
    });

    // --- Listener for update errors ---
     autoUpdater.on('error', (err) => {
       log.error('Error in auto-updater:', err);
       win?.webContents.send('update-error', err.message); // Inform renderer
     });

    // --- IPC Handlers for Renderer Actions ---
    ipcMain.on('start-download', () => {
      log.info('User initiated download');
      autoUpdater.downloadUpdate().catch(err => {
        log.error('Error starting download:', err);
        win?.webContents.send('update-error', `Error starting download: ${err.message}`);
      });
    });

    ipcMain.on('quit-and-install', () => {
      log.info('User initiated quit and install');
      setImmediate(() => { // Ensures response is sent before quitting
         autoUpdater.quitAndInstall(true, true); // silent=true, forceRunAfter=true
      });
    });
  }
  // --- End Auto Update Setup ---

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (viteDevServerUrl) {
    win.loadURL(viteDevServerUrl)
    // Optional: Open DevTools in dev mode
    win.webContents.openDevTools()
  } else {
    // win.loadFile('dist/index.html') // Correct path in production build
     win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

   win.on('closed', () => {
     win = null
   })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Use 'whenReady' instead of 'ready' for async operations
app.whenReady().then(createWindow)