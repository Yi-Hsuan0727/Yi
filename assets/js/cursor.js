/*
 * CursorLogic: Handles custom cursor movement and hover effects.
 */
const CursorLogic = {
    _listeners: null,

    destroy: function() {
        const oldDot = document.querySelector('.cursor-dot');
        const oldOutline = document.querySelector('.cursor-outline');
        if (oldDot) oldDot.remove();
        if (oldOutline) oldOutline.remove();

        if (this._listeners) {
            window.removeEventListener('mousemove', this._listeners.mousemove);
            document.removeEventListener('mouseleave', this._listeners.mouseleave);
            document.removeEventListener('mouseenter', this._listeners.mouseenter);
            this._listeners = null;
        }
    },

    init: function() {
        // Always clean up first
        this.destroy();

        // Only init on desktop
        if (window.innerWidth < 900) return;

        // Create Elements
        const dot = document.createElement("div");
        dot.className = "cursor-dot";
        const outline = document.createElement("div");
        outline.className = "cursor-outline";

        document.body.appendChild(dot);
        document.body.appendChild(outline);

        // State Variables
        let mx = window.innerWidth / 2;
        let my = window.innerHeight / 2;
        let ox = mx;
        let oy = my;

        // Define named listener functions for cleanup
        const onMouseMove = (e) => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top = my + 'px';
            dot.style.opacity = 1;
            outline.style.opacity = 1;
        };

        const onMouseLeave = () => {
            dot.style.opacity = 0;
            outline.style.opacity = 0;
        };

        const onMouseEnter = () => {
            dot.style.opacity = 1;
            outline.style.opacity = 1;
        };

        // Store references for cleanup
        this._listeners = {
            mousemove: onMouseMove,
            mouseleave: onMouseLeave,
            mouseenter: onMouseEnter
        };

        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mouseenter', onMouseEnter);

        // Animation Loop
        function animate() {
            ox += (mx - ox) * 0.15;
            oy += (my - oy) * 0.15;
            outline.style.left = ox + 'px';
            outline.style.top = oy + 'px';
            requestAnimationFrame(animate);
        }
        animate();

        // Hover Interactions
        document.body.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, input, textarea, .project-card, .filter-btn, .visit-btn, .theme-toggle, .nav-link, .cursor-hover')) {
                document.body.classList.add('hovering');
            } else {
                document.body.classList.remove('hovering');
            }
        });
    }
};
