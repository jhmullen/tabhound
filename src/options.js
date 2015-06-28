

function insertPicker() {
  jQuery('#datetimepicker').datetimepicker();
}

function hash(s){
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

function removeItem(item) {
  chrome.storage.sync.get({
    myList: []
  }, function(items) {
    var listFromStorage = items.myList;
    var index = listFromStorage.indexOf(item);
    if (index > -1) {
      listFromStorage.splice(index, 1);
    }
    chrome.storage.sync.set({
      myList: listFromStorage
    }, function() {
      refreshList(listFromStorage);
      var status = document.getElementById('status');
      status.textContent = 'Tab Deleted.';
      setTimeout(function() {
        status.textContent = '';
      }, 1500);
  });
});
}

function refreshList(newList) {
  var ul = document.getElementById('ul');
    ul.innerHTML = '';
    for (var i = 0; i < newList.length; i++) {
      var tab = newList[i];
      var tabhash = hash(tab);
      var listItem = document.createElement('li');
      listItem.innerHTML = tab + " ";
      listItem.setAttribute("id", tab);
      var deleteText = document.createTextNode('[x]');
      var deleteLink = document.createElement('a');
      deleteLink.setAttribute('href', '#');
      deleteLink.setAttribute('id', "del_" + tab);
      deleteLink.appendChild(deleteText);
      deleteLink.onclick = function () { removeItem(this.getAttribute('id').split('_')[1]); };
      listItem.appendChild(deleteLink);
      //item.appendChild(document.createTextNode(newList[i]));
      //item.appendChild(document.createTextNode("<a href='#'>[x]</a>"));
      ul.appendChild(listItem);
    }
  document.getElementById('list').appendChild(ul);
}

function save_options() {
  var opt = document.getElementById('opt').value;
  chrome.storage.sync.get({
    myList: []
  }, function(items) {
    var listFromStorage = items.myList;
    listFromStorage.push(opt);
    chrome.storage.sync.set({
      myList: listFromStorage
    }, function() {
      refreshList(listFromStorage);
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 1500);
    });
  });
}

function restore_options() {
  chrome.storage.sync.get({
    myList: []
  }, function(items) {
    refreshList(items.myList);
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

document.addEventListener('DOMContentLoaded', insertPicker);