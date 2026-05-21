/*
 * SplashScreen: Home page entry animation with the brand M logo.
 */
const SplashScreen = {
    STORAGE_KEY: 'portfolio-home-splash-seen',
    FILL_DELAY_MS: 350,
    FILL_DURATION_MS: 1400,
    HOLD_MS: 300,
    EXIT_MS: 450,

    shouldShow: function() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return false;
        }
        return sessionStorage.getItem(this.STORAGE_KEY) !== '1';
    },

    markSeen: function() {
        sessionStorage.setItem(this.STORAGE_KEY, '1');
    },

    logoMarkup: function() {
        return `
            <div class="splash-logo" aria-hidden="true">
                <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Loading">
                    <defs>
                        <clipPath id="splash-m-fill-clip" clipPathUnits="userSpaceOnUse">
                            <rect class="splash-fill-mask" x="0" y="0" width="64" height="64"></rect>
                        </clipPath>
                    </defs>
                    <text class="splash-logo-base" x="32" y="54" font-size="72" font-weight="900" font-family="Arial" text-anchor="middle">M</text>
                    <text class="splash-logo-fill" x="32" y="54" font-size="72" font-weight="900" font-family="Arial" text-anchor="middle" clip-path="url(#splash-m-fill-clip)">M</text>
                </svg>
            </div>
        `;
    },

    show: function(onComplete) {
        document.body.classList.add('splash-active');

        const overlay = document.createElement('div');
        overlay.id = 'splash-screen';
        overlay.className = 'splash-screen';
        overlay.innerHTML = this.logoMarkup();
        document.body.appendChild(overlay);

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const fillDelay = reducedMotion ? 0 : this.FILL_DELAY_MS;
        const fillDuration = reducedMotion ? 0 : this.FILL_DURATION_MS;
        const hold = reducedMotion ? 120 : this.HOLD_MS;
        const exit = reducedMotion ? 0 : this.EXIT_MS;
        const exitStart = fillDelay + fillDuration + hold;

        window.setTimeout(function() {
            overlay.classList.add('splash-screen--exit');
        }, exitStart);

        window.setTimeout(function() {
            overlay.remove();
            document.body.classList.remove('splash-active');
            SplashScreen.markSeen();
            if (typeof onComplete === 'function') {
                onComplete();
            }
        }, exitStart + exit);
    }
};
