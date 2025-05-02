// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing elements...');
    
    // DOM Elements
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const submitBtn = document.getElementById('submit-btn');
    const viewFilter = document.getElementById('view-filter');
    const opportunitiesList = document.getElementById('opportunities-list');

    // Form elements
    const opportunityName = document.getElementById('opportunity-name');
    const notes = document.getElementById('notes');
    const deadline = document.getElementById('deadline');
    const link = document.getElementById('link');

    console.log('Elements initialized:', {
        submitBtn: !!submitBtn,
        opportunityName: !!opportunityName,
        notes: !!notes,
        deadline: !!deadline,
        link: !!link
    });

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}-tab`) {
                    content.classList.add('active');
                }
            });

            if (targetTab === 'view') {
                loadOpportunities();
            }
        });
    });

    // Save opportunity
    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('Save button clicked');
        console.log('Form values:', {
            name: opportunityName.value,
            notes: notes.value,
            deadline: deadline.value,
            link: link.value
        });
        
        if (!opportunityName.value) {
            showNotification('Please enter an opportunity name', 'error');
            return;
        }

        const opportunity = {
            timestamp: new Date().toISOString(),
            name: opportunityName.value,
            notes: notes.value,
            deadline: deadline.value,
            link: link.value
        };

        console.log('Sending opportunity:', opportunity);

        try {
            console.log('Sending message to background script...');
            chrome.runtime.sendMessage({
                action: 'saveOpportunity',
                opportunity: opportunity
            }, response => {
                console.log('Received response:', response);
                if (chrome.runtime.lastError) {
                    console.error('Runtime error:', chrome.runtime.lastError);
                    showNotification('Error: ' + chrome.runtime.lastError.message, 'error');
                    return;
                }
                if (response && response.success) {
                    console.log('Save successful');
                    clearForm();
                    showNotification('Opportunity saved successfully!');
                    if (document.querySelector('.tab[data-tab="view"]').classList.contains('active')) {
                        loadOpportunities();
                    }
                } else {
                    console.error('Save failed:', response);
                    showNotification(response?.error || 'Failed to save opportunity', 'error');
                }
            });
        } catch (error) {
            console.error('Error in save process:', error);
            showNotification('Error saving opportunity: ' + error.message, 'error');
        }
    });

    // Load opportunities
    async function loadOpportunities() {
        try {
            const response = await chrome.runtime.sendMessage({ action: 'getOpportunities' });
            if (chrome.runtime.lastError) {
                throw new Error(chrome.runtime.lastError.message);
            }
            if (response && response.opportunities) {
                displayOpportunities(response.opportunities);
            } else {
                throw new Error('Failed to load opportunities');
            }
        } catch (error) {
            console.error('Error loading opportunities:', error);
            showNotification('Error loading opportunities', 'error');
        }
    }

    // Display opportunities
    function displayOpportunities(opportunities) {
        opportunitiesList.innerHTML = '';
        const now = new Date();
        
        opportunities.forEach(opp => {
            const item = document.createElement('div');
            item.className = 'opportunity-item';
            
            const deadline = opp.deadline ? new Date(opp.deadline).toLocaleDateString() : 'No deadline';
            
            item.innerHTML = `
                <h3>${opp.name}</h3>
                <p>${opp.notes || ''}</p>
                <p class="deadline">Deadline: ${deadline}</p>
                ${opp.link ? `<p><a href="${opp.link}" target="_blank">${opp.link}</a></p>` : ''}
            `;
            
            opportunitiesList.appendChild(item);
        });
    }

    // Clear form
    function clearForm() {
        opportunityName.value = '';
        notes.value = '';
        deadline.value = '';
        link.value = '';
    }
});

// Notification function (outside DOMContentLoaded since it's used by other scripts)
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }, 100);
} 