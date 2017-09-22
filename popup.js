chrome.tabs.executeScript({
    code: "window.getSelection().toString();"
}, function(selection) {
    document.getElementById("code-snippet").value = selection[0];
});

$('#til-form').hide();
$('#signin-form').hide();
$('#successNotification').hide();
$('#errorNotification').hide();
$('#relogin').hide();
$('#orgs').hide();
$('#editMenu').hide();

var accessToken = localStorage.getItem('accessToken');

$('#home').on('click', function() {
  window.location.reload();
});

$('#editMenu').on('click', function() {
  $('form').hide();
  fetchOrgs();
});

function renderOrgs(orgs) {
  const savedOrgs = JSON.parse(localStorage.getItem('orgs'));
  const ids = orgs.map(function(org) { return org.id });
  const matched = ids.map(function(id) {
    if (savedOrgs.indexOf(id.toString()) > -1) {
      return id;
    }
  });
  function ifChecked(id) {
    if (matched.indexOf(id) > -1) {
      return 'checked';
    }
    return '';
  };
  const checkboxes = orgs.map(function(org) {
    return ('<input type="checkbox" '+ifChecked(org.id)+' class="orgs_option" value='+org.id+ ' />' + org.name);
  });
  $('#orgs_inputs').html(checkboxes);
}

function fetchOrgs() {
  $.ajax({
    url: 'http://www.littil.io/api/orgs',
    type: 'GET',
    beforeSend: function(xhr) {
      xhr.setRequestHeader ("Authorization", "Basic " + localStorage.getItem('accessToken'));
    }
  })
  .done(function(response) {
    $('#orgs').show();
    renderOrgs(response.data)
  })
}

function postTil(orgId, tilData) {
  $.ajax({
    url: 'http://www.littil.io/api/orgs/'+ orgId +'/tils',
    type: 'POST',
    dataType: 'json',
    beforeSend: function(xhr) {
      xhr.setRequestHeader ("Authorization", "Basic " + localStorage.getItem('accessToken'));
    },
    data: {
      "til": {
        "tags": tilData.tags,
        "snippet": tilData.code,
        "notes": tilData.notes
      }
    }
  })
  .done(function() {
    $("#til-form")[0].reset();
    $('#errorNotification').hide();
    $('#successNotification').show().text('TIL Saved');
  })
  .fail(function(response) {
    $('#successNotification').hide();
    $('#errorNotification').show().text('Something went wrong, probably your accessToken expired!!');
  })
}

$(document).ready(function(){
  if(accessToken) {
    $('#til-form').show();
    $('#relogin').show();
    $('#editMenu').show();
  } else {
    $('#signin-form').show();
  }
});

$('#relogin').on('click', function(e) {
  e.preventDefault();
  localStorage.removeItem('accessToken');
  $("#til-form")[0].reset();
  $("#signin-form")[0].reset();
  $('#signin-form').show();
  $('#til-form').hide();
  location.reload()
})


$('#signin-btn').on('click', function(e) {
  e.preventDefault();
  var accessTokenInp = $('input[type="text"]#accessToken').val()

  if(accessTokenInp) {
    localStorage.setItem('accessToken', btoa(accessTokenInp+':X'));
    $('#errorNotification').hide();
    $('#successNotification').show().text('accessToken saved');
    $('#signin-form').hide();
    setTimeout(function() {$('#successNotification').fadeOut('slow')}, 5000)
    fetchOrgs();
  } else {
    $('#successNotification').hide();
    $('#errorNotification').show().text('Please enter accessToken before continuing');
  }
});

$('#save-til').on('click', function(e) {
  e.preventDefault();
  var code = $('textarea#code-snippet').val();
  var notes = $('textarea#notes').val();
  var tags = $('input[type="text"]#tags').val();
  if(code && notes) {
    selectedOrgs = JSON.parse(localStorage.getItem('orgs'));
    if (selectedOrgs.length === 0) {
      $('#errorNotification').show().text('Please select the organization to post to.');
    }
    selectedOrgs.forEach(function(orgId) { postTil(orgId, {code: code, notes: notes, tags: tags}) });
  } else {
    $('#errorNotification').show().text('Code and Notes are required fields');
  }
});

$('#relogin').on('click', function(e) {
  e.preventDefault();
  localStorage.removeItem('accessToken');
  $('#signin-form').show();
  $('#til-form').hide();
});

$('#orgs').on('submit', function(e) {
  e.preventDefault();
  var options = document.querySelectorAll('.orgs_option');
  var selectedOrgs = Object.keys(options).map(function(opt) {
      if (options[opt].checked) {
        return options[opt].value;
      }
  }).filter(function(opt) { return typeof opt !== 'undefined'})
  localStorage.setItem('orgs', JSON.stringify(selectedOrgs));
  $('#til-form').show();
  $('#orgs').hide();
  $('#relogin').show();
  $('#successNotification').show().text('Organizations saved');
  setTimeout(function() {$('#successNotification').fadeOut('slow')}, 5000)
})