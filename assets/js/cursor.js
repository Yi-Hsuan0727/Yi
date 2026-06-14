/*
 * CursorLogic: Handles custom cursor movement and hover effects.
 */
const CursorLogic = {
    _listeners: null,

    destroy: function() {
        const oldDot = document.querySelector('.cursor-dot');
        const oldOutline = document.querySelector('.cursor-outline');
        const oldLabel = document.querySelector('.cursor-label');
        if (oldDot) oldDot.remove();
        if (oldOutline) oldOutline.remove();
        if (oldLabel) oldLabel.remove();

        document.body.classList.remove('cursor-view', 'hovering');

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
        // Always clean up first
        this.destroy();

        // Only init on desktop
        if (window.innerWidth < 1200) return;

        // Create Elements
        const dot = document.createElement("div");
        dot.className = "cursor-dot";
        const outline = document.createElement("div");
        outline.className = "cursor-outline";
        const label = document.createElement("div");
        label.className = "cursor-label";
        label.textContent = "View";
        label.setAttribute("aria-hidden", "true");

        document.body.appendChild(dot);
        document.body.appendChild(outline);
        document.body.appendChild(label);

        // State Variables
        let mx = window.innerWidth / 2;
        let my = window.innerHeight / 2;
        let ox = mx;
        let oy = my;
        let hasMoved = false;

        const positionCursor = (x, y) => {
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            label.style.left = x + 'px';
            label.style.top = y + 'px';
            outline.style.left = ox + 'px';
            outline.style.top = oy + 'px';
        };

        positionCursor(mx, my);

        const showCursor = () => {
            dot.classList.add('is-active');
            outline.classList.add('is-active');
            label.classList.add('is-active');
            dot.style.opacity = '1';
            outline.style.opacity = '1';
        };

        const setViewCursor = (active) => {
            document.body.classList.toggle('cursor-view', active);
            label.style.opacity = active ? '1' : '0';
            label.classList.toggle('is-view', active);
        };

        const hideCursor = () => {
            dot.style.opacity = '0';
            outline.style.opacity = '0';
            dot.classList.remove('is-active');
            outline.classList.remove('is-active');
            label.classList.remove('is-active');
            setViewCursor(false);
            document.body.classList.remove('hovering');
        };

        const syncHoverState = (x, y) => {
            const el = document.elementFromPoint(x, y);
            if (!el) {
                setViewCursor(false);
                document.body.classList.remove('hovering');
                return;
            }

            if (el.closest('.project-grid .project-card')) {
                document.body.classList.add('hovering');
                setViewCursor(true);
                return;
            }

            setViewCursor(false);

            if (el.closest('a, button, input, textarea, .project-card, .filter-btn, .visit-btn, .theme-toggle, .nav-link, .cursor-hover')) {
                document.body.classList.add('hovering');
            } else {
                document.body.classList.remove('hovering');
            }
        };

        // Define named listener functions for cleanup
        const onMouseMove = (e) => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top = my + 'px';
            if (!hasMoved) {
                hasMoved = true;
                ox = mx;
                oy = my;
                outline.style.left = ox + 'px';
                outline.style.top = oy + 'px';
                label.style.left = ox + 'px';
                label.style.top = oy + 'px';
            }
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

        const onPageShow = () => {
            setViewCursor(false);
            document.body.classList.remove('hovering');
            if (hasMoved) syncHoverState(mx, my);
        };

        const scrollTargets = [
            window,
            document.getElementById('scroll-container')
        ].filter(Boolean);

        // Store references for cleanup
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

        document.querySelectorAll('.project-grid .project-card').forEach((card) => {
            card.addEventListener('mouseleave', () => {
                requestAnimationFrame(() => syncHoverState(mx, my));
            });
        });

        // Animation Loop
        function animate() {
            ox += (mx - ox) * 0.15;
            oy += (my - oy) * 0.15;
            outline.style.left = ox + 'px';
            outline.style.top = oy + 'px';
            label.style.left = ox + 'px';
            label.style.top = oy + 'px';
            if (hasMoved) syncHoverState(mx, my);
            requestAnimationFrame(animate);
        }
        animate();
    }
};
