/*
 * LayoutComponents: Reusable HTML builder functions for the portfolio layout.
 */
const LayoutComponents = {

    logoSVG: function() {
        return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><text x="32" y="54" font-size="72" font-weight="900" font-family="Arial" fill="#2ecc71" text-anchor="middle">M</text></svg>`;
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
                    <a href="playground.html" class="nav-link ${pageType === 'playground' ? 'active' : ''}">Playground</a>
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

    /* --- Sidebar metadata: subtitle, timeline, team, tags (project pages only) --- */
    buildSidebarMeta: function(pageType, projectMeta) {
        if (pageType === 'home' || !projectMeta) return '';
        let tagsHTML = '';
        if (projectMeta.tags && projectMeta.tags.length) {
            tagsHTML = projectMeta.tags.map(function(t) {
                return `<span class="sidebar-tag">${t}</span>`;
            }).join('');
        }
        return `
            <div class="sidebar-meta">
                ${projectMeta.subtitle ? `<div class="sidebar-meta-item"><span class="sidebar-meta-label">Subtitle</span><span class="sidebar-meta-value">${projectMeta.subtitle}</span></div>` : ''}
                ${projectMeta.timeline ? `<div class="sidebar-meta-item"><span class="sidebar-meta-label">Timeline</span><span class="sidebar-meta-value">${projectMeta.timeline}</span></div>` : ''}
                ${projectMeta.team ? `<div class="sidebar-meta-item"><span class="sidebar-meta-label">Team</span><span class="sidebar-meta-value">${projectMeta.team}</span></div>` : ''}
                ${projectMeta.role ? `<div class="sidebar-meta-item"><span class="sidebar-meta-label">My Role</span><span class="sidebar-meta-value">${projectMeta.role}</span></div>` : ''}
                ${tagsHTML ? `<div class="sidebar-meta-item"><span class="sidebar-meta-label">Tags</span><div class="sidebar-tags">${tagsHTML}</div></div>` : ''}
            </div>`;
    },

    buildSidebarBottom: function(pageType, pageData) {
        if (pageType === 'home' || pageType === 'playground') {
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
        if (pageType === 'home') {
            return `
                <div class="works-header" id="sticky-filter-bar">
                    <span class="section-title">Selected Works</span>
                    <div class="filter-bar">
                        <button class="filter-btn active" onclick="filterProjects('all')">All</button>
                        <button class="filter-btn" onclick="filterProjects('uiux')">UI/UX</button>
                        <button class="filter-btn" onclick="filterProjects('code')">Code</button>
                    </div>
                </div>`;
        }
        if (pageType === 'playground') {
            return `
                <div class="works-header" id="sticky-filter-bar">
                    <span class="section-title">Playground</span>
                </div>`;
        }
        return '';
    },

    /* --- Next Projects section (project pages only) --- */
    buildNextProjects: function(projects) {
        if (!projects || !projects.length) return '';
        let cardsHTML = projects.map(function(p) {
            let tagsHTML = p.tags.map(function(t) {
                return `<span class="tag">${t}</span>`;
            }).join('');
            let imgContent = p.image
                ? `<img src="${p.image}" alt="${p.title}">`
                : `<span style="color:#777;font-weight:bold;">${p.title}</span>`;
            return `
                <div class="next-project-card" onclick="window.location.href='${p.link}'">
                    <div class="next-project-img">${imgContent}</div>
                    <div class="next-project-info">
                        <h3>${p.title}</h3>
                        <span class="project-subtitle">${p.subtitle}</span>
                        <div class="tags">${tagsHTML}</div>
                    </div>
                </div>`;
        }).join('');

        return `
            <div class="next-projects-section">
                <h2 class="next-projects-title">Next Projects</h2>
                <div class="next-projects-grid">${cardsHTML}</div>
            </div>`;
    },

    buildFooter: function() {
        return `
            <footer class="site-footer">
                <span class="footer-copyright">&copy; 2025 Michelle Chen. All Rights Reserved.</span>
                <div class="socials">
                    <span class="connect-label" style="margin-right:10px; font-weight:700;">Connect with me:</span>
                    <a href="https://linkedin.com" target="_blank" class="social-link"><i class="fab fa-linkedin"></i></a>
                    <a href="mailto:email@example.com" class="social-link"><i class="fas fa-envelope"></i></a>
                    <a href="#" class="social-link resume-link">Resume</a>
                </div>
            </footer>`;
    },

    buildProgressBar: function() {
        return `<div id="progress-bar"></div>`;
    },

    buildBackToTop: function() {
        return `<button class="back-to-top" aria-label="Back to top"><i class="fas fa-arrow-up"></i></button>`;
    }
};
