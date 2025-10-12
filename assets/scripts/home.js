var swiper = new Swiper(".mySwiper", {
  slidesPerView: 2,
  spaceBetween: 18,
  lazy:true,
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

  function setupObserverForEl(el){
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

        if (entry.isIntersecting){
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
          if ((el.getAttribute('data-sa-once') ?? 'true') === 'false'){
            el.classList.remove('sa-active');
            el.style.transitionDelay = '';
          }
        }
      });
    }, opts);

    io.observe(el);
  }

  function getIndexInGroup(parent, el){
    if (!parent) return 0;
    if (!groupIndex.has(parent)){
      const children = Array.from(parent.querySelectorAll(SELECTOR));
      const map = new Map(children.map((node, i) => [node, i]));
      groupIndex.set(parent, map);
    }
    return groupIndex.get(parent).get(el) ?? 0;
  }

  function clamp01(v){ return Math.max(0, Math.min(1, v)); }

  // İlk yükləmə
  if (!('IntersectionObserver' in window)){
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
    mo.observe(document.body, { childList: true, subtree: true });
  }
})();




/* =============================
🎬 SLIDER — Infinite Flow Setup
=============================== */


document.addEventListener("DOMContentLoaded", () => {
        const wrapper = document.querySelector(".promo-slider .wrapper");
        if (wrapper) {
            const clone = wrapper.innerHTML;
            wrapper.insertAdjacentHTML("beforeend", clone);
            const slides = wrapper.querySelectorAll(".slide").length / 2;
            wrapper.parentElement.dataset.slides = slides;
        }
    });