# Quant Expense Tracker - Electron Desktop App

## Setup After Cloning

After cloning this repository on a new machine (Windows, Linux, or Mac):

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Supabase credentials:
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_URL`

3. **You're ready!** Run `npm run electron:dev` to test.

## Development

To run the app in development mode:

```bash
npm run electron:dev
```

This opens the app in a desktop window with DevTools for debugging.

## Building Windows Installer

To create a Windows `.exe` installer:

```bash
npm run electron:build:win
```

**Build time:** Approximately 2-5 minutes depending on your system.

**Output:** The installer will be in the `release/` folder:
- `Quant Expense Tracker Setup 1.0.0.exe`

## Installing on Windows

### First Time Installation
1. Build the installer (see above) or get it from releases
2. Run `Quant Expense Tracker Setup 1.0.0.exe`
3. Follow the installation wizard
4. Launch from desktop or start menu

### Updating to New Version
**Important:** Always uninstall the old version first!

1. Go to Windows Settings → Apps
2. Find "Quant Expense Tracker" and uninstall it
3. Optionally delete: `C:\Users\[YourUsername]\AppData\Local\Programs\Quant Expense Tracker`
4. Install the new version

## Requirements

- Node.js and npm installed (for building)
- Internet connection (app connects to Supabase)

## Distribution

Once built, you can distribute the `.exe` file to Windows users. They can:
1. Download the installer
2. Run it
3. Follow the installation wizard
4. Launch the app from desktop or start menu

The app will work like a native Windows application but still connects to your Supabase backend.
