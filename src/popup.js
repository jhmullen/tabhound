
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
  chrome.storage.sync.get({
    myTabs: []
  }, function(items) {
    var tabsFromStorage = items.myTabs;
    var epoch = String((new Date).getTime());
    tabsFromStorage.push(epoch);
    chrome.storage.sync.set({
      myTabs: tabsFromStorage
    }, function() {
      chrome.runtime.openOptionsPage();
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  /*getCurrentTabUrl(function(url) {
    document.getElementById("myurl").innerHTML = url
  });*/
  document.getElementById("savelink").onclick = passLinkToOptions;
});
