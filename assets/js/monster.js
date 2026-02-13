/* * MonsterLogic: Handles the eye-rolling animation for the sidebar monster.
 */
const MonsterLogic = {
    init: function() {
        // Only run if the monster exists on the page
        const eyes = document.querySelectorAll('.monster-eye');
        if (!eyes.length) return;

        document.addEventListener('mousemove', (e) => {
            eyes.forEach(eye => {
                const pupil = eye.querySelector('.monster-pupil');
                
                // Get Eye Center
                const rect = eye.getBoundingClientRect();
                const eyeX = rect.left + rect.width / 2;
                const eyeY = rect.top + rect.height / 2;

                // Calculate Angle & Distance
                const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
                
                // Limit the pupil movement so it stays inside the white area
                // (Eye Radius - Pupil Radius) roughly
                const maxDist = (rect.width / 4); 
                const dist = Math.min(maxDist, Math.hypot(e.clientX - eyeX, e.clientY - eyeY));

                // Calculate new position
                const pupilX = Math.cos(angle) * dist;
                const pupilY = Math.sin(angle) * dist;

                // Apply
                pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
            });
        });
    }
};

// Check if DOM is ready, then init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', MonsterLogic.init);
} else {
    // If loaded dynamically, wait a tick
    setTimeout(MonsterLogic.init, 100); 
}