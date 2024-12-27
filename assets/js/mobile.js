// Change button text depending on to show or to hide the contents of filters
function menuClick() {
    let menuContent = document.getElementById('filterMenu');
    let button = document.getElementById('filtersShow');

    // Check if the device is mobile (screen width 768px or smaller)
    if (window.matchMedia("(max-width: 1200px)").matches) {
        if (menuContent.style.display === 'block') {
            menuContent.style.display = 'none';
            button.textContent = "Show Filters";
        } else {
            menuContent.style.display = 'block';
            button.textContent = "Hide Filters";
        }
    }
}