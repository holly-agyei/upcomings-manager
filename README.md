# Smart Opportunity Saver Chrome Extension

A Chrome extension that helps you save opportunities, ideas, and deadlines with Google Sheets integration.

## Installation

Currently, the extension is available in two ways:

1. **Developer Mode Installation** (Recommended for testing/development):
   - Follow the setup instructions below
   - Load the extension in Chrome's developer mode
   - This requires enabling developer mode in Chrome

2. **Chrome Web Store** (Coming Soon):
   - The extension will soon be available on the Chrome Web Store
   - This will provide one-click installation
   - No developer mode required

## Features

- 📝 Clean, modern input form
- 📅 Deadline tracking
- 🔔 Smart notifications for approaching deadlines
- 📊 Google Sheets integration
- 📱 Responsive, accessible UI

## Setup Instructions

### 1. Google Cloud Project Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Sheets API
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Chrome Extension" as the application type
   - Add your extension ID (you can get this from chrome://extensions in developer mode)
   - Download the client configuration

### 2. Google Sheets Setup

1. Create a new Google Sheet
2. Name the first sheet "Sheet1"
3. Add the following headers in row 1:
   - Timestamp
   - Name
   - Notes
   - Deadline
   - Link
4. Copy the Sheet ID from the URL (it's the long string between /d/ and /edit)

### 3. Extension Setup

1. Update the following in `manifest.json`:
   - Replace `YOUR_CLIENT_ID` with your OAuth client ID
   - Update the extension icons (create an `icons` folder with 16x16, 48x48, and 128x128 PNG icons)

2. Update the following in `background.js`:
   - Replace `YOUR_SPREADSHEET_ID` with your Google Sheet ID

### 4. Load the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the extension directory
4. The extension will appear in your Chrome toolbar

Note: When installed in developer mode, you'll see a "Developer mode" warning. This is normal and won't affect the extension's functionality.

## Usage

1. Click the extension icon in your Chrome toolbar
2. To add a new opportunity:
   - Fill in the form with the opportunity details
   - Required fields are marked with an asterisk (*)
   - Add optional notes, deadline, and link
3. View your saved opportunities in the "View All" tab
4. Filter opportunities by:
   - Upcoming
   - Past
   - All

## Notifications

The extension automatically checks for approaching deadlines every hour and will notify you:
- When a deadline is due today
- When a deadline is due tomorrow

Notifications appear as Chrome desktop notifications with:
- The extension's icon
- Title: "Opportunity Saver"
- Clear message indicating which opportunity is due

## Development

The extension is built using:
- Chrome Extension Manifest V3
- Google Sheets API for data storage
- Chrome Notifications API for reminders
- Modern CSS with responsive design
- Accessible HTML structure with ARIA attributes

## License

MIT License 