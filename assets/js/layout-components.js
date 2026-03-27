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
                <a class="brand-logo" href="index.html" aria-label="Back to home">${logoSVG}</a>
                <button class="theme-toggle" onclick="toggleTheme()"><i class="fas fa-moon"></i></button>
            </div>`;
    },

    buildSiteHeader: function(logoSVG, pageType) {
        return `
            <header class="site-header">
                <a class="brand-logo" href="index.html" aria-label="Back to home">${logoSVG}</a>
                <nav class="nav-menu">
                    <a href="index.html" class="nav-link home-btn ${pageType === 'home' ? 'active' : ''}">Home</a>
                    <a href="about.html" class="nav-link ${pageType === 'about' ? 'active' : ''}">About</a>
                    <a href="playground.html" class="nav-link ${pageType === 'playground' ? 'active' : ''}">Playground</a>
                    <button class="theme-toggle" onclick="toggleTheme()" style="margin-left:20px;"><i class="fas fa-moon"></i></button>
                </nav>
            </header>`;
    },

    buildSidebarTop: function(pageData, projectMeta, pageType) {
        let html = '';
        if (pageData.backLink && projectMeta) {
            html += `<a href="index.html" class="back-btn"><i class="fas fa-arrow-left"></i> Back to Home</a>`;
        }
        if (pageType === 'playground') {
            html += `<a href="index.html" class="back-btn back-btn-mobile-only"><i class="fas fa-arrow-left"></i> Back to Home</a>`;
        }
        let tagsHTML = '';
        if (projectMeta && projectMeta.tags && projectMeta.tags.length) {
            tagsHTML = projectMeta.tags.map(function(t) {
                return `<span class="sidebar-tag">${t}</span>`;
            }).join('');
        }
        const introHTML = (!projectMeta && pageData.desc)
            ? `<p class="sidebar-intro">${pageData.desc}</p>`
            : '';
        const heroContent = `<div class="hero-text"><h1>${pageData.title}</h1>${projectMeta && projectMeta.subtitle ? `<span class="sidebar-meta-value">${projectMeta.subtitle}</span>` : ''}${tagsHTML ? `<div class="sidebar-tags">${tagsHTML}</div>` : ''}${introHTML}</div>`;
        html += heroContent;
        return html;
    },

    /* --- Sidebar metadata: timeline, team, role (project pages only); subtitle & tags live in hero-text --- */
    buildSidebarMeta: function(pageType, projectMeta, pageData) {
        if (pageType === 'home') return '';
        if (!projectMeta) return '';
        return `
            <div class="sidebar-meta">
                ${projectMeta.timeline ? `<div class="sidebar-meta-item"><span class="sidebar-meta-label">Timeline</span><span class="sidebar-meta-value">${projectMeta.timeline}</span></div>` : ''}
                ${projectMeta.team ? `<div class="sidebar-meta-item"><span class="sidebar-meta-label">Team</span><span class="sidebar-meta-value">${projectMeta.team}</span></div>` : ''}
                ${projectMeta.role ? `<div class="sidebar-meta-item"><span class="sidebar-meta-label">My Role</span><span class="sidebar-meta-value">${projectMeta.role}</span></div>` : ''}
            </div>`;
    },

    buildSidebarBottom: function(pageType, pageData) {
        if (pageType === 'home' || pageType === 'playground') {
            return '';
        }
        if (pageType === 'about') {
            return '';
        }
        const sidebarLink = pageData.liveLink || '#';
        let sidebarLabel = 'Visit Live Site';
        let sidebarIcon = 'fa-external-link-alt';
        if (pageType === 'unesco' || pageType === 'spring' || sidebarLink.indexOf('figma.com') !== -1) {
            sidebarLabel = 'View Prototype';
        } else if (sidebarLink.indexOf('devpost.com') !== -1) {
            sidebarLabel = 'View on Devpost';
        } else if (sidebarLink.indexOf('endlessstudios.com') !== -1 || sidebarLink.indexOf('endstar') !== -1) {
            sidebarLabel = 'Play the Game';
            sidebarIcon = 'fa-gamepad';
        }
        return `
            <div class="bio-container" style="border:none; padding-top:0; margin-top: auto;">
                <a href="${sidebarLink}" target="_blank" class="visit-btn">${sidebarLabel} <i class="fas ${sidebarIcon}" style="margin-left:5px;"></i></a>
            </div>`;
    },

    buildWorksHeader: function(pageType) {
        if (pageType === 'home') {
            return `
                <div class="works-header" id="sticky-filter-bar">
                    <span class="section-title">Selected Works</span>
                    <div class="filter-bar">
                        <button class="filter-btn active" onclick="filterProjects('uiux')">UI/UX</button>
                        <button class="filter-btn" onclick="filterProjects('code')">Code</button>
                    </div>
                </div>`;
        }
        return '';
    },

    /* Mobile-only: visit live site + back to home above next projects (project pages) */
    buildMobileProjectActions: function(projectMeta) {
        if (!projectMeta) return '';
        const liveLink = projectMeta.liveLink || '#';
        let liveLabel = 'Visit Live Site';
        let liveIcon = 'fa-external-link-alt';
        if (projectMeta.id === 'unesco' || projectMeta.id === 'spring' || (liveLink && liveLink.indexOf('figma.com') !== -1)) {
            liveLabel = 'View Prototype';
        } else if (liveLink && liveLink.indexOf('devpost.com') !== -1) {
            liveLabel = 'View on Devpost';
        } else if (liveLink && (liveLink.indexOf('endlessstudios.com') !== -1 || liveLink.indexOf('endstar') !== -1)) {
            liveLabel = 'Play the Game';
            liveIcon = 'fa-gamepad';
        }
        return `
            <div class="mobile-project-actions">
                <a href="${liveLink}" target="_blank" class="projects-cta-btn projects-cta-btn-secondary">${liveLabel} <i class="fas ${liveIcon}" style="margin-left:6px;"></i></a>
                <a href="index.html" class="projects-cta-btn"><i class="fas fa-arrow-left" style="margin-right:8px;"></i> Back to Home</a>
            </div>`;
    },

    /* --- Next Projects section (project pages only) --- */
    buildNextProjects: function(projects) {
        if (!projects || !projects.length) return '';
        let cardsHTML = projects.map(function(p) {
            let tagsHTML = p.tags.map(function(t) {
                return `<span class="project-overlay-tag">${t}</span>`;
            }).join('');
            let imgContent = p.image
                ? `<img src="${p.image}" alt="${p.title}">
                    <div class="project-overlay">
                        <div class="project-overlay-title">${p.title}</div>
                        <div class="project-overlay-subtitle">${p.subtitle}</div>
                        <div class="project-overlay-tags">${tagsHTML}</div>
                    </div>`
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

    buildFooter: function(pageType) {
        const monsterHTML = (pageType === 'home' || pageType === 'playground')
            ? `
                <div class="site-footer-monster" aria-hidden="true">
                    <div class="monster-container">
                        <div class="monster-body">
                            <div class="monster-eyes-wrapper">
                                <div class="monster-eye"><div class="monster-pupil"></div></div>
                                <div class="monster-eye"><div class="monster-pupil"></div></div>
                            </div>
                        </div>
                    </div>
                </div>`
            : '';
        return `
            <div class="site-footer-shell ${monsterHTML ? 'site-footer-shell-green' : ''}">
                ${monsterHTML}
                <footer class="site-footer ${monsterHTML ? 'site-footer-green' : ''}">
                    <span class="footer-copyright">&copy; 2025 Michelle Chen. All Rights Reserved.</span>
                    <div class="socials">
                        <span class="connect-label" style="font-weight:700;">Connect with me:</span>
                        <a href="https://linkedin.com" target="_blank" class="social-link"><i class="fab fa-linkedin"></i></a>
                        <a href="mailto:yche1356@asu.edu" class="social-link"><i class="fas fa-envelope"></i></a>
                        <a href="assets/img/resume.pdf" class="social-link resume-link">Resume</a>
                    </div>
                </footer>
            </div>`;
    },

    buildProgressBar: function() {
        return `<div id="progress-bar"></div>`;
    },

    buildBackToTop: function() {
        return `<button class="back-to-top" aria-label="Back to top"><i class="fas fa-arrow-up"></i></button>`;
    }
};
