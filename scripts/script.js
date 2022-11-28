// When the user clicks on <div>, open the popup
function displayTooltip(text) {
    var popup = document.getElementById("myPopup");
    popup.innerHTML = '<video controls width=\"320\" height=\"150\" style="border-radius: 7px; margin-bottom: 10px; border-color: white; border-style: solid; border-width: 2px;"> <source src=\"assets/videos/dave.mp4\" type=\"video/mp4\"></video>';
    popup.append(text);
    popup.classList.toggle("show");
}