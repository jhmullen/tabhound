

//---------- UI Functions -------------

$(window).focus(function() {
   console.log('welcome (back)');
   restoreTabs();
});

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
  document.getElementById('clearall').onclick = function () { 
    chrome.storage.sync.clear(function() {
      restoreTabs();
    });
  };
  document.onkeydown=function(){
    if(window.event.keyCode=='13'){
      saveTabs();
    }
  }
}

//-------------------------------------

//---------- Tab Management -----------

function removeTab(tab) {
  console.log('trying to remove' + tab);
  chrome.storage.sync.get({
    myTabs: []
  }, function(items) {
    var tabsFromStorage = items.myTabs;
    console.log(tabsFromStorage);
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
  deleteLink.setAttribute('id', "del___" + tab);
  deleteLink.appendChild(deleteText);
  deleteLink.onclick = function () { removeTab(this.getAttribute('id').split('___')[1]); };
  listItem.appendChild(deleteLink);
  return listItem;
}

function buildList(newList) {
  var ul = document.getElementById('ul');
  ul.innerHTML = '';
  for (var i = newList.length - 1; i >= 0 ; i--) {
    var tab = newList[i];
    listItem = buildListItem(tab);
    ul.appendChild(listItem);
  }
}

//-------------------------------------

//------- Chrome Local Storage --------

function saveTabs() {
  var opt = document.getElementById('opt').value;
  if (opt != "") {
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
  } else {
    showStatus('Cannot add blank');
  }
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


