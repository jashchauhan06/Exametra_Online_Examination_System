const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Start window in standard mode
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    kiosk: false, 
    alwaysOnTop: false,
    fullscreen: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Track lockdown state
  let isLockdown = false;

  const enableLockdown = () => {
    if (isLockdown) return;
    isLockdown = true;
    console.log("Enabling strict exam lockdown mode...");
    mainWindow.setKiosk(true);
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
    mainWindow.setContentProtection(true); // Block screenshots
    
    // Register global shortcuts to block ONLY when in lockdown
    const shortcutsToBlock = [
      'CommandOrControl+Tab',
      'Alt+Tab',
      'CommandOrControl+Shift+Esc',
      'CommandOrControl+Alt+Delete',
      'Alt+F4',
      'CommandOrControl+W',
      'PrintScreen'
    ];
    shortcutsToBlock.forEach(shortcut => {
      try {
        globalShortcut.register(shortcut, () => console.log(`${shortcut} blocked.`));
      } catch (e) {}
    });
  };

  const disableLockdown = () => {
    if (!isLockdown) return;
    isLockdown = false;
    console.log("Disabling lockdown mode (free navigation)...");
    mainWindow.setKiosk(false);
    mainWindow.setAlwaysOnTop(false);
    mainWindow.setContentProtection(false);
    globalShortcut.unregisterAll();
  };

  const checkUrlForLockdown = (url) => {
    // URL pattern for taking exam: http://localhost:3000/exam/[id]
    // Note: It's NOT /exams/ (with an s), which is the exam bank/details
    if (url.includes('/exam/') && !url.includes('/exams/')) {
      enableLockdown();
    } else {
      disableLockdown();
    }
  };

  mainWindow.webContents.on('did-navigate-in-page', (event, url) => checkUrlForLockdown(url));
  mainWindow.webContents.on('did-navigate', (event, url) => checkUrlForLockdown(url));

  // Load the running Next.js app with retry logic
  const loadApp = () => {
    mainWindow.loadURL('http://localhost:3000').catch((err) => {
      console.log('Waiting for Next.js to start, retrying in 2s...');
      setTimeout(loadApp, 2000);
    });
  };
  loadApp();

  // Prevent window from closing easily if in lockdown
  mainWindow.on('close', (e) => {
    if (isLockdown) {
      const response = require('electron').dialog.showMessageBoxSync(mainWindow, {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm Exit',
        message: 'Are you sure you want to exit the exam environment? If you have not submitted, your progress will be lost.'
      });
      if (response !== 0) {
        e.preventDefault();
      }
    }
  });
}

app.whenReady().then(() => {
  createWindow();

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
