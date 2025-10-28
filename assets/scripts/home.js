var swiper = new Swiper(".mySwiper", {
  slidesPerView: 2,
  spaceBetween: 18,
  lazy: true,
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




(() => {
  const SELECTOR = '.card-animation';

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
})();




/* =============================
🎬 SLIDER — Infinite Flow Setup
=============================== */


document.addEventListener("DOMContentLoaded", () => {
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
  //    Piksel/saniyə sabiti -> nə qədər böyükdürsə, o qədər sürətli hərəkət.
  const PX_PER_SEC = 80; // İstəyə görə 60–120 arası oynada bilərsən
  // Hədəf məsafə: [-50%] hərəkət edəcəyik (çünki 2x content var)
  const distancePx = wrapper.scrollWidth / 2;
  const durationSec = Math.max(12, distancePx / PX_PER_SEC); // min 12s
  container.style.setProperty("--marquee-duration", `${durationSec}s`);

  // 4) Resize zamanı yenidən ölç (responsivlik)
  let rAF;
  const onResize = () => {
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(() => {
      // content artıq ikiqatdır; yenidən hesablamaq üçün yalnız duration güncəlləyirik
      const newDistance = wrapper.scrollWidth / 2;
      const newDuration = Math.max(12, newDistance / PX_PER_SEC);
      container.style.setProperty("--marquee-duration", `${newDuration}s`);
    });
  };
  window.addEventListener("resize", onResize, {
    passive: true
  });
});


/* =============================
🎬 SLIDER — Testimoniols
=============================== */
var swiper = new Swiper(".testimonials-section  .mySwiper", {
  slidesPerView: 1,
  spaceBetween: 22,
  lazy: true,
  autoplay: {
    delay: 2500,
    loop: true,
  },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
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
});

/* =============================
🎬 FAQ Accordion Functionality
=============================== */
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) return;
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        question.addEventListener('click', function() {
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
        if (index === 0) {
            openItem(item);
        }
    });
    
    // FAQ item-i açan funksiya
    function openItem(item) {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
    }
    
    // FAQ item-i bağlayan funksiya
    function closeItem(item) {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
    }
});


