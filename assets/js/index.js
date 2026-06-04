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
            this.initProjectCardTransitions();
            this.initCaseStudyVideos();
            // Cursor init is now handled by CursorLogic or Components.js
        }, 50);
        window.addEventListener('load', () => this.initCaseStudyVideos());
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

    /* Hide case-study videos until the first frame is ready (avoids poster/static image flash). */
    initCaseStudyVideos: function() {
        const videos = document.querySelectorAll('.single-page-wrapper video, .case-hero-video video');
        videos.forEach((video) => {
            if (video.dataset.videoInit === '1') return;
            video.dataset.videoInit = '1';
            video.classList.add('case-video-pending');

            const reveal = () => {
                video.classList.remove('case-video-pending');
                video.classList.add('case-video-ready');
                video.removeAttribute('poster');
            };

            if (video.readyState >= 2) {
                reveal();
            } else {
                video.addEventListener('loadeddata', reveal, { once: true });
                video.addEventListener('canplay', reveal, { once: true });
            }

            if (video.hasAttribute('autoplay') && !video.hasAttribute('data-autoplay-on-view')) {
                video.muted = true;
                video.setAttribute('playsinline', '');
                const playPromise = video.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(() => {});
                }
            }
        });
    },

    // --- 2. SMOOTH SCROLL (LENIS) ---
    initLenis: function() {
        if (window.__lenis) {
            window.__lenis.destroy();
            window.__lenis = null;
        }
        if (window.innerWidth > 1200 && typeof Lenis !== 'undefined') {
            const wrapper = document.getElementById('scroll-container');
            const content = document.querySelector('.single-page-wrapper');
            if (!wrapper || !content) return;

            const lenis = new Lenis({ wrapper, content, duration: 1.2, smooth: true });
            window.__lenis = lenis;

            function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
            requestAnimationFrame(raf);

            const refreshLenis = () => lenis.resize();
            setTimeout(refreshLenis, 100);
            setTimeout(refreshLenis, 400);
            window.addEventListener('load', refreshLenis);
            window.addEventListener('resize', refreshLenis);
        }
    },

    // --- 3. SCROLL INTERACTIONS ---
    initScrollLogic: function() {
        const desktopContainer = document.getElementById('scroll-container');
        const progressBar = document.getElementById('progress-bar');
        
        let lastScroll = 0;
        const isMobile = window.innerWidth <= 1200;
        const scroller = isMobile ? window : desktopContainer;

        if (!scroller && !isMobile) return;

        const onScroll = () => {
            let currentScroll, maxScroll;
            if (!isMobile && window.__lenis) {
                currentScroll = window.__lenis.scroll;
                maxScroll = window.__lenis.limit;
            } else if (isMobile) {
                currentScroll = window.scrollY;
                maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            } else {
                currentScroll = desktopContainer.scrollTop;
                maxScroll = desktopContainer.scrollHeight - desktopContainer.clientHeight;
            }
            
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

        if (!isMobile && window.__lenis) {
            window.__lenis.on('scroll', onScroll);
        } else {
            scroller.addEventListener('scroll', onScroll, { passive: true });
        }

        // Back to Top Button
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                if (isMobile) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (window.__lenis) {
                    window.__lenis.scrollTo(0);
                } else if (desktopContainer) {
                    desktopContainer.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }
    },

    // --- 4. PROJECT CARD SMOOTH LEAVE TRANSITION ---
    initProjectCardTransitions: function() {
        document.querySelectorAll('.project-card, .next-project-card').forEach(card => {
            const isNextCard = card.classList.contains('next-project-card');
            const img = card.querySelector(isNextCard ? '.next-project-img img' : '.image-container img');
            if (!img) return;

            card.addEventListener('mouseleave', () => {
                img.style.animation = 'none';
                img.style.transform = 'scale(1)';
                img.style.transition = 'transform 0.4s ease';

                setTimeout(() => {
                    if (!card.matches(':hover')) {
                        img.style.animation = '';
                        img.style.transform = '';
                        img.style.transition = '';
                    }
                }, 450);
            });

            card.addEventListener('mouseenter', () => {
                img.style.animation = '';
                img.style.transform = '';
                img.style.transition = '';
            });
        });
    },

    // (former 5. Entry loader logic removed)
};

/* --- Global Filter Function --- */
function filterProjects(category) {
    const cards = document.querySelectorAll('.project-card');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        const filter = btn.getAttribute('data-filter');
        btn.classList.toggle('active', filter === category);
    });

    cards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(/\s+/);
        const match = category === 'all' || categories.includes(category);
        card.style.display = match ? 'flex' : 'none';
        if (match) setTimeout(() => card.style.opacity = '1', 50);
    });
}