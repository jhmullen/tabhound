

function insertPicker() {
  jQuery('#datetimepicker').datetimepicker();
}

function updateList(newList) {
  var ul = document.getElementById('ul');
    ul.innerHTML = '';
    for (var i = 0; i < newList.length; i++) {
      var item = document.createElement('li');
      item.appendChild(document.createTextNode(newList[i]));
      ul.appendChild(item);
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
      updateList(listFromStorage);
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
    updateList(items.myList);
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

document.addEventListener('DOMContentLoaded', insertPicker);