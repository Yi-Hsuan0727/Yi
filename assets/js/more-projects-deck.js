/*
 * MoreProjectsDeck: card deck interactions + project detail modal.
 */
const MoreProjectsDeck = {
    modal: null,
    dialog: null,
    lastFocus: null,
    isInitialized: false,

    init: function() {
        if (this.isInitialized) return;

        const deck = document.getElementById('projects-more-list');
        const carousel = document.querySelector('.more-work-carousel');
        const hasDeck = deck && deck.classList.contains('projects-more-row');
        const hasCarousel = !!carousel;

        if (!hasDeck && !hasCarousel) return;

        this.isInitialized = true;
        this.ensureModal();
        if (hasDeck) {
            this.bindDeck(deck);
            this.bindDeckHover(deck);
        }
        if (hasCarousel) {
            this.bindMoreWorkCarousel(carousel);
        }
    },

    centerDeckScroll: function() {
        /* Board layout is static — no horizontal scroll centering. */
    },

    bindDeckHover: function(deck) {
        const cards = deck.querySelectorAll('.projects-more-card');
        if (!cards.length) return;

        const setActive = (card) => {
            deck.classList.add('is-hovering');
            cards.forEach((item) => {
                item.classList.toggle('is-active', item === card);
            });
        };

        const clearActive = () => {
            deck.classList.remove('is-hovering');
            cards.forEach((item) => item.classList.remove('is-active'));
        };

        cards.forEach((card) => {
            card.addEventListener('mouseenter', () => setActive(card));
            card.addEventListener('mouseleave', (e) => {
                if (!e.relatedTarget || !deck.contains(e.relatedTarget)) {
                    clearActive();
                }
            });
            card.addEventListener('focus', () => setActive(card));
        });

        deck.addEventListener('mouseleave', clearActive);
        deck.addEventListener('focusout', (e) => {
            if (!deck.contains(e.relatedTarget)) {
                clearActive();
            }
        });
    },

    ensureModal: function() {
        if (document.getElementById('projects-more-modal')) {
            this.modal = document.getElementById('projects-more-modal');
            this.dialog = this.modal.querySelector('.projects-more-modal__dialog');
            return;
        }

        const markup = `
            <div class="projects-more-modal" id="projects-more-modal" hidden>
                <div class="projects-more-modal__backdrop" data-close="true"></div>
                <div class="projects-more-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="projects-more-modal-title" tabindex="-1">
                    <button type="button" class="projects-more-modal__close" aria-label="Close project details">&times;</button>
                    <div class="projects-more-modal__hero">
                        <img src="" alt="">
                    </div>
                    <div class="projects-more-modal__body">
                        <h3 class="projects-more-modal__title" id="projects-more-modal-title"></h3>
                        <dl class="projects-more-modal__meta"></dl>
                        <p class="projects-more-modal__summary"></p>
                        <div class="projects-more-modal__footer">
                            <a class="projects-more-modal__cta" href="">View more</a>
                        </div>
                    </div>
                </div>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', markup);
        this.modal = document.getElementById('projects-more-modal');
        this.dialog = this.modal.querySelector('.projects-more-modal__dialog');

        this.modal.querySelector('.projects-more-modal__close').addEventListener('click', () => this.close());
        this.modal.querySelector('[data-close]').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) this.close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && !this.modal.hidden) {
                this.close();
            }
        });
    },

    bindDeck: function(deck) {
        deck.addEventListener('click', (e) => {
            const card = e.target.closest('.projects-more-card');
            if (!card) return;
            e.preventDefault();
            this.openFromElement(card);
        });
    },

    bindMoreWorkCarousel: function(carousel) {
        let pointerStart = null;

        carousel.addEventListener('mousedown', (e) => {
            const tile = e.target.closest('.more-work-tile');
            if (!tile || tile.getAttribute('aria-hidden') === 'true') return;
            pointerStart = { x: e.clientX, y: e.clientY };
        });

        carousel.addEventListener('touchstart', (e) => {
            const tile = e.target.closest('.more-work-tile');
            if (!tile || tile.getAttribute('aria-hidden') === 'true') return;
            pointerStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: true });

        carousel.addEventListener('click', (e) => {
            const tile = e.target.closest('.more-work-tile');
            if (!tile || tile.getAttribute('aria-hidden') === 'true') return;

            if (pointerStart) {
                const point = e.changedTouches && e.changedTouches[0]
                    ? e.changedTouches[0]
                    : e;
                const dx = Math.abs(point.clientX - pointerStart.x);
                const dy = Math.abs(point.clientY - pointerStart.y);
                pointerStart = null;
                if (dx > 8 || dy > 8) return;
            }

            e.preventDefault();
            this.openFromElement(tile);
        });
    },

    openFromElement: function(el) {
        const projectId = el.dataset.projectId;
        if (!projectId || typeof PortfolioApp === 'undefined') return;
        const project = PortfolioApp.getProject(projectId);
        if (!project) return;
        this.open(project);
    },

    open: function(project) {
        if (!this.modal) return;

        this.lastFocus = document.activeElement;

        const heroSrc = project.heroImage || project.image || '';
        const heroAlt = project.heroAlt || (project.title + ' hero image');
        const heroImg = this.modal.querySelector('.projects-more-modal__hero img');
        heroImg.src = heroSrc;
        heroImg.alt = heroAlt;

        this.modal.querySelector('.projects-more-modal__title').textContent = project.title;

        const meta = this.modal.querySelector('.projects-more-modal__meta');
        const metaRows = [];
        if (project.timeline) {
            metaRows.push(`<div class="projects-more-modal__meta-row"><dt>Timeline</dt><dd>${project.timeline}</dd></div>`);
        }
        if (project.role) {
            metaRows.push(`<div class="projects-more-modal__meta-row"><dt>Role</dt><dd>${project.role}</dd></div>`);
        }
        if (project.team) {
            metaRows.push(`<div class="projects-more-modal__meta-row"><dt>Team</dt><dd>${project.team}</dd></div>`);
        }
        meta.innerHTML = metaRows.join('');

        const summary = project.demoIntro || project.listSubline || project.subtitle || project.desc || '';
        this.modal.querySelector('.projects-more-modal__summary').textContent = summary;

        const link = this.modal.querySelector('.projects-more-modal__cta');
        link.href = project.link || '#';
        link.textContent = 'View more';

        this.modal.hidden = false;
        document.body.classList.add('projects-more-modal-open');
        this.dialog.focus();
    },

    close: function() {
        if (!this.modal || this.modal.hidden) return;
        this.modal.hidden = true;
        document.body.classList.remove('projects-more-modal-open');
        if (this.lastFocus && typeof this.lastFocus.focus === 'function') {
            this.lastFocus.focus();
        }
    }
};
