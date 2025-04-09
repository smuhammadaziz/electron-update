// src/global.d.ts
export {};

declare global {
  interface Window {
    electronAPI: {
      startDownload: () => void;
      quitAndInstall: () => void;
      onUpdateAvailable: (callback: (info: any) => void) => void;
      onDownloadProgress: (callback: (progressInfo: any) => void) => void;
      onUpdateDownloaded: (callback: (info: any) => void) => void;
      onUpdateError: (callback: (errorMessage: string) => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}