/*
 * MonsterLogic: Handles eye-rolling, blinking, wiggle, and hover interactions.
 */
const MonsterLogic = {
    blinkInterval: null,

    init: function() {
        const eyes = document.querySelectorAll('.monster-eye');
        const monsterBody = document.querySelector('.monster-body');
        if (!eyes.length || !monsterBody) return;

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

        // --- 5. CLICK/TAP: Pointed + sparkles ---
        monsterBody.addEventListener('click', (e) => {
            this.triggerClickEffect(monsterBody, eyes, e);
        });
        monsterBody.addEventListener('touchstart', (e) => {
            e.preventDefault();
            monsterBody.classList.add('pointed');
            setTimeout(() => monsterBody.classList.remove('pointed'), 600);
            this.triggerClickEffect(monsterBody, eyes, e.touches[0]);
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

    triggerClickEffect: function(monsterBody, eyes, event) {
        // Pointed effect (same as hover)
        monsterBody.classList.add('pointed');
        setTimeout(() => monsterBody.classList.remove('pointed'), 600);

        // Quick blink
        eyes.forEach(eye => {
            eye.classList.add('blinking');
            setTimeout(() => eye.classList.remove('blinking'), 300);
        });

        // Sparkle particles
        const container = monsterBody.closest('.monster-container');
        const rect = container.getBoundingClientRect();
        const shapes = ['circle', 'triangle', 'square'];
        const count = 14;

        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            const shape = shapes[i % shapes.length];
            el.className = 'sparkle sparkle-' + shape;

            // Start from center-top of the monster
            const startX = rect.width / 2;
            const startY = 10;
            el.style.left = startX + 'px';
            el.style.top = startY + 'px';

            // Random direction and distance
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
            const dist = 60 + Math.random() * 80;
            el.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
            el.style.setProperty('--dy', Math.sin(angle) * dist - 40 + 'px');

            container.appendChild(el);
            setTimeout(() => el.remove(), 700);
        }
    }
};

// Check if DOM is ready, then init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', MonsterLogic.init.bind(MonsterLogic));
} else {
    setTimeout(() => MonsterLogic.init(), 100);
}
