/*
 * PortfolioApp: Structure & Content
 */
const PortfolioApp = {

    /* --- Ordered project list for navigation & home grid --- */
    projectList: [
        /* ===== WORK PROJECTS ===== */
        {
            id: 'pic2split',
            title: 'Pic2Split',
            subtitle: 'End-to-End Design of a Social Bill-Splitting Web App',
            desc: 'A web app that helps groups use OCR to scan receipts and share split results with friends. (It is online now!)',
            demoIntro: 'Led UX research and product design to create a streamlined receipt-scanning experience for group expense sharing.',
            filterType: 'apps',
            audience: 'Consumer',
            tags: ['Product Design', 'UX Research', 'Web App'],
            image: 'assets/img/main images/pic2split.png',
            heroImage: 'assets/img/Pic2Split/hero.png',
            link: 'pic2split.html',
            timeline: 'Nov 2025 – Jan 2026',
            team: '2 Engineers, 1 Designer, 1 PM',
            role: 'UX Research (survey, interview, usability test), Product Design (userflow, wireframe, prototype), UI Design (logo, components)',
            tools: 'Figma',
            liveLink: null
        },
        {
            id: 'unesco',
            title: 'UNESCO Volunteer Recruitment',
            subtitle: 'UX Redesign for Clarity & Conversion',
            desc: 'A redesign + case study of the volunteer recruiting page for UNESCO. (Class project)',
            demoIntro: 'Conducted research and redesigned the volunteer recruitment experience to improve information hierarchy and usability.',
            filterType: 'web',
            audience: 'Public',
            tags: ['UX Research', 'UX/UI Design', 'Web Redesign'],
            image: 'assets/img/main images/UNESCO.png',
            heroImage: 'assets/img/UNESCO/hero.png',
            link: 'unesco.html',
            timeline: 'Jan 2025 – May 2025',
            team: 'Solo',
            role: 'UX Research (survey, interview, usability test), Product Design (userflow, wireframe, prototype), UI Design',
            tools: 'Figma',
            liveLink: '#'
        },
        {
            id: 'uav',
            title: 'UAV Control System',
            subtitle: 'Agricultural UAV Interface Design',
            desc: 'Designing a UAV control system to help the agriculture industry improve operational efficiency and optimize workflows. (Class project)',
            demoIntro: 'A UAV control system helps the agriculture industry improve operational efficiency and optimize workflows.',
            filterType: 'apps',
            audience: 'Enterprise',
            tags: ['UI Design', 'Prototyping', 'Mobile App'],
            image: 'assets/img/main images/UAV.png',
            heroImage: 'assets/img/UAV/hero.png',
            link: 'uav.html',
            timeline: 'Aug 2025 – Dec 2025',
            team: '4 Designers',
            role: 'Technician Interface design',
            tools: 'Figma',
            liveLink: '#'
        },
        {
            id: 'lawfare',
            title: 'International Lawfare Website',
            subtitle: 'Drupal-Based Legal Scholarship Hub',
            desc: 'The program page for International Lawfare — introducing and sharing course details.',
            demoIntro: 'A centralized digital repository designed to organize complex legal scholarship within the ASU Design System.',
            filterType: 'web',
            audience: 'Public',
            tags: ['UI Design', 'Front-End Development', 'Web Design'],
            image: 'assets/img/main images/International Lawfare.png',
            heroImage: 'assets/img/law/hero.png',
            link: 'lawfare.html',
            timeline: 'Jan 2026 – Feb 2026',
            team: '1 Engineer, 1 Designer, 1 PM',
            role: 'UI Design (Web layout, components), Building site on CMS under ASU Design System (Drupal)',
            tools: 'Figma, Drupal, Illustrator, Photoshop, HTML/CSS',
            liveLink: 'https://lawfare-asufactory1.acquia.asu.edu/'
        },
        {
            id: 'lcm',
            title: 'Indigenous Cultural Museums',
            subtitle: 'WCAG AA Compliant Website for 30 Museums',
            desc: 'Demonstrate the information of 30 Taiwan indigenous museums, qualified for WCAG level AA. (It is online now!)',
            demoIntro: 'Designed and developed an accessibility-focused website system showcasing Taiwan\'s indigenous cultural institutions.',
            filterType: 'web',
            audience: 'Public',
            tags: ['UI Design', 'Front-End Development', 'Accessibility'],
            image: 'assets/img/main images/indigenous Cultural Museums.png',
            heroImage: 'assets/img/lcm/hero.png',
            link: 'lcm.html',
            timeline: 'Oct 2022 – Feb 2023',
            team: '2 Engineers, 1 Designer, 1 PM',
            role: 'Product Designer & Full-Stack Developer',
            tools: 'HTML/CSS, Illustrator, jQuery, Bootstrap',
            liveLink: 'http://lcm.tacp.gov.tw/'
        },
        {
            id: 'lt',
            title: 'Longtan Walker Pace Counter APP',
            subtitle: 'Behavior-Driven Mobility App Concept',
            desc: 'By accumulating steps, people are encouraged to walk to reduce the traffic of cars and motorcycles on Longtan Road. (Class project)',
            demoIntro: 'Applied UX research and prototyping to design a mobile experience encouraging walkability and urban sustainability.',
            filterType: 'apps',
            audience: 'Consumer',
            tags: ['UX Research', 'Product Design', 'Mobile App'],
            image: 'assets/img/main images/Longtan Walker.png',
            heroImage: 'assets/img/lt/hero.png',
            link: 'lt.html',
            timeline: 'Jan 2020 – May 2020',
            team: '2 Designers',
            role: 'UX Research (survey, interview), Product Design (prototype), UI Design (components)',
            tools: 'HTML/CSS, Illustrator, jQuery, Bootstrap',
            liveLink: null
        },
        {
            id: 'quickbite',
            title: 'QuickBite',
            subtitle: 'AI Meal Planning Assistant',
            desc: 'A smart meal planning assistant born from the frustration of "What should I eat today?" combined with a busy schedule and limited budget.',
            demoIntro: 'A smart assistant using Claude AI & USDA data to plan meals and recipes based on user needs.',
            filterType: 'apps',
            audience: 'Consumer',
            tags: ['AI', 'Web App', 'Product Design'],
            image: 'assets/img/main images/QuickBite.png',
            heroImage: 'assets/img/QuickBite/hero.png',
            link: 'quickbite.html',
            timeline: 'Aug 2025 – Dec 2025',
            team: 'Solo',
            role: 'Product Designer & Full-Stack Developer',
            tools: 'Python, Streamlit, Anthropic Claude, USDA FoodData Central',
            liveLink: null
        },
        {
            id: 'magnate',
            title: 'Magnate Technology Official Website',
            subtitle: 'Corporate Website & Digital Brand System',
            desc: 'Commissioned by Magnate Technology Co., Ltd. to create a website and establish an online presence. (It is online now!)',
            demoIntro: 'Designed and built a scalable website and UI component system to establish a professional digital presence.',
            filterType: 'web',
            audience: 'Enterprise',
            tags: ['Web Design', 'UI Design', 'Branding'],
            image: 'assets/img/main images/Magnate.png',
            heroImage: 'assets/img/Magnate/hero.png',
            link: 'magnate.html',
            timeline: 'Jun 2023 – Sep 2023',
            team: '2 UI Designers, 3 Engineers, 1 PM, 1 Planner',
            role: 'UI Design (components, color), Front-end interaction and userflow design',
            tools: 'HTML/CSS, Illustrator, jQuery, Bootstrap',
            liveLink: 'https://www.maicl.com/'
        },
        {
            id: 'spring',
            title: 'Echoes of the Four Seasons',
            subtitle: 'Bridging Cultures Through Interactive Typography',
            desc: 'An interactive web experience that reconstructs Chinese seasonal characters with English letters so non-Chinese speakers can explore poetry through tracing.',
            demoIntro: 'Designed a cross-cultural typography experience that turns Chinese poetry into a participatory tracing system built from English letterforms.',
            filterType: 'web',
            audience: 'Public',
            tags: ['UI/UX Design', 'Typography', 'Interactive Web'],
            image: 'assets/img/main images/Spring.png',
            heroImage: 'assets/img/lcm/website mockup_lcm.png',
            heroAlt: 'Temporary placeholder hero image for Echoes of the Four Seasons showing desktop, tablet, and mobile screens with the Spring character composed of English letter strokes on a soft beige background.',
            link: 'spring.html',
            role: 'UI/UX Designer, Visual Designer, Typographer',
            liveLink: 'spring/phome.html'
        },
        {
            id: 'dailymoo',
            title: 'Daily Moo Mood',
            subtitle: 'Cow-Themed Emotional Wellness Tracker',
            desc: 'An emotional wellness tracker built during RoseHack 2025 that turns daily reflection into a low-friction, playful habit. (2nd Place winner)',
            demoIntro: 'Designed a chill, approachable mood-tracking experience that uses playful visuals and actionable care prompts to support emotional self-reflection.',
            filterType: 'apps',
            audience: 'Consumer',
            tags: ['Hackathon', 'UI/UX Design', 'Wellness'],
            image: 'assets/img/main images/DailyMooMood.png',
            heroImage: 'assets/img/DailyMooMood/_Users_mac_Desktop_msux_2025spring_How\'s%20going%20Arizona!_DailyMooMood_landingPage.html.png',
            heroAlt: 'Daily Moo Mood interface showing the MooYourMood selector, comment field, and calendar in a calm blue and green visual style.',
            link: 'dailymoo.html',
            timeline: 'RoseHack 2025',
            team: 'Cathy Chen, Michelle Chen, Jerry Chen',
            role: 'UI/Front-end Lead',
            tools: 'React, Alpine.js, Tailwind CSS, ASP.NET Core MVC, SQLite, JavaScript, HTML5, CSS',
            liveLink: 'https://devpost.com/software/daily-moo-mood'
        }
    ],

    data: {
        home: {
            title: `<span class="hero-title-line">Product design<span class="shape shape-circle" aria-hidden="true"></span></span><span class="hero-title-line">Interaction<span class="shape shape-triangle" aria-hidden="true"></span></span><span class="hero-title-line">Systems<span class="shape shape-square" aria-hidden="true"></span></span>`,
            desc: "Hi! I'm Michelle Chen — a UX/UI designer with 3+ years of experience designing apps, platforms, and consumer-facing products.",
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
        pic2split: {
            title: "Pic2Split",
            desc: "Led UX research and product design to create a streamlined receipt-scanning experience for group expense sharing.",
            meta: ``, backLink: true, liveLink: null, cover: false
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
            meta: ``, backLink: true, liveLink: null, cover: false
        },
        spring: {
            title: "Echoes of the Four Seasons",
            desc: "An interactive typography experience that bridges English letterforms and Chinese poetry through guided tracing.",
            meta: ``, backLink: true, liveLink: "spring/phome.html", cover: false
        },
        dailymoo: {
            title: "Daily Moo Mood",
            desc: "A cow-themed emotional wellness tracker that turns daily reflection into a low-friction habit through playful visuals and actionable care prompts.",
            meta: ``, backLink: true, liveLink: "https://devpost.com/software/daily-moo-mood", cover: false
        },
        quickbite: {
            title: "QuickBite",
            desc: "An AI-powered meal planning system that turns fridge inventory into tailored menus and tracks real nutritional data.",
            meta: ``, backLink: true, liveLink: null, cover: false
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

    isLiveProject: function(project) {
        return !!(project && project.liveLink && project.liveLink !== '#');
    },

    getProjectFilterCategory: function(project) {
        if (!project) return '';
        return project.filterType || 'web';
    },

    buildProjectOverlayTags: function(project) {
        if (!project) return '';
        var audienceHTML = project.audience
            ? '<span class="project-overlay-tag project-overlay-tag--audience">' + project.audience + '</span>'
            : '';
        var skillTagsHTML = (project.tags || []).map(function(t) {
            return '<span class="project-overlay-tag">' + t + '</span>';
        }).join('');
        return audienceHTML + skillTagsHTML;
    },

    getHomeProjects: function() {
        var self = this;
        return this.projectList.filter(function(p) {
            return !self.isPlaygroundProject(p.id);
        });
    },

    /* Playground-only projects — never shown in "Next Projects" on case study pages */
    playgroundProjectIds: ['dailymoo', 'enchanter', 'stiffy', 'spring'],

    isPlaygroundProject: function(id) {
        return this.playgroundProjectIds.indexOf(id) !== -1;
    },

    getNextProjects: function(currentId, count) {
        var currentProject = this.getProject(currentId);
        if (!currentProject) return [];

        var filtered = this.projectList.filter(function(p) {
            return !PortfolioApp.isPlaygroundProject(p.id);
        });
        if (!filtered.length) return [];

        var idx = filtered.findIndex(function(p) { return p.id === currentId; });
        var startIdx = idx === -1 ? 0 : idx;

        var result = [];
        for (var i = 1; i <= count; i++) {
            result.push(filtered[(startIdx + i) % filtered.length]);
        }
        return result;
    },

    init: function(pageType) {
        this.injectHead(pageType);
        this.buildLayout(pageType);

        const startApp = () => {
            this.initEntryEffects(pageType);

            if (typeof AppLogic !== 'undefined') AppLogic.init();
            if ((pageType === 'home' || pageType === 'playground' || pageType === 'about') && typeof MonsterLogic !== 'undefined') {
                MonsterLogic.init();
            }
            if ((pageType === 'home' || pageType === 'playground' || pageType === 'about') && typeof ContactFormLogic !== 'undefined') {
                ContactFormLogic.init();
            }
            if (pageType === 'about' && typeof CarouselLogic !== 'undefined') {
                CarouselLogic.init();
            }
            if (typeof CursorLogic !== 'undefined') CursorLogic.init();
            const isCasePage = pageType !== 'home' && pageType !== 'playground' && pageType !== 'about';
            if (isCasePage) {
                this.initCaseFigureZoom();
                this.initCaseInfographic();
            }
            if (pageType === 'home' && typeof filterProjects === 'function') {
                filterProjects('all');
            }
        };

        if (pageType === 'home' && typeof SplashScreen !== 'undefined' && SplashScreen.shouldShow()) {
            SplashScreen.show(startApp);
            return;
        }

        startApp();
    },

    initCaseFigureZoom: function() {
        const run = () => {
            if (typeof CaseFigureZoom !== 'undefined') CaseFigureZoom.init();
        };
        if (typeof CaseFigureZoom !== 'undefined') {
            run();
            return;
        }
        const existing = document.querySelector('script[data-case-figure-zoom]');
        if (existing) {
            existing.addEventListener('load', run, { once: true });
            return;
        }
        const script = document.createElement('script');
        script.src = 'assets/js/case-figure-zoom.js';
        script.dataset.caseFigureZoom = '1';
        script.onload = run;
        document.body.appendChild(script);
    },

    initCaseInfographic: function() {
        const run = () => {
            if (typeof CaseInfographic !== 'undefined') CaseInfographic.init();
        };
        if (typeof CaseInfographic !== 'undefined') {
            run();
            return;
        }
        const existing = document.querySelector('script[data-case-infographic]');
        if (existing) {
            existing.addEventListener('load', run, { once: true });
            return;
        }
        const script = document.createElement('script');
        script.src = 'assets/js/case-infographic.js';
        script.dataset.caseInfographic = '1';
        script.onload = run;
        document.body.appendChild(script);
    },

    injectHead: function(pageType) {
        if(document.getElementById('app-styles')) return;
        const isCasePage = pageType && pageType !== 'home' && pageType !== 'playground' && pageType !== 'about';
        const caseInfographicCss = isCasePage
            ? '<link rel="stylesheet" href="assets/css/case-infographic.css">'
            : '';
        const headHTML = `
            <meta charset="UTF-8">
            <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            ${caseInfographicCss}
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
        const mobileProjectActionsHTML = !isGridPage && projectMeta ? LayoutComponents.buildMobileProjectActions(projectMeta) : '';
        const heroImage = projectMeta ? (projectMeta.heroImage || projectMeta.image || 'assets/img/bk/welcome.jpg') : '';
        const heroAlt = projectMeta ? (projectMeta.heroAlt || (projectMeta.title + ' main hero image')) : '';
        const heroVideo = projectMeta ? (projectMeta.heroVideo || '') : '';
        const coverHTML = (!isGridPage && projectMeta)
            ? heroVideo
                ? `<div class="case-hero-img case-hero-video"><video src="${heroVideo}" autoplay muted playsinline loop preload="auto" poster="${heroImage}" style="width:100%;height:100%;object-fit:cover;"></video></div>`
                : `<div class="case-hero-img"><img src="${heroImage}" alt="${heroAlt}" style="width:100%;height:100%;object-fit:cover;"></div>`
            : '';
        const footerHTML = LayoutComponents.buildFooter(pageType);
        const finalContent = `${worksHeaderHTML} ${coverHTML} ${uniqueContent} ${mobileProjectActionsHTML} ${nextProjectHTML} ${isGridPage ? footerHTML : ''}`;

        const aboutBackLinkHTML = pageType === 'about'
            ? `<a href="index.html" class="about-home-link about-home-link-mobile-only"><i class="fas fa-arrow-left" style="margin-right:8px;"></i> Back to Home</a>`
            : '';

        if (pageType === 'about') {
            const aboutContent = `<div class="about-page">${uniqueContent}</div>`;
            const layoutHTML = `
                ${LayoutComponents.buildProgressBar()}
                ${LayoutComponents.buildBackToTop()}
                ${LayoutComponents.buildMobileHeader(logoSVG)}
                <div id="app-root" class="app-root-about">
                    ${LayoutComponents.buildSiteHeader(logoSVG, pageType)}
                    <div class="content-wrapper content-wrapper-fullwidth">
                        <div class="right-panel right-panel-fullwidth">
                            <div class="scroll-area" id="scroll-container">
                                <div class="single-page-wrapper">
                                    ${aboutContent}
                                    ${LayoutComponents.buildFooter(pageType)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.innerHTML = layoutHTML;
            return;
        }

        const layoutHTML = `
            ${LayoutComponents.buildProgressBar()}
            ${LayoutComponents.buildBackToTop()}
            ${LayoutComponents.buildMobileHeader(logoSVG)}
            <div id="app-root">
                ${LayoutComponents.buildSiteHeader(logoSVG, pageType)}
                <div class="content-wrapper">
                    <aside class="sidebar">
                        <div class="sidebar-top">${LayoutComponents.buildSidebarTop(pageData, projectMeta, pageType)}</div>
                        ${LayoutComponents.buildSidebarMeta(pageType, projectMeta, pageData)}
                        ${LayoutComponents.buildSidebarBottom(pageType, pageData)}
                        ${isGridPage ? LayoutComponents.buildSidebarToolsMarquee() : ''}
                    </aside>
                        <div class="right-panel">
                        <div class="scroll-area" id="scroll-container">
                            <div class="single-page-wrapper">${finalContent}</div>
                        </div>
                        ${isGridPage ? '' : footerHTML}
                    </div>
                </div>
            </div>
        `;
        document.body.innerHTML = layoutHTML;
    },

    initEntryEffects: function(pageType) {
        const isGridPage = (pageType === 'home' || pageType === 'playground');

        // Monster: enter from very bottom on home, playground & about
        if (isGridPage || pageType === 'about') {
            const monsterBody = document.querySelector('.monster-body');
            if (monsterBody) {
                monsterBody.classList.remove('monster-enter');
                setTimeout(() => {
                    monsterBody.classList.add('monster-enter');
                }, 80);
            }
        }

        // Project cards: enter from bottom on grid pages
        if (isGridPage) {
            const cards = document.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
                card.classList.remove('project-enter');
                const delay = 0.15 + index * 0.06;
                card.style.animationDelay = `${delay}s`;
                // Allow browser to apply delay before starting animation
                requestAnimationFrame(() => {
                    card.classList.add('project-enter');
                });
            });
        }
    }
};
