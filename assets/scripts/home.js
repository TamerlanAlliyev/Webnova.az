var swiper = new Swiper(".mySwiper", {
  slidesPerView: 2,
  spaceBetween: 18,
  autoplay: {
      delay: 1500,
      loop: true,
  },
  breakpoints: {
   580: {
          slidesPerView: 3,
          spaceBetween: 18,
      },
      768: {
          slidesPerView: 4,
          spaceBetween: 22,
      },
      1080: {
          slidesPerView: 5,
          spaceBetween: 24,
      },
  },
});

  (function () {
    const items = document.querySelectorAll(".services-list .service-item");

    // Scroll istiqamətini izləyək (isteğe bağlı – yalnız diaqnostika/inkişaf üçün)
    let lastY = window.scrollY;
    let scrollDir = 'down';
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      scrollDir = y > lastY ? 'down' : 'up';
      lastY = y;
    }, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;
    if (entry.isIntersecting) {
      el.classList.add("in-view");
    } else {
      el.classList.remove("in-view");
    }
  });
}, {
  root: null,
  threshold: 0.2,   // 50% göründükdə açılacaq
  rootMargin: "0px" // əlavə margin olmadan
});


    items.forEach(el => observer.observe(el));
  })();
