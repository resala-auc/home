document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementsByClassName('toggle-button')[0];
    const navbarLinks = document.getElementsByClassName('navbar-links')[0];
    const moreBtn = document.getElementById('moreBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const darkModeToggle = document.querySelector('.dark-mode-toggle');

    // Check for saved dark mode preference on load
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Navbar toggle for mobile
    if (toggleButton) {
        toggleButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (navbarLinks) {
                navbarLinks.classList.toggle('active');
            }
        });
    }

    // Dark mode toggle - only responds to clicks on the toggle itself
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling up
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
    }

    // Handle clicks on navbar links
    if (navbarLinks) {
        navbarLinks.addEventListener('click', function(event) {
            if (moreBtn && !moreBtn.contains(event.target)) {
                if (toggleButton) {
                    toggleButton.click();
                }
            }
        });
    }

    // Dropdown menu functionality
    function toggleDropdown(e) {
        e.preventDefault();
        if (dropdownMenu) {
            dropdownMenu.classList.toggle('show');
        }
    }

    if (moreBtn && dropdownMenu) {
        moreBtn.addEventListener('click', toggleDropdown);
        moreBtn.addEventListener('touchstart', toggleDropdown);

        moreBtn.addEventListener('mouseover', function() {
            dropdownMenu.classList.add('show');
        });

        moreBtn.addEventListener('mouseleave', function() {
            setTimeout(function() {
                if (!dropdownMenu.matches(':hover')) {
                    dropdownMenu.classList.remove('show');
                }
            }, 100);
        });

        dropdownMenu.addEventListener('mouseleave', function() {
            dropdownMenu.classList.remove('show');
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (moreBtn && dropdownMenu && 
            !moreBtn.contains(event.target) && 
            !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }

        if (navbarLinks && toggleButton &&
            !navbarLinks.contains(event.target) && 
            !toggleButton.contains(event.target)) {
            navbarLinks.classList.remove('active');
        }
    });
});