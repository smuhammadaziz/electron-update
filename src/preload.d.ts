// src/preload.d.ts

// Define the structure of the UpdateInfo and ProgressInfo objects
// based on their usage in UpdateNotification.tsx
interface UpdateInfo {
    version: string;
    releaseNotes?: string;
    // Add other fields if needed based on the actual data sent from main process
}

interface ProgressInfo {
    percent: number;
    // Add other fields if needed
}

// Define the interface for the API exposed via preload script
export interface IElectronAPI {
    onUpdateAvailable: (callback: (info: UpdateInfo) => void) => void;
    onDownloadProgress: (callback: (progress: ProgressInfo) => void) => void;
    onUpdateDownloaded: (callback: (info: UpdateInfo) => void) => void;
    onUpdateError: (callback: (message: string) => void) => void;
    removeAllListeners: (channel: string) => void;
    startDownload: () => void;
    quitAndInstall: () => void;
}

// Augment the global Window interface
declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}

// Export an empty object to make this file a module (if needed by tsconfig)
export { }; 