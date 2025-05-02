// Google Sheets API setup
const SPREADSHEET_ID = '1f5ZcCWC715RtUQBmshzSIBMVTufEZP1e7gZwVROcckA';
const SHEET_NAME = 'Sheet1';

console.log('Background script loaded');

// Check for upcoming deadlines
chrome.alarms.create('checkDeadlines', {
    periodInMinutes: 60 // Check every hour
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'checkDeadlines') {
        checkUpcomingDeadlines();
    }
});

// Check for deadlines that are due today or tomorrow
async function checkUpcomingDeadlines() {
    try {
        const opportunities = await getOpportunitiesFromSheets();
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        opportunities.forEach(opportunity => {
            if (!opportunity.deadline) return;

            const deadline = new Date(opportunity.deadline);
            const timeDiff = deadline - now;
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            if (daysDiff === 0) {
                showNotification(`Today's deadline: ${opportunity.name}`);
            } else if (daysDiff === 1) {
                showNotification(`Tomorrow's deadline: ${opportunity.name}`);
            }
        });
    } catch (error) {
        console.error('Error checking deadlines:', error);
    }
}

// Show Chrome notification
function showNotification(message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: 'Opportunity Saver',
        message: message,
        priority: 2
    });
}

// Get opportunities from Google Sheets
async function getOpportunitiesFromSheets() {
    try {
        const token = await getAuthToken();
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:E`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch opportunities');
        }

        const data = await response.json();
        return parseSheetData(data.values || []);
    } catch (error) {
        console.error('Error getting opportunities:', error);
        throw error;
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background script received message:', request);

    if (request.action === 'saveOpportunity') {
        console.log('Processing save opportunity request...');
        
        // Validate the opportunity data
        if (!request.opportunity || !request.opportunity.name) {
            console.error('Invalid opportunity data');
            sendResponse({ success: false, error: 'Invalid opportunity data' });
            return true;
        }

        saveToGoogleSheets(request.opportunity)
            .then(() => {
                console.log('Successfully saved to Google Sheets');
                sendResponse({ success: true });
            })
            .catch(error => {
                console.error('Error saving to Google Sheets:', error);
                sendResponse({ 
                    success: false, 
                    error: error.message || 'Failed to save to Google Sheets'
                });
            });
        return true; // Will respond asynchronously
    }

    if (request.action === 'getOpportunities') {
        console.log('Processing get opportunities request...');
        getOpportunitiesFromSheets()
            .then(opportunities => {
                console.log('Successfully fetched opportunities:', opportunities);
                sendResponse({ success: true, opportunities });
            })
            .catch(error => {
                console.error('Error fetching opportunities:', error);
                sendResponse({ 
                    success: false, 
                    error: error.message || 'Failed to fetch opportunities'
                });
            });
        return true; // Will respond asynchronously
    }
});

// Save opportunity to Google Sheets
async function saveToGoogleSheets(opportunity) {
    console.log('Starting saveToGoogleSheets...');
    try {
        console.log('Getting auth token...');
        const token = await getAuthToken();
        console.log('Got auth token:', !!token);
        
        const values = [
            [
                opportunity.timestamp,
                opportunity.name,
                opportunity.notes,
                opportunity.deadline,
                opportunity.link
            ]
        ];

        console.log('Sending request to Google Sheets API...');
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:E:append?valueInputOption=USER_ENTERED`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    values: values
                })
            }
        );

        console.log('Google Sheets API response status:', response.status);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Google Sheets API error:', errorData);
            throw new Error(errorData.error?.message || `Failed to save opportunity (${response.status})`);
        }

        const responseData = await response.json();
        console.log('Save successful:', responseData);
        return true;
    } catch (error) {
        console.error('Error in saveToGoogleSheets:', error);
        throw error;
    }
}

// Parse sheet data into opportunity objects
function parseSheetData(values) {
    if (!values || values.length === 0) return [];

    // If there's no header row, return empty array
    if (values.length === 1) return [];

    const headers = ['timestamp', 'name', 'notes', 'deadline', 'link'];
    return values.slice(1).map(row => {
        const opportunity = {};
        headers.forEach((header, index) => {
            opportunity[header] = row[index] || '';
        });
        return opportunity;
    });
}

// Get OAuth token
async function getAuthToken() {
    console.log('Getting auth token...');
    return new Promise((resolve, reject) => {
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError) {
                console.error('Auth error:', chrome.runtime.lastError);
                reject(new Error(chrome.runtime.lastError.message));
                return;
            }
            if (!token) {
                console.error('No token received');
                reject(new Error('Failed to get authentication token'));
                return;
            }
            console.log('Successfully got auth token');
            resolve(token);
        });
    });
} 