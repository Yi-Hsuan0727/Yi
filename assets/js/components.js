/*
 * PortfolioApp: Handles page structure generation.
 */
const PortfolioApp = {
    
    data: {
        home: {
            title: "Design.<br>Code.<br>Systems.",
            desc: "<strong>UX/UI Designer</strong> specializing in B2B SaaS and complex data visualization. Currently transforming requirements into scalable design systems.",
            meta: `` 
        },
        lcm: {
            title: "Indigenous Cultural Museums",
            desc: "Redesigning the digital presence for cultural heritage to meet WCAG 2.1 AA standards.",
            meta: `
                <div class="case-meta">
                    <h6>My Role</h6><p>UX Researcher & UI Designer</p>
                    <h6>Timeline</h6><p>Oct 2024 - Dec 2024</p>
                    <h6>Tools</h6><p>Figma, Webflow</p>
                </div>
            `,
            backLink: true,
            liveLink: "https://webflow.com",
            cover: true 
        }
    },

    init: function(pageType) {
        this.injectHead();
        this.buildLayout(pageType);
        
        if (typeof AppLogic !== 'undefined') {
            AppLogic.init();
        } else {
            console.error("AppLogic not found. Ensure assets/js/index.js is loaded.");
        }
    },

    injectHead: function() {
        if(document.getElementById('app-styles')) return;

        const headHTML = `
            <meta charset="UTF-8">
            <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22 font-weight=%22900%22 font-family=%22Arial%22 fill=%22%232ecc71%22>M</text></svg>">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style id="app-styles">html.lenis { height: auto; } .lenis.lenis-smooth { scroll-behavior: auto; } .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; } .lenis.lenis-stopped { overflow: hidden; } </style>
        `;
        document.head.insertAdjacentHTML('beforeend', headHTML);
    },

    buildLayout: function(pageType) {
        const contentDiv = document.getElementById('page-specific-content');
        const uniqueContent = contentDiv ? contentDiv.innerHTML : "";
        const pageData = this.data[pageType] || this.data.home;
        const logoSVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text y=".9em" font-size="90" font-weight="900" font-family="Arial" fill="#2ecc71">M</text></svg>`;

        // Sidebar
        let sidebarTop = '';
        if (pageData.backLink) {
            sidebarTop += `<a href="index.html" class="back-btn"><i class="fas fa-arrow-left"></i> Back to Home</a>`;
        }
        sidebarTop += `<div class="hero-text"><h1>${pageData.title}</h1><p>${pageData.desc}</p>${pageData.meta}</div>`;

        let sidebarBottom = '';
        if (pageType === 'home') {
            sidebarBottom = `
                <div class="bio-container">
                    <div style="width: 40px; height: 40px; margin-right: 10px;">${logoSVG}</div>
                    <div class="bio-text"><h4 style="font-size:0.9rem;">Michelle Chen</h4><p style="font-size:0.7rem; color:var(--secondary-text);">michelle.design</p></div>
                </div>`;
        } else {
            sidebarBottom = `
                <div class="bio-container" style="border:none; padding-top:0;">
                    <a href="${pageData.liveLink || '#'}" target="_blank" class="visit-btn">Visit Live Site <i class="fas fa-external-link-alt" style="margin-left:5px;"></i></a>
                </div>`;
        }

        // Home Filter
        let worksHeaderHTML = '';
        if (pageType === 'home') {
            worksHeaderHTML = `
                <div class="works-header" id="sticky-filter-bar">
                    <span class="section-title">Selected Works</span>
                    <div class="filter-bar">
                        <button class="filter-btn active" onclick="filterProjects('all')">All</button>
                        <button class="filter-btn" onclick="filterProjects('uiux')">UI/UX</button>
                        <button class="filter-btn" onclick="filterProjects('code')">Code</button>
                    </div>
                </div>`;
        }

        // Content + Footer
        const finalContent = `
            ${worksHeaderHTML}
            ${pageData.cover ? '<div class="case-hero-img">LCM Project Cover</div>' : ''}
            ${uniqueContent}
        `;

        // Footer Structure
        const footerHTML = `
            <footer class="site-footer">
                <span>© 2025 Michelle Chen. All Rights Reserved.</span>
                <div class="socials">
                    <span style="margin-right:10px;">Connect:</span>
                    <a href="https://linkedin.com" target="_blank"><i class="fab fa-linkedin"></i></a>
                    <a href="mailto:email@example.com"><i class="fas fa-envelope"></i></a>
                </div>
            </footer>
        `;

        // Full Layout
        const layoutHTML = `
            <div id="progress-bar"></div>
            
            <div class="mobile-top-bar" id="mobile-header">
                <div class="brand-logo">${logoSVG}</div>
                <button class="theme-toggle" onclick="toggleTheme()"><i class="fas fa-moon"></i></button>
            </div>

            <div id="app-root">
                <header class="site-header">
                    <div class="brand-logo">${logoSVG}</div>
                    <nav class="nav-menu">
                        <a href="index.html" class="nav-link ${pageType === 'home' ? 'active' : ''}">Work</a>
                        <a href="#" class="nav-link">About</a>
                        <a href="#" class="nav-link">Playground</a>
                        <button class="theme-toggle" onclick="toggleTheme()" style="margin-left:20px;"><i class="fas fa-moon"></i></button>
                    </nav>
                </header>

                <div class="content-wrapper">
                    <aside class="sidebar">
                        <div class="sidebar-top">${sidebarTop}</div>
                        ${sidebarBottom}
                    </aside>

                    <div class="right-panel">
                        <div class="scroll-area" id="scroll-container">
                            <div class="single-page-wrapper">
                                ${finalContent}
                            </div>
                        </div>
                        ${footerHTML}
                    </div>
                </div>
            </div>
        `;

        document.body.innerHTML = layoutHTML;
    }
};