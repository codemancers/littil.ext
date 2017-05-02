chrome.tabs.executeScript({
    code: "window.getSelection().toString();"
}, function(selection) {
    document.getElementById("code-snippet").value = selection[0];
});

// $('#attach-repo').hide()
// $('#til-form').hide()

$(document).ready(function(){
    // var accessToken = localStorage.getItem('accessToken')
    localStorage.removeItem('accessToken')
    var accessToken = window.btoa('<access_token>:X')
    localStorage.setItem('accessToken', accessToken)
    // if(accessToken) {
    //     $('#attach-repo').hide()
    //     $('#til-form').show()
    // } else {
    //     $('#attach-repo').show()
    //     $('#til-form').hide()
    // }

    $('#attach-repo').submit(function() {
        var url = $('input[type="text"]#git-url').val()
        $.ajax({
            xhrFields: {
                withCredentials: true
            },
            url: 'https://til-server.herokuapp.com/api/git_repos',
            method: 'POST',
            dataType: 'json',
            data: {
                git_repo: {
                    url: url
                }
            },
             headers: {
                'Authorization': 'Basic ' + localStorage.getItem('accessToken')
            }
        })
        .done(function() {
            console.log('Til Repo added')
        })
        .fail(function(error) {
            console.log(error)
        })
    })

    // Ignore for now
    // $('#til-form').submit(function() {
    //     var code = $('textarea#code-snippet').val()
    //     var notes = $('textarea#notes').val()
    //     var tags = $('input[type="text"]#tags').val()
    //     $.ajax({
    //         url: 'http://til-server.herokuapp.com/',
    //         method: 'POST',
    //         data: {
    //             code_snippet: code,
    //             notes: notes,
    //             tags: tags
    //         },
    //         headers: {
    //             "Authorization": accessToken
    //         }
    //     })
    //     .done(function() {
    //         alert('success')
    //     })
    //     .fail(function() {
    //         alert('failed')
    //     })
    // })
})
