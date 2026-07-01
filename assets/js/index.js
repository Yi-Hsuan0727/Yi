/* * AppLogic: Handles page behaviors, scroll logic, and themes.
 * (Cursor logic has been moved to cursor.js)
 */
const AppLogic = {
    init: function() {
        this.initTheme();
        
        // Wait briefly for DOM to be ready
        setTimeout(() => {
            this.initSectionSnap();
            this.initLenis();
            this.initScrollLogic();
            this.initProjectCardTransitions();
            this.initCaseStudyVideos();
            // Cursor init is now handled by CursorLogic or Components.js
        }, 50);
        window.addEventListener('load', () => {
            this.initCaseStudyVideos();
        });
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

    _refreshLenis: function() {
        if (window.__lenis) window.__lenis.resize();
    },

    _clearLenisRefreshTimers: function() {
        if (this._lenisRefreshT100 != null) clearTimeout(this._lenisRefreshT100);
        if (this._lenisRefreshT400 != null) clearTimeout(this._lenisRefreshT400);
        this._lenisRefreshT100 = null;
        this._lenisRefreshT400 = null;
    },

    _bindLenisLoadRefresh: function() {
        if (this._lenisLoadHandler) return;
        this._lenisLoadHandler = () => this._refreshLenis();
        window.addEventListener('load', this._lenisLoadHandler);
    },

    _unbindLenisLoadRefresh: function() {
        if (!this._lenisLoadHandler) return;
        window.removeEventListener('load', this._lenisLoadHandler);
        this._lenisLoadHandler = null;
    },

    // --- 2. SMOOTH SCROLL (LENIS) ---
    initLenis: function() {
        // Tear down any existing instance + its rAF loop. This is essential when
        // the viewport crosses to mobile width: a leftover Lenis instance stays
        // bound to #scroll-container (which becomes overflow:visible on mobile) and
        // swallows wheel/touch gestures, leaving the page stuck at the top.
        if (window.__lenis) {
            if (this._lenisRaf) cancelAnimationFrame(this._lenisRaf);
            this._lenisRaf = null;
            window.__lenis.destroy();
            window.__lenis = null;
        }

        if (window.innerWidth > 1200 && typeof Lenis !== 'undefined' && !document.querySelector('.app-root-playground')) {
            const wrapper = document.getElementById('scroll-container');
            const content = document.querySelector('.single-page-wrapper');
            if (!wrapper || !content) return;

            const lenis = new Lenis({
                wrapper,
                content,
                duration: 0.85,
                smooth: true,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
            window.__lenis = lenis;
            if (this._snapOnScroll) lenis.on('scroll', this._snapOnScroll);

            const raf = (time) => { lenis.raf(time); this._lenisRaf = requestAnimationFrame(raf); };
            this._lenisRaf = requestAnimationFrame(raf);

            const refreshLenis = () => lenis.resize();
            setTimeout(refreshLenis, 100);
            setTimeout(refreshLenis, 400);
            window.addEventListener('load', refreshLenis);
        }

        this.initLenisBreakpointWatcher();
    },

    /* Gentle snap: when scrolling settles near a snap point, ease to it so users
       pause on each block. Snap points are the hero, each Featured/More-work card
       in the deck, and the What-can-I-bring / About sections. Mid-block scrolling
       stays free. Works with Lenis (desktop) and native scroll (mobile). */
    initSectionSnap: function() {
        const sc = document.getElementById('scroll-container');
        if (!sc) return;
        // Home only, and respect reduced-motion preferences.
        if (!document.querySelector('.home-featured-edge')) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        let settleTimer = null;
        let lockUntil = 0;

        // The scroller is #scroll-container on desktop, but the window on mobile
        // (where #scroll-container becomes overflow:visible).
        const getScroller = () => {
            if (window.__lenis) return sc;
            if (sc && getComputedStyle(sc).overflowY !== 'visible' && sc.scrollHeight > sc.clientHeight + 5) return sc;
            return document.scrollingElement || document.documentElement;
        };

        // Absolute scroll positions to rest on. Each item is centered vertically in
        // the viewport; items taller than the viewport just align to the top.
        const getSnapPositions = (refTop, current, viewport) => {
            const positions = [];
            const centerOffset = (h) => Math.max(0, (viewport - h) / 2);
            const alignCenter = (el) => {
                if (el && el.getClientRects().length) {
                    positions.push(current + (el.getBoundingClientRect().top - refTop) - centerOffset(el.offsetHeight));
                }
            };

            alignCenter(document.querySelector('.single-page-wrapper > .home-page-header'));

            // Featured deck: one snap per card, centered. Cards are sticky, so offsetTop
            // is unreliable (pinned cards report their pinned offset). Derive each card's
            // flow position from the deck's (non-sticky) top plus the cumulative
            // offsetHeight of the cards above it.
            const deck = document.querySelector('.home-featured-edge .stack-deck');
            if (deck && deck.getClientRects().length) {
                const deckAlign = current + (deck.getBoundingClientRect().top - refTop);
                let flow = 0;
                deck.querySelectorAll(':scope > .stack-card').forEach((card) => {
                    const h = card.offsetHeight;
                    positions.push(deckAlign + flow - centerOffset(h));
                    flow += h + (parseFloat(getComputedStyle(card).marginBottom) || 0);
                });
            }

            const canBring = document.querySelector('#home-can-bring');
            const canBringUsesPin = canBring
                && canBring.classList.contains('home-scroll-pin-block--can-bring')
                && typeof HomeScrollScenes !== 'undefined'
                && HomeScrollScenes.enabled;
            if (!canBringUsesPin) {
                alignCenter(canBring);
            }

            return positions;
        };

        const getCanBringPinLanding = (refTop, current, viewport) => {
            const canBring = document.querySelector('#home-can-bring.home-scroll-pin-block--can-bring');
            if (!canBring || typeof HomeScrollScenes === 'undefined' || !HomeScrollScenes.enabled) return null;

            const pinnable = canBring.offsetHeight - viewport;
            if (pinnable <= 0) return null;

            const top = canBring.getBoundingClientRect().top - refTop;
            const progress = Math.max(0, Math.min(1, -top / pinnable));
            // Only ease into the section at the start of the pin range — not mid-flip.
            if (progress > 0.14) return null;

            return current + top;
        };

        const snapToNearest = () => {
            if (Date.now() < lockUntil) return;

            const scroller = getScroller();
            const isWindow = scroller === (document.scrollingElement || document.documentElement);
            const refTop = isWindow ? 0 : scroller.getBoundingClientRect().top;
            const viewport = isWindow ? window.innerHeight : scroller.clientHeight;
            const current = window.__lenis ? window.__lenis.scroll : scroller.scrollTop;

            const positions = getSnapPositions(refTop, current, viewport);
            const canBringLanding = getCanBringPinLanding(refTop, current, viewport);
            if (canBringLanding != null) {
                positions.push(canBringLanding);
            }
            if (!positions.length) return;

            let bestTarget = null, bestDist = Infinity;
            positions.forEach((p) => {
                const d = Math.abs(p - current);
                if (d < bestDist) { bestDist = d; bestTarget = p; }
            });
            if (bestTarget === null) return;

            const isCanBringLanding = canBringLanding != null && Math.abs(bestTarget - canBringLanding) < 2;

            // Only ease in when a snap point is reasonably close but not already aligned.
            if (bestDist <= 3 || bestDist >= viewport * 0.6) return;

            const target = Math.max(0, Math.round(bestTarget));
            const snapDuration = isCanBringLanding
                ? Math.min(1.05, 0.65 + (bestDist / viewport) * 0.55)
                : 0.55;
            lockUntil = Date.now() + Math.round(snapDuration * 1000) + 120;
            if (window.__lenis) {
                window.__lenis.scrollTo(target, {
                    duration: snapDuration,
                    easing: (t) => 1 - Math.pow(1 - t, 3)
                });
            } else if (isWindow) {
                window.scrollTo({ top: target, behavior: 'smooth' });
            } else {
                scroller.scrollTo({ top: target, behavior: 'smooth' });
            }
        };

        const onScroll = () => {
            if (settleTimer) clearTimeout(settleTimer);
            settleTimer = setTimeout(snapToNearest, 130);
        };

        // Expose so initLenis can also hook Lenis' scroll event (covers desktop).
        this._snapOnScroll = onScroll;
        sc.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });

        if (window.__lenis) {
            window.__lenis.on('scroll', onScroll);
        }
    },

    // Re-evaluate Lenis when the viewport crosses the 1200px breakpoint so smooth
    // scroll is created on desktop and fully destroyed on mobile (bound once).
    initLenisBreakpointWatcher: function() {
        if (this._lenisBreakpointBound) return;
        this._lenisBreakpointBound = true;
        window.addEventListener('resize', () => {
            const isMobile = window.innerWidth <= 1200;
            if (isMobile) {
                if (window.__lenis) this.initLenis();
            } else if (!window.__lenis) {
                this.initLenis();
            } else {
                window.__lenis.resize();
            }
        }, { passive: true });
    },

    // --- 3. SCROLL INTERACTIONS ---
    initSidebarCompact: function() {
        const wrapper = document.querySelector('.content-wrapper.sidebar-compact-scope');
        /* Home and project pages keep sidebar width fixed while scrolling */
        if (!wrapper || wrapper.classList.contains('sidebar-compact-scope--home') || wrapper.classList.contains('sidebar-compact-scope--project')) {
            return function() {};
        }

        const COMPACT_ON = 80;
        const COMPACT_OFF = 24;
        let isCompact = false;

        return function(currentScroll) {
            if (window.innerWidth <= 1200) {
                if (isCompact) {
                    wrapper.classList.remove('sidebar-compact');
                    isCompact = false;
                }
                return;
            }

            if (!isCompact && currentScroll > COMPACT_ON) {
                wrapper.classList.add('sidebar-compact');
                isCompact = true;
                if (window.__lenis) window.__lenis.resize();
            } else if (isCompact && currentScroll < COMPACT_OFF) {
                wrapper.classList.remove('sidebar-compact');
                isCompact = false;
                if (window.__lenis) window.__lenis.resize();
            }
        };
    },

    initScrollLogic: function() {
        const desktopContainer = document.getElementById('scroll-container');
        const progressBar = document.getElementById('progress-bar');
        const isPlayground = !!document.querySelector('.app-root-playground');
        
        let lastScroll = 0;
        let lastRailActive = false;
        let navSwitchTimer = null;
        const isMobile = window.innerWidth <= 1200;
        const useWindowScroll = isMobile || isPlayground;
        const scroller = useWindowScroll ? window : desktopContainer;
        const updateSidebarCompact = this.initSidebarCompact();
        const topNav = document.querySelector('.site-top-nav--auto-hide');
        const NAV_HIDE_AFTER = 120; // keep nav visible near the top

        if (!scroller && !useWindowScroll) return;

        const onScroll = () => {
            let currentScroll, maxScroll;
            if (!useWindowScroll && window.__lenis) {
                currentScroll = window.__lenis.scroll;
                maxScroll = window.__lenis.limit;
            } else if (useWindowScroll) {
                currentScroll = window.scrollY;
                maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            } else {
                currentScroll = desktopContainer.scrollTop;
                maxScroll = desktopContainer.scrollHeight - desktopContainer.clientHeight;
            }
            
            if (progressBar) progressBar.style.width = ((currentScroll / maxScroll) * 100) + "%";

            updateSidebarCompact(currentScroll);

            // Nav auto-hide (project desktop handled in PortfolioApp.initProjectNavScroll)
            if (topNav) {
                const delta = currentScroll - lastScroll;
                const isProjectDesktop = document.body.classList.contains('is-project-page') && window.innerWidth > 1200;

                // Vertical nav rail: keep the nav as a left vertical rail from the
                // featured-work section down through "what I bring" and the footer
                // (home desktop) instead of auto-hiding it.
                const featured = document.getElementById('featured-work');
                const isHomeDesktop = !!document.querySelector('.app-root-home') && window.innerWidth > 1200;
                let railActive = false;
                if (isHomeDesktop && featured) {
                    // Active once the featured list reaches the viewport center, and
                    // stays active for everything below it (can-bring, footer).
                    railActive = featured.getBoundingClientRect().top <= window.innerHeight / 2;
                }
                // Crossfade the horizontal <-> vertical switch: fade out, swap the
                // layout while invisible, then fade back in.
                if (railActive !== lastRailActive) {
                    lastRailActive = railActive;
                    topNav.classList.add('is-nav-switching');
                    if (navSwitchTimer) clearTimeout(navSwitchTimer);
                    navSwitchTimer = setTimeout(() => {
                        topNav.classList.toggle('is-nav-rail', railActive);
                        requestAnimationFrame(() => topNav.classList.remove('is-nav-switching'));
                    }, 240);
                }
                if (railActive) topNav.classList.remove('is-scroll-hidden');

                if (!isProjectDesktop && !railActive) {
                    if (currentScroll <= NAV_HIDE_AFTER || delta < -4) {
                        topNav.classList.remove('is-scroll-hidden');
                    } else if (delta > 4) {
                        topNav.classList.add('is-scroll-hidden');
                    }
                }
            }

            // Back to Top visibility
            const backToTop = document.querySelector('.back-to-top');
            if (backToTop) {
                if (maxScroll > 0 && (currentScroll / maxScroll) > 0.15) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            }

            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        };

        if (!useWindowScroll && window.__lenis) {
            window.__lenis.on('scroll', onScroll);
        } else {
            scroller.addEventListener('scroll', onScroll, { passive: true });
        }
        onScroll();

        window.addEventListener('resize', () => {
            if (window.innerWidth <= 1200) {
                updateSidebarCompact(0);
            } else {
                const currentScroll = window.__lenis
                    ? window.__lenis.scroll
                    : (desktopContainer ? desktopContainer.scrollTop : 0);
                updateSidebarCompact(currentScroll);
            }
        }, { passive: true });

        // Back to Top Button
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                if (useWindowScroll) {
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