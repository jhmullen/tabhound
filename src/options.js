

function insertPicker() {
  jQuery('#datetimepicker').datetimepicker();
}

function save_options() {
  var opt = document.getElementById('opt').value;
  chrome.storage.sync.set({
    myOpt: opt
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    myOpt: 'default'
  }, function(items) {
    document.getElementById('opt').value = items.myOpt;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

document.addEventListener('DOMContentLoaded', insertPicker);