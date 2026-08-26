const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    kiosk: true, // Enables full kiosk mode (restricts Alt+Tab, OS overlays, etc on most systems)
    alwaysOnTop: true,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Load the running Next.js app
  mainWindow.loadURL('http://localhost:3000');

  // Prevent window from closing easily
  mainWindow.on('close', (e) => {
    // Ideally we would send an IPC message here to check if exam is submitted
    // But for a simple kiosk, we just prevent standard close via Alt+F4
    const response = require('electron').dialog.showMessageBoxSync(mainWindow, {
      type: 'question',
      buttons: ['Yes', 'No'],
      title: 'Confirm Exit',
      message: 'Are you sure you want to exit the exam environment? If you have not submitted, your progress will be lost.'
    });
    if (response !== 0) {
      e.preventDefault();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  // Block dangerous global shortcuts
  const shortcutsToBlock = [
    'CommandOrControl+Tab',
    'Alt+Tab', // Doesn't always work on Windows depending on OS level, but kiosk: true handles it
    'CommandOrControl+Shift+Esc',
    'CommandOrControl+Alt+Delete',
    'Alt+F4',
    'CommandOrControl+W',
  ];

  shortcutsToBlock.forEach(shortcut => {
    try {
      globalShortcut.register(shortcut, () => {
        console.log(`${shortcut} blocked.`);
      });
    } catch (e) {
      console.warn(`Could not register ${shortcut}`);
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
