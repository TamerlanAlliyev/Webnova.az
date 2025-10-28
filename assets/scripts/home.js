// Initialize Swiper with performance optimizations
const initSwiper = () => {
  if (typeof Swiper === 'undefined') return;
  
  new Swiper(".mySwiper", {
    slidesPerView: 2,
    spaceBetween: 18,
    lazy: {
      loadPrevNext: true,
      loadPrevNextAmount: 2
    },
    autoplay: {
      delay: 1500,
      loop: true,
      pauseOnMouseEnter: true,
      disableOnInteraction: false
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
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    preloadImages: false,
    updateOnImagesReady: true
  });
};




// Optimized scroll animation with performance improvements
(() => {
  const SELECTOR = '.card-animation';
  let isInitialized = false;

  // Debounced resize handler
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // İlk render + sonradan DOM-a əlavə olunanlar üçün MutationObserver dəstəyi
  const observeCards = (root = document) => {
    const cards = Array.from(root.querySelectorAll(SELECTOR));
    cards.forEach(setupObserverForEl);
  };

  // parent üzrə index xəritəsi (stagger üçün)
  const groupIndex = new WeakMap();

  function setupObserverForEl(el) {
    if (el.__saObserved) return; // təkrarı önlə
    el.__saObserved = true;

    const thr = parseFloat(el.getAttribute('data-sa-threshold'));
    const margin = el.getAttribute('data-sa-margin');
    const opts = {
      threshold: Number.isFinite(thr) ? clamp01(thr) : 0.15,
      rootMargin: margin || '0px 0px -5% 0px'
    };

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.target !== el) return;

        const once = (el.getAttribute('data-sa-once') ?? 'true') !== 'false';

        if (entry.isIntersecting) {
          const baseDelay = parseInt(el.getAttribute('data-sa-delay') || '0', 10);
          const stagger = parseInt(el.getAttribute('data-sa-stagger') || '0', 10);

          const parent = el.parentElement;
          const idx = getIndexInGroup(parent, el);
          const totalDelay = baseDelay + (stagger * idx);

          el.style.transitionDelay = totalDelay ? `${totalDelay}ms` : '';
          el.classList.add('sa-active');

          if (once) observer.unobserve(el);
        } else {
          // repeat mode
          if ((el.getAttribute('data-sa-once') ?? 'true') === 'false') {
            el.classList.remove('sa-active');
            el.style.transitionDelay = '';
          }
        }
      });
    }, opts);

    io.observe(el);
  }

  function getIndexInGroup(parent, el) {
    if (!parent) return 0;
    if (!groupIndex.has(parent)) {
      const children = Array.from(parent.querySelectorAll(SELECTOR));
      const map = new Map(children.map((node, i) => [node, i]));
      groupIndex.set(parent, map);
    }
    return groupIndex.get(parent).get(el) ?? 0;
  }

  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  // Initialize only once
  const init = () => {
    if (isInitialized) return;
    isInitialized = true;

    // İlk yükləmə
    if (!('IntersectionObserver' in window)) {
      // Fallback: animasiyasız göstər
      document.querySelectorAll(SELECTOR).forEach(el => el.classList.add('sa-active'));
    } else {
      observeCards();

      // Dinamik kontent üçün MutationObserver
      const mo = new MutationObserver(muts => {
        muts.forEach(m => {
          m.addedNodes.forEach(node => {
            if (!(node instanceof Element)) return;
            if (node.matches?.(SELECTOR)) setupObserverForEl(node);
            // iç-içə yeni kartlar
            node.querySelectorAll?.(SELECTOR).forEach(setupObserverForEl);
          });
        });
      });
      mo.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();




/* =============================
🎬 SLIDER — Infinite Flow Setup
=============================== */


// Optimized marquee slider with performance improvements
const initMarqueeSlider = () => {
  const container = document.querySelector(".promo-slider");
  const wrapper = container?.querySelector(".wrapper");
  if (!container || !wrapper) return;

  // 1) Indexləri avtomatik 01, 02, ... formatla (HTML-də yazmağa ehtiyac qalmasın)
  const slides = Array.from(wrapper.querySelectorAll(".slide"));
  slides.forEach((li, i) => {
    const idxEl = li.querySelector(".promo-index");
    if (idxEl) idxEl.textContent = String(i + 1).padStart(2, "0");
  });

  // 2) Sonsuz axın üçün kontenti ən azı 2x genişliyə çatana qədər klonla
  const initialHTML = wrapper.innerHTML;
  let safety = 0;
  while (wrapper.scrollWidth < container.clientWidth * 2 && safety < 10) {
    wrapper.insertAdjacentHTML("beforeend", initialHTML);
    safety++;
  }

  // 3) Marquee sürətini dinamik hesabla:
  const PX_PER_SEC = 80;
  const distancePx = wrapper.scrollWidth / 2;
  const durationSec = Math.max(12, distancePx / PX_PER_SEC);
  container.style.setProperty("--marquee-duration", `${durationSec}s`);

  // 4) Optimized resize handler with debouncing
  let rAF;
  const onResize = debounce(() => {
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(() => {
      const newDistance = wrapper.scrollWidth / 2;
      const newDuration = Math.max(12, newDistance / PX_PER_SEC);
      container.style.setProperty("--marquee-duration", `${newDuration}s`);
    });
  }, 100);

  window.addEventListener("resize", onResize, { passive: true });
};

// Initialize marquee when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initMarqueeSlider);
} else {
  initMarqueeSlider();
}


/* =============================
🎬 SLIDER — Testimoniols
=============================== */
// Initialize testimonials swiper with performance optimizations
const initTestimonialsSwiper = () => {
  if (typeof Swiper === 'undefined') return;
  
  new Swiper(".testimonials-section .mySwiper", {
    slidesPerView: 1,
    spaceBetween: 22,
    lazy: {
      loadPrevNext: true,
      loadPrevNextAmount: 1
    },
    autoplay: {
      delay: 2500,
      loop: true,
      pauseOnMouseEnter: true,
      disableOnInteraction: false
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 26,
      },
      1080: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    preloadImages: false,
    updateOnImagesReady: true
  });
};

/* =============================
🎬 FAQ Accordion Functionality
=============================== */
// Optimized FAQ accordion with performance improvements
const initFAQAccordion = () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) return;
    
    // FAQ item-i açan funksiya
    const openItem = (item) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
    };
    
    // FAQ item-i bağlayan funksiya
    const closeItem = (item) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
    };
    
    // Event delegation for better performance
    const faqContainer = document.querySelector('.faq-accordion');
    if (!faqContainer) return;
    
    faqContainer.addEventListener('click', (e) => {
        const question = e.target.closest('.faq-question');
        if (!question) return;
        
        const item = question.closest('.faq-item');
        if (!item) return;
        
        const isActive = item.classList.contains('active');
        
        // Bütün FAQ itemləri bağla (accordion mode - yalnız biri açıq qalar)
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                closeItem(otherItem);
            }
        });
        
        // Cari item-i toggle et
        if (isActive) {
            closeItem(item);
        } else {
            openItem(item);
        }
    });
    
    // İlk FAQ item-i avtomatik aç
    if (faqItems[0]) {
        openItem(faqItems[0]);
    }
};

// Initialize FAQ accordion when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQAccordion);
} else {
    initFAQAccordion();
}

// Initialize all components when DOM is ready
const initializeAll = () => {
    initSwiper();
    initTestimonialsSwiper();
    initMarqueeSlider();
    initFAQAccordion();
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
} else {
    initializeAll();
}
