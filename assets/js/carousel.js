/*
 * CarouselLogic: Horizontal image carousel for the About page.
 * Users can swipe left/right (touch or mouse drag) to scroll. No scrollbar shown.
 */
const CarouselLogic = {
    currentTranslate: 0,
    targetTranslate: 0,
    animationFrame: null,
    isDragging: false,
    startX: 0,
    startTranslate: 0,

    init: function () {
        const carousel = document.querySelector('.about-carousel');
        if (!carousel) return;

        const track = carousel.querySelector('.about-carousel-track');
        if (!track) return;

        this.currentTranslate = 0;
        this.targetTranslate = 0;
        const maxTranslate = 0;
        const minTranslate = -(track.scrollWidth - carousel.offsetWidth);

        const applyTransform = () => {
            this.currentTranslate += (this.targetTranslate - this.currentTranslate) * 0.15;
            track.style.transform = `translateX(${this.currentTranslate}px)`;
        };

        const tick = () => {
            applyTransform();
            this.animationFrame = requestAnimationFrame(tick);
        };
        tick();

        const clamp = (val) => Math.max(minTranslate, Math.min(maxTranslate, val));

        // Touch events (mobile swipe)
        carousel.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
            this.startTranslate = this.targetTranslate;
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            const dx = e.touches[0].clientX - this.startX;
            this.targetTranslate = clamp(this.startTranslate + dx);
            e.preventDefault(); // Prevent page scroll when swiping carousel
        }, { passive: false });

        carousel.addEventListener('touchend', () => {
            this.startX = 0;
            this.startTranslate = this.targetTranslate;
        }, { passive: true });

        // Mouse events (desktop drag)
        carousel.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startX = e.clientX;
            this.startTranslate = this.targetTranslate;
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            const dx = e.clientX - this.startX;
            this.targetTranslate = clamp(this.startTranslate + dx);
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        carousel.style.cursor = 'grab';
        carousel.style.userSelect = 'none';
        carousel.addEventListener('mousedown', () => { carousel.style.cursor = 'grabbing'; });
        document.addEventListener('mouseup', () => { carousel.style.cursor = 'grab'; });
    }
};

// Auto-init once the DOM is ready (works whether script is deferred or inline)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CarouselLogic.init());
} else {
    // Layout is built dynamically by PortfolioApp — wait one tick
    setTimeout(() => CarouselLogic.init(), 0);
}
