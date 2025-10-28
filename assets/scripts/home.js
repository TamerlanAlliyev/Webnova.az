// Optimized Swiper - Lazy initialization
let swiperInstance = null;

function initSwiper() {
  if (swiperInstance) return swiperInstance;
  
  const swiperEl = document.querySelector(".mySwiper");
  if (!swiperEl) return null;
  
  swiperInstance = new Swiper(swiperEl, {
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
    // Performance optimizations
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    preloadImages: false,
    updateOnWindowResize: true
  });
  
  return swiperInstance;
}




// Optimized Card Animation - Performance focused
(() => {
  const SELECTOR = '.card-animation';
  const groupIndex = new WeakMap();
  let observer = null;
  let mutationObserver = null;

  // Throttled function for better performance
  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  };

  const setupObserverForEl = (el) => {
    if (el.__saObserved) return;
    el.__saObserved = true;

    const thr = parseFloat(el.getAttribute('data-sa-threshold'));
    const margin = el.getAttribute('data-sa-margin');
    const opts = {
      threshold: Number.isFinite(thr) ? Math.max(0, Math.min(1, thr)) : 0.15,
      rootMargin: margin || '0px 0px -5% 0px'
    };

    const io = new IntersectionObserver((entries) => {
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

          if (once) io.unobserve(el);
        } else if ((el.getAttribute('data-sa-once') ?? 'true') === 'false') {
          el.classList.remove('sa-active');
          el.style.transitionDelay = '';
        }
      });
    }, opts);

    io.observe(el);
  };

  const getIndexInGroup = (parent, el) => {
    if (!parent) return 0;
    if (!groupIndex.has(parent)) {
      const children = Array.from(parent.querySelectorAll(SELECTOR));
      const map = new Map(children.map((node, i) => [node, i]));
      groupIndex.set(parent, map);
    }
    return groupIndex.get(parent).get(el) ?? 0;
  };

  const observeCards = (root = document) => {
    const cards = Array.from(root.querySelectorAll(SELECTOR));
    cards.forEach(setupObserverForEl);
  };

  // Initialize with performance check
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    document.querySelectorAll(SELECTOR).forEach(el => el.classList.add('sa-active'));
  } else {
    // Use requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => observeCards());
    } else {
      setTimeout(() => observeCards(), 0);
    }

    // Optimized MutationObserver
    mutationObserver = new MutationObserver(throttle((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return;
          if (node.matches?.(SELECTOR)) setupObserverForEl(node);
          node.querySelectorAll?.(SELECTOR).forEach(setupObserverForEl);
        });
      });
    }, 100));

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();




/* =============================
🎬 SLIDER — Infinite Flow Setup
=============================== */


// Optimized Marquee Slider - Performance focused
(() => {
  let container = null;
  let wrapper = null;
  let resizeRAF = null;
  const PX_PER_SEC = 80;

  const initMarquee = () => {
    container = document.querySelector(".promo-slider");
    wrapper = container?.querySelector(".wrapper");
    if (!container || !wrapper) return;

    // 1) Index numbers with performance optimization
    const slides = Array.from(wrapper.querySelectorAll(".slide"));
    slides.forEach((li, i) => {
      const idxEl = li.querySelector(".promo-index");
      if (idxEl) idxEl.textContent = String(i + 1).padStart(2, "0");
    });

    // 2) Clone content for infinite scroll
    const initialHTML = wrapper.innerHTML;
    let safety = 0;
    while (wrapper.scrollWidth < container.clientWidth * 2 && safety < 10) {
      wrapper.insertAdjacentHTML("beforeend", initialHTML);
      safety++;
    }

    // 3) Calculate marquee speed
    updateMarqueeSpeed();

    // 4) Throttled resize handler
    const onResize = () => {
      cancelAnimationFrame(resizeRAF);
      resizeRAF = requestAnimationFrame(updateMarqueeSpeed);
    };

    window.addEventListener("resize", onResize, { passive: true });
  };

  const updateMarqueeSpeed = () => {
    if (!container || !wrapper) return;
    const distancePx = wrapper.scrollWidth / 2;
    const durationSec = Math.max(12, distancePx / PX_PER_SEC);
    container.style.setProperty("--marquee-duration", `${durationSec}s`);
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMarquee);
  } else {
    initMarquee();
  }
})();


/* =============================
🎬 SLIDER — Testimoniols
=============================== */
// Optimized Testimonials Swiper - Lazy initialization
let testimonialsSwiper = null;

function initTestimonialsSwiper() {
  if (testimonialsSwiper) return testimonialsSwiper;
  
  const swiperEl = document.querySelector(".testimonials-section .mySwiper");
  if (!swiperEl) return null;
  
  testimonialsSwiper = new Swiper(swiperEl, {
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
    // Performance optimizations
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    preloadImages: false,
    updateOnWindowResize: true
  });
  
  return testimonialsSwiper;
}

/* =============================
🎬 FAQ Accordion Functionality
=============================== */
// Optimized FAQ Accordion - Performance focused
(() => {
  let faqItems = [];
  let isInitialized = false;

  const initFAQ = () => {
    if (isInitialized) return;
    
    faqItems = Array.from(document.querySelectorAll('.faq-item'));
    if (faqItems.length === 0) return;

    faqItems.forEach((item, index) => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      
      if (!question || !answer) return;
      
      // Use event delegation for better performance
      question.addEventListener('click', handleFAQClick.bind(null, item), { passive: true });
      
      // Open first item by default
      if (index === 0) {
        openItem(item);
      }
    });
    
    isInitialized = true;
  };

  const handleFAQClick = (item) => {
    const isActive = item.classList.contains('active');
    
    // Close all other items (accordion mode)
    faqItems.forEach(otherItem => {
      if (otherItem !== item && otherItem.classList.contains('active')) {
        closeItem(otherItem);
      }
    });
    
    // Toggle current item
    if (isActive) {
      closeItem(item);
    } else {
      openItem(item);
    }
  };

  const openItem = (item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (!question || !answer) return;
    
    item.classList.add('active');
    question.setAttribute('aria-expanded', 'true');
  };

  const closeItem = (item) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (!question || !answer) return;
    
    item.classList.remove('active');
    question.setAttribute('aria-expanded', 'false');
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
  } else {
    initFAQ();
  }
})();

/* =============================
🚀 LAZY INITIALIZATION
=============================== */

// Initialize all components when needed
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Swipers when they come into view
  const swiperObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('mySwiper') && !entry.target.classList.contains('testimonials-section')) {
          initSwiper();
        } else if (entry.target.closest('.testimonials-section')) {
          initTestimonialsSwiper();
        }
        swiperObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '50px' });

  // Observe swiper containers
  const swiperContainers = document.querySelectorAll('.mySwiper, .testimonials-section');
  swiperContainers.forEach(container => {
    swiperObserver.observe(container);
  });
});

// Export functions for external use
window.WebnovaComponents = {
  initSwiper,
  initTestimonialsSwiper
};
