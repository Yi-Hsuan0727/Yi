/* * AppLogic: Handles behaviors, scroll logic, and global state.
 */
const AppLogic = {

    init: function() {
        this.initTheme();
        
        setTimeout(() => {
            this.initLenis();
            this.initScrollLogic();
            this.initCursor();
        }, 50);
    },

    // 1. Theme Logic
    initTheme: function() {
        window.toggleTheme = function() {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        };
        const saved = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
    },

    // 2. Smooth Scroll (Lenis) - Desktop Only
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

    // 3. Scroll Interactions (Sticky Header, Progress)
    initScrollLogic: function() {
        const desktopContainer = document.getElementById('scroll-container');
        const progressBar = document.getElementById('progress-bar');
        
        let lastScroll = 0;
        
        // Mobile scrolls window, Desktop scrolls container
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

            // Mobile Sticky Logic
            if (isMobile) {
                const scrollThreshold = 50; 
                
                if (currentScroll > scrollThreshold) {
                    if (currentScroll > lastScroll) {
                        // SCROLLING DOWN -> Hide Nav, Collapse Filter Text
                        document.body.classList.add('nav-hidden');
                    } else {
                        // SCROLLING UP -> Show Nav, Show Filter Text
                        document.body.classList.remove('nav-hidden');
                    }
                } else if (currentScroll < 10) {
                    // AT TOP
                    document.body.classList.remove('nav-hidden');
                }
            }
            
            lastScroll = currentScroll <= 0 ? 0 : currentScroll;
        };

        scroller.addEventListener('scroll', onScroll, { passive: true });
    },

    // 4. Custom Cursor
    initCursor: function() {
        if (window.innerWidth < 900) return;

        const dot = document.createElement("div"); dot.className = "cursor-dot";
        const outline = document.createElement("div"); outline.className = "cursor-outline";
        document.body.appendChild(dot); document.body.appendChild(outline);

        let mx = window.innerWidth/2, my = window.innerHeight/2;
        let ox = mx, oy = my;

        // Move
        window.addEventListener('mousemove', e => { 
            mx = e.clientX; my = e.clientY; 
            dot.style.left = mx + 'px'; dot.style.top = my + 'px';
            dot.style.opacity = 1; outline.style.opacity = 1; 
        });

        // Hide on Leave
        document.addEventListener('mouseleave', () => {
            dot.style.opacity = 0; outline.style.opacity = 0;
        });
        document.addEventListener('mouseenter', () => {
            dot.style.opacity = 1; outline.style.opacity = 1;
        });

        // Smooth Follow
        function animate() {
            ox += (mx - ox) * 0.15; oy += (my - oy) * 0.15;
            outline.style.left = ox + 'px'; outline.style.top = oy + 'px';
            requestAnimationFrame(animate);
        }
        animate();

        // Hover
        document.body.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .project-card, .filter-btn, .visit-btn')) {
                document.body.classList.add('hovering');
            } else {
                document.body.classList.remove('hovering');
            }
        });
    }
};

// Global Filter Function
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