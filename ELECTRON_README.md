# Electron Desktop App Setup

This project has been successfully configured to build as an Electron desktop application for Windows.

## Quick Start

### Development Mode

To run the app in Electron development mode:

```bash
npm run electron:dev
```

This will start the Vite dev server and launch the Electron app with DevTools open.

### Building for Windows

To build a Windows installer (.exe):

```bash
npm run electron:build:win
```

The installer will be created in the `release` folder as `Quant Expense Tracker Setup 1.0.0.exe`.

## What's Included

### Files Created

- **`electron/main.ts`** - Electron main process (creates the app window)
- **`electron/preload.ts`** - Preload script for secure IPC communication
- **`electron.d.ts`** - TypeScript definitions for Electron API
- **`public/icon.ico`** - Application icon for Windows

### Configuration Updates

- **`package.json`** - Added Electron scripts and build configuration
- **`vite.config.ts`** - Configured Vite to work with Electron
- **`.gitignore`** - Added Electron build output directories

## Features

- ✅ Desktop application with native window
- ✅ Connects to Supabase (requires internet connection)
- ✅ All existing functionality preserved
- ✅ Windows installer with desktop shortcut
- ✅ Custom application icon
- ✅ Professional installer with options
- ✅ Auto-launch on startup (optional)

## Build Configuration

The build configuration is in `package.json` under the `build` key:

```json
{
  "appId": "com.quant.expense-tracker",
  "productName": "Quant Expense Tracker",
  "win": {
    "target": "nsis",
    "icon": "public/icon.ico"
  }
}
```

### Customization Options

You can customize:
- **App name and ID** - Change `productName` and `appId`
- **Icon** - Replace `public/icon.ico` with your own
- **Installer options** - Modify the `nsis` configuration
- **Target platforms** - Add `mac` or `linux` configurations

## Available Scripts

- **`npm run electron:dev`** - Run in development mode
- **`npm run electron:build`** - Build for all platforms
- **`npm run electron:build:win`** - Build for Windows only
- **`npm run build`** - Build the web app and Electron files

## Security

The app uses:
- **Context Isolation** - Enabled for security
- **Node Integration** - Disabled in renderer
- **Preload Script** - For safe IPC communication

## Important Notes

### Internet Connection Required
- The app requires an internet connection to connect to Supabase
- All data is stored in Supabase (cloud-based)
- Offline functionality can be added later if needed

### Supabase Configuration
- Supabase credentials are configured in `src/integrations/supabase/client.ts`
- Make sure your Supabase URL and anon key are set correctly
- The app will work exactly like the web version but in a native window

### Icon Customization
- Current icon is converted from the favicon
- For a professional look, replace `public/icon.ico` with a custom icon
- Recommended size: 256x256 or larger
- Use tools like [ICO Convert](https://icoconvert.com/) to create .ico files

## Troubleshooting

### Build Fails
- Make sure all dependencies are installed: `npm install`
- Clear the build cache: `rm -rf dist dist-electron release`
- Try building again

### App Won't Start
- Check if port 8080 is available
- Look for errors in the terminal
- Try running `npm run build` first to check for compilation errors

### Icon Not Showing
- Make sure `public/icon.ico` exists
- Rebuild the app after changing the icon
- Windows may cache icons - try restarting

## Distribution

After building, you'll find the installer in the `release` folder:
- **`Quant Expense Tracker Setup 1.0.0.exe`** - NSIS installer
- Users can install it like any other Windows application
- The installer will create desktop and start menu shortcuts

## Future Enhancements

Possible additions:
- Auto-update functionality
- Offline mode with local database sync
- System tray integration
- Custom menu bar
- Keyboard shortcuts
- Multiple window support
