/*
 * CursorLogic: Handles custom cursor movement and hover effects.
 */
const CursorLogic = {
    _listeners: null,

    destroy: function() {
        document.querySelectorAll('.cursor-pointer, .cursor-label').forEach((el) => el.remove());

        document.documentElement.classList.remove('custom-cursor-active');
        document.body.classList.remove('cursor-view', 'hovering', 'custom-cursor-active', 'cursor-tool-label');
        document.documentElement.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');

        if (this._listeners) {
            window.removeEventListener('pointermove', this._listeners.pointermove);
            document.removeEventListener('pointerdown', this._listeners.pointerdown, true);
            document.removeEventListener('pointerup', this._listeners.pointerup, true);
            document.removeEventListener('click', this._listeners.click, true);
            document.removeEventListener('lostpointercapture', this._listeners.lostpointercapture);
            document.removeEventListener('focusin', this._listeners.focusin, true);
            document.removeEventListener('mouseleave', this._listeners.mouseleave);
            document.removeEventListener('mouseenter', this._listeners.mouseenter);
            if (this._listeners.resize) {
                window.removeEventListener('resize', this._listeners.resize);
            }
            if (this._listeners.scroll) {
                this._listeners.scroll.forEach(({ target, handler }) => {
                    target.removeEventListener('scroll', handler);
                });
            }
            if (this._listeners.pageshow) {
                window.removeEventListener('pageshow', this._listeners.pageshow);
            }
            this._listeners = null;
        }
    },

    init: function() {
        this.destroy();

        if (window.innerWidth < 1200) return;

        const pointer = document.createElement('div');
        pointer.className = 'cursor-pointer';
        pointer.setAttribute('aria-hidden', 'true');

        const label = document.createElement('div');
        label.className = 'cursor-label comic-speech-bubble';
        label.textContent = 'View';
        label.setAttribute('aria-hidden', 'true');

        document.body.appendChild(pointer);
        document.body.appendChild(label);
        document.documentElement.classList.add('custom-cursor-active');
        document.body.classList.add('custom-cursor-active');
        document.documentElement.style.setProperty('cursor', 'none', 'important');
        document.body.style.setProperty('cursor', 'none', 'important');

        const enforceNativeCursorHidden = () => {
            document.documentElement.style.setProperty('cursor', 'none', 'important');
            document.body.style.setProperty('cursor', 'none', 'important');
        };

        let mx = 0;
        let my = 0;
        let hasMoved = false;
        const HOTSPOT_X = 2;
        const HOTSPOT_Y = 2;
        const POSITION_KEY = 'portfolio-cursor-position';

        const persistPosition = () => {
            try {
                sessionStorage.setItem(POSITION_KEY, JSON.stringify({ x: mx, y: my }));
            } catch (error) {
                /* ignore storage errors */
            }
        };

        const restorePosition = () => {
            try {
                const raw = sessionStorage.getItem(POSITION_KEY);
                if (!raw) return false;
                const saved = JSON.parse(raw);
                if (typeof saved.x !== 'number' || typeof saved.y !== 'number') return false;
                updatePointer(saved.x, saved.y);
                hasMoved = true;
                showCursor();
                syncHoverState(mx, my);
                return true;
            } catch (error) {
                return false;
            }
        };

        const positionPointer = (x, y) => {
            pointer.style.left = (x - HOTSPOT_X) + 'px';
            pointer.style.top = (y - HOTSPOT_Y) + 'px';
        };

        const positionLabel = (x, y) => {
            label.style.left = (x + 24) + 'px';
            label.style.top = (y + 18) + 'px';
        };

        positionPointer(mx, my);
        positionLabel(mx, my);

        const DEFAULT_LABEL = 'View';

        const setCursorLabel = (options = {}) => {
            const {
                visible = false,
                text = DEFAULT_LABEL,
                hidePointer = false,
                isTool = false
            } = options;

            label.textContent = text;
            document.body.classList.toggle('cursor-view', hidePointer);
            document.body.classList.toggle('cursor-tool-label', visible && isTool);
            label.style.opacity = visible ? '1' : '0';
            label.classList.toggle('is-view', visible);
            label.classList.toggle('cursor-label--tool', visible && isTool);
        };

        const showCursor = () => {
            pointer.classList.add('is-active');
            label.classList.add('is-active');
            pointer.style.opacity = '1';
        };

        const hideCursor = () => {
            pointer.style.opacity = '0';
            pointer.classList.remove('is-active');
            label.classList.remove('is-active');
            setCursorLabel({ visible: false });
            document.body.classList.remove('hovering', 'cursor-tool-label');
        };

        const syncHoverState = (x, y) => {
            const el = document.elementFromPoint(x, y);
            if (!el) {
                setCursorLabel({ visible: false });
                document.body.classList.remove('hovering');
                return;
            }

            if (el.closest('.project-grid .project-card, .home-spotlight-card__link')) {
                document.body.classList.add('hovering');
                setCursorLabel({ visible: true, text: DEFAULT_LABEL, hidePointer: true });
                return;
            }

            const toolSticker = el.closest('.tool-sticker');
            if (toolSticker) {
                document.body.classList.add('hovering');
                setCursorLabel({
                    visible: true,
                    text: toolSticker.getAttribute('aria-label') || '',
                    hidePointer: false,
                    isTool: true
                });
                return;
            }

            setCursorLabel({ visible: false });

            if (el.closest('a, button, input, textarea, .project-card, .filter-btn, .visit-btn, .theme-toggle, .nav-link, .cursor-hover')) {
                document.body.classList.add('hovering');
            } else {
                document.body.classList.remove('hovering');
            }
        };

        const updatePointer = (x, y) => {
            mx = x;
            my = y;
            positionPointer(mx, my);
            positionLabel(mx, my);
        };

        const refreshCursor = () => {
            enforceNativeCursorHidden();
            if (!hasMoved) return;
            showCursor();
            syncHoverState(mx, my);
        };

        const onPointerMove = (e) => {
            enforceNativeCursorHidden();
            updatePointer(e.clientX, e.clientY);
            if (!hasMoved) hasMoved = true;
            showCursor();
            syncHoverState(mx, my);
            persistPosition();
        };

        const onPointerDown = (e) => {
            enforceNativeCursorHidden();
            if (e.pointerType === 'mouse') {
                updatePointer(e.clientX, e.clientY);
                if (!hasMoved) hasMoved = true;
                showCursor();
                syncHoverState(mx, my);
                persistPosition();
            }
        };

        const onPointerUp = (e) => {
            enforceNativeCursorHidden();
            if (e.pointerType !== 'mouse') return;
            requestAnimationFrame(() => {
                const active = document.activeElement;
                if (
                    active
                    && active !== document.body
                    && !active.matches('input, textarea, select, [contenteditable="true"]')
                    && active.matches('a, button, .cursor-hover, .project-card, .filter-btn, .visit-btn, .site-top-nav__link, .site-top-nav__menu-toggle, .theme-toggle, .nav-link, [role="button"]')
                ) {
                    active.blur();
                }
                refreshCursor();
            });
        };

        const onClick = () => {
            enforceNativeCursorHidden();
            requestAnimationFrame(refreshCursor);
        };

        const onFocusIn = () => {
            requestAnimationFrame(refreshCursor);
        };

        const onLostPointerCapture = (e) => {
            if (e.pointerType !== 'mouse') return;
            enforceNativeCursorHidden();
            updatePointer(e.clientX, e.clientY);
            refreshCursor();
        };

        const onMouseLeave = () => {
            hideCursor();
        };

        const onMouseEnter = (e) => {
            if (!hasMoved) return;
            updatePointer(e.clientX, e.clientY);
            showCursor();
            syncHoverState(mx, my);
        };

        const onScroll = () => {
            if (hasMoved) syncHoverState(mx, my);
        };

        const onPageShow = (event) => {
            if (event.persisted) {
                this.init();
                return;
            }
            setCursorLabel({ visible: false });
            document.body.classList.remove('hovering');
            if (hasMoved) syncHoverState(mx, my);
        };

        const onResize = () => {
            if (window.innerWidth < 1200) {
                this.destroy();
                return;
            }
            if (!document.querySelector('.cursor-pointer')) {
                this.init();
            }
        };

        const scrollTargets = [
            window,
            document.getElementById('scroll-container')
        ].filter(Boolean);

        this._listeners = {
            pointermove: onPointerMove,
            pointerdown: onPointerDown,
            pointerup: onPointerUp,
            click: onClick,
            lostpointercapture: onLostPointerCapture,
            focusin: onFocusIn,
            mouseleave: onMouseLeave,
            mouseenter: onMouseEnter,
            resize: onResize,
            pageshow: onPageShow,
            scroll: scrollTargets.map((target) => {
                target.addEventListener('scroll', onScroll, { passive: true });
                return { target, handler: onScroll };
            })
        };

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        document.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true });
        document.addEventListener('pointerup', onPointerUp, { capture: true, passive: true });
        document.addEventListener('click', onClick, { capture: true, passive: true });
        document.addEventListener('lostpointercapture', onLostPointerCapture, { passive: true });
        document.addEventListener('focusin', onFocusIn, true);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mouseenter', onMouseEnter);
        window.addEventListener('pageshow', onPageShow);
        window.addEventListener('resize', onResize, { passive: true });

        const projectGrid = document.querySelector('.project-grid');
        if (projectGrid) {
            projectGrid.addEventListener('mouseleave', (e) => {
                if (!e.target.closest('.project-card')) return;
                requestAnimationFrame(() => syncHoverState(mx, my));
            });
        }

        const toolbox = document.querySelector('.home-toolbox-stickers');
        if (toolbox) {
            toolbox.addEventListener('mouseleave', () => {
                requestAnimationFrame(() => syncHoverState(mx, my));
            });
        }

        restorePosition();
    },

    ensure: function() {
        if (window.innerWidth < 1200) {
            this.destroy();
            return;
        }
        const pointers = document.querySelectorAll('.cursor-pointer');
        const isHealthy = pointers.length === 1
            && document.documentElement.classList.contains('custom-cursor-active')
            && this._listeners;
        if (!isHealthy) {
            this.init();
        }
    }
};
