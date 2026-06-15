/*
 * MonsterLogic: Handles eye movement, blinking, hover shape, and click sparkles.
 */
const MonsterLogic = {
    blinkInterval: null,
    pointedTimeout: null,
    isInitialized: false,

    init: function() {
        if (this.isInitialized) return;
        const eyes = document.querySelectorAll('.monster-eye');
        const monsterBody = document.querySelector('.monster-body');
        if (!eyes.length || !monsterBody) return;
        this.isInitialized = true;

        // --- 1. EYES FOLLOW CURSOR ---
        document.addEventListener('mousemove', (e) => {
            eyes.forEach(eye => {
                const pupil = eye.querySelector('.monster-pupil');
                const rect = eye.getBoundingClientRect();
                const eyeX = rect.left + rect.width / 2;
                const eyeY = rect.top + rect.height / 2;

                const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
                const maxDist = rect.width / 4;
                const dist = Math.min(maxDist, Math.hypot(e.clientX - eyeX, e.clientY - eyeY));

                const pupilX = Math.cos(angle) * dist;
                const pupilY = Math.sin(angle) * dist;
                pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
            });
        });

        // --- 2. TOUCH SUPPORT (Mobile) ---
        document.addEventListener('touchmove', (e) => {
            if (!e.touches.length) return;
            const touch = e.touches[0];
            eyes.forEach(eye => {
                const pupil = eye.querySelector('.monster-pupil');
                const rect = eye.getBoundingClientRect();
                const eyeX = rect.left + rect.width / 2;
                const eyeY = rect.top + rect.height / 2;

                const angle = Math.atan2(touch.clientY - eyeY, touch.clientX - eyeX);
                const maxDist = rect.width / 4;
                const dist = Math.min(maxDist, Math.hypot(touch.clientX - eyeX, touch.clientY - eyeY));

                const pupilX = Math.cos(angle) * dist;
                const pupilY = Math.sin(angle) * dist;
                pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
            });
        }, { passive: true });

        // --- 3. OCCASIONAL BLINKING ---
        this.startBlinking(eyes);

        // --- 4. CLICK/TAP: Brief pulse + sparkles ---
        monsterBody.addEventListener('click', (e) => {
            this.triggerClickEffect(monsterBody, {
                clientX: e.clientX,
                clientY: e.clientY
            });
        });
        monsterBody.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches && e.touches[0];
            if (touch) {
                this.triggerClickEffect(monsterBody, {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
            } else {
                this.triggerClickEffect(monsterBody, null);
            }
        }, { passive: false });

        this.initSpeechBubble();
    },

    initSpeechBubble: function() {
        const cluster = document.querySelector('.monster-speech-cluster');
        const monster = document.querySelector('.site-footer-monster');
        if (!cluster || !monster) return;

        const bubbles = cluster.querySelectorAll('.monster-chat-bubble');
        let isVisible = false;

        const resetBubbles = () => {
            bubbles.forEach((bubble) => {
                bubble.style.animation = 'none';
                void bubble.offsetHeight;
                bubble.style.animation = '';
            });
        };

        const setVisible = (visible) => {
            if (visible === isVisible) return;
            isVisible = visible;
            if (!visible) resetBubbles();
            cluster.classList.toggle('is-visible', visible);
        };

        const getScrollState = () => {
            const container = document.getElementById('scroll-container');
            const isMobile = window.matchMedia('(max-width: 1200px)').matches;

            if (window.__lenis && !isMobile) {
                return {
                    scroll: window.__lenis.scroll,
                    max: window.__lenis.limit
                };
            }
            if (!isMobile && container) {
                return {
                    scroll: container.scrollTop,
                    max: container.scrollHeight - container.clientHeight
                };
            }
            return {
                scroll: window.scrollY,
                max: document.documentElement.scrollHeight - window.innerHeight
            };
        };

        const update = () => {
            const { scroll, max } = getScrollState();
            const atBottom = max <= 0 || scroll >= max - 40;
            setVisible(atBottom);
        };

        const container = document.getElementById('scroll-container');
        if (container) {
            container.addEventListener('scroll', update, { passive: true });
        }
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);

        const bindLenis = () => {
            if (!window.__lenis || this._lenisSpeechBound) return;
            this._lenisSpeechBound = true;
            window.__lenis.on('scroll', update);
            update();
        };

        bindLenis();
        setTimeout(bindLenis, 80);
        setTimeout(bindLenis, 250);
        window.addEventListener('load', () => {
            bindLenis();
            update();
        });

        update();
    },

    startBlinking: function(eyes) {
        const doBlink = () => {
            eyes.forEach(eye => {
                eye.classList.add('blinking');
                setTimeout(() => eye.classList.remove('blinking'), 300);
            });
        };

        // Blink at random intervals between 2-6 seconds
        const scheduleNext = () => {
            const delay = 2000 + Math.random() * 4000;
            this.blinkInterval = setTimeout(() => {
                doBlink();
                scheduleNext();
            }, delay);
        };
        scheduleNext();
    },

    triggerClickEffect: function(monsterBody, clickPoint) {
        this.applyPointedPulse(monsterBody);
        this.emitSparkles(monsterBody, clickPoint);
    },

    applyPointedPulse: function(monsterBody) {
        monsterBody.classList.add('pointed');
        if (this.pointedTimeout) clearTimeout(this.pointedTimeout);

        this.pointedTimeout = setTimeout(() => {
            monsterBody.classList.remove('pointed');
        }, 420);
    },

    ensureSparkLayer: function(monsterBody) {
        // Attach to body as a fixed overlay — viewport-relative, never contributes to scroll
        let layer = document.body.querySelector(':scope > .monster-spark-layer');
        if (!layer) {
            layer = document.createElement('div');
            layer.className = 'monster-spark-layer';
            document.body.appendChild(layer);
        }
        return layer;
    },

    emitSparkles: function(monsterBody, clickPoint) {
        const layer = this.ensureSparkLayer(monsterBody);
        if (!layer) return;

        const rect = monsterBody.getBoundingClientRect();
        const layerRect = layer.getBoundingClientRect();
        const clickedX = clickPoint ? clickPoint.clientX : (rect.left + rect.width * 0.5);
        const clickedY = clickPoint ? clickPoint.clientY : (rect.top + rect.height * 0.38);

        // Origin relative to spark layer
        const originX = clickedX - layerRect.left;
        const originY = clickedY - layerRect.top;

        const sparkleCount = 16;
        const shapeClasses = ['spark-triangle', 'spark-circle', 'spark-square'];

        // Physics constants
        const GRAVITY = 0.0004;  // px/ms²  (≈ 400 px/s² — gentle gravity)

        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('span');
            const shapeClass = shapeClasses[Math.floor(Math.random() * shapeClasses.length)];
            sparkle.className = `monster-spark ${shapeClass}`;
            sparkle.style.left = `${originX}px`;
            sparkle.style.top = `${originY}px`;
            sparkle.style.transform = 'translate(-50%, -50%)';

            layer.appendChild(sparkle);

            // Initial velocity — shoot outward/upward in a spread fan
            const angle = (-Math.PI / 2) + (Math.random() * 1.4 - 0.7);
            const speed = 0.10 + Math.random() * 0.15; // px/ms  (100–250 px/s)
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed; // negative = upward
            const initRot = Math.random() * 360;
            const rotSpeed = (Math.random() - 0.5) * 0.5; // deg/ms
            const maxDuration = 1000 + Math.random() * 500; // ms

            const startTime = performance.now();

            const animate = (time) => {
                if (!sparkle.isConnected) return;
                const t = time - startTime;
                if (t >= maxDuration) {
                    sparkle.remove();
                    return;
                }
                // Parabolic trajectory: x = x0 + vx·t,  y = y0 + vy·t + ½·g·t²
                const px = originX + vx * t;
                const py = originY + vy * t + 0.5 * GRAVITY * t * t;
                const rot = initRot + rotSpeed * t;

                sparkle.style.left = `${px}px`;
                sparkle.style.top = `${py}px`;
                sparkle.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;

                requestAnimationFrame(animate);
            };

            requestAnimationFrame(animate);
        }
    }
};

/* Initialized by PortfolioApp.startAppEffects — avoid duplicate DOMContentLoaded init */
