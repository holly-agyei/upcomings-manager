# Smart Opportunity Saver Chrome Extension

A Chrome extension that helps you save opportunities, ideas, and deadlines with voice input and Google Sheets integration.

## Features

- 🎤 Voice input with smart parsing
- 📝 Manual input form
- 📅 Deadline tracking
- 🔔 Notifications for upcoming deadlines
- 📊 Google Sheets integration
- 📱 Clean, modern UI

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
2. Name the first sheet "Opportunities"
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

## Usage

1. Click the extension icon in your Chrome toolbar
2. To add a new opportunity:
   - Fill in the form manually, or
   - Click the microphone icon and speak your opportunity (e.g., "AI scholarship due August 5th. Link is www.scholarships.ai")
3. View your saved opportunities in the "View All" tab
4. Filter opportunities by:
   - Upcoming
   - Past
   - All

## Voice Input Format

The extension can parse voice input in the following format:
- "Opportunity name. Additional notes. Due [date]. Link is [URL]"

Example:
- "AI scholarship. Machine learning competition. Due August 5th. Link is www.scholarships.ai"

## Notifications

You'll receive notifications:
- When a deadline is due today
- When a deadline is due tomorrow

## Development

The extension is built using:
- Chrome Extension Manifest V3
- Web Speech API for voice recognition
- Google Sheets API for data storage
- Chrome Notifications API for reminders

## License

MIT License 