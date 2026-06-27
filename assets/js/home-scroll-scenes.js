/*
 * HomeScrollScenes: desktop home scroll — one viewport step per scene.
 * header → stack cards (×5) → can-bring (+3 flips) → about → toolbox → footer
 */
const HomeScrollScenes = {
    enabled: false,
    bound: false,
    snapTimer: null,
    totalSteps: 13,
    stackCards: [],
    canBringCards: [],
    featuredPin: null,
    canBringPin: null,
    mq: null,

    init: function() {
        if (!document.body.classList.contains('app-root-home')) return;

        const canBring = document.querySelector('#home-can-bring');
        this.canBringCards = canBring
            ? Array.prototype.slice.call(canBring.querySelectorAll('.home-can-bring-card'))
            : [];
        this.bindCanBringScrollFlip();

        this.mq = window.matchMedia('(min-width: 1201px) and (prefers-reduced-motion: no-preference)');
        const run = () => (this.mq.matches ? this.enable() : this.disable());
        run();
        if (this.mq.addEventListener) {
            this.mq.addEventListener('change', run);
        } else {
            this.mq.addListener(run);
        }
    },

    getViewportHeight: function() {
        return window.innerHeight || document.documentElement.clientHeight || 800;
    },

    getScrollY: function() {
        if (window.__lenis) return window.__lenis.scroll || 0;
        const scroller = document.getElementById('scroll-container');
        return scroller ? scroller.scrollTop : window.scrollY;
    },

    scrollToStep: function(step, immediate) {
        const vh = this.getViewportHeight();
        const target = Math.max(0, Math.min(this.totalSteps - 1, step)) * vh;
        if (window.__lenis) {
            window.__lenis.scrollTo(target, { immediate: !!immediate, duration: immediate ? 0 : 0.65 });
            return;
        }
        const scroller = document.getElementById('scroll-container');
        if (scroller) {
            scroller.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
        } else {
            window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
        }
    },

    enable: function() {
        const wrapper = document.querySelector('.single-page-wrapper');
        if (!wrapper || wrapper.dataset.scrollScenesReady === '1') {
            if (wrapper && wrapper.dataset.scrollScenesReady === '1') {
                this.enabled = true;
                document.documentElement.classList.add('home-scroll-scenes');
                this.bindScroll();
                this.update();
            }
            return;
        }

        const header = wrapper.querySelector('.home-page-header');
        const featured = wrapper.querySelector('#featured-work');
        const deck = featured && featured.querySelector('.stack-deck');
        const canBring = wrapper.querySelector('#home-can-bring');
        const about = wrapper.querySelector('#about');
        const aboutIntro = about && about.querySelector('.home-about-intro');
        const aboutRest = about && about.querySelector('.home-about-rest');
        const footer = wrapper.querySelector('.site-footer-shell');

        if (!header || !featured || !deck || !canBring || !aboutIntro || !aboutRest || !footer) return;

        this.stackCards = Array.prototype.slice.call(deck.querySelectorAll('.stack-card'));
        this.canBringCards = Array.prototype.slice.call(canBring.querySelectorAll('.home-can-bring-card'));
        if (this.stackCards.length < 2) return;

        this.totalSteps = 1 + this.stackCards.length + 4 + 3;

        wrapper.dataset.scrollScenesReady = '1';

        header.classList.add('home-scroll-scene', 'home-scroll-scene--header');

        featured.classList.add('home-scroll-pin-block', 'home-scroll-pin-block--featured');
        featured.style.setProperty('--pin-steps', String(this.stackCards.length));
        const featuredPin = document.createElement('div');
        featuredPin.className = 'home-scroll-pin';
        deck.classList.add('stack-deck--scene');
        featuredPin.appendChild(deck);
        featured.innerHTML = '';
        featured.appendChild(featuredPin);
        this.featuredPin = featured;

        const canInner = canBring.querySelector('.home-can-bring-inner');
        const canNote = canBring.querySelector('.home-can-bring-ai-note');
        canBring.classList.add('home-scroll-pin-block', 'home-scroll-pin-block--can-bring');
        canBring.style.setProperty('--pin-steps', '4');
        const canPin = document.createElement('div');
        canPin.className = 'home-scroll-pin home-scroll-pin--can-bring';
        if (canInner) canPin.appendChild(canInner);
        if (canNote) canPin.appendChild(canNote);
        canBring.innerHTML = '';
        canBring.appendChild(canPin);
        this.canBringPin = canBring;

        aboutIntro.classList.add('home-scroll-scene', 'home-scroll-scene--about-intro');
        aboutRest.classList.add('home-scroll-scene', 'home-scroll-scene--about-rest');
        footer.classList.add('home-scroll-scene', 'home-scroll-scene--footer');

        document.documentElement.classList.add('home-scroll-scenes');
        this.enabled = true;
        this.bindScroll();
        this.update();
        this.refreshLenis();
    },

    disable: function() {
        document.documentElement.classList.remove('home-scroll-scenes');
        this.enabled = false;
        this.unbindScroll();
        this.updateCanBringByScroll();
    },

    bindCanBringScrollFlip: function() {
        if (this.canBringFlipBound || !this.canBringCards.length) return;
        this.canBringFlipBound = true;
        this.onCanBringScrollFlip = this.onCanBringScrollFlip.bind(this);
        const scroller = document.getElementById('scroll-container');
        if (scroller) scroller.addEventListener('scroll', this.onCanBringScrollFlip, { passive: true });
        window.addEventListener('scroll', this.onCanBringScrollFlip, { passive: true });
        window.addEventListener('resize', this.onCanBringScrollFlip, { passive: true });
        if (window.__lenis) {
            window.__lenis.on('scroll', this.onCanBringScrollFlip);
        } else {
            this.waitForLenisCanBringFlip();
        }
        this.updateCanBringByScroll();
    },

    waitForLenisCanBringFlip: function() {
        let attempts = 0;
        const tick = () => {
            if (window.__lenis) {
                window.__lenis.on('scroll', this.onCanBringScrollFlip);
                this.updateCanBringByScroll();
                return;
            }
            attempts += 1;
            if (attempts < 40) setTimeout(tick, 50);
        };
        tick();
    },

    onCanBringScrollFlip: function() {
        if (this.enabled) return;
        this.updateCanBringByScroll();
    },

    updateCanBringByScroll: function() {
        if (!this.canBringCards.length) return;
        const section = document.getElementById('home-can-bring');
        if (!section) return;

        const vh = this.getViewportHeight();
        const rect = section.getBoundingClientRect();
        const start = vh * 0.82;
        const end = vh * 0.18;
        const total = Math.max(rect.height + start - end, 1);
        const scrolled = start - rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / total));

        this.canBringCards.forEach((card, index) => {
            const threshold = (index + 1) / (this.canBringCards.length + 1);
            card.classList.toggle('is-flipped', progress >= threshold);
        });
    },

    bindScroll: function() {
        if (this.bound) return;
        this.bound = true;
        this.onScroll = this.onScroll.bind(this);
        this.onResize = this.onResize.bind(this);

        const scroller = document.getElementById('scroll-container');
        if (scroller) scroller.addEventListener('scroll', this.onScroll, { passive: true });
        window.addEventListener('scroll', this.onScroll, { passive: true });
        window.addEventListener('resize', this.onResize, { passive: true });

        if (window.__lenis) {
            window.__lenis.on('scroll', this.onScroll);
        } else {
            this.waitForLenis();
        }
    },

    waitForLenis: function() {
        let attempts = 0;
        const tick = () => {
            if (!this.enabled) return;
            if (window.__lenis) {
                window.__lenis.on('scroll', this.onScroll);
                this.update();
                this.refreshLenis();
                return;
            }
            attempts += 1;
            if (attempts < 40) setTimeout(tick, 50);
        };
        tick();
    },

    unbindScroll: function() {
        if (!this.bound) return;
        this.bound = false;
        const scroller = document.getElementById('scroll-container');
        if (scroller) scroller.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onResize);
    },

    onResize: function() {
        this.update();
        this.refreshLenis();
    },

    onScroll: function() {
        this.update();
        if (this.snapTimer) clearTimeout(this.snapTimer);
        this.snapTimer = setTimeout(() => this.snapToNearestStep(), 140);
    },

    snapToNearestStep: function() {
        if (!this.enabled) return;
        const vh = this.getViewportHeight();
        if (!vh) return;
        const scrollY = this.getScrollY();
        const step = Math.round(scrollY / vh);
        const target = Math.max(0, Math.min(this.totalSteps - 1, step)) * vh;
        if (Math.abs(scrollY - target) > 6) {
            this.scrollToStep(step, false);
        }
    },

    getStep: function(scrollY, vh) {
        return Math.max(0, Math.min(this.totalSteps - 1, Math.round(scrollY / vh)));
    },

    update: function() {
        if (!this.enabled) return;

        const vh = this.getViewportHeight();
        const scrollY = this.getScrollY();
        const step = this.getStep(scrollY, vh);

        document.body.dataset.homeScrollStep = String(step);

        this.stackCards.forEach((card, index) => {
            const active = step === index + 1;
            card.classList.toggle('is-scene-active', active);
            card.style.transform = '';
            card.style.filter = '';
        });

        const canBringFirstStep = this.stackCards.length + 1;
        this.canBringCards.forEach((card, index) => {
            card.classList.toggle('is-flipped', step >= canBringFirstStep + 1 + index);
        });
    },

    refreshLenis: function() {
        if (window.__lenis) {
            window.__lenis.resize();
            setTimeout(() => window.__lenis && window.__lenis.resize(), 150);
        }
    }
};
