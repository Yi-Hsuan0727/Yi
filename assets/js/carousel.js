/*
 * CarouselLogic: Horizontal image carousel for the About page and More work stack card.
 * Users can swipe left/right (touch or mouse drag) to scroll. No scrollbar shown.
 * Looping carousels auto-scroll slowly when idle.
 */
const CarouselLogic = {
    instances: [],

    init: function () {
        document.querySelectorAll('.about-carousel, .more-work-carousel').forEach((carousel) => {
            this.initCarousel(carousel);
        });
    },

    initCarousel: function (carousel) {
        const track = carousel.querySelector('.about-carousel-track, .more-work-carousel-track');
        if (!track) return;

        const isLooping = carousel.classList.contains('more-work-carousel')
            || !!carousel.closest('.home-about');

        const instance = {
            carousel: carousel,
            track: track,
            currentTranslate: 0,
            targetTranslate: 0,
            isDragging: false,
            startX: 0,
            startTranslate: 0,
            autoScrollSpeed: carousel.classList.contains('more-work-carousel') ? 0.35 : 0.22,
            autoScrollPausedUntil: 0,
            loopWidth: 0,
            animationFrame: null
        };

        if (isLooping && track.children.length) {
            instance.loopWidth = track.scrollWidth / 2;
        }

        this.instances.push(instance);
        this.bindCarousel(instance);

        if (!this.animationFrame) {
            const tick = () => {
                this.instances.forEach((item) => this.applyTransform(item));
                this.animationFrame = requestAnimationFrame(tick);
            };
            tick();
        }
    },

    getBounds: function (instance) {
        const maxTranslate = 0;
        const minTranslate = -(instance.track.scrollWidth - instance.carousel.offsetWidth);
        return { maxTranslate, minTranslate };
    },

    reducedMotionQuery: null,

    prefersReducedMotion: function () {
        if (!this.reducedMotionQuery) {
            this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        }
        return this.reducedMotionQuery.matches;
    },

    applyTransform: function (instance) {
        const now = performance.now();
        const { maxTranslate, minTranslate } = this.getBounds(instance);

        /* No idle auto-scroll for reduced-motion users — the marquee only
           moves when they drag it themselves. */
        if (instance.loopWidth > 0 && !instance.isDragging && !this.prefersReducedMotion() && now >= instance.autoScrollPausedUntil) {
            instance.targetTranslate -= instance.autoScrollSpeed;
            if (instance.targetTranslate <= -instance.loopWidth) {
                instance.targetTranslate += instance.loopWidth;
                instance.currentTranslate += instance.loopWidth;
            }
        }

        instance.currentTranslate += (instance.targetTranslate - instance.currentTranslate) * 0.06;
        instance.track.style.transform = `translateX(${instance.currentTranslate}px)`;
    },

    bindCarousel: function (instance) {
        const carousel = instance.carousel;

        const clamp = (val) => {
            const { maxTranslate, minTranslate } = this.getBounds(instance);
            return Math.max(minTranslate, Math.min(maxTranslate, val));
        };

        const pauseAutoScroll = () => {
            instance.autoScrollPausedUntil = performance.now() + 2400;
        };

        carousel.addEventListener('touchstart', (e) => {
            instance.startX = e.touches[0].clientX;
            instance.startTranslate = instance.targetTranslate;
            pauseAutoScroll();
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            const dx = e.touches[0].clientX - instance.startX;
            instance.targetTranslate = clamp(instance.startTranslate + dx);
            e.preventDefault();
        }, { passive: false });

        carousel.addEventListener('touchend', () => {
            instance.startX = 0;
            instance.startTranslate = instance.targetTranslate;
        }, { passive: true });

        carousel.addEventListener('mousedown', (e) => {
            instance.isDragging = true;
            instance.startX = e.clientX;
            instance.startTranslate = instance.targetTranslate;
            pauseAutoScroll();
            carousel.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!instance.isDragging) return;
            const dx = e.clientX - instance.startX;
            instance.targetTranslate = clamp(instance.startTranslate + dx);
        });

        document.addEventListener('mouseup', () => {
            if (instance.isDragging) {
                instance.isDragging = false;
                carousel.style.cursor = 'grab';
            }
        });

        carousel.addEventListener('mouseenter', pauseAutoScroll);
        carousel.style.cursor = 'grab';
    }
};

/* Initialized by PortfolioApp.startAppEffects on pages that need it */
