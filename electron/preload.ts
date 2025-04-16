import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // Renderer to Main (send/invoke)
  startDownload: () => ipcRenderer.send("start-download"),
  quitAndInstall: () => ipcRenderer.send("quit-and-install"),

  // Main to Renderer (receive)
  onUpdateAvailable: (callback) =>
    ipcRenderer.on("update-available", (_event, value) => callback(value)),
  onDownloadProgress: (callback) =>
    ipcRenderer.on("download-progress", (_event, value) => callback(value)),
  onUpdateDownloaded: (callback) =>
    ipcRenderer.on("update-downloaded", (_event, value) => callback(value)),
  onUpdateError: (callback) =>
    ipcRenderer.on("update-error", (_event, value) => callback(value)),

  // Cleanup listeners (important!)
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

// You can also expose other Node.js modules securely if needed
// contextBridge.exposeInMainWorld('nodeAPI', {
//   versions: process.versions
// });
