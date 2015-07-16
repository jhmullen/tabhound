
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function passLinkToOptions() {
  getCurrentTabUrl(function(url) {
    chrome.storage.sync.get({
      myTabs: []
    }, function(items) {
      var tabsFromStorage = items.myTabs;
      var epoch = String((new Date).getTime());
      tabsFromStorage.push(url);
      chrome.storage.sync.set({
        myTabs: tabsFromStorage
      }, function() {
        chrome.runtime.openOptionsPage();
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("savelink").onclick = passLinkToOptions;
});
