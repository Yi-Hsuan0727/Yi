/**
 * Click-to-zoom lightbox for case study diagram images (.case-figure-readable).
 */
const CaseFigureZoom = {
    minScale: 0.5,
    maxScale: 4,
    step: 0.25,
    scale: 1,

    init() {
        const images = document.querySelectorAll('.case-figure-readable img');
        if (!images.length) return;

        this.buildOverlay();
        images.forEach((img) => {
            if (img.closest('a')) return;
            img.classList.add('case-figure-zoomable');
            img.setAttribute('role', 'button');
            img.setAttribute('tabindex', '0');
            const caption = img.closest('figure')?.querySelector('figcaption')?.textContent?.trim();
            if (caption) {
                img.setAttribute('aria-label', caption + ' (click to zoom)');
            }
            img.addEventListener('click', () => this.open(img));
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.open(img);
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (!this.overlay?.classList.contains('is-open')) return;
            if (e.key === 'Escape') this.close();
            if (e.key === '+' || e.key === '=') { e.preventDefault(); this.zoomIn(); }
            if (e.key === '-') { e.preventDefault(); this.zoomOut(); }
            if (e.key === '0') { e.preventDefault(); this.resetZoom(); }
        });
    },

    buildOverlay() {
        if (document.getElementById('case-figure-zoom')) return;

        const el = document.createElement('div');
        el.id = 'case-figure-zoom';
        el.className = 'case-figure-zoom';
        el.setAttribute('aria-hidden', 'true');
        el.innerHTML = `
            <div class="case-figure-zoom-backdrop" data-zoom-close></div>
            <div class="case-figure-zoom-dialog" role="dialog" aria-modal="true" aria-labelledby="case-figure-zoom-title">
                <div class="case-figure-zoom-toolbar">
                    <p id="case-figure-zoom-title" class="case-figure-zoom-title"></p>
                    <div class="case-figure-zoom-controls">
                        <button type="button" class="case-figure-zoom-btn" data-zoom-out aria-label="Zoom out">
                            <i class="fas fa-minus" aria-hidden="true"></i>
                        </button>
                        <span class="case-figure-zoom-level" aria-live="polite">100%</span>
                        <button type="button" class="case-figure-zoom-btn" data-zoom-in aria-label="Zoom in">
                            <i class="fas fa-plus" aria-hidden="true"></i>
                        </button>
                        <button type="button" class="case-figure-zoom-btn" data-zoom-reset aria-label="Reset zoom">
                            <i class="fas fa-rotate-left" aria-hidden="true"></i>
                        </button>
                        <button type="button" class="case-figure-zoom-btn case-figure-zoom-btn--close" data-zoom-close aria-label="Close">
                            <i class="fas fa-xmark" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
                <div class="case-figure-zoom-stage">
                    <img class="case-figure-zoom-img" alt="">
                </div>
            </div>
        `;
        document.body.appendChild(el);

        this.overlay = el;
        this.stage = el.querySelector('.case-figure-zoom-stage');
        this.img = el.querySelector('.case-figure-zoom-img');
        this.levelEl = el.querySelector('.case-figure-zoom-level');
        this.titleEl = el.querySelector('.case-figure-zoom-title');

        el.querySelector('[data-zoom-in]').addEventListener('click', () => this.zoomIn());
        el.querySelector('[data-zoom-out]').addEventListener('click', () => this.zoomOut());
        el.querySelector('[data-zoom-reset]').addEventListener('click', () => this.resetZoom());
        el.querySelectorAll('[data-zoom-close]').forEach((btn) => {
            btn.addEventListener('click', () => this.close());
        });

        this.stage.addEventListener('wheel', (e) => {
            if (!this.overlay.classList.contains('is-open')) return;
            e.preventDefault();
            if (e.deltaY < 0) this.zoomIn();
            else this.zoomOut();
        }, { passive: false });
    },

    open(sourceImg) {
        this.scale = 1;
        this.img.src = sourceImg.currentSrc || sourceImg.src;
        this.img.alt = sourceImg.alt || '';
        const caption = sourceImg.closest('figure')?.querySelector('figcaption')?.textContent?.trim();
        this.titleEl.textContent = caption || sourceImg.alt || 'Image preview';
        this.applyScale();
        this.overlay.classList.add('is-open');
        this.overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('case-figure-zoom-open');
        this.overlay.querySelector('[data-zoom-in]').focus();
    },

    close() {
        this.overlay.classList.remove('is-open');
        this.overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('case-figure-zoom-open');
        this.img.removeAttribute('src');
    },

    zoomIn() {
        this.scale = Math.min(this.maxScale, Math.round((this.scale + this.step) * 100) / 100);
        this.applyScale();
    },

    zoomOut() {
        this.scale = Math.max(this.minScale, Math.round((this.scale - this.step) * 100) / 100);
        this.applyScale();
    },

    resetZoom() {
        this.scale = 1;
        this.applyScale();
        this.stage.scrollTop = 0;
        this.stage.scrollLeft = 0;
    },

    applyScale() {
        this.img.style.transform = 'scale(' + this.scale + ')';
        this.levelEl.textContent = Math.round(this.scale * 100) + '%';
    }
};
