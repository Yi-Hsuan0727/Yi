/* * AppLogic: Handles page behaviors, scroll logic, and themes.
 * (Cursor logic has been moved to cursor.js)
 */
const AppLogic = {

    init: function() {
        this.initTheme();
        
        // Wait briefly for DOM to be ready
        setTimeout(() => {
            this.initLenis();
            this.initScrollLogic();
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

            // Desktop header & works-header hide/show
            if (!isMobile && desktopContainer) {
                const scrollThreshold = 50;
                if (currentScroll > scrollThreshold) {
                    if (currentScroll > lastScroll) {
                        document.body.classList.add('scroll-down');
                    } else {
                        document.body.classList.remove('scroll-down');
                    }
                } else if (currentScroll < 10) {
                    document.body.classList.remove('scroll-down');
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