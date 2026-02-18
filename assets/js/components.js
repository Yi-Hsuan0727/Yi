/*
 * PortfolioApp: Structure & Content
 */
const PortfolioApp = {

    /* --- Ordered project list for navigation & home grid --- */
    projectList: [
        {
            id: 'lcm',
            title: 'Indigenous Cultural Museums',
            subtitle: 'UX Research & Design',
            desc: 'Demonstrate the information of 30 Taiwan indigenous museums, qualified for Web Content Accessibility Guidelines (WCAG) level AA.',
            category: 'uiux',
            tags: ['UI/UX', 'Webflow'],
            image: 'assets/img/lcm.png',
            link: 'lcm.html',
            timeline: 'Sep 2022 – Jan 2023',
            team: 'Solo Project (Self-directed)',
            role: 'UX Research, UI Design, Webflow Development'
        },
        {
            id: 'gy',
            title: 'Great Yarmouth Heritage Centre',
            subtitle: 'Heritage Centre Design Concept',
            desc: 'The concept for an immersive and interactive visitor experience, showcasing Great Yarmouth\'s rich history and culture.',
            category: 'uiux',
            tags: ['Prototyping', 'Research', 'Visual Design'],
            image: 'assets/img/gy.png',
            link: 'gy.html',
            timeline: 'Mar 2021 – Jun 2021',
            team: '2 Professors, 2 Students',
            role: 'Visual Design, Research and Synthesis, Experience Design'
        },
        {
            id: 'lt',
            title: 'Longtan Walker Pace Counter APP',
            subtitle: 'Gamifying Pedestrian Life',
            desc: 'A mobile solution to gamify pedestrian movement, encouraging students and residents to choose walking over driving.',
            category: 'uiux',
            tags: ['Prototyping', 'Research'],
            image: 'assets/img/lt.png',
            link: 'lt.html',
            timeline: 'Sep 2020 – Jan 2021',
            team: '3 Students',
            role: 'UX/UI Design, Research and Synthesis, Prototype'
        },
        {
            id: 'lk',
            title: 'Rickshaw Puller on Lukang Old Street',
            subtitle: 'Documentary & Visual Design',
            desc: 'Promote the century-old rickshaw industry in Lukang Old Street and document the beauty of rickshaw puller culture.',
            category: 'uiux',
            tags: ['Research', 'Visual Design'],
            image: 'assets/img/lk.png',
            link: 'lk.html',
            timeline: 'Feb 2020 – Jun 2020',
            team: '4 Students',
            role: 'Visual Design, Research and Synthesis'
        },
        {
            id: 'magnate',
            title: 'Magnate Technology Official Website',
            subtitle: 'Multilingual Corporate Website',
            desc: 'Multilingual corporate website for an aerospace components manufacturer with 30+ years of history.',
            category: 'code',
            tags: ['RWD', 'Multilingual', 'HTML / CSS'],
            image: 'assets/img/magnate.png',
            link: 'magnate.html',
            timeline: 'Mar 2023 – Jul 2023',
            team: '2 UI Designers, 3 Engineers, 1 PM, 1 Planner',
            role: 'UX/UI Design, Visual Design, Prototype, RWD Layout'
        },
        {
            id: 'tnaf',
            title: 'Tainan Art Festival 2023 Website',
            subtitle: 'Government Event Website',
            desc: 'Commissioned by the Tainan City Government to create a website for the Tainan Arts Festival.',
            category: 'code',
            tags: ['RWD', 'Bilingual', 'HTML / CSS'],
            image: 'assets/img/tnaf.png',
            link: 'tnaf.html',
            timeline: 'Jan 2023 – May 2023',
            team: '2 UI Designers, 3 Engineers, 1 PM, 1 Planner',
            role: 'UX/UI Design, Prototype, RWD Layout (HTML / CSS)'
        }
    ],

    data: {
        home: {
            title: `Design<span class="shape shape-circle"></span><br>Code<span class="shape shape-triangle"></span><br>Systems<span class="shape shape-square"></span>`,
            desc: "<strong>UX/UI Designer</strong> specializing in B2B SaaS...",
            meta: ``
        },
        lcm: {
            title: "Indigenous Cultural Museums",
            desc: "Redesigning the digital presence of 30 Taiwan indigenous museums with WCAG AA compliance.",
            meta: ``,
            backLink: true,
            liveLink: "https://webflow.com",
            cover: true
        },
        gy: {
            title: "Great Yarmouth Heritage Centre",
            desc: "Design concept for an immersive visitor experience showcasing Great Yarmouth's heritage.",
            meta: ``,
            backLink: true,
            liveLink: "#",
            cover: false
        },
        lt: {
            title: "Longtan Walker Pace Counter APP",
            desc: "Gamifying pedestrian movement to reduce traffic on Longtan Road.",
            meta: ``,
            backLink: true,
            liveLink: "https://www.figma.com/proto/liiY3uuAuqkyhPUDgfMtSk/longtan",
            cover: false
        },
        lk: {
            title: "Rickshaw Puller on Lukang Old Street",
            desc: "Documentary project preserving the century-old rickshaw puller culture.",
            meta: ``,
            backLink: true,
            liveLink: "https://youtu.be/CdNF3fMakOE",
            cover: false
        },
        magnate: {
            title: "Magnate Technology Official Website",
            desc: "Multilingual corporate website for an aerospace manufacturer.",
            meta: ``,
            backLink: true,
            liveLink: "https://www.maicl.com/index.php?lang=en",
            cover: false
        },
        tnaf: {
            title: "Tainan Art Festival 2023 Website",
            desc: "Official website for the Tainan Arts Festival, themed 'Young Dreams'.",
            meta: ``,
            backLink: true,
            liveLink: "https://tnaf.tainan.gov.tw/index.php?lang=en",
            cover: false
        }
    },

    /* --- Get project metadata by id --- */
    getProject: function(id) {
        return this.projectList.find(function(p) { return p.id === id; });
    },

    /* --- Get next N projects (wraps around) --- */
    getNextProjects: function(currentId, count) {
        var idx = this.projectList.findIndex(function(p) { return p.id === currentId; });
        if (idx === -1) return [];
        var result = [];
        for (var i = 1; i <= count; i++) {
            result.push(this.projectList[(idx + i) % this.projectList.length]);
        }
        return result;
    },

    init: function(pageType) {
        this.injectHead();
        this.buildLayout(pageType);

        // 1. Init General App Logic
        if (typeof AppLogic !== 'undefined') AppLogic.init();

        // 2. Init Monster Logic (Home only)
        if (pageType === 'home' && typeof MonsterLogic !== 'undefined') MonsterLogic.init();

        // 3. Init Cursor Logic
        if (typeof CursorLogic !== 'undefined') {
            CursorLogic.init();
        }
    },

    injectHead: function() {
        if(document.getElementById('app-styles')) return;
        const headHTML = `
            <meta charset="UTF-8">
            <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2264%22 height=%2264%22 viewBox=%220 0 64 64%22><text x=%2232%22 y=%2254%22 font-size=%2272%22 font-weight=%22900%22 font-family=%22Arial%22 fill=%22%232ecc71%22 text-anchor=%22middle%22>M</text></svg>">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style id="app-styles">html.lenis { height: auto; } .lenis.lenis-smooth { scroll-behavior: auto; } .lenis.lenis-smooth [data-lenis-prevent] { overscroll-behavior: contain; } .lenis.lenis-stopped { overflow: hidden; } </style>
        `;
        document.head.insertAdjacentHTML('beforeend', headHTML);
    },

    buildLayout: function(pageType) {
        const contentDiv = document.getElementById('page-specific-content');
        const uniqueContent = contentDiv ? contentDiv.innerHTML : "";
        const pageData = this.data[pageType] || this.data.home;
        const projectMeta = this.getProject(pageType);
        const logoSVG = LayoutComponents.logoSVG();

        const worksHeaderHTML = LayoutComponents.buildWorksHeader(pageType);
        const nextProjectHTML = (pageType !== 'home') ? LayoutComponents.buildNextProjects(this.getNextProjects(pageType, 2)) : '';
        const coverHTML = pageData.cover ? '<div class="case-hero-img"><img src="assets/img/website mockup_lcm.png" alt="LCM Project Cover" style="width:100%;height:100%;object-fit:cover;"></div>' : '';
        const finalContent = `${worksHeaderHTML} ${coverHTML} ${uniqueContent} ${nextProjectHTML}`;

        const layoutHTML = `
            ${LayoutComponents.buildProgressBar()}
            ${LayoutComponents.buildBackToTop()}
            ${LayoutComponents.buildMobileHeader(logoSVG)}
            <div id="app-root">
                ${LayoutComponents.buildSiteHeader(logoSVG, pageType)}
                <div class="content-wrapper">
                    <aside class="sidebar">
                        <div class="sidebar-top">${LayoutComponents.buildSidebarTop(pageData)}</div>
                        ${LayoutComponents.buildSidebarMeta(pageType, projectMeta)}
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
