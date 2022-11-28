// When the user clicks on <div>, open the popup
function displayTooltip(text, media) {
    var popup = document.getElementById("myTooltip");
    // popup.innerHTML = '<video controls width=\"480\" height=\"225\" style="border-radius: 7px; margin-bottom: 10px; border-color: white; border-style: solid; border-width: 2px;"> <source src=\"assets/videos/dave.mp4\" type=\"video/mp4\"></video>';
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