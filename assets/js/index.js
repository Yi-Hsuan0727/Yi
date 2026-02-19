/* * AppLogic: Handles page behaviors, scroll logic, and themes.
 * (Cursor logic has been moved to cursor.js)
 */
const AppLogic = {
    entryAnimationInterval: null,
    entryAnimationTimers: [],

    init: function() {
        this.initTheme();
        
        // Wait briefly for DOM to be ready
        setTimeout(() => {
            this.initLenis();
            this.initScrollLogic();
            this.initEntryAnimation();
            // Cursor init is now handled by CursorLogic or Components.js
        }, 50);
    },

    // --- 1. THEME LOGIC ---
    updateThemeIcons: function(theme) {
        const icons = document.querySelectorAll('.theme-toggle i');
        icons.forEach(icon => {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
    },

    initTheme: function() {
        const self = this;
        window.toggleTheme = function() {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            self.updateThemeIcons(next);
        };
        const saved = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
        // Delay icon update to ensure DOM is built
        setTimeout(() => self.updateThemeIcons(saved), 0);
    },

    // --- 2. SMOOTH SCROLL (LENIS) ---
    initLenis: function() {
        if (window.innerWidth > 900 && typeof Lenis !== 'undefined') {
            const lenis = new Lenis({ 
                wrapper: document.getElementById('scroll-container'), 
                content: document.querySelector('.single-page-wrapper'),
                duration: 1.2,
                smooth: true
            });
            function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
            requestAnimationFrame(raf);
        }
    },

    // --- 3. SCROLL INTERACTIONS ---
    initScrollLogic: function() {
        const desktopContainer = document.getElementById('scroll-container');
        const progressBar = document.getElementById('progress-bar');
        
        let lastScroll = 0;
        const isMobile = window.innerWidth <= 900;
        const scroller = isMobile ? window : desktopContainer;

        if (!scroller && !isMobile) return;

        const onScroll = () => {
            const currentScroll = isMobile ? window.scrollY : desktopContainer.scrollTop;
            
            // Progress Bar
            let maxScroll, scrollHeight, clientHeight;
            if (isMobile) {
                scrollHeight = document.documentElement.scrollHeight;
                clientHeight = window.innerHeight;
            } else {
                scrollHeight = desktopContainer.scrollHeight;
                clientHeight = desktopContainer.clientHeight;
            }
            maxScroll = scrollHeight - clientHeight;
            
            if (progressBar) progressBar.style.width = ((currentScroll / maxScroll) * 100) + "%";

            // Back to Top visibility
            const backToTop = document.querySelector('.back-to-top');
            if (backToTop) {
                if (maxScroll > 0 && (currentScroll / maxScroll) > 0.15) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            }

            // Mobile Sticky Header Logic
            if (isMobile) {
                const scrollThreshold = 50;
                if (currentScroll > scrollThreshold) {
                    if (currentScroll > lastScroll) {
                        document.body.classList.add('nav-hidden'); // Scroll Down
                    } else {
                        document.body.classList.remove('nav-hidden'); // Scroll Up
                    }
                } else if (currentScroll < 10) {
                    document.body.classList.remove('nav-hidden'); // At Top
                }
            }

            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        };

        scroller.addEventListener('scroll', onScroll, { passive: true });

        // Back to Top Button
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                if (isMobile) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (desktopContainer) {
                    desktopContainer.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    },

    // --- 4. ENTRY LOADER (monster transition on home) ---
    initEntryAnimation: function() {
        const loader = document.getElementById('entry-loader');
        if (!loader) return;

        const eyes = loader.querySelectorAll('.entry-monster-eye');
        const sparkLayer = document.getElementById('entry-loader-spark-layer');
        if (!eyes.length) {
            loader.classList.add('hide');
            return;
        }

        if (this.entryAnimationInterval) {
            clearInterval(this.entryAnimationInterval);
            this.entryAnimationInterval = null;
        }
        if (this.entryAnimationTimers.length) {
            this.entryAnimationTimers.forEach(timer => clearTimeout(timer));
            this.entryAnimationTimers = [];
        }

        document.body.classList.add('entry-loading');

        const moveEyes = () => {
            const maxDist = eyes[0] ? eyes[0].clientWidth * 0.22 : 10;
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * maxDist;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            eyes.forEach(eye => {
                const pupil = eye.querySelector('.entry-monster-pupil');
                if (!pupil) return;
                pupil.style.transform = `translate(${x}px, ${y}px)`;
            });
        };

        const addTimer = (delay, callback) => {
            const timer = setTimeout(callback, delay);
            this.entryAnimationTimers.push(timer);
        };

        moveEyes();
        this.entryAnimationInterval = setInterval(moveEyes, 420);

        addTimer(1600, () => loader.classList.add('bubble-phase'));
        addTimer(2450, () => {
            loader.classList.add('pop-phase');
            this.emitLoaderSparkles(sparkLayer);
        });
        addTimer(3150, () => this.emitLoaderSparkles(sparkLayer));
        addTimer(4250, () => {
            loader.classList.add('hide');
            if (this.entryAnimationInterval) {
                clearInterval(this.entryAnimationInterval);
                this.entryAnimationInterval = null;
            }
            document.body.classList.remove('entry-loading');
        });
        addTimer(4800, () => {
            loader.remove();
            this.entryAnimationTimers = [];
        });
    },

    emitLoaderSparkles: function(sparkLayer) {
        if (!sparkLayer) return;

        const layerRect = sparkLayer.getBoundingClientRect();
        const originX = layerRect.width / 2;
        const originY = layerRect.height / 2;
        const shapeClasses = ['spark-triangle', 'spark-circle', 'spark-square'];
        const sparkleCount = 22;

        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('span');
            const shapeClass = shapeClasses[Math.floor(Math.random() * shapeClasses.length)];
            sparkle.className = `entry-loader-spark ${shapeClass}`;
            sparkle.style.left = `${originX}px`;
            sparkle.style.top = `${originY}px`;

            const angle = ((Math.PI * 2) / sparkleCount) * i + (Math.random() * 0.6 - 0.3);
            const distance = 45 + Math.random() * 90;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;
            sparkle.style.setProperty('--dx', `${dx}px`);
            sparkle.style.setProperty('--dy', `${dy}px`);
            sparkle.style.setProperty('--rot', `${Math.floor(Math.random() * 360)}deg`);
            sparkle.style.setProperty('--dur', `${560 + Math.random() * 260}ms`);

            sparkLayer.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 950);
        }
    }
};

/* --- Global Filter Function --- */
function filterProjects(category) {
    const cards = document.querySelectorAll('.project-card');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        const text = btn.textContent.toLowerCase();
        const isMatch = (category === 'all' && text === 'all') || text.includes(category === 'uiux' ? 'ui/ux' : category);
        btn.classList.toggle('active', isMatch);
    });

    cards.forEach(card => {
        const categories = card.getAttribute('data-category');
        const match = category === 'all' || categories.includes(category);
        card.style.display = match ? 'flex' : 'none';
        if (match) setTimeout(() => card.style.opacity = '1', 50);
    });
}