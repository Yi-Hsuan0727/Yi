/*
 * BubbleConfetti: lightweight confetti burst around comic speech bubbles.
 */
const BubbleConfetti = {
    prefersReducedMotion: function() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },

    getHostParent: function(target) {
        return target.closest('.site-contact-form, .site-contact-connect-note');
    },

    ensureHost: function(target) {
        const parent = this.getHostParent(target);
        if (!parent) return null;

        let host = parent.querySelector(':scope > .bubble-confetti-host');
        if (!host) {
            host = document.createElement('div');
            host.className = 'bubble-confetti-host';
            host.setAttribute('aria-hidden', 'true');
            parent.insertBefore(host, parent.firstChild);
            if (window.getComputedStyle(parent).position === 'static') {
                parent.style.position = 'relative';
            }
        }
        return host;
    },

    burst: function(target, options) {
        if (this.prefersReducedMotion()) return;
        if (!target || typeof target.getBoundingClientRect !== 'function') return;

        const host = this.ensureHost(target);
        if (!host) return;

        options = options || {};
        const rect = target.getBoundingClientRect();
        const hostRect = host.getBoundingClientRect();

        if (!rect.width && !rect.height) return;

        const centerX = rect.left + rect.width / 2 - hostRect.left;
        const centerY = rect.top + rect.height / 2 - hostRect.top;
        const spreadX = Math.max(rect.width * (options.spreadX || 0.55), 48);
        const spreadY = Math.max(rect.height * (options.spreadY || 0.55), 32);
        const count = options.count || 28;
        const colors = options.colors || ['#2ecc71', '#E8E258', '#4A55E0', '#ff6b9d', '#ff9a00', '#111111', '#ffffff'];
        const shapes = ['rect', 'circle', 'triangle'];
        const gravity = 0.00035;

        for (let i = 0; i < count; i++) {
            const piece = document.createElement('span');
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            piece.className = 'bubble-confetti-piece bubble-confetti-piece--' + shape;
            if (shape === 'triangle') {
                piece.style.color = color;
            } else {
                piece.style.backgroundColor = color;
            }

            const originX = centerX + (Math.random() - 0.5) * spreadX;
            const originY = centerY + (Math.random() - 0.5) * spreadY;
            piece.style.left = originX + 'px';
            piece.style.top = originY + 'px';
            piece.style.transform = 'translate(-50%, -50%)';
            host.appendChild(piece);

            const angle = Math.random() * Math.PI * 2;
            const speed = 0.07 + Math.random() * 0.13;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 0.04;
            const initRot = Math.random() * 360;
            const rotSpeed = (Math.random() - 0.5) * 0.45;
            const maxDuration = 900 + Math.random() * 700;
            const startTime = performance.now();

            const animate = function(time) {
                if (!piece.isConnected) return;
                const t = time - startTime;
                if (t >= maxDuration) {
                    piece.remove();
                    return;
                }

                const px = originX + vx * t;
                const py = originY + vy * t + 0.5 * gravity * t * t;
                const rot = initRot + rotSpeed * t;
                const opacity = Math.max(0, 1 - (t / maxDuration) * 0.95);

                piece.style.left = px + 'px';
                piece.style.top = py + 'px';
                piece.style.opacity = String(opacity);
                piece.style.transform = 'translate(-50%, -50%) rotate(' + rot + 'deg)';

                requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);
        }
    }
};
