export {};

declare global {
  interface Window {
    electronAPI: {
      startDownload: () => void;
      quitAndInstall: () => void;

      onUpdateAvailable: (callback: (info: any) => void) => void;
      onDownloadProgress: (callback: (progress: any) => void) => void;
      onUpdateDownloaded: (callback: (info: any) => void) => void;
      onUpdateError: (callback: (error: any) => void) => void;

      removeAllListeners: (channel: string) => void;
    };
  }
}
