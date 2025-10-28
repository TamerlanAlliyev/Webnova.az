/* ======================== THEME MODE ======================== */ 

// Optimized theme management with performance improvements
const initThemeManager = () => {
  const checkbox = document.getElementById("checkbox");
  if (!checkbox) return;

  // localStorage-dan mövzu götür
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    checkbox.checked = savedTheme === "dark";
  } else {
    // cihazın sistem mövzusuna bax
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = prefersDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    checkbox.checked = prefersDark;
  }

  // dəyişdiriləndə
  checkbox.addEventListener("change", () => {
    const theme = checkbox.checked ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  });
};

/* ================================================================= */


/* ======================== LANGUAGE PICKER ======================== */ 

// Optimized language picker with performance improvements
const initLanguagePicker = () => {
  const dropdown = document.querySelector('.dropdown');
  const button = document.querySelector('.selected-language');
  const picker = document.querySelector('.language-picker');
  
  if (!dropdown || !button || !picker) return;

  const toggleDropdown = () => {
    const isOpen = dropdown.style.display === 'block';
    
    // Toggle açılıb-bağlanma
    dropdown.style.display = isOpen ? 'none' : 'block';
    button.setAttribute('aria-expanded', !isOpen);
    
    // "active" class-ını toggle elə
    picker.classList.toggle('active', !isOpen);
  };

  // Event delegation for better performance
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  // Çöldə klik ediləndə bağlansın
  document.addEventListener('click', (e) => {
    if (!picker.contains(e.target)) {
      dropdown.style.display = 'none';
      button.setAttribute('aria-expanded', 'false');
      picker.classList.remove('active');
    }
  });
};

/* ================================================================= */


/* ======================== HEADER SCROLL ======================== */ 

// Optimized header scroll with performance improvements
const initHeaderScroll = () => {
  const header = document.querySelector("header.header");
  if (!header) return;

  let lastScroll = 0;
  let ticking = false;

  const updateHeader = () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScroll && currentScroll > 100) {
      // aşağı scroll → header gizlənir
      header.classList.add("hide");
    } else {
      // yuxarı scroll → header çıxır
      header.classList.remove("hide");
    }

    lastScroll = currentScroll;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
};
/* ================================================================= */


/* ======================== MOBILE MENU ========================= */ 

// Optimized mobile menu with performance improvements
const initMobileMenu = () => {
  const menu = document.querySelector(".mobile-menu");
  const openBtn = document.querySelector(".mobile-menu-btn-open");
  const closeBtn = document.querySelector(".mobile-menu-btn-close");

  if (!menu || !openBtn || !closeBtn) return;

  // Açma düyməsi
  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    menu.classList.add("active");
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  });

  // Bağlama düyməsi
  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    menu.classList.remove("active");
    document.body.style.overflow = ''; // Restore scroll
  });

  // Kənara kliklənəndə bağla
  document.addEventListener("click", (e) => {
    if (
      menu.classList.contains("active") &&
      !menu.contains(e.target) &&
      !openBtn.contains(e.target)
    ) {
      menu.classList.remove("active");
      document.body.style.overflow = ''; // Restore scroll
    }
  });

  // ESC key to close menu
  document.addEventListener("keydown", (e) => {
    if (e.key === 'Escape' && menu.classList.contains("active")) {
      menu.classList.remove("active");
      document.body.style.overflow = ''; // Restore scroll
    }
  });
};

/* ================================================================= */

// Initialize all layout components when DOM is ready
const initializeLayoutComponents = () => {
  initThemeManager();
  initLanguagePicker();
  initHeaderScroll();
  initMobileMenu();
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLayoutComponents);
} else {
  initializeLayoutComponents();
}