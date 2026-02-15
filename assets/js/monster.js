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

        // --- 4. HOVER: Pointed shape + wiggle ---
        monsterBody.addEventListener('mouseenter', () => {
            monsterBody.classList.add('pointed');
        });
        monsterBody.addEventListener('mouseleave', () => {
            monsterBody.classList.remove('pointed');
        });

        // --- 5. CLICK/TAP: Wiggle ---
        monsterBody.addEventListener('click', () => {
            this.triggerWiggle(monsterBody, eyes);
        });
        monsterBody.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.triggerWiggle(monsterBody, eyes);
            // Also trigger pointed briefly on tap
            monsterBody.classList.add('pointed');
            setTimeout(() => monsterBody.classList.remove('pointed'), 600);
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

    triggerWiggle: function(monsterBody, eyes) {
        // Remove then re-add to restart animation
        monsterBody.classList.remove('wiggling');
        void monsterBody.offsetWidth; // force reflow
        monsterBody.classList.add('wiggling');

        // Quick double-blink on wiggle
        eyes.forEach(eye => {
            eye.classList.add('blinking');
            setTimeout(() => eye.classList.remove('blinking'), 300);
        });

        setTimeout(() => monsterBody.classList.remove('wiggling'), 600);
    }
};

// Check if DOM is ready, then init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', MonsterLogic.init.bind(MonsterLogic));
} else {
    setTimeout(() => MonsterLogic.init(), 100);
}
