/* ======================== THEME MODE ======================== */ 

// Optimized Theme Handler - Performance focused
(() => {
  let checkbox = null;
  let isInitialized = false;

  const initTheme = () => {
    if (isInitialized) return;
    
    checkbox = document.getElementById("checkbox");
    if (!checkbox) return;

    // Get saved theme or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = savedTheme || (prefersDark ? "dark" : "light");

    // Apply theme immediately to prevent flash
    document.documentElement.setAttribute("data-theme", theme);
    checkbox.checked = theme === "dark";

    // Save theme if not already saved
    if (!savedTheme) {
      localStorage.setItem("theme", theme);
    }

    // Add change listener
    checkbox.addEventListener("change", handleThemeChange, { passive: true });
    
    isInitialized = true;
  };

  const handleThemeChange = () => {
    const theme = checkbox.checked ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  };

  // Initialize immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();

/* ================================================================= */


/* ======================== LANGUAGE PICKER ======================== */ 

// Optimized Language Picker - Performance focused
(() => {
  let dropdown = null;
  let button = null;
  let picker = null;
  let isInitialized = false;

  const initLanguagePicker = () => {
    if (isInitialized) return;
    
    dropdown = document.querySelector('.dropdown');
    button = document.querySelector('.selected-language');
    picker = document.querySelector('.language-picker');
    
    if (!dropdown || !button || !picker) return;

    // Add click listener to button
    button.addEventListener('click', toggleDropdown, { passive: true });
    
    // Add global click listener for outside clicks
    document.addEventListener('click', handleOutsideClick, { passive: true });
    
    isInitialized = true;
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    const isOpen = dropdown.style.display === 'block';

    // Toggle dropdown visibility
    dropdown.style.display = isOpen ? 'none' : 'block';
    button.setAttribute('aria-expanded', !isOpen);
    picker.classList.toggle('active', !isOpen);
  };

  const handleOutsideClick = (event) => {
    if (!picker.contains(event.target)) {
      dropdown.style.display = 'none';
      button.setAttribute('aria-expanded', 'false');
      picker.classList.remove('active');
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguagePicker);
  } else {
    initLanguagePicker();
  }

  // Export function for external use
  window.toggleDropdown = toggleDropdown;
})();

/* ================================================================= */


/* ======================== HEADER SCROLL ======================== */ 

// Optimized Header Scroll - Performance focused
(() => {
  let lastScroll = 0;
  let header = null;
  let ticking = false;

  const initHeaderScroll = () => {
    header = document.querySelector("header.header");
    if (!header) return;

    // Throttled scroll handler
    window.addEventListener("scroll", handleScroll, { passive: true });
  };

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  };

  const updateHeader = () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 100) {
      // Scroll down - hide header
      header.classList.add("hide");
    } else {
      // Scroll up - show header
      header.classList.remove("hide");
    }

    lastScroll = currentScroll;
    ticking = false;
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderScroll);
  } else {
    initHeaderScroll();
  }
})();
/* ================================================================= */


/* ======================== MOBILE MENU ========================= */ 

// Optimized Mobile Menu - Performance focused
(() => {
  let menu = null;
  let openBtn = null;
  let closeBtn = null;
  let isInitialized = false;

  const initMobileMenu = () => {
    if (isInitialized) return;
    
    menu = document.querySelector(".mobile-menu");
    openBtn = document.querySelector(".mobile-menu-btn-open");
    closeBtn = document.querySelector(".mobile-menu-btn-close");

    if (!menu || !openBtn || !closeBtn) return;

    // Add event listeners
    openBtn.addEventListener("click", openMenu, { passive: true });
    closeBtn.addEventListener("click", closeMenu, { passive: true });
    document.addEventListener("click", handleOutsideClick, { passive: true });
    
    isInitialized = true;
  };

  const openMenu = (e) => {
    e.preventDefault();
    menu.classList.add("active");
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeMenu = (e) => {
    e.preventDefault();
    menu.classList.remove("active");
    document.body.style.overflow = ''; // Restore scroll
  };

  const handleOutsideClick = (e) => {
    if (
      menu.classList.contains("active") &&
      !menu.contains(e.target) &&
      !openBtn.contains(e.target)
    ) {
      closeMenu(e);
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
})();

/* ================================================================= */
