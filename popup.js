chrome.tabs.executeScript({
    code: "window.getSelection().toString();"
}, function(selection) {
    document.getElementById("code-snippet").value = selection[0];
});

$(document).ready(function(){
    $('#til-form').submit(function() {
        var code = $('textarea#code-snippet').val()
        var notes = $('textarea#notes').val()
        var tags = $('input[type="text"]#tags').val()
        $.ajax({
            url: 'http://localhost:3000/',
            method: 'POST',
            data: {
                code_snippet: code,
                notes: notes,
                tags: tags
            }
        })
        .done(function() {
            alert('success')
        })
        .fail(function() {
            alert('failed')
        })
    })
})
