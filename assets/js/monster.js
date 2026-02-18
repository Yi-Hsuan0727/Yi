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

        // --- 4. HOVER: Pointed shape ---
        monsterBody.addEventListener('mouseenter', () => {
            monsterBody.classList.add('pointed');
        });
        monsterBody.addEventListener('mouseleave', () => {
            monsterBody.classList.remove('pointed');
        });

        // --- 5. CLICK/TAP: Hover-like shape + sparkles ---
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
            if (!monsterBody.matches(':hover')) {
                monsterBody.classList.remove('pointed');
            }
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
        const clickedX = clickPoint ? clickPoint.clientX : (rect.left + (rect.width * 0.5));
        const clickedY = clickPoint ? clickPoint.clientY : (rect.top + (rect.height * 0.38));
        const originX = clickedX + (Math.random() * 8 - 4);
        const originY = clickedY - 10;
        const sparkleCount = 16;
        const shapeClasses = ['spark-triangle', 'spark-circle', 'spark-square'];

        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('span');
            const shapeClass = shapeClasses[Math.floor(Math.random() * shapeClasses.length)];
            sparkle.className = `monster-spark ${shapeClass}`;
            sparkle.style.left = `${originX - layerRect.left}px`;
            sparkle.style.top = `${originY - layerRect.top}px`;

            const angle = (-Math.PI / 2) + (Math.random() * 0.8 - 0.4);
            const distance = 40 + Math.random() * 75;
            const dx = Math.cos(angle) * distance * (0.4 + Math.random() * 0.6);
            const dy = -Math.abs(Math.sin(angle) * distance) - 20 - Math.random() * 25;
            sparkle.style.setProperty('--dx', `${dx}px`);
            sparkle.style.setProperty('--dy', `${dy}px`);
            sparkle.style.setProperty('--rot', `${Math.floor(Math.random() * 360)}deg`);
            sparkle.style.setProperty('--dur', `${520 + Math.random() * 280}ms`);

            layer.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 900);
        }
    }
};

// Check if DOM is ready, then init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', MonsterLogic.init.bind(MonsterLogic));
} else {
    setTimeout(() => MonsterLogic.init(), 100);
}
