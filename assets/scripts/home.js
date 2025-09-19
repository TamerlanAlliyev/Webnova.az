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