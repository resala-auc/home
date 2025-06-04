// DOM elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-toggle__icon');
const navLinks = document.querySelectorAll('.nav__link');
const scrollLinks = document.querySelectorAll('[data-scroll]');

// Theme state
let currentTheme = 'light';

// Initialize theme
function initializeTheme() {
    // Check system preference for initial theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    currentTheme = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-color-scheme', currentTheme);
    updateThemeIcon(currentTheme);
}

// Update theme icon
function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Toggle theme
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-color-scheme', currentTheme);
    updateThemeIcon(currentTheme);
    // Add a subtle animation effect
    document.body.style.transition = 'background-color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

// Toggle mobile navigation
function toggleNavigation() {
    navMenu.classList.toggle('nav__menu--open');
    navToggle.classList.toggle('nav__toggle--open');
    // Update aria attributes for accessibility
    const isOpen = navMenu.classList.contains('nav__menu--open');
    navToggle.setAttribute('aria-expanded', isOpen);
    // Prevent body scroll when menu is open
    if (isOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close mobile navigation
function closeNavigation() {
    navMenu.classList.remove('nav__menu--open');
    navToggle.classList.remove('nav__toggle--open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

// Smooth scroll to section
function smoothScrollToSection(targetId) {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20; // Extra offset for better visual
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        // Update active nav link
        updateActiveNavLink(targetId);
        // Close mobile menu if open
        closeNavigation();
    }
}

// Handle scroll link clicks (for both navigation and CTA buttons)
function handleScrollLinkClick(event) {
    event.preventDefault();
    const targetId = event.target.getAttribute('data-scroll') ||
                     event.target.getAttribute('href').substring(1);
    if (targetId) {
        smoothScrollToSection(targetId);
    }
}

// Update active navigation link
function updateActiveNavLink(activeId = null) {
    // If activeId is provided, use it; otherwise determine from scroll position
    if (activeId) {
        navLinks.forEach(link => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('data-scroll') === activeId) {
                link.classList.add('nav__link--active');
            }
        });
        return;
    }

    // Determine active section from scroll position
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150; // Offset for header
    let activeSection = null;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            activeSection = sectionId;
        }
    });

    // Update nav links
    navLinks.forEach(link => {
        link.classList.remove('nav__link--active');
        if (link.getAttribute('data-scroll') === activeSection) {
            link.classList.add('nav__link--active');
        }
    });
}

// Header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 50) {
        if (currentTheme === 'dark') {
            header.style.background = 'rgba(38, 40, 40, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 253, 0.98)';
        }
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        if (currentTheme === 'dark') {
            header.style.background = 'rgba(38, 40, 40, 0.95)';
        } else {
            header.style.background = 'rgba(255, 255, 253, 0.95)';
        }
        header.style.boxShadow = 'none';
    }
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.event-card, .about-text');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Handle keyboard navigation
function handleKeyboardNavigation(event) {
    // Close mobile menu on Escape key
    if (event.key === 'Escape' && navMenu.classList.contains('nav__menu--open')) {
        closeNavigation();
    }

    // Toggle theme with Ctrl/Cmd + T
    if ((event.ctrlKey || event.metaKey) && event.key === 't') {
        event.preventDefault();
        toggleTheme();
    }
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Enhanced accessibility features
function enhanceAccessibility() {
    // Add skip link for screen readers
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    skipLink.style.left = '6px';
    skipLink.style.zIndex = '100000';
    skipLink.style.background = 'var(--color-primary)';
    skipLink.style.color = 'white';
    skipLink.style.padding = '8px';
    skipLink.style.textDecoration = 'none';
    skipLink.style.borderRadius = '4px';

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const main = document.getElementById('main');
        if (main) {
            main.focus();
            main.scrollIntoView({ behavior: 'smooth' });
        }
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Initialize entrance animations
function initializeEntranceAnimations() {
    const heroContent = document.querySelector('.hero__content');
    const heroVisual = document.querySelector('.hero__visual');

    if (heroContent && heroVisual) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroVisual.style.opacity = '0';
        heroVisual.style.transform = 'translateX(30px)';

        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroVisual.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
            heroVisual.style.opacity = '1';
            heroVisual.style.transform = 'translateX(0)';
        }, 100);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme on page load
    initializeTheme();

    // Initialize animations
    initializeAnimations();

    // Initialize accessibility features
    enhanceAccessibility();

    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Navigation toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleNavigation);
    }

    // All scroll links (navigation and CTA buttons)
    scrollLinks.forEach(link => {
        link.addEventListener('click', handleScrollLinkClick);
    });

    // Close navigation when clicking outside
    document.addEventListener('click', (event) => {
        if (navMenu && navToggle && !navMenu.contains(event.target) && !navToggle.contains(event.target)) {
            if (navMenu.classList.contains('nav__menu--open')) {
                closeNavigation();
            }
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);

    // Scroll events (throttled for performance)
    window.addEventListener('scroll', throttle(() => {
        updateActiveNavLink();
        handleHeaderScroll();
    }, 100));

    // Handle window resize
    window.addEventListener('resize', () => {
        // Close mobile menu on resize to larger screen
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('nav__menu--open')) {
            closeNavigation();
        }
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only update if user hasn't manually changed theme
        if (document.documentElement.getAttribute('data-color-scheme') === (e.matches ? 'light' : 'dark')) {
            currentTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-color-scheme', currentTheme);
            updateThemeIcon(currentTheme);
        }
    });

    // Set initial active nav link
    updateActiveNavLink();
});

// Initialize entrance animations on load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    initializeEntranceAnimations();
});

// Polyfill for smooth scrolling for older browsers
if (!CSS.supports('scroll-behavior', 'smooth')) {
    // Simple smooth scroll polyfill
    function smoothScrollPolyfill(target, duration = 500) {
        const targetElement = typeof target === 'string' ? document.getElementById(target) : target;
        if (!targetElement) return;

        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // Override smooth scroll function for older browsers
    window.smoothScrollToSection = function(targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            smoothScrollPolyfill(targetElement);
            updateActiveNavLink(targetId);
            closeNavigation();
        }
    };
}

// Error handling for missing elements
function safelyAddEventListener(element, event, handler) {
    if (element) {
        element.addEventListener(event, handler);
    } else {
        console.warn(`Element not found for event listener: ${event}`);
    }
}

// Expose necessary functions globally for debugging
window.ResalaAUC = {
    toggleTheme,
    smoothScrollToSection,
    updateActiveNavLink,
    closeNavigation
};