/*
 * LayoutComponents: Reusable HTML builder functions for the portfolio layout.
 */
const LayoutComponents = {

    logoSVG: function() {
        return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text y=".9em" font-size="90" font-weight="900" font-family="Arial" fill="#2ecc71">M</text></svg>`;
    },

    buildMobileHeader: function(logoSVG) {
        return `
            <div class="mobile-top-bar" id="mobile-header">
                <div class="brand-logo">${logoSVG}</div>
                <button class="theme-toggle" onclick="toggleTheme()"><i class="fas fa-moon"></i></button>
            </div>`;
    },

    buildSiteHeader: function(logoSVG, pageType) {
        return `
            <header class="site-header">
                <div class="brand-logo">${logoSVG}</div>
                <nav class="nav-menu">
                    <a href="index.html" class="nav-link ${pageType === 'home' ? 'active' : ''}">Work</a>
                    <a href="#" class="nav-link">About</a>
                    <a href="#" class="nav-link">Playground</a>
                    <button class="theme-toggle" onclick="toggleTheme()" style="margin-left:20px;"><i class="fas fa-moon"></i></button>
                </nav>
            </header>`;
    },

    buildSidebarTop: function(pageData) {
        let html = '';
        if (pageData.backLink) {
            html += `<a href="index.html" class="back-btn"><i class="fas fa-arrow-left"></i> Back to Home</a>`;
        }
        html += `<div class="hero-text"><h1>${pageData.title}</h1><p>${pageData.desc}</p>${pageData.meta}</div>`;
        return html;
    },

    buildSidebarBottom: function(pageType, pageData) {
        if (pageType === 'home') {
            return `
                <div class="sidebar-footer-container">
                    <div class="monster-container">
                        <div class="monster-body">
                            <div class="monster-eyes-wrapper">
                                <div class="monster-eye"><div class="monster-pupil"></div></div>
                                <div class="monster-eye"><div class="monster-pupil"></div></div>
                            </div>
                        </div>
                    </div>
                </div>`;
        } else {
            return `
                <div class="bio-container" style="border:none; padding-top:0; margin-top: auto;">
                    <a href="${pageData.liveLink || '#'}" target="_blank" class="visit-btn">Visit Live Site <i class="fas fa-external-link-alt" style="margin-left:5px;"></i></a>
                </div>`;
        }
    },

    buildWorksHeader: function(pageType) {
        if (pageType !== 'home') return '';
        return `
            <div class="works-header" id="sticky-filter-bar">
                <span class="section-title">Selected Works</span>
                <div class="filter-bar">
                    <button class="filter-btn active" onclick="filterProjects('all')">All</button>
                    <button class="filter-btn" onclick="filterProjects('uiux')">UI/UX</button>
                    <button class="filter-btn" onclick="filterProjects('code')">Code</button>
                </div>
            </div>`;
    },

    buildFooter: function() {
        return `
            <footer class="site-footer">
                <span>© 2025 Michelle Chen. All Rights Reserved.</span>
                <div class="socials">
                    <span style="margin-right:10px;">Connect:</span>
                    <a href="https://linkedin.com" target="_blank"><i class="fab fa-linkedin"></i></a>
                    <a href="mailto:email@example.com"><i class="fas fa-envelope"></i></a>
                </div>
            </footer>`;
    },

    buildProgressBar: function() {
        return `<div id="progress-bar"></div>`;
    }
};
