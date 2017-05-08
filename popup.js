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


var accessToken = localStorage.getItem('accessToken');

$(document).ready(function(){
    if(accessToken) {
        $('#til-form').show();
        $('#relogin').show();
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
        $('#til-form').show();
        $('#relogin').show();
    } else {
        $('#successNotification').hide();
        $('#errorNotification').show().text('Please enter accessToken before continuing');
    }
});

$('#save-til').on('click', function(e) {
    e.preventDefault();
    var code = $('textarea#code-snippet').val()
    var notes = $('textarea#notes').val()
    var tags = $('input[type="text"]#tags').val()
    if(code && notes) {
        $.ajax({
            url: 'https://til-server.herokuapp.com/api/tils',
            type: 'POST',
            dataType: 'json',
            beforeSend: function(xhr) {
                xhr.setRequestHeader ("Authorization", "Basic " + accessToken);
            },
            data: {
                "til": {
                    "tags": tags,
                    "snippet": code,
                    "notes": notes
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