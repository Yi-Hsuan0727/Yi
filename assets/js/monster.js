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
        const container = monsterBody.closest('.monster-container');
        if (!container) return null;
        let layer = container.querySelector('.monster-spark-layer');
        if (!layer) {
            layer = document.createElement('div');
            layer.className = 'monster-spark-layer';
            container.insertBefore(layer, monsterBody);
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

// Check if DOM is ready, then init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', MonsterLogic.init.bind(MonsterLogic));
} else {
    setTimeout(() => MonsterLogic.init(), 100);
}
