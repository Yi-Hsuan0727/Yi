/*
 * CarouselLogic: Scroll-driven horizontal image carousel for the About page.
 * The carousel strip is wider than the viewport. As the user scrolls the page
 * down, the carousel advances (moves left); scrolling up reverses it.
 */
const CarouselLogic = {
    currentTranslate: 0,
    lastScroll: 0,
    animationFrame: null,
    targetTranslate: 0,

    init: function () {
        const carousel = document.querySelector('.about-carousel');
        if (!carousel) return;

        const track = carousel.querySelector('.about-carousel-track');
        if (!track) return;

        const isMobile = window.innerWidth <= 1200;
        const scrollEl = isMobile ? window : (document.getElementById('scroll-container') || window);

        this.lastScroll = isMobile ? window.scrollY : (scrollEl.scrollTop || 0);
        this.currentTranslate = 0;
        this.targetTranslate = 0;

        const onScroll = () => {
            const scrollTop = (scrollEl === window) ? window.scrollY : scrollEl.scrollTop;
            const delta = scrollTop - this.lastScroll;
            this.lastScroll = scrollTop;

            // Speed multiplier: how many px the carousel moves per px of page scroll
            const speed = 0.55;
            this.targetTranslate -= delta * speed;

            // Clamp so the carousel doesn't over-scroll past its edges
            const maxTranslate = 0;
            const minTranslate = -(track.scrollWidth - carousel.offsetWidth);
            this.targetTranslate = Math.max(minTranslate, Math.min(maxTranslate, this.targetTranslate));

            // Use rAF for smooth rendering
            if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
            this.animationFrame = requestAnimationFrame(() => {
                // Ease toward target
                this.currentTranslate += (this.targetTranslate - this.currentTranslate) * 0.12;
                track.style.transform = `translateX(${this.currentTranslate}px)`;
            });
        };

        scrollEl.addEventListener('scroll', onScroll, { passive: true });
    }
};

// Auto-init once the DOM is ready (works whether script is deferred or inline)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CarouselLogic.init());
} else {
    // Layout is built dynamically by PortfolioApp — wait one tick
    setTimeout(() => CarouselLogic.init(), 0);
}
