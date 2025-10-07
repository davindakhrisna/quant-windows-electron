# Quick Build Instructions

## To Build Windows Installer

Run this command to create a Windows .exe installer:

```bash
npm run electron:build:win
```

**Build time:** Approximately 2-5 minutes depending on your system.

**Output:** The installer will be in the `release/` folder:
- `Quant Expense Tracker Setup 1.0.0.exe`

## To Test in Development

Run this command to test the Electron app without building:

```bash
npm run electron:dev
```

This opens the app in a desktop window with DevTools for debugging.

## Requirements

- Node.js and npm installed
- All dependencies installed (`npm install` already done)
- Internet connection (for Supabase)

## Distribution

Once built, you can distribute the `.exe` file to Windows users. They can:
1. Download the installer
2. Run it
3. Follow the installation wizard
4. Launch the app from desktop or start menu

The app will work like a native Windows application but still connects to your Supabase backend.
