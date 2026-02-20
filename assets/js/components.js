/*
 * PortfolioApp: Structure & Content
 */
const PortfolioApp = {

    /* --- Ordered project list for navigation & home grid --- */
    projectList: [
        /* ===== WORK PROJECTS ===== */
        {
            id: 'plc2split',
            title: 'Pic2Split',
            subtitle: 'End-to-End Design of a Social Bill-Splitting Web App',
            desc: 'A web app that helps groups use OCR to scan receipts and share split results with friends. (It is online now!)',
            demoIntro: 'Led UX research and product design to create a streamlined receipt-scanning experience for group expense sharing.',
            category: 'uiux',
            tags: ['Product Design', 'UX Research', 'UI Design', 'Web App'],
            image: '',
            heroImage: 'assets/img/welcome.jpg',
            link: 'Pic2Split.html',
            timeline: 'Nov 2025 – Present',
            team: '2 Engineers, 1 Designer, 1 PM',
            role: 'UX Research (survey, interview, usability test), Product Design (userflow, wireframe, prototype), UI Design (logo, components)',
            tools: 'Figma',
            liveLink: 'https://plc2split.design/'
        },
        {
            id: 'lawfare',
            title: 'International Lawfare Website',
            subtitle: 'Drupal-Based Legal Scholarship Hub',
            desc: 'The program page for International Lawfare — introducing and sharing course details.',
            demoIntro: 'A centralized digital repository designed to organize complex legal scholarship within the ASU Design System.',
            category: 'uiux code',
            tags: ['UI Design', 'Front-End Development', 'Web Design'],
            image: '',
            heroImage: 'assets/img/welcome.jpg',
            link: 'lawfare.html',
            timeline: 'Jan 2026 – Feb 2026',
            team: '1 Engineer, 1 Designer, 1 PM',
            role: 'UI Design (Web layout, components), Building site on CMS under ASU Design System (Drupal)',
            tools: 'Figma, Drupal, Illustrator, Photoshop, HTML/CSS',
            liveLink: 'https://lawfare-asufactory1.acquia.asu.edu/'
        },
        {
            id: 'agsec',
            title: 'Agriculture and National Security Website',
            subtitle: 'Research Portal for Food Security & Defense',
            desc: 'The program page for Agriculture and National Security — introducing and sharing course details.',
            demoIntro: 'A specialized CMS interface designed to bridge the gap between agricultural science and national defense policy.',
            category: 'uiux code',
            tags: ['UI Design', 'Front-End Development', 'Web Design'],
            image: '',
            heroImage: 'assets/img/welcome.jpg',
            link: 'agsec.html',
            timeline: 'Aug 2025 – Oct 2025',
            team: '1 Engineer, 1 Designer, 1 PM',
            role: 'UI Design (Web layout, components), Building site on CMS under ASU Design System (Drupal)',
            tools: 'Figma, Drupal, Illustrator, HTML/CSS',
            liveLink: 'https://agsec-asufactory1.acquia.asu.edu/'
        },
        {
            id: 'unesco',
            title: 'UNESCO Volunteer Recruitment',
            subtitle: 'UX Redesign for Clarity & Conversion',
            desc: 'A redesign + case study of the volunteer recruiting page for UNESCO. (Class project)',
            demoIntro: 'Conducted research and redesigned the volunteer recruitment experience to improve information hierarchy and usability.',
            category: 'uiux',
            tags: ['UX Research', 'UX/UI Design', 'Web Redesign'],
            image: '',
            heroImage: 'assets/img/welcome.jpg',
            link: 'unesco.html',
            timeline: 'Jan 2025 – May 2025',
            team: 'Solo',
            role: 'UX Research (survey, interview, usability test), Product Design (userflow, wireframe, prototype), UI Design',
            tools: 'Figma',
            liveLink: '#'
        },
        {
            id: 'lcm',
            title: 'Indigenous Cultural Museums',
            subtitle: 'WCAG AA Compliant Website for 30 Museums',
            desc: 'Demonstrate the information of 30 Taiwan indigenous museums, qualified for WCAG level AA. (It is online now!)',
            demoIntro: 'Designed and developed an accessibility-focused website system showcasing Taiwan\'s indigenous cultural institutions.',
            category: 'uiux code',
            tags: ['UI Design', 'Front-End Development', 'Accessibility', 'Web Design'],
            image: 'assets/img/lcm.png',
            heroImage: 'assets/img/website mockup_lcm.png',
            link: 'lcm.html',
            timeline: 'Oct 2022 – Feb 2023',
            team: '2 Engineers, 1 Designer, 1 PM',
            role: 'UI Design (logo, color/components), Front-end interaction and userflow design',
            tools: 'HTML/CSS, Illustrator, jQuery, Bootstrap',
            liveLink: 'http://lcm.tacp.gov.tw/'
        },
        {
            id: 'magnate',
            title: 'Magnate Technology Official Website',
            subtitle: 'Corporate Website & Digital Brand System',
            desc: 'Commissioned by Magnate Technology Co., Ltd. to create a website and establish an online presence. (It is online now!)',
            demoIntro: 'Designed and built a scalable website and UI component system to establish a professional digital presence.',
            category: 'uiux code',
            tags: ['Web Design', 'UI Design', 'Front-End Development', 'Branding'],
            image: 'assets/img/magnate.png',
            heroImage: 'assets/img/website mockup_magnate.png',
            link: 'magnate.html',
            timeline: 'Jun 2023 – Sep 2023',
            team: '2 UI Designers, 3 Engineers, 1 PM, 1 Planner',
            role: 'UI Design (components, color), Front-end interaction and userflow design',
            tools: 'HTML/CSS, Illustrator, jQuery, Bootstrap',
            liveLink: 'https://www.maicl.com/'
        },
        {
            id: 'tnaf',
            title: 'Tainan Art Festival 2023 Website',
            subtitle: 'Large-Scale Event Website Design',
            desc: 'Commissioned by the Tainan City Government to create a website for the Tainan Arts Festival.',
            demoIntro: 'Designed and developed the official government event website to enhance public engagement and information clarity.',
            category: 'uiux code',
            tags: ['Web Design', 'UI Design', 'Front-End Development'],
            image: 'assets/img/tnaf.png',
            heroImage: 'assets/img/website mockup_tnaf.png',
            link: 'tnaf.html',
            timeline: 'Feb 2022 – Apr 2023',
            team: '2 UI Designers, 3 Engineers, 1 PM, 1 Planner',
            role: 'UI Design (components, color), Front-end interaction and userflow design',
            tools: 'HTML/CSS, Illustrator, jQuery, Bootstrap',
            liveLink: 'https://tnaf.tainan.gov.tw/index.php?lang=en'
        },
        {
            id: 'lt',
            title: 'Longtan Walker Pace Counter APP',
            subtitle: 'Behavior-Driven Mobility App Concept',
            desc: 'By accumulating steps, people are encouraged to walk to reduce the traffic of cars and motorcycles on Longtan Road. (Class project)',
            demoIntro: 'Applied UX research and prototyping to design a mobile experience encouraging walkability and urban sustainability.',
            category: 'uiux',
            tags: ['UX Research', 'Product Design', 'Mobile App', 'Prototyping'],
            image: 'assets/img/lt.png',
            heroImage: 'assets/img/longtan-mockup-2.png',
            link: 'lt.html',
            timeline: 'Jan 2020 – May 2020',
            team: '2 Designers',
            role: 'UX Research (survey, interview), Product Design (prototype), UI Design (components)',
            tools: 'HTML/CSS, Illustrator, jQuery, Bootstrap',
            liveLink: 'https://www.figma.com/proto/liiY3uuAuqkyhPUDgfMtSk/longtan'
        },
        /* ===== PLAYGROUND PROJECTS ===== */
        {
            id: 'dailymoo',
            title: 'Daily Moo Mood',
            subtitle: 'Mood Tracking Web App',
            desc: 'A fun and interactive website that helps users track daily moods with adorable cow-themed visuals. (2nd Place @ RoseHack 2025)',
            demoIntro: 'A fun website helping users track daily moods with cow-themed visuals (2nd Place @ RoseHack 2025).',
            category: 'playground',
            tags: ['Hackathon', 'Web App'],
            image: '',
            heroImage: 'assets/img/welcome.jpg',
            link: 'dailymoo.html',
            timeline: 'Jan 2025',
            team: '1 Engineer, 1 Designer, 1 PM',
            role: 'UI Design (logo, color/components), Front-end interaction and userflow design',
            tools: 'HTML/CSS, Figma',
            liveLink: 'https://devpost.com/software/daily-moo-mood'
        },
        {
            id: 'quickbite',
            title: 'QuickBite',
            subtitle: 'AI Meal Planning Assistant',
            desc: 'A smart meal planning assistant born from the frustration of "What should I eat today?" combined with a busy schedule and limited budget.',
            demoIntro: 'A smart assistant using Claude AI & USDA data to plan meals and recipes based on user needs.',
            category: 'playground',
            tags: ['AI', 'Web App'],
            image: '',
            heroImage: 'assets/img/welcome.jpg',
            link: 'quickbite.html',
            timeline: 'Aug 2025 – Dec 2025',
            team: 'Solo',
            role: 'UI Design (logo, color/components), Front-end interaction and userflow design',
            tools: 'Python, Streamlit, Anthropic Claude, USDA FoodData Central',
            liveLink: '#'
        },
        {
            id: 'enchanter',
            title: 'Enchanter',
            subtitle: '3D Adventure Game',
            desc: 'A game on the Endstar platform — fix a mysterious painting to break the curse over an abandoned kingdom. (People\'s Choice Award, Meta VR headsets)',
            demoIntro: 'A game built on the Endstar platform where players fix a painting to break a kingdom\'s curse.',
            category: 'playground',
            tags: ['Game Design', '3D'],
            image: '',
            heroImage: 'assets/img/welcome.jpg',
            link: 'enchanter.html',
            timeline: 'Feb 2025',
            team: '3 Designers, 1 PM',
            role: 'Design + Build 3D Game scenes and gameplay',
            tools: 'Endstar',
            liveLink: 'https://studio.endlessstudios.com/endstar/e25c3c59-a822-4576-acd1-3ebfd5b52d09/?assetType=game'
        },
        {
            id: 'stiffy',
            title: 'Stiffy Wanderers',
            subtitle: 'Interactive Mobile Game',
            desc: 'An interactive mobile game where players guide a cute rock with googly eyes through environmental conditions using real-time location.',
            demoIntro: 'A mobile game guiding a rock character through environmental missions based on real-time location.',
            category: 'playground',
            tags: ['Game Design', 'Mobile App'],
            image: '',
            heroImage: 'assets/img/welcome.jpg',
            link: 'stiffy.html',
            timeline: 'Sep 2024',
            team: '1 Engineer, 2 Designers, 1 PM',
            role: 'Part of front-end coding and UI design',
            tools: 'HTML/CSS, Figma',
            liveLink: 'https://devpost.com/software/stiffy-wanderers'
        },
        {
            id: 'uav',
            title: 'UAV Control System',
            subtitle: 'Agricultural UAV Interface Design',
            desc: 'Designing a UAV control system to help the agriculture industry improve operational efficiency and optimize workflows. (Class project)',
            demoIntro: 'A UAV control system helps the agriculture industry improve operational efficiency and optimize workflows.',
            category: 'playground',
            tags: ['UI Design', 'Prototyping'],
            image: '',
            heroImage: 'assets/img/welcome.jpg',
            link: 'uav.html',
            timeline: 'Aug 2025 – Dec 2025',
            team: '4 Designers',
            role: 'Pilot interface design',
            tools: 'Figma',
            liveLink: '#'
        }
    ],

    data: {
        home: {
            title: `Design<span class="shape shape-circle"></span><br>Code<span class="shape shape-triangle"></span><br>Systems<span class="shape shape-square"></span>`,
            desc: "Michelle Chen is a UX/UI designer who blends product thinking, interaction craft, and front-end collaboration to turn complex problems into clear, useful digital experiences.",
            meta: ``
        },
        about: {
            title: `About`,
            desc: "From cultural institutions and civic programs to SaaS tools and hackathon projects, Michelle has spent the last several years designing interfaces and systems that respect both user needs and implementation realities.",
            meta: ``
        },
        playground: {
            title: `Playground`,
            desc: "Side projects, hackathons, game jams, and creative experiments that explore ideas beyond client work.",
            meta: ``
        },
        plc2split: {
            title: "Pic2Split",
            desc: "Led UX research and product design to create a streamlined receipt-scanning experience for group expense sharing.",
            meta: ``, backLink: true, liveLink: "https://plc2split.design/", cover: false
        },
        lawfare: {
            title: "International Lawfare Website",
            desc: "A centralized digital repository designed to organize complex legal scholarship within the ASU Design System.",
            meta: ``, backLink: true, liveLink: "https://lawfare-asufactory1.acquia.asu.edu/", cover: false
        },
        agsec: {
            title: "Agriculture and National Security Website",
            desc: "A specialized CMS interface designed to bridge the gap between agricultural science and national defense policy.",
            meta: ``, backLink: true, liveLink: "https://agsec-asufactory1.acquia.asu.edu/", cover: false
        },
        unesco: {
            title: "UNESCO Volunteer Recruitment",
            desc: "Conducted research and redesigned the volunteer recruitment experience to improve information hierarchy and usability.",
            meta: ``, backLink: true, liveLink: "#", cover: false
        },
        lcm: {
            title: "Indigenous Cultural Museums",
            desc: "Designed and developed an accessibility-focused website system showcasing Taiwan's indigenous cultural institutions.",
            meta: ``, backLink: true, liveLink: "http://lcm.tacp.gov.tw/", cover: true
        },
        magnate: {
            title: "Magnate Technology Official Website",
            desc: "Designed and built a scalable website and UI component system to establish a professional digital presence.",
            meta: ``, backLink: true, liveLink: "https://www.maicl.com/", cover: false
        },
        tnaf: {
            title: "Tainan Art Festival 2023 Website",
            desc: "Designed and developed the official government event website to enhance public engagement and information clarity.",
            meta: ``, backLink: true, liveLink: "https://tnaf.tainan.gov.tw/index.php?lang=en", cover: false
        },
        lt: {
            title: "Longtan Walker Pace Counter APP",
            desc: "Applied UX research and prototyping to design a mobile experience encouraging walkability and urban sustainability.",
            meta: ``, backLink: true, liveLink: "https://www.figma.com/proto/liiY3uuAuqkyhPUDgfMtSk/longtan", cover: false
        },
        dailymoo: {
            title: "Daily Moo Mood",
            desc: "A fun website helping users track daily moods with cow-themed visuals (2nd Place @ RoseHack 2025).",
            meta: ``, backLink: true, liveLink: "https://devpost.com/software/daily-moo-mood", cover: false
        },
        quickbite: {
            title: "QuickBite",
            desc: "A smart assistant using Claude AI & USDA data to plan meals and recipes based on user needs.",
            meta: ``, backLink: true, liveLink: "#", cover: false
        },
        enchanter: {
            title: "Enchanter",
            desc: "A game built on the Endstar platform where players fix a painting to break a kingdom's curse.",
            meta: ``, backLink: true, liveLink: "https://studio.endlessstudios.com/endstar/e25c3c59-a822-4576-acd1-3ebfd5b52d09/?assetType=game", cover: false
        },
        stiffy: {
            title: "Stiffy Wanderers",
            desc: "A mobile game guiding a rock character through environmental missions based on real-time location.",
            meta: ``, backLink: true, liveLink: "https://devpost.com/software/stiffy-wanderers", cover: false
        },
        uav: {
            title: "UAV Control System",
            desc: "A UAV control system helps the agriculture industry improve operational efficiency and optimize workflows.",
            meta: ``, backLink: true, liveLink: "#", cover: false
        }
    },

    getProject: function(id) {
        return this.projectList.find(function(p) { return p.id === id; });
    },

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

        if (typeof AppLogic !== 'undefined') AppLogic.init();
        if (pageType === 'home' && typeof MonsterLogic !== 'undefined') MonsterLogic.init();
        if (typeof CursorLogic !== 'undefined') CursorLogic.init();
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
        const isGridPage = (pageType === 'home' || pageType === 'playground');
        const nextProjectHTML = !isGridPage ? LayoutComponents.buildNextProjects(this.getNextProjects(pageType, 2)) : '';
        const loaderHTML = pageType === 'home' ? LayoutComponents.buildEntryLoader() : '';
        const heroImage = projectMeta ? (projectMeta.heroImage || projectMeta.image || 'assets/img/welcome.jpg') : '';
        const coverHTML = (!isGridPage && projectMeta)
            ? `<div class="case-hero-img"><img src="${heroImage}" alt="${projectMeta.title} main hero image" style="width:100%;height:100%;object-fit:cover;"></div>`
            : '';
        const finalContent = `${worksHeaderHTML} ${coverHTML} ${uniqueContent} ${nextProjectHTML}`;

        const layoutHTML = `
            ${loaderHTML}
            ${LayoutComponents.buildProgressBar()}
            ${LayoutComponents.buildBackToTop()}
            ${LayoutComponents.buildMobileHeader(logoSVG)}
            <div id="app-root">
                ${LayoutComponents.buildSiteHeader(logoSVG, pageType)}
                <div class="content-wrapper">
                    <aside class="sidebar">
                        <div class="sidebar-top">${LayoutComponents.buildSidebarTop(pageData, projectMeta)}</div>
                        ${LayoutComponents.buildSidebarMeta(pageType, projectMeta, pageData)}
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
