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
        if (!eyes.length) return;
        const monsterBody = document.querySelector('.monster-body');
        this.isInitialized = true;

        // --- 1. EYES FOLLOW CURSOR (shared rAF loop with nav + header) ---
        if (typeof EyeFollow !== 'undefined') {
            EyeFollow.registerNodeList(eyes, '.monster-pupil');
        }

        // --- 2. OCCASIONAL BLINKING ---
        this.startBlinking(eyes);

        // --- 3. CLICK/TAP: Brief pulse + sparkles ---
        if (monsterBody) {
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
        }
    },

    initSpeechBubble: function() {
        const cluster = document.querySelector('.monster-speech-cluster');
        const monster = document.querySelector('.site-footer-monster');
        if (!cluster || !monster) return;

        const bubbles = cluster.querySelectorAll('.monster-chat-bubble');
        let isVisible = false;
        let observer = null;

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

        const bindObserver = () => {
            if (observer) observer.disconnect();

            const isMobile = window.matchMedia('(max-width: 1200px)').matches;
            const scrollRoot = !isMobile ? document.getElementById('scroll-container') : null;

            observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.target !== monster) return;
                    setVisible(entry.isIntersecting);
                });
            }, {
                root: scrollRoot,
                threshold: 0.06,
                rootMargin: '0px 0px 0px 0px'
            });

            observer.observe(monster);
        };

        bindObserver();
        window.addEventListener('resize', bindObserver);
        window.addEventListener('load', bindObserver);
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
