/*
 * HomeScrollScenes (desktop): pins ONLY the "What can I bring" section in the
 * center of the viewport and flips its three cards one at a time as the user
 * scrolls through the pinned range. Featured work and About scroll normally
 * (entrance reveals only). Disabled on mobile / reduced-motion.
 */
const HomeScrollScenes = {
    enabled: false,
    bound: false,
    cards: [],
    block: null,
    panel: null,
    mq: null,
    PIN_STEPS: 4, // 1 viewport to enter/exit + 3 flips of scroll distance

    init: function() {
        if (!document.querySelector('.app-root-home')) return;
        this.mq = window.matchMedia('(min-width: 1201px) and (prefers-reduced-motion: no-preference)');
        const run = () => (this.mq.matches ? this.enable() : this.disable());
        run();
        if (this.mq.addEventListener) {
            this.mq.addEventListener('change', run);
        } else {
            this.mq.addListener(run);
        }
    },

    enable: function() {
        const canBring = document.querySelector('#home-can-bring');
        if (!canBring) return;
        this.cards = Array.prototype.slice.call(canBring.querySelectorAll('.home-can-bring-card'));
        if (!this.cards.length) return;

        // Restructure once: the section becomes a tall scroll track; the panel +
        // note move into a sticky, centered pin. The panel box (home-panel) must
        // move off the (now 4×100vh) section so it doesn't become a giant box.
        if (canBring.dataset.pinReady !== '1') {
            const inner = canBring.querySelector('.home-can-bring-inner');
            const note = canBring.querySelector('.home-can-bring-ai-note');

            const panel = document.createElement('div');
            panel.className = 'home-panel home-can-bring-panel';
            if (inner) panel.appendChild(inner);
            if (note) panel.appendChild(note); // bubble sits at the panel's top-right corner

            const pin = document.createElement('div');
            pin.className = 'home-scroll-pin home-scroll-pin--can-bring';
            pin.appendChild(panel);

            canBring.classList.remove('home-panel');
            canBring.classList.add('home-scroll-pin-block', 'home-scroll-pin-block--can-bring');
            canBring.style.setProperty('--pin-steps', String(this.PIN_STEPS));
            canBring.innerHTML = '';
            canBring.appendChild(pin);
            canBring.dataset.pinReady = '1';
        }

        this.block = canBring;
        this.panel = canBring.querySelector('.home-can-bring-panel');
        document.documentElement.classList.add('home-scroll-scenes');
        this.enabled = true;
        this.bindScroll();
        this.update();
        this.refreshLenis();
        if (typeof PortfolioApp !== 'undefined' && PortfolioApp.refreshHomeScrollReveal) {
            PortfolioApp.refreshHomeScrollReveal();
        }
    },

    disable: function() {
        document.documentElement.classList.remove('home-scroll-scenes');
        this.enabled = false;
        this.unbindScroll();
        this.cards.forEach((c) => c.classList.remove('is-flipped'));
    },

    /* Flip exactly one card based on scroll progress through the pinned range. */
    update: function() {
        if (!this.enabled || !this.block) return;
        const vh = window.innerHeight || document.documentElement.clientHeight || 800;
        const rect = this.block.getBoundingClientRect();
        const pinnable = rect.height - vh; // scroll distance available while pinned
        if (pinnable <= 0) return;

        const progress = Math.max(0, Math.min(1, -rect.top / pinnable)); // 0..1
        const n = this.cards.length;

        // Buffer before the first flip and after the last, then one equal segment
        // per card. Only one card is flipped at any time.
        const enter = 0.08;
        const exit = 0.96;
        let active = -1;
        if (progress > enter && progress < exit) {
            const span = (exit - enter) / n;
            active = Math.min(n - 1, Math.floor((progress - enter) / span));
        }

        this.cards.forEach((card, i) => card.classList.toggle('is-flipped', i === active));
    },

    bindScroll: function() {
        if (this.bound) return;
        this.bound = true;
        this.onScroll = this.update.bind(this);

        const scroller = document.getElementById('scroll-container');
        if (scroller) scroller.addEventListener('scroll', this.onScroll, { passive: true });
        window.addEventListener('scroll', this.onScroll, { passive: true });
        window.addEventListener('resize', this.onScroll, { passive: true });

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
            if (++attempts < 40) setTimeout(tick, 50);
        };
        tick();
    },

    unbindScroll: function() {
        if (!this.bound) return;
        this.bound = false;
        const scroller = document.getElementById('scroll-container');
        if (scroller) scroller.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onScroll);
    },

    refreshLenis: function() {
        if (window.__lenis) {
            window.__lenis.resize();
            setTimeout(() => window.__lenis && window.__lenis.resize(), 150);
        }
    }
};
