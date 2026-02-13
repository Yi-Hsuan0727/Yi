/*
 * PortfolioApp: Structure & Content
 */
const PortfolioApp = {
    // ... (Your data object remains the same) ...
    data: {
        home: {
            title: `Design<span class="shape shape-circle"></span><br>Code<span class="shape shape-triangle"></span><br>Systems<span class="shape shape-square"></span>`,
            desc: "<strong>UX/UI Designer</strong> specializing in B2B SaaS...",
            meta: `` 
        },
        lcm: {
            title: "Indigenous Cultural Museums",
            desc: "Redesigning the digital presence...",
            meta: `...`, 
            backLink: true,
            liveLink: "https://webflow.com",
            cover: true 
        }
    },

    init: function(pageType) {
        this.injectHead();
        this.buildLayout(pageType);
        
        // 1. Init General App Logic
        if (typeof AppLogic !== 'undefined') AppLogic.init();
        
        // 2. Init Monster Logic (Home only)
        if (pageType === 'home' && typeof MonsterLogic !== 'undefined') MonsterLogic.init();

        // 3. Init Cursor Logic (NEW)
        if (typeof CursorLogic !== 'undefined') {
            CursorLogic.init();
        }
    },
    
    // ... (rest of injectHead and buildLayout functions remain unchanged) ...
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
        const logoSVG = LayoutComponents.logoSVG();

        const worksHeaderHTML = LayoutComponents.buildWorksHeader(pageType);
        const finalContent = `${worksHeaderHTML} ${pageData.cover ? '<div class="case-hero-img">LCM Project Cover</div>' : ''} ${uniqueContent}`;

        const layoutHTML = `
            ${LayoutComponents.buildProgressBar()}
            ${LayoutComponents.buildMobileHeader(logoSVG)}
            <div id="app-root">
                ${LayoutComponents.buildSiteHeader(logoSVG, pageType)}
                <div class="content-wrapper">
                    <aside class="sidebar">
                        <div class="sidebar-top">${LayoutComponents.buildSidebarTop(pageData)}</div>
                        ${LayoutComponents.buildSidebarBottom(pageType, pageData)}
                    </aside>
                    <div class="right-panel">
                        <div class="scroll-area" id="scroll-container">
                            <div class="single-page-wrapper">${finalContent}</div>
                        </div>
                        ${LayoutComponents.buildFooter()}
                    </div>
                </div>
            </div>
        `;
        document.body.innerHTML = layoutHTML;
    }
};