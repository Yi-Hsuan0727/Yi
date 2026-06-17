/*
 * CursorLogic: Handles custom cursor movement and hover effects.
 */
const CursorLogic = {
    _listeners: null,

    destroy: function() {
        document.querySelectorAll('.cursor-pointer, .cursor-label').forEach((el) => el.remove());

        document.documentElement.classList.remove('custom-cursor-active');
        document.body.classList.remove('cursor-view', 'hovering', 'custom-cursor-active');

        if (this._listeners) {
            window.removeEventListener('mousemove', this._listeners.mousemove);
            document.removeEventListener('mouseleave', this._listeners.mouseleave);
            document.removeEventListener('mouseenter', this._listeners.mouseenter);
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

        let mx = window.innerWidth / 2;
        let my = window.innerHeight / 2;
        let hasMoved = false;

        const positionPointer = (x, y) => {
            pointer.style.left = x + 'px';
            pointer.style.top = y + 'px';
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
            document.body.classList.remove('hovering');
        };

        const syncHoverState = (x, y) => {
            const el = document.elementFromPoint(x, y);
            if (!el) {
                setCursorLabel({ visible: false });
                document.body.classList.remove('hovering');
                return;
            }

            if (el.closest('.project-grid .project-card')) {
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

        const onMouseMove = (e) => {
            mx = e.clientX;
            my = e.clientY;
            positionPointer(mx, my);
            positionLabel(mx, my);
            if (!hasMoved) hasMoved = true;
            showCursor();
            syncHoverState(mx, my);
        };

        const onMouseLeave = () => {
            hideCursor();
        };

        const onMouseEnter = () => {
            if (hasMoved) showCursor();
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

        const scrollTargets = [
            window,
            document.getElementById('scroll-container')
        ].filter(Boolean);

        this._listeners = {
            mousemove: onMouseMove,
            mouseleave: onMouseLeave,
            mouseenter: onMouseEnter,
            pageshow: onPageShow,
            scroll: scrollTargets.map((target) => {
                target.addEventListener('scroll', onScroll, { passive: true });
                return { target, handler: onScroll };
            })
        };

        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mouseenter', onMouseEnter);
        window.addEventListener('pageshow', onPageShow);

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

        showCursor();
        syncHoverState(mx, my);
    },

    ensure: function() {
        if (window.innerWidth < 1200) {
            this.destroy();
            return;
        }
        if (!document.querySelector('.cursor-pointer')) {
            this.init();
        }
    }
};
