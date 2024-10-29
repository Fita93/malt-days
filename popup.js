const keys = {
    days: 'days',
    lastSync: 'lastSyncDate'
}

document.addEventListener('DOMContentLoaded', async () => {
    const result = await chrome.storage.local.get([keys.days, keys.lastSync]);
    console.log(result);
    
    if (result) {
        renderDays(result[keys.days]);
        renderLastSyncDate(result[keys.lastSync])
    }
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentUrl = tabs[0].url;
    const scrapeButton = document.getElementById('scrapeButton');

    if (currentUrl.includes('malt.fr')) {
        scrapeButton.disabled = false;
    } else {
        scrapeButton.disabled = true;
        scrapeButton.textContent = 'Only works on Malt';
    }
});

document.getElementById('scrapeButton').addEventListener('click', async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const response = await new Promise((resolve, reject) => {
            chrome.tabs.sendMessage(tab.id, { action: "scrape" }, (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            });
        });

        if (response && response.days) {
            const syncDate = new Date().toLocaleDateString();
            // Save to storage only after receiving response
            await chrome.storage.local.set({
                [keys.days]: response.days,
                [keys.lastSync]: syncDate
            });
            renderDays(response.days);
            renderLastSyncDate(syncDate);
            console.log('Data saved:', response.days);
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').textContent = 'Error: Could not scrape or save data';
    }
});

const renderDays = (days) => {
    document.getElementById('result').textContent = days;
    document.getElementById('days').style.display = 'flex';
}

const renderLastSyncDate  = (date) => {
    document.getElementById(keys.lastSync).textContent = date; 
}