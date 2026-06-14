/*
 * CarouselLogic: Horizontal image carousel for the About page.
 * Users can swipe left/right (touch or mouse drag) to scroll. No scrollbar shown.
 * Home page carousel auto-scrolls slowly when idle.
 */
const CarouselLogic = {
    currentTranslate: 0,
    targetTranslate: 0,
    animationFrame: null,
    isDragging: false,
    startX: 0,
    startTranslate: 0,
    autoScrollSpeed: 0.22,
    autoScrollPausedUntil: 0,
    loopWidth: 0,

    init: function () {
        const carousel = document.querySelector('.about-carousel');
        if (!carousel) return;

        const track = carousel.querySelector('.about-carousel-track');
        if (!track) return;

        const isHomeCarousel = !!carousel.closest('.home-about');
        if (isHomeCarousel) {
            track.innerHTML += track.innerHTML;
        }

        this.currentTranslate = 0;
        this.targetTranslate = 0;
        this.loopWidth = isHomeCarousel ? track.scrollWidth / 2 : 0;

        const getBounds = () => {
            const maxTranslate = 0;
            const minTranslate = -(track.scrollWidth - carousel.offsetWidth);
            return { maxTranslate, minTranslate };
        };

        const applyTransform = () => {
            const now = performance.now();
            const { maxTranslate, minTranslate } = getBounds();

            if (isHomeCarousel && !this.isDragging && now >= this.autoScrollPausedUntil) {
                this.targetTranslate -= this.autoScrollSpeed;
                if (this.loopWidth > 0 && this.targetTranslate <= -this.loopWidth) {
                    this.targetTranslate += this.loopWidth;
                    this.currentTranslate += this.loopWidth;
                }
            }

            this.currentTranslate += (this.targetTranslate - this.currentTranslate) * 0.06;
            track.style.transform = `translateX(${this.currentTranslate}px)`;
        };

        const tick = () => {
            applyTransform();
            this.animationFrame = requestAnimationFrame(tick);
        };
        tick();

        const clamp = (val) => {
            const { maxTranslate, minTranslate } = getBounds();
            return Math.max(minTranslate, Math.min(maxTranslate, val));
        };

        const pauseAutoScroll = () => {
            this.autoScrollPausedUntil = performance.now() + 2400;
        };

        // Touch events (mobile swipe)
        carousel.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
            this.startTranslate = this.targetTranslate;
            pauseAutoScroll();
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            const dx = e.touches[0].clientX - this.startX;
            this.targetTranslate = clamp(this.startTranslate + dx);
            e.preventDefault();
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
            pauseAutoScroll();
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            const dx = e.clientX - this.startX;
            this.targetTranslate = clamp(this.startTranslate + dx);
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        carousel.addEventListener('mouseenter', pauseAutoScroll);

        carousel.style.cursor = 'grab';
        carousel.style.userSelect = 'none';
        carousel.addEventListener('mousedown', () => { carousel.style.cursor = 'grabbing'; });
        document.addEventListener('mouseup', () => { carousel.style.cursor = 'grab'; });
    }
};

/* Initialized by PortfolioApp.startAppEffects on pages that need it */
