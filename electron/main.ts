import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import squirrelStartup from 'electron-squirrel-startup';

// ES module compatibility: create __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (squirrelStartup) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  // Determine the correct preload path
  const preloadPath = app.isPackaged
    ? path.join(__dirname, 'preload.mjs')
    : path.join(__dirname, 'preload.js');

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false, // Don't show until ready
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '../public/icon.ico'),
  });

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the index.html from the app directory
    const indexPath = path.join(process.resourcesPath, 'app.asar', 'dist', 'index.html');
    console.log('Loading from:', indexPath);
    console.log('__dirname:', __dirname);
    console.log('resourcesPath:', process.resourcesPath);
    console.log('isPackaged:', app.isPackaged);
    
    mainWindow.loadFile(indexPath).catch(err => {
      console.error('Error loading file:', err);
      // Fallback: try alternative path
      const fallbackPath = path.join(__dirname, '../dist/index.html');
      console.log('Trying fallback path:', fallbackPath);
      mainWindow?.loadFile(fallbackPath).catch(err2 => {
        console.error('Fallback also failed:', err2);
        mainWindow?.loadURL('data:text/html,<h1>Error loading app</h1><p>' + err2.message + '</p>');
      });
    });
  }

  // Show window when ready to prevent white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Log any errors for debugging
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
