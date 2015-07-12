

//---------- UI Functions -------------

function insertPicker() {
  jQuery('#datetimepicker').datetimepicker();
}

function showStatus(msg) {
  var status = document.getElementById('status');
  status.textContent = msg;
  setTimeout(function() {
    status.textContent = '';
  }, 1500);
}

function clearTextFieldInput() {
  var opt = document.getElementById('opt');
  opt.value = "";
  opt.focus();
}

function initializePage() {
  document.addEventListener('DOMContentLoaded', restoreTabs);
  document.addEventListener('DOMContentLoaded', insertPicker);
  document.getElementById('save').addEventListener('click', saveTabs);
  document.getElementById('opt').addEventListener('click', function() {this.select();});
  document.onkeydown=function(){
    if(window.event.keyCode=='13' && document.getElementById('opt').value != ""){
      saveTabs();
    }
  }
}

//-------------------------------------

//---------- Tab Management -----------

function removeTab(tab) {
  chrome.storage.sync.get({
    myTabs: []
  }, function(items) {
    var tabsFromStorage = items.myTabs;
    var index = tabsFromStorage.indexOf(tab);
    if (index > -1) {
      tabsFromStorage.splice(index, 1);
    }
    chrome.storage.sync.set({
      myTabs: tabsFromStorage
    }, function() {
      buildList(tabsFromStorage);
      showStatus('Tab Deleted');
    });
  });
}

function buildListItem(tab) {
  var listItem = document.createElement('li');
  listItem.innerHTML = tab + " ";
  listItem.setAttribute("id", tab);
  var deleteText = document.createTextNode('[x]');
  var deleteLink = document.createElement('a');
  deleteLink.setAttribute('href', '#');
  deleteLink.setAttribute('id', "del_" + tab);
  deleteLink.appendChild(deleteText);
  deleteLink.onclick = function () { removeTab(this.getAttribute('id').split('_')[1]); };
  listItem.appendChild(deleteLink);
  return listItem;
}

function buildList(newList) {
  var ul = document.getElementById('ul');
  ul.innerHTML = '';
  for (var i = 0; i < newList.length; i++) {
    var tab = newList[i];
    listItem = buildListItem(tab);
    ul.appendChild(listItem);
  }
}

//-------------------------------------

//------- Chrome Local Storage --------

function saveTabs() {
  var opt = document.getElementById('opt').value;
  chrome.storage.sync.get({
    myTabs: []
  }, function(items) {
    var tabsFromStorage = items.myTabs;
    tabsFromStorage.push(opt);
    chrome.storage.sync.set({
      myTabs: tabsFromStorage
    }, function() {
      buildList(tabsFromStorage);
      clearTextFieldInput();
      showStatus('Options saved.');
    });
  });
}

function restoreTabs() {
  chrome.storage.sync.get({
    myTabs: []
  }, function(items) {
    buildList(items.myTabs);
  });
}

//-------------------------------------

initializePage();


