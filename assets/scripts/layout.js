/* ======================== THEME MODE ======================== */ 

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("checkbox");

  // localStorage-dan mövzu götür
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "dark") checkbox.checked = true;
  } else {
    // cihazın sistem mövzusuna bax
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");
    localStorage.setItem("theme", prefersDark ? "dark" : "light");
    checkbox.checked = prefersDark;
  }

  // dəyişdiriləndə
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  });
});

/* ================================================================= */


/* ======================== LANGUAGE PICKER ======================== */ 

function toggleDropdown() {
  const dropdown = document.querySelector('.dropdown');
  const button = document.querySelector('.selected-language');
  const picker = document.querySelector('.language-picker');
  const isOpen = dropdown.style.display === 'block';

  // Toggle açılıb-bağlanma
  dropdown.style.display = isOpen ? 'none' : 'block';
  button.setAttribute('aria-expanded', !isOpen);

  // "active" class-ını toggle elə
  picker.classList.toggle('active', !isOpen);
}

// Çöldə klik ediləndə bağlansın
document.addEventListener('click', function(event) {
  const picker = document.querySelector('.language-picker');
  const dropdown = document.querySelector('.dropdown');
  const button = document.querySelector('.selected-language');

  if (!picker.contains(event.target)) {
    dropdown.style.display = 'none';
    button.setAttribute('aria-expanded', 'false');
    picker.classList.remove('active');
  }
});

/* ================================================================= */


/* ======================== HEADER SCROLL ======================== */ 

let lastScroll = 0;
const header = document.querySelector("header.header");

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > lastScroll) {
    // aşağı scroll → header gizlənir
    header.classList.add("hide");
  } else {
    // yuxarı scroll → header çıxır
    header.classList.remove("hide");
  }

  lastScroll = currentScroll;
});
/* ================================================================= */


/* ======================== MOBILE MENU ========================= */ 

document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".mobile-menu");
  const openBtn = document.querySelector(".mobile-menu-btn-open");
  const closeBtn = document.querySelector(".mobile-menu-btn-close");

  // Açma düyməsi
  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    menu.classList.add("active");
  });

  // Bağlama düyməsi
  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    menu.classList.remove("active");
  });

  // Kənara kliklənəndə bağla
  document.addEventListener("click", (e) => {
    if (
      menu.classList.contains("active") &&
      !menu.contains(e.target) &&
      !openBtn.contains(e.target)
    ) {
      menu.classList.remove("active");
    }
  });
});

/* ================================================================= */
