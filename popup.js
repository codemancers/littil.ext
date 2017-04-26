chrome.tabs.executeScript({
    code: "window.getSelection().toString();"
}, function(selection) {
    document.getElementById("code-snippet").value = selection[0];
});