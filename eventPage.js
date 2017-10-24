console.log('====================================');
console.log('eventPage.js');
console.log('====================================');

// Get Storage.local
chrome.storage.local.get(null, obj => console.log('Get Storage.local: ', obj));

// Get Alarms
chrome.alarms.getAll(obj => console.log('Get Alarms: ', obj));

/* 
 * Add Listeners
 */
chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log(`Alarm [${Date.now()}]`, alarm);
    var opt = { type: "basic", title: "Remindrs!", message: `${alarm.name}`, iconUrl: "./favicon.png" };
    notification(opt);
});

chrome.storage.onChanged.addListener(function(storageObj) {
    console.log('Storage updated: ', storageObj.reminders);
});

chrome.browserAction.onClicked.addListener(function() {
    console.log('Browser Action: clicked');
    openOrFocusOptionsPage();
});

/*
 * Helpers
 */
function notification(opt) {
    chrome.notifications.create('', opt, () =>
      console.log("Notification created: ", opt)
    );
}

function openOrFocusOptionsPage() {
    const optionsURL = chrome.extension.getURL("options.html");

    chrome.tabs.query({}, function(tabs) {
        let found = false;
        // search all tabs for matching optionsURL
        for (let i = 0; i < tabs.length; i++) {
            if (optionsURL == tabs[i].url) {
                found = true;
                chrome.tabs.update(tabs[i].id, { "selected": true });
            }
        }
        // if options tab not open, open it.
        if (found == false) { 
            chrome.tabs.create({ url: "options.html "}); 
        }
    });
}