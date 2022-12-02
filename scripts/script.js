var isIE = /msie\s|trident/i.test(window.navigator.userAgent);
if (isIE) {
  window.location.href = "./unsupported.html";
}


// When the user clicks on <div>, open the popup
function displayTooltip(id, text, media) {
    var popup = document.getElementById(id);

    if (media) {
        popup.innerHTML = media;
        popup.append(document.createElement('br'));
    }

    textDiv = document.createElement('div');
    textDiv.innerHTML = text;
    textDiv.style.fontWeight = 'bold';
    popup.append(textDiv);

    popup.classList.toggle("show");
}