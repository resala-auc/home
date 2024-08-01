document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementsByClassName('toggle-button')[0];
    const navbarLinks = document.getElementsByClassName('navbar-links')[0];
    const moreBtn = document.getElementById('moreBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');

    // Toggle the visibility of navbar links when the toggle button is clicked
    toggleButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Toggle button clicked');
        navbarLinks.classList.toggle('active');
    });

    // Handle clicks on navbar links
    navbarLinks.addEventListener('click', function(event) {
        console.log('Navbar item clicked');
        
        // Check if the clicked item is not the "More" tab
        if (!moreBtn.contains(event.target)) {
            // Toggle the visibility of navbar links
            toggleButton.click();
        }
    });

    // Toggle dropdown menu visibility when "More" tab is clicked or touched
    function toggleDropdown(e) {
        e.preventDefault();
        dropdownMenu.classList.toggle('show');
    }

    moreBtn.addEventListener('click', toggleDropdown);
    moreBtn.addEventListener('touchstart', toggleDropdown);

    // Show the dropdown menu when "More" tab is hovered over
    moreBtn.addEventListener('mouseover', function() {
        dropdownMenu.classList.add('show');
    });

    // Hide the dropdown menu when the mouse leaves "More" tab or the dropdown menu
    moreBtn.addEventListener('mouseleave', function() {
        setTimeout(function() {
            if (!dropdownMenu.matches(':hover')) {
                dropdownMenu.classList.remove('show');
            }
        }, 100); // Delay to allow cursor to move into the dropdown menu
    });

    dropdownMenu.addEventListener('mouseleave', function() {
        dropdownMenu.classList.remove('show');
    });

    // Close the dropdown menu if clicking outside of it
    document.addEventListener('click', function(event) {
        if (!moreBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }

        // Hide the navbar links if clicking outside of it
        if (!navbarLinks.contains(event.target) && !toggleButton.contains(event.target)) {
            navbarLinks.classList.remove('active');
        }
    });
});
