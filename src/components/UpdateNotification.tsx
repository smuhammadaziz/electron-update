// src/components/UpdateNotification.tsx
import React, { useState, useEffect } from 'react';

interface UpdateInfo {
  version: string;
  releaseNotes?: string; // Adjust based on actual info structure
  // Add other fields from 'info' object if needed
}

interface ProgressInfo {
  percent: number;
  // Add other fields like bytesPerSecond, total, transferred if needed
}

function UpdateNotification() {
  const [isVisible, setIsVisible] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [progressInfo, setProgressInfo] = useState<ProgressInfo | null>(null);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // --- Listeners setup ---
    const handleUpdateAvailable = (info: UpdateInfo) => {
      console.log('Update available:', info);
      setUpdateInfo(info);
      setIsVisible(true);
      setIsDownloaded(false); // Reset state if a new update comes while modal is open
      setProgressInfo(null);
      setErrorMessage(null);
    };

    const handleDownloadProgress = (progress: ProgressInfo) => {
      console.log('Download progress:', progress);
      setProgressInfo(progress);
    };

    const handleUpdateDownloaded = (info: UpdateInfo) => {
      console.log('Update downloaded:', info);
      setIsDownloaded(true);
      setProgressInfo(null); // Clear progress bar
    };

     const handleUpdateError = (message: string) => {
       console.error('Update error:', message);
       setErrorMessage(`Update Error: ${message}. Please try again later or restart the app.`);
       // Optionally hide progress/download buttons on error
       setIsVisible(true); // Keep modal open to show error
       setIsDownloaded(false);
       setProgressInfo(null);
     };

    // Register listeners using the exposed API from preload script
    window.electronAPI.onUpdateAvailable(handleUpdateAvailable);
    window.electronAPI.onDownloadProgress(handleDownloadProgress);
    window.electronAPI.onUpdateDownloaded(handleUpdateDownloaded);
    window.electronAPI.onUpdateError(handleUpdateError);


    // --- Cleanup function ---
    return () => {
      // Remove listeners when component unmounts to prevent memory leaks
      window.electronAPI.removeAllListeners('update-available');
      window.electronAPI.removeAllListeners('download-progress');
      window.electronAPI.removeAllListeners('update-downloaded');
      window.electronAPI.removeAllListeners('update-error');

    };
  }, []); // Empty dependency array ensures this runs only once on mount/unmount

  const startDownload = () => {
    setErrorMessage(null); // Clear previous errors
    setProgressInfo({ percent: 0 }); // Show progress bar immediately
    window.electronAPI.startDownload();
  };

  const restartApp = () => {
    window.electronAPI.quitAndInstall();
  };

  const closeNotification = () => {
    setIsVisible(false);
     // Optionally reset states if closed manually
     // setUpdateInfo(null);
     // setProgressInfo(null);
     // setIsDownloaded(false);
     // setErrorMessage(null);
  }

  if (!isVisible) {
    return null; // Don't render anything if not visible
  }

  // --- Render the modal using Tailwind CSS ---
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
          {isDownloaded ? 'Update Ready to Install' : 'Update Available'}
        </h2>

        {errorMessage && (
            <p className="text-red-500 text-sm mb-3">{errorMessage}</p>
        )}

        {updateInfo && !isDownloaded && !progressInfo && !errorMessage && (
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Version {updateInfo.version} is available. Do you want to download it now?
          </p>
        )}

        {progressInfo && !isDownloaded && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Downloading... {Math.round(progressInfo.percent)}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-width duration-150 ease-linear"
                style={{ width: `${progressInfo.percent}%` }}
              ></div>
            </div>
          </div>
        )}

        {isDownloaded && (
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The update has been downloaded. Restart the application to apply the changes.
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          {!isDownloaded && !progressInfo && !errorMessage && (
            <>
              <button
                onClick={closeNotification}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 text-sm font-medium"
              >
                Later
              </button>
              <button
                onClick={startDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
              >
                Download Now
              </button>
            </>
          )}
           {progressInfo && !isDownloaded && (
             <span className="text-sm text-gray-500">Downloading...</span> // Indicate download in progress
           )}
          {isDownloaded && (
            <button
              onClick={restartApp}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
            >
              Restart & Apply Update
            </button>
          )}
           {errorMessage && (
             <button
               onClick={closeNotification}
               className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 text-sm font-medium"
             >
               Close
             </button>
           )}
        </div>
      </div>
    </div>
  );
}

export default UpdateNotification;