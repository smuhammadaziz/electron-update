"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // Renderer to Main (send/invoke)
  startDownload: () => electron.ipcRenderer.send("start-download"),
  quitAndInstall: () => electron.ipcRenderer.send("quit-and-install"),
  // Main to Renderer (receive)
  onUpdateAvailable: (callback) => electron.ipcRenderer.on("update-available", (_event, value) => callback(value)),
  onDownloadProgress: (callback) => electron.ipcRenderer.on("download-progress", (_event, value) => callback(value)),
  onUpdateDownloaded: (callback) => electron.ipcRenderer.on("update-downloaded", (_event, value) => callback(value)),
  onUpdateError: (callback) => electron.ipcRenderer.on("update-error", (_event, value) => callback(value)),
  // Cleanup listeners (important!)
  removeAllListeners: (channel) => electron.ipcRenderer.removeAllListeners(channel)
});
