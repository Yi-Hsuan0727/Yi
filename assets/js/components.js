/*
 * EyeFollow: shared cursor-tracking for all googly eyes (footer monster,
 * nav logo, header composition). Uses one rAF loop so pupils stay smooth
 * while their parent elements animate (CSS drift on header shapes, etc.).
 */
const EyeFollow = {
    targets: [],
    cursorX: -9999,
    cursorY: -9999,
    running: false,
    pointerBound: false,

    register: function(eyeEl, pupilEl) {
        if (!eyeEl || !pupilEl) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (this.targets.some((t) => t.pupilEl === pupilEl)) return;
        this.targets.push({ eyeEl: eyeEl, pupilEl: pupilEl });
        this.start();
    },

    registerNodeList: function(eyes, pupilSelector) {
        const sel = pupilSelector || '.monster-pupil';
        Array.prototype.forEach.call(eyes || [], (eye) => {
            this.register(eye, eye.querySelector(sel));
        });
    },

    start: function() {
        if (this.running) return;
        this.running = true;
        this.bindPointer();
        const tick = () => {
            if (!this.running) return;
            this.updateAll();
            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    },

    bindPointer: function() {
        if (this.pointerBound) return;
        this.pointerBound = true;
        document.addEventListener('mousemove', (e) => {
            this.cursorX = e.clientX;
            this.cursorY = e.clientY;
        });
        document.addEventListener('touchmove', (e) => {
            if (!e.touches.length) return;
            this.cursorX = e.touches[0].clientX;
            this.cursorY = e.touches[0].clientY;
        }, { passive: true });
    },

    updateAll: function() {
        const cx = this.cursorX;
        const cy = this.cursorY;
        this.targets.forEach(({ eyeEl, pupilEl }) => {
            const rect = eyeEl.getBoundingClientRect();
            if (!rect.width) return;
            const eyeX = rect.left + rect.width / 2;
            const eyeY = rect.top + rect.height / 2;
            const angle = Math.atan2(cy - eyeY, cx - eyeX);
            const maxDist = rect.width / 4;
            const dist = Math.min(maxDist, Math.hypot(cx - eyeX, cy - eyeY));
            pupilEl.style.transform =
                `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
        });
    }
};

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
            cardHeadline: 'Shipped an AI web app that splits group bills in under 2 min, 2× faster than the 4-min competitor baseline.',
            subtitle: 'End-to-End Design of a Social Bill-Splitting Web App',
            desc: 'A web app that helps groups use OCR to scan receipts and share split results with friends. (It is online now!)',
            demoIntro: 'Led UX research and product design to create a streamlined receipt-scanning experience for group expense sharing.',
            filterType: 'apps',
            audience: 'Consumer',
            tags: ['Web App', 'AI', 'B2C'],
            image: 'assets/img/main images/pic2split.png',
            heroImage: 'assets/img/Pic2Split/hero.png',
            link: 'pic2split.html',
            timeline: 'Nov 2025 – Jan 2026',
            team: '2 Engineers, 1 Designer, 1 PM',
            teamRoster: [
                '1 Product Designer (me)',
                '1 Product Manager',
                '2 Software Engineers'
            ],
            role: 'UX Research (survey, interview, usability test), Product Design (userflow, wireframe, prototype), UI Design (logo, components)',
            tools: ['Figma', 'Tailwind CSS', 'React', 'PaddleOCR', 'Google Gemini', 'Google SSO'],
            liveLink: null,
            featured: true,
            spotlightEyebrow: 'Flagship · AI product',
            spotlightTitle: 'Scan a receipt with AI + OCR, split the bill in seconds.',
            spotlightDesc: 'An end-to-end AI web app using OCR + Google Gemini that turns a photo into a validated, shareable split, with multi-state logic that keeps cognitive load low at the table.',
            spotlightStats: [
                { value: '2× faster', label: 'vs. 4-min baseline', accent: true },
                { value: '50% less time', label: 'per group split' },
                { value: 'Live today', label: 'no app install' }
            ]
        },
        {
            id: 'unesco',
            title: 'UNESCO Volunteer Recruitment',
            cardHeadline: 'Researched and rebuilt UNESCO\'s volunteer flow to turn interest into sign-ups.',
            subtitle: 'UX Redesign for Clarity & Conversion',
            desc: 'A redesign + case study of the volunteer recruiting page for UNESCO. (Class project)',
            demoIntro: 'Conducted research and redesigned the volunteer recruitment experience to improve information hierarchy and usability.',
            filterType: 'web',
            audience: 'Public',
            tags: ['Website', 'Nonprofit', 'B2C'],
            image: 'assets/img/main images/UNESCO.png',
            heroImage: 'assets/img/UNESCO/hero.png',
            link: 'unesco.html',
            timeline: 'Jan 2025 – May 2025',
            team: 'Solo',
            teamRoster: ['1 UX/UI Designer (me)'],
            role: 'UX Research (survey, interview, usability test), Product Design (userflow, wireframe, prototype), UI Design',
            tools: ['Figma'],
            liveLink: '#',
            featured: false,
            secondary: true
        },
        {
            id: 'lcm',
            title: 'Indigenous Cultural Museums',
            cardHeadline: 'Hand-coded a WCAG 2.1 AA site unifying 30 indigenous museums.',
            subtitle: 'WCAG AA Compliant Website for 30 Museums',
            desc: 'Demonstrate the information of 30 Taiwan indigenous museums, qualified for WCAG level AA. (It is online now!)',
            demoIntro: 'Designed and developed an accessibility-focused website system showcasing Taiwan\'s indigenous cultural institutions.',
            filterType: 'web',
            audience: 'Public',
            tags: ['Website', 'Public Sector', 'Accessibility'],
            image: 'assets/img/main images/indigenous Cultural Museums.png',
            cardImagePosition: 'right center',
            heroImage: 'assets/img/lcm/hero.png',
            link: 'lcm.html',
            timeline: 'Oct 2022 – Feb 2023',
            team: '2 Engineers, 1 Designer, 1 PM',
            teamRoster: [
                '1 Product Designer & Front-End Developer (me)',
                '1 Product Manager',
                '2 Software Engineers'
            ],
            role: 'Product Designer & Front-End Developer',
            tools: ['HTML/CSS', 'Illustrator', 'jQuery', 'Bootstrap'],
            liveLink: null,
            featured: true,
            spotlightEyebrow: 'Public sector · Accessibility',
            spotlightTitle: 'One WCAG 2.1 AA home for 30 indigenous museums.',
            spotlightDesc: 'I designed and hand-coded a unified museum portal for Taiwan\'s indigenous cultural institutions, using semantic HTML/CSS, AA contrast, and navigation patterns that scale across 30 distinct collections.',
            spotlightTagline: '30 museums, one accessible web home.',
            spotlightVisual: 'assets/img/lcm/website mockup_lcm.png',
            spotlightLogo: 'assets/img/lcm/lcm-logo.png',
            spotlightBg: '#1a6b5c',
            spotlightStats: [
                { value: 'WCAG 2.1 AA', label: 'compliance target', accent: true },
                { value: '30 museums', label: 'unified portal' },
                { value: 'HTML/CSS', label: 'hand-coded ship' }
            ]
        },
        {
            id: 'uav',
            title: 'UAV Control System',
            cardHeadline: 'Technician tablet UI for an AI-assisted farm drone, built by a four-person team.',
            subtitle: 'Agricultural UAV Interface Design',
            desc: 'Designing a UAV control system to help the agriculture industry improve operational efficiency and optimize workflows. (Class project)',
            demoIntro: 'A UAV control system helps the agriculture industry improve operational efficiency and optimize workflows.',
            filterType: 'apps',
            audience: 'Enterprise',
            tags: ['Tablet App', 'Agtech', 'B2B'],
            image: 'assets/img/main images/UAV.png',
            cardVideo: 'assets/img/UAV/technician video.mp4',
            heroImage: 'assets/img/UAV/hero.png',
            link: 'uav.html',
            timeline: 'Aug 2025 – Dec 2025',
            team: '4 Designers',
            teamRoster: [
                '1 Product Designer, Technician Interface (me)',
                '3 Product Designers'
            ],
            role: 'Technician Interface design',
            tools: ['Figma'],
            liveLink: '#',
            featured: true,
            spotlightEyebrow: 'Enterprise · Agtech',
            spotlightTitle: 'Technician UI for an AI-assisted farm drone.',
            spotlightDesc: 'I owned the technician tablet interface, unifying mapping, spray, and thermal workflows into one screen, with a design target that cuts payload diagnosis from 18 minutes to 5.',
            spotlightStats: [
                { value: '18m → 5m', label: 'diagnosis target', headline: 'Diagnosis', accent: true },
                { value: 'One platform', label: 'map · spray · thermal', headline: 'Platform' },
                { value: '12-hr shifts', label: 'field-ready UI', headline: 'Field use' }
            ]
        },
        {
            id: 'realwater',
            title: 'Real Water LMS',
            cardHeadline: 'A water-education learning platform helping Arizonans make informed decisions about water.',
            subtitle: 'Water Education Learning Platform',
            desc: 'Arizona Real Water LMS delivers comprehensive water-education resources for Arizona communities, real estate professionals, and the public.',
            demoIntro: 'A learning platform delivering accessible water-education courses for Arizona communities and professionals.',
            filterType: 'web',
            audience: 'Public',
            tags: ['EdTech', 'LMS', 'B2C'],
            image: 'assets/img/main images/RealWater.png',
            cardVideo: 'assets/img/main images/RealWater.mp4',
            heroImage: 'assets/img/main images/RealWater.png',
            link: '#',
            comingSoon: true,
            featured: true,
            spotlightEyebrow: 'In development · EdTech',
            spotlightTitle: 'A learning platform for water education that helps Arizonans make informed decisions.',
            spotlightDesc: 'Arizona Real Water LMS is a platform for water management and conservation education, delivering accessible courses and resources for communities, real estate professionals, and the public.'
        },
        {
            id: 'lawfare',
            title: 'International Lawfare Website',
            subtitle: 'Drupal-Based Legal Scholarship Hub',
            listSubline: 'Drupal CMS organizing legal scholarship under the ASU Design System, with searchable publications and course materials.',
            desc: 'The program page for International Lawfare, introducing and sharing course details.',
            demoIntro: 'A centralized digital repository designed to organize complex legal scholarship within the ASU Design System.',
            filterType: 'web',
            audience: 'Public',
            tags: ['Website', 'CMS', 'EdTech'],
            image: 'assets/img/main images/International Lawfare.png',
            heroImage: 'assets/img/law/hero.png',
            link: 'lawfare.html',
            timeline: 'Jan 2026 – Feb 2026',
            team: '1 Engineer, 1 Designer, 1 PM',
            teamRoster: [
                '1 UI Designer (me)',
                '1 Product Manager',
                '1 Software Engineer'
            ],
            role: 'UI Design (Web layout, components), Building site on CMS under ASU Design System (Drupal)',
            tools: ['Figma', 'Drupal', 'Illustrator', 'Photoshop', 'HTML/CSS', 'ASU Design System'],
            liveLink: 'https://lawfare-asufactory1.acquia.asu.edu/',
            secondary: true
        },
        {
            id: 'lt',
            title: 'Longtan Walker Pace Counter APP',
            subtitle: 'Behavior-Driven Mobility App Concept',
            listSubline: 'Step-tracking concept that rewards walking on Longtan Road to cut car and scooter traffic.',
            desc: 'By accumulating steps, people are encouraged to walk to reduce the traffic of cars and motorcycles on Longtan Road. (Class project)',
            demoIntro: 'Applied UX research and prototyping to design a mobile experience encouraging walkability and urban sustainability.',
            filterType: 'apps',
            audience: 'Consumer',
            tags: ['Mobile App', 'Civic Tech', 'B2C'],
            image: 'assets/img/main images/Longtan Walker.png',
            heroImage: 'assets/img/lt/hero.png',
            link: 'lt.html',
            timeline: 'Jan 2020 – May 2020',
            team: '2 Designers',
            teamRoster: [
                '1 Product Designer (me)',
                '1 Product Designer'
            ],
            role: 'UX Research (survey, interview), Product Design (prototype), UI Design (components)',
            tools: ['Figma', 'HTML/CSS', 'Illustrator', 'jQuery', 'Bootstrap'],
            liveLink: null,
            secondary: true
        },
        {
            id: 'quickbite',
            title: 'QuickBite',
            moreCardTitle: 'QuickBite AI Assistant',
            subtitle: 'AI Meal Planning Assistant',
            listSubline: 'Claude-powered planner syncing fridge inventory, nutrition goals, and weekly menus in one workspace.',
            desc: 'A smart meal planning assistant born from the frustration of "What should I eat today?" combined with a busy schedule and limited budget.',
            demoIntro: 'A smart assistant using Claude AI & USDA data to plan meals and recipes based on user needs.',
            filterType: 'apps',
            audience: 'Consumer',
            tags: ['Web App', 'AI', 'B2C'],
            image: 'assets/img/main images/QuickBite.png',
            heroImage: 'assets/img/QuickBite/hero.png',
            link: 'quickbite.html',
            timeline: 'Aug 2025 – Dec 2025',
            team: 'Solo',
            teamRoster: ['1 Product Designer & Front-End Developer (me)'],
            role: 'Product Designer & Front-End Developer',
            tools: ['Python', 'Streamlit', 'Anthropic Claude', 'Google Gemini', 'USDA FoodData Central', 'GitHub', 'Google AI Studio'],
            liveLink: null,
            secondary: true,
            moreCardWidth: 140
        },
        {
            id: 'magnate',
            title: 'Magnate Technology Official Website',
            subtitle: 'Corporate Website & Digital Brand System',
            listSubline: 'Corporate site and reusable UI system establishing Magnate Technology\'s industrial automation brand online.',
            desc: 'Commissioned by Magnate Technology Co., Ltd. to create a website and establish an online presence. (It is online now!)',
            demoIntro: 'Designed and built a scalable website and UI component system to establish a professional digital presence.',
            filterType: 'web',
            audience: 'Enterprise',
            tags: ['Website', 'Corporate', 'B2B'],
            image: 'assets/img/main images/Magnate.png',
            heroImage: 'assets/img/Magnate/hero.png',
            link: 'magnate.html',
            timeline: 'Jun 2023 – Sep 2023',
            team: '2 UI Designers, 3 Engineers, 1 PM, 1 Planner',
            teamRoster: [
                '1 UI Designer (me)',
                '1 UI Designer',
                '3 Software Engineers',
                '1 Product Manager',
                '1 Planner'
            ],
            role: 'UI Design (components, color), Front-end interaction and userflow design',
            tools: ['HTML/CSS', 'Illustrator', 'jQuery', 'Bootstrap'],
            liveLink: 'https://www.maicl.com/',
            secondary: true
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
            team: 'Solo',
            teamRoster: ['1 UI/UX Designer, Visual Designer & Typographer (me)'],
            role: 'UI/UX Designer, Visual Designer, Typographer',
            tools: ['HTML/CSS', 'JavaScript', 'Canvas API', 'Illustrator'],
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
            teamRoster: [
                'Michelle Chen, UI/Front-end Lead (me)',
                'Cathy Chen',
                'Jerry Chen'
            ],
            role: 'UI/Front-end Lead',
            tools: ['Figma', 'React', 'Alpine.js', 'Tailwind CSS', 'ASP.NET Core MVC', 'SQLite', 'JavaScript', 'HTML5', 'CSS'],
            liveLink: 'https://devpost.com/software/daily-moo-mood',
            award: "2nd Place Winner · RoseHack, UC Riverside (2025)",
            awardShort: '2nd Place · RoseHack 2025'
        },
        {
            id: 'enchanter',
            title: 'Enchanter',
            subtitle: '3D Adventure Game',
            listSubline: 'Endstar platform game where players fix a magical painting to break a kingdom\'s curse.',
            desc: 'A 3D adventure game built on the Endstar platform combining exploration, puzzle-solving, and narrative storytelling. (People\'s Choice Award winner)',
            demoIntro: 'Designed and built a fantasy adventure game on Endstar where players restore a magical painting to break a kingdom\'s curse.',
            filterType: 'apps',
            audience: 'Consumer',
            tags: ['Game Design', '3D', 'Narrative'],
            image: 'assets/img/main images/Enchanter.png',
            heroImage: 'assets/img/main images/Enchanter.png',
            link: 'enchanter.html',
            timeline: 'Endstar Game Maker Spark Challenge 2025',
            team: 'Team project',
            role: 'Game Design & Development',
            tools: ['Endstar', 'Figma'],
            liveLink: 'https://studio.endlessstudios.com/endstar/e25c3c59-a822-4576-acd1-3ebfd5b52d09/?assetType=game',
            award: "People's Choice Award · Endstar Game Maker Spark Challenge, ASU (2025)",
            awardShort: "People's Choice Award"
        },
        {
            id: 'stiffy',
            title: 'Stiffy Wanderers',
            subtitle: 'Interactive Mobile Game',
            listSubline: 'Location-based mobile game guiding a rock character through environmental missions.',
            desc: 'A mobile game guiding a rock character through environmental missions based on real-time location. (Hackathon project)',
            demoIntro: 'Designed an interactive mobile game that uses real-time location to guide players through environmental missions.',
            filterType: 'apps',
            audience: 'Consumer',
            tags: ['Game Design', 'Mobile App', 'Hackathon'],
            image: 'assets/img/main images/Stiffy.png',
            heroImage: 'assets/img/Stiffy/main visual.png',
            link: 'stiffy.html',
            timeline: 'Hackathon project',
            team: 'Team project',
            role: 'UI/UX Design',
            tools: ['Figma'],
            liveLink: 'https://devpost.com/software/stiffy-wanderers'
        }
    ],

    data: {
        home: {
            heroGreeting: '',
            title: `<span class="hero-title-line hero-title-line--focus">I design accessible,</span><span class="hero-title-line hero-title-line--focus">AI-driven web products.</span>`,
            desc: '',
            briefIntro: 'Currently working as a UX/UI Designer at VisLab. From research and prototyping through front-end, shipping WCAG-compliant interfaces for data-heavy tools.',
            meta: ``
        },
        about: {
            title: `About`,
            desc: "From cultural institutions and civic programs to SaaS tools and hackathon projects, Michelle has spent the last several years designing interfaces and systems that respect both user needs and implementation realities.",
            meta: ``
        },
        playground: {
            title: `Playground`,
            desc: "Old work, side projects, or random explorations.",
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
            meta: ``, backLink: true, liveLink: null, cover: true
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

    getFeaturedProjects: function() {
        return this.getHomeProjects().filter(function(p) { return p.featured; });
    },

    getSecondaryProjects: function() {
        return this.getHomeProjects().filter(function(p) { return p.secondary; });
    },

    applyHomeProjectsContent: function(html) {
        if (!html) return html;

        var featured = this.getFeaturedProjects();
        var secondary = this.getSecondaryProjects();
        var featuredCards = featured.map(function(p, i) {
            return LayoutComponents.buildStackCard(p, i);
        }).join('');
        var moreCard = LayoutComponents.buildMoreWorkCard(secondary, featured.length);
        var spotlightHTML = '<div class="stack-deck">' + featuredCards + moreCard + '</div>';

        var parser = new DOMParser();
        var doc = parser.parseFromString('<div id="home-content-root">' + html + '</div>', 'text/html');
        var root = doc.getElementById('home-content-root');
        if (!root) return html;

        var spotlightList = root.querySelector('#featured-work-list, .home-featured-spotlights');
        if (spotlightList) spotlightList.innerHTML = spotlightHTML;

        return root.innerHTML;
    },

    /* Playground-only projects — never shown in "Next Projects" on case study pages */
    playgroundProjectIds: ['dailymoo', 'enchanter', 'stiffy', 'spring'],

    isPlaygroundProject: function(id) {
        return this.playgroundProjectIds.indexOf(id) !== -1;
    },

    getNextProjects: function(currentId, count) {
        /* Next Projects only surfaces featured case studies, in home-page order.
           More-work (secondary) projects and coming-soon (no page) are excluded. */
        var featured = this.getFeaturedProjects().filter(function(p) {
            return !p.comingSoon && p.link && p.link !== '#';
        });
        if (!featured.length) return [];

        var idx = featured.findIndex(function(p) { return p.id === currentId; });
        var result = [];

        if (idx === -1) {
            /* Current page isn't a featured project — list featured from the start. */
            for (var i = 0; i < count && i < featured.length; i++) {
                result.push(featured[i]);
            }
        } else {
            /* Continue from the current featured project, cycling past the others. */
            for (var j = 1; j <= featured.length && result.length < count; j++) {
                var pick = featured[(idx + j) % featured.length];
                if (pick.id !== currentId) result.push(pick);
            }
        }
        return result;
    },

    init: function(pageType) {
        /* Pages processed by scripts/prerender.mjs already contain the full
           layout as static HTML (SEO + progressive enhancement); skip the
           rebuild and only bind behaviors. */
        if (!document.body.hasAttribute('data-prerendered')) {
            this.injectHead(pageType);
            this.buildLayout(pageType);
        }

        const finishBoot = () => this.startAppEffects(pageType);

        /* Splash overlays the built page; CSS hides #app-root until the M animation ends */
        if (pageType === 'home' && typeof SplashScreen !== 'undefined' && SplashScreen.shouldShow()) {
            SplashScreen.show(finishBoot);
            return;
        }

        finishBoot();
    },

    startAppEffects: function(pageType) {
        const projectMeta = this.getProject(pageType);
        if (typeof LayoutComponents !== 'undefined') {
            LayoutComponents.syncPrerenderedChrome(pageType, projectMeta);
        }
        if (pageType === 'home') {
            this.initHomeToolbox();
        }
        this.initEntryEffects(pageType);

        if (typeof AppLogic !== 'undefined') AppLogic.init();
        if ((pageType === 'home' || pageType === 'playground' || pageType === 'about') && typeof MonsterLogic !== 'undefined') {
            MonsterLogic.init();
        }
        if (!document.querySelector('.mc-nav')) {
            this.initTopNavAvatarEyes();
            this.initTopNavDock();
        }
        if ((pageType === 'home' || pageType === 'playground' || pageType === 'about') && typeof ContactFormLogic !== 'undefined') {
            ContactFormLogic.init();
        }
        if ((pageType === 'home') && typeof CarouselLogic !== 'undefined') {
            CarouselLogic.init();
        }
        if (pageType === 'home') {
            this.initHomeContactNav();
            this.initHomeFeaturedWorkNav();
            if (typeof HomeScrollScenes !== 'undefined') {
                HomeScrollScenes.init();
            }
            this.initHomeCanBringCards();
            this.initProjectStack();
            this.initHomeTopNav();
            this.initTopNavAutoHide();
            this.initMoreProjectsDeck();
            this.initAboutAwardPreviews();
            this.initHomeHeaderComposition();
        }
        if (pageType === 'playground') {
            this.initPlaygroundBoard();
            if (!document.querySelector('.mc-nav')) {
                this.initHomeTopNav();
                this.initTopNavAutoHide();
            }
        }
        if (pageType === 'about') {
            this.initHomeToolbox();
            this.initAboutAwardPreviews();
            if (!document.querySelector('.mc-nav')) {
                this.initHomeTopNav();
                this.initTopNavAutoHide();
            }
        }
        if (typeof CursorLogic !== 'undefined') CursorLogic.ensure();
        const isCasePage = pageType !== 'home' && pageType !== 'playground' && pageType !== 'about';
        if (isCasePage) {
            this.initProjectTopNav();
            this.initCaseFigureZoom();
            this.initCaseInfographic();
            this.initCaseScrollSpy();
        }
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

    initCaseScrollSpy: function() {
        const run = () => {
            if (typeof CaseScrollSpy !== 'undefined') {
                setTimeout(() => CaseScrollSpy.init(), 120);
            }
        };
        if (typeof CaseScrollSpy !== 'undefined') {
            run();
            return;
        }
        const existing = document.querySelector('script[data-case-scroll-spy]');
        if (existing) {
            existing.addEventListener('load', run, { once: true });
            return;
        }
        const script = document.createElement('script');
        script.src = 'assets/js/case-scroll-spy.js';
        script.dataset.caseScrollSpy = '1';
        script.onload = run;
        document.body.appendChild(script);
    },

    injectHead: function(pageType) {
        if(document.getElementById('app-styles')) return;
        const isCasePage = pageType && pageType !== 'home' && pageType !== 'playground' && pageType !== 'about';
        const caseInfographicCss = isCasePage
            ? '<link rel="stylesheet" href="assets/css/case-infographic.css">'
            : '';
        const homeFonts = pageType === 'home'
            ? '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" rel="stylesheet">'
            : '';
        const headHTML = `
            <meta charset="UTF-8">
            <link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            ${homeFonts}
            ${caseInfographicCss}
            <style id="app-styles">/* marker: head assets injected */</style>
        `;
        document.head.insertAdjacentHTML('beforeend', headHTML);
    },

    buildLayout: function(pageType) {
        if (typeof CursorLogic !== 'undefined') {
            CursorLogic.destroy();
        }

        const contentDiv = document.getElementById('page-specific-content');
        let uniqueContent = contentDiv ? contentDiv.innerHTML : "";
        if (pageType === 'home') {
            uniqueContent = this.applyHomeProjectsContent(uniqueContent);
        }
        const pageData = this.data[pageType] || this.data.home;
        const projectMeta = this.getProject(pageType);

        const worksHeaderHTML = LayoutComponents.buildWorksHeader(pageType);
        const isGridPage = pageType === 'home';
        const isPlaygroundPage = pageType === 'playground';
        const nextProjectHTML = !isGridPage && !isPlaygroundPage ? LayoutComponents.buildNextProjects(this.getNextProjects(pageType, 2)) : '';
        const mobileProjectActionsHTML = !isGridPage && !isPlaygroundPage && projectMeta ? LayoutComponents.buildMobileProjectActions(projectMeta) : '';
        const heroImage = projectMeta ? (projectMeta.heroImage || projectMeta.image || 'assets/img/bk/welcome.jpg') : '';
        const heroAlt = projectMeta ? (projectMeta.heroAlt || (projectMeta.title + ' main hero image')) : '';
        const heroVideo = projectMeta ? (projectMeta.heroVideo || '') : '';
        const coverHTML = (!isGridPage && projectMeta)
            ? heroVideo
                ? `<div class="case-hero-img case-hero-video"><video src="${heroVideo}" autoplay muted playsinline loop preload="auto" style="width:100%;height:100%;object-fit:cover;"></video></div>`
                : `<div class="case-hero-img"><img src="${heroImage}" alt="${heroAlt}" style="width:100%;height:100%;object-fit:cover;"></div>`
            : '';
        const heroHTML = coverHTML
            ? `<div class="case-hero">${coverHTML}</div>`
            : '';
        const footerHTML = LayoutComponents.buildFooter(pageType);
        let finalContent = `${worksHeaderHTML} ${heroHTML} ${uniqueContent} ${mobileProjectActionsHTML} ${nextProjectHTML} ${(isGridPage || isPlaygroundPage) ? footerHTML : ''}`;

        if (pageType === 'home') {
            finalContent = `${LayoutComponents.buildHomePageHeader(pageData)}${finalContent}`;
        }

        if (pageType === 'playground') {
            finalContent = LayoutComponents.buildPlaygroundBoard();
        }

        const aboutBackLinkHTML = pageType === 'about'
            ? `<a href="index.html" class="about-home-link about-home-link-mobile-only"><i class="fas fa-arrow-left" style="margin-right:8px;"></i> Back to Home</a>`
            : '';

        if (pageType === 'about') {
            const layoutHTML = `
                ${LayoutComponents.buildSkipLink()}
                ${LayoutComponents.buildProgressBar()}
                ${LayoutComponents.buildBackToTop()}
                ${LayoutComponents.buildTopNav('about')}
                <div id="app-root" class="app-root-about">
                    <div class="content-wrapper content-wrapper-fullwidth">
                        <div class="right-panel right-panel-fullwidth">
                            <div class="scroll-area" id="scroll-container">
                                <main class="single-page-wrapper" id="main-content" tabindex="-1">
                                    ${uniqueContent}
                                </main>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.innerHTML = layoutHTML;
            return;
        }

        if (pageType === 'home') {
            const layoutHTML = `
                ${LayoutComponents.buildSkipLink()}
                ${LayoutComponents.buildMoreWorkPaintFilters()}
                ${LayoutComponents.buildProgressBar()}
                ${LayoutComponents.buildBackToTop()}
                ${LayoutComponents.buildTopNav('home')}
                <div id="app-root" class="app-root-home">
                    <div class="content-wrapper content-wrapper-fullwidth">
                        <div class="right-panel right-panel-fullwidth">
                            <div class="scroll-area" id="scroll-container">
                                <main class="single-page-wrapper" id="main-content" tabindex="-1">${finalContent}</main>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.innerHTML = layoutHTML;
            return;
        }

        if (pageType === 'playground') {
            const layoutHTML = `
                ${LayoutComponents.buildSkipLink()}
                ${LayoutComponents.buildTopNav('playground')}
                <div id="app-root" class="app-root-playground app-root-about">
                    <div class="content-wrapper content-wrapper-fullwidth">
                        <div class="right-panel right-panel-fullwidth">
                            <div class="scroll-area" id="scroll-container">
                                <main class="single-page-wrapper" id="main-content" tabindex="-1">
                                    ${finalContent}
                                </main>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.innerHTML = layoutHTML;
            document.body.classList.add('is-playground-page');
            return;
        }

        const sidebarCompactScope = (!isGridPage && projectMeta)
            ? ' sidebar-compact-scope sidebar-compact-scope--project'
            : '';

        const layoutHTML = `
            ${LayoutComponents.buildSkipLink()}
            ${LayoutComponents.buildProgressBar()}
            ${LayoutComponents.buildBackToTop()}
            ${LayoutComponents.buildTopNav(pageType)}
            <div id="app-root" class="app-root-project">
                <div class="content-wrapper${sidebarCompactScope}">
                    <aside class="sidebar">
                        <div class="sidebar-top">${LayoutComponents.buildSidebarTop(pageData, projectMeta, pageType)}</div>
                        <div class="sidebar-bottom-block">
                            ${LayoutComponents.buildSidebarMeta(pageType, projectMeta, pageData)}
                            ${LayoutComponents.buildSidebarBottom(pageType, pageData)}
                        </div>
                        ${pageType === 'playground' ? LayoutComponents.buildSidebarToolsMarquee() : ''}
                    </aside>
                        <div class="right-panel">
                        <div class="scroll-area" id="scroll-container">
                            <main class="single-page-wrapper" id="main-content" tabindex="-1">${finalContent}</main>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.innerHTML = layoutHTML;
        document.body.classList.add('is-project-page');
    },

    scrollToHomeAbout: function() {
        this.scrollToHomeSection('about', -16);
    },

    scrollToHomeSection: function(id, offset) {
        const el = document.getElementById(id);
        if (!el) return;

        const offsetVal = offset ?? -16;
        const scrollRoot = document.getElementById('scroll-container');
        const useContainer = window.innerWidth > 1200 && !!scrollRoot;

        const runScroll = () => {
            if (scrollRoot && useContainer) {
                const rootRect = scrollRoot.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();
                const top = scrollRoot.scrollTop + (elRect.top - rootRect.top) + offsetVal;
                /* behavior omitted: CSS scroll-behavior decides (smooth only
                   under prefers-reduced-motion: no-preference) */
                scrollRoot.scrollTo({ top: Math.max(0, top) });
                return;
            }

            el.scrollIntoView({ block: 'start' });
        };

        requestAnimationFrame(() => setTimeout(runScroll, 120));
    },

    initHomeFeaturedWorkNav: function() {
        if (this._homeFeaturedNavBound) return;
        this._homeFeaturedNavBound = true;

        const scrollHomeToTop = () => {
            const scrollRoot = document.getElementById('scroll-container');
            if (scrollRoot) scrollRoot.scrollTo({ top: 0, behavior: 'instant' });
            window.scrollTo({ top: 0, behavior: 'instant' });
        };

        if (window.location.hash === '#featured-work') {
            history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
            scrollHomeToTop();
            requestAnimationFrame(() => setTimeout(scrollHomeToTop, 120));
        }

        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href="#featured-work"]');
            if (!link) return;
            event.preventDefault();
            this.scrollToHomeSection('featured-work', -20);
        });
    },

    initHomeFeaturedStack: function() {
        const stack = document.querySelector('.home-featured-spotlights--stack');
        if (!stack) return;

        const syncStackSpacers = () => {
            const cards = stack.querySelectorAll('.home-spotlight-card');
            if (!cards.length) return;

            cards.forEach((card) => {
                card.style.removeProperty('min-height');
            });

            let maxHeight = 0;
            cards.forEach((card) => {
                maxHeight = Math.max(maxHeight, card.getBoundingClientRect().height);
            });
            if (!maxHeight) return;

            const cardHeight = Math.ceil(maxHeight);
            cards.forEach((card) => {
                card.style.minHeight = `${cardHeight}px`;
            });

            const viewportRoom = Math.max(window.innerHeight - 160, 320);
            const spacer = Math.max(180, Math.round(Math.min(viewportRoom * 0.5, cardHeight * 0.85)));
            const release = Math.max(72, Math.round((cards.length - 1) * cardHeight * 0.35 + spacer * 0.25));
            stack.style.setProperty('--spotlight-stack-height', `${cardHeight}px`);
            stack.style.setProperty('--spotlight-stack-overlap', `${cardHeight}px`);
            stack.style.setProperty('--spotlight-stack-spacer', `${spacer}px`);
            stack.style.setProperty('--spotlight-stack-release', `${release}px`);
        };

        stack.querySelectorAll('.home-spotlight-card img').forEach((img) => {
            if (img.complete) return;
            img.addEventListener('load', syncStackSpacers, { once: true });
        });

        const revealStackCards = () => {
            stack.querySelectorAll('.home-spotlight-card').forEach((card) => {
                card.classList.add('is-revealed');
            });
        };

        syncStackSpacers();
        revealStackCards();
        window.addEventListener('load', () => {
            syncStackSpacers();
            revealStackCards();
        }, { once: true });
        window.addEventListener('resize', syncStackSpacers);
    },

    /* Sticky stacking project cards: scroll-driven scale + dim as each card is covered.
       Disabled — the Featured deck no longer uses sticky stacking. */
    initProjectStack: function() {
        return;
        const deck = document.querySelector('.stack-deck');
        if (!deck) return;
        if (document.documentElement.classList.contains('home-scroll-scenes')) return;
        const cards = Array.prototype.slice.call(deck.querySelectorAll('.stack-card'));
        if (cards.length < 2) return;

        const mq = window.matchMedia('(max-width: 860px), (prefers-reduced-motion: reduce)');
        let ticking = false;

        const clear = () => {
            cards.forEach((card) => {
                card.style.transform = '';
                card.style.filter = '';
            });
        };

        const update = () => {
            ticking = false;
            if (mq.matches) { clear(); return; }
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                const next = cards[i + 1];
                if (!next) { card.style.transform = ''; card.style.filter = ''; continue; }
                const h = card.offsetHeight;
                if (!h) continue;
                /* Coverage 0→1: how far the next card has risen over this pinned one.
                   transform-origin keeps the top edge fixed, so rects stay comparable. */
                const gap = next.getBoundingClientRect().top - card.getBoundingClientRect().top;
                let p = 1 - gap / h;
                p = p < 0 ? 0 : p > 1 ? 1 : p;
                card.style.transform = 'scale(' + (1 - 0.05 * p).toFixed(4) + ')';
                card.style.filter = 'brightness(' + (1 - 0.10 * p).toFixed(3) + ')';
            }
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(update);
        };

        /* Bind the native scroller (#scroll-container on desktop) plus
           window for the mobile/native-scroll case. */
        const scroller = document.getElementById('scroll-container');
        if (scroller) scroller.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        window.addEventListener('load', onScroll, { once: true });
        update();
    },

    initHomeToolbox: function() {
        const mount = document.getElementById('home-toolbox-stickers');
        if (!mount || typeof LayoutComponents === 'undefined') return;
        mount.outerHTML = LayoutComponents.buildToolStickers('home-toolbox-stickers');
    },

    initPlaygroundBoard: function() {
        if (typeof PlaygroundBoard !== 'undefined') {
            PlaygroundBoard.init();
        }
    },

    isPageReload: function() {
        try {
            const navEntries = performance.getEntriesByType && performance.getEntriesByType('navigation');
            if (navEntries && navEntries.length && navEntries[0].type) {
                return navEntries[0].type === 'reload';
            }
            if (performance.navigation) {
                return performance.navigation.type === 1;
            }
        } catch (e) {}
        return false;
    },

    clearLocationHash: function() {
        history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    },

    scrollHomeToTopImmediate: function() {
        const scrollRoot = document.getElementById('scroll-container');
        if (scrollRoot) scrollRoot.scrollTo({ top: 0, behavior: 'instant' });
        window.scrollTo({ top: 0, behavior: 'instant' });
    },

    initHomeAboutNav: function() {
        if (window.location.hash === '#about') {
            // A reload keeps the #about hash, causing the page to jump back to the
            // section on every refresh. Strip the hash and stay at the top on reload;
            // only honor it for genuine (cross-page) navigation.
            if (this.isPageReload()) {
                this.clearLocationHash();
                this.scrollHomeToTopImmediate();
                requestAnimationFrame(() => setTimeout(() => this.scrollHomeToTopImmediate(), 120));
            } else {
                this.scrollToHomeAbout();
            }
        }
        document.querySelectorAll('a[href="#about"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                history.pushState(null, '', '#about');
                this.scrollToHomeAbout();
            });
        });
    },

    initHomeContactNav: function() {
        if (window.location.hash === '#contact') {
            if (this.isPageReload()) {
                this.clearLocationHash();
                this.scrollHomeToTopImmediate();
                requestAnimationFrame(() => setTimeout(() => this.scrollHomeToTopImmediate(), 120));
            } else {
                this.scrollToHomeSection('contact', -20);
            }
        }
        document.querySelectorAll('a[href="#contact"]').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                history.pushState(null, '', '#contact');
                this.scrollToHomeSection('contact', -20);
            });
        });
    },

    initTopNavAvatarEyes: function() {
        if (document.body.dataset.topNavAvatarEyesBound) return;
        const eyes = document.querySelectorAll('.site-top-nav__eye');
        if (!eyes.length) return;
        if (typeof EyeFollow === 'undefined') return;

        document.body.dataset.topNavAvatarEyesBound = '1';
        EyeFollow.registerNodeList(eyes, '.site-top-nav__pupil');
    },

    initHomeTopNav: function() {
        const brand = document.querySelector('.site-top-nav__brand');
        if (!brand || brand.dataset.navBound) return;
        brand.dataset.navBound = '1';

        brand.addEventListener('click', (e) => {
            // Only intercept the brand click when the user is already on the home
            // page (so it scrolls to top). If not on home (e.g. playground), allow
            // the normal anchor navigation to `index.html`.
            const isHome = document.body.classList.contains('app-root-home')
                || window.location.pathname.endsWith('index.html')
                || window.location.pathname === '/';
            if (!isHome) {
                return; // allow default navigation
            }

            e.preventDefault();
            /* behavior omitted: CSS scroll-behavior decides */
            const scrollRoot = document.getElementById('scroll-container');
            if (scrollRoot) scrollRoot.scrollTo({ top: 0 });
            else window.scrollTo({ top: 0 });
            history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
        });
    },

    getTopNavDockMetrics: function() {
        const wrapper = document.querySelector('#app-root .content-wrapper');
        if (!wrapper) return null;

        const sidebar = wrapper.querySelector(':scope > .sidebar');
        if (sidebar) {
            const sidebarStyle = getComputedStyle(sidebar);
            if (sidebarStyle.display !== 'none' && sidebarStyle.visibility !== 'hidden') {
                const rect = sidebar.getBoundingClientRect();
                if (rect.width > 0) {
                    return { left: rect.left, width: rect.width };
                }
            }
        }

        const wrapperRect = wrapper.getBoundingClientRect();
        const styles = getComputedStyle(wrapper);
        const padX = parseFloat(styles.getPropertyValue('--case-page-pad-x')) || 48;
        const percent = parseFloat(styles.getPropertyValue('--project-sidebar-width-percent')) || 16;
        const extraPx = parseFloat(styles.getPropertyValue('--project-sidebar-width-extra')) || 34;

        return {
            left: wrapperRect.left + padX,
            width: wrapperRect.width * (percent / 100) + extraPx
        };
    },

    syncTopNavDock: function() {
        const nav = document.querySelector('.site-top-nav');
        if (!nav) return;

        // The dock geometry (fixed 309px width + left) is fully CSS-controlled per
        // breakpoint, so JS only toggles the --docked class for the inner-layout
        // styling and reveals the nav. It never sets inline width/left, which is
        // what previously caused the nav to resize (shrink) on load.
        if (window.innerWidth <= 1200) {
            nav.classList.remove('site-top-nav--docked');
        } else {
            nav.classList.add('site-top-nav--docked');
        }

        // Clear any legacy inline geometry so CSS wins.
        nav.style.removeProperty('left');
        nav.style.removeProperty('width');
        nav.style.removeProperty('right');

        // Reveal the nav (it starts hidden to avoid any pre-position flash).
        nav.classList.add('is-nav-ready');
    },

    initTopNavDock: function() {
        if (this._topNavDockBound) return;
        this._topNavDockBound = true;

        const sync = () => this.syncTopNavDock();
        const bindScroller = () => {
            const scroller = document.getElementById('scroll-container');
            if (scroller) {
                scroller.addEventListener('scroll', sync, { passive: true });
            }
        };

        sync();
        bindScroller();
        window.addEventListener('resize', () => {
            requestAnimationFrame(sync);
            setTimeout(sync, 420);
        }, { passive: true });
        window.addEventListener('pageshow', sync);
        window.addEventListener('load', sync);
        setTimeout(sync, 0);
        setTimeout(sync, 150);
        setTimeout(sync, 500);
    },

    initProjectTopNav: function() {
        this.initHomeTopNav();
        this.initTopNavAutoHide();
        this.initProjectNavMenu();
        this.initProjectNavScroll();
    },

    initProjectNavScroll: function() {
        const nav = document.querySelector('.site-top-nav');
        if (!nav || nav.dataset.projectScrollBound) return;
        nav.dataset.projectScrollBound = '1';

        let lastScroll = 0;

        const syncCompact = () => {
            this.syncTopNavDock();
        };

        const syncCompactAnimated = () => {
            syncCompact();
            requestAnimationFrame(syncCompact);
            setTimeout(syncCompact, 420);
        };

        const dockNavLeft = () => {
            nav.classList.add('is-scroll-hidden');
            nav.classList.remove('is-menu-open');
            const toggle = nav.querySelector('.site-top-nav__menu-toggle');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
                toggle.setAttribute('aria-label', 'Open menu');
            }
            syncCompactAnimated();
        };

        const getScroll = () => {
            const root = document.getElementById('scroll-container');
            return root ? root.scrollTop : window.scrollY;
        };

        const update = (e) => {
            if (window.innerWidth <= 1200) return;

            const currentScroll = (e && typeof e.scroll === 'number') ? e.scroll : getScroll();

            if (nav.classList.contains('is-menu-open')) {
                if (typeof nav._closeProjectMenu === 'function') {
                    nav._closeProjectMenu();
                } else {
                    nav.classList.remove('is-menu-open');
                    syncCompactAnimated();
                }
                lastScroll = currentScroll;
                return;
            }

            dockNavLeft();
            lastScroll = currentScroll;
        };

        const scroller = document.getElementById('scroll-container');
        if (scroller) {
            scroller.addEventListener('scroll', () => update(), { passive: true });
        }
        update();
    },

    initProjectNavMenu: function() {
        const nav = document.querySelector('.site-top-nav');
        const toggle = nav ? nav.querySelector('.site-top-nav__menu-toggle') : null;
        if (!nav || !toggle || toggle.dataset.bound) return;
        toggle.dataset.bound = '1';

        const syncCompactNav = () => {
            this.syncTopNavDock();
        };

        const setMenuOpen = (open) => {
            nav.classList.toggle('is-menu-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            syncCompactNav();
        };

        nav._closeProjectMenu = () => setMenuOpen(false);

        toggle.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (!nav.classList.contains('is-scroll-hidden') || window.innerWidth <= 1200) return;
            setMenuOpen(!nav.classList.contains('is-menu-open'));
        });

        nav.querySelectorAll('.site-top-nav__link').forEach((link) => {
            link.addEventListener('click', () => setMenuOpen(false));
        });

        document.addEventListener('click', (event) => {
            if (!nav.classList.contains('is-menu-open')) return;
            if (nav.contains(event.target)) return;
            setMenuOpen(false);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && nav.classList.contains('is-menu-open')) {
                setMenuOpen(false);
            }
        });

        const observer = new MutationObserver(() => {
            const isProjectDesktop = document.body.classList.contains('is-project-page') && window.innerWidth > 1200;
            if (!isProjectDesktop && !nav.classList.contains('is-scroll-hidden') && nav.classList.contains('is-menu-open')) {
                // Guard on is-menu-open so the observer only reacts when there is
                // actually a menu to close — and disconnect while we mutate the nav's
                // class so setMenuOpen() can't re-trigger this observer (infinite loop).
                observer.disconnect();
                setMenuOpen(false);
                observer.takeRecords();
                observer.observe(nav, { attributes: true, attributeFilter: ['class'] });
            }
        });
        observer.observe(nav, { attributes: true, attributeFilter: ['class'] });
    },

    initTopNavAutoHide: function() {
        const nav = document.querySelector('.site-top-nav');
        if (!nav || nav.dataset.autoHideBound) return;
        nav.dataset.autoHideBound = '1';
        nav.classList.add('site-top-nav--auto-hide');

        const isProjectPage = document.body.classList.contains('is-project-page');

        if (isProjectPage) {
            this.syncTopNavDock();
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        if (isProjectPage) {
            /* Project pages: scroll visibility is handled in AppLogic.initScrollLogic */
            return;
        }

        let lastScroll = 0;
        let ticking = false;
        const threshold = 8;
        const minScroll = 64;

        const getScrollPosition = () => {
            const isPlayground = !!document.querySelector('.app-root-playground');
            if (isPlayground) return 0;

            const isMobile = window.innerWidth <= 1200;
            if (isMobile) return window.scrollY;
            const scrollRoot = document.getElementById('scroll-container');
            return scrollRoot ? scrollRoot.scrollTop : window.scrollY;
        };

        const updateNavVisibility = () => {
            ticking = false;
            const currentScroll = getScrollPosition();
            const delta = currentScroll - lastScroll;
            const isProjectDesktop = isProjectPage && window.innerWidth > 1200;
            const keepProjectMenuOpen = isProjectDesktop && nav.classList.contains('is-menu-open');

            if (keepProjectMenuOpen) {
                nav.classList.add('is-scroll-hidden');
                this.syncTopNavDock();
                lastScroll = Math.max(0, currentScroll);
                return;
            }

            if (isProjectDesktop) {
                /* Project desktop: scroll down → compact left; scroll up → full centered nav */
                const scrollDownThreshold = threshold;
                const scrollUpThreshold = 4;

                if (currentScroll <= minScroll || delta < -scrollUpThreshold) {
                    nav.classList.remove('is-scroll-hidden');
                    nav.classList.remove('is-menu-open');
                } else if (delta > scrollDownThreshold) {
                    nav.classList.add('is-scroll-hidden');
                    nav.classList.remove('is-menu-open');
                }
            } else if (currentScroll <= minScroll) {
                nav.classList.remove('is-scroll-hidden');
            } else if (delta > threshold) {
                nav.classList.add('is-scroll-hidden');
            } else if (delta < -threshold) {
                nav.classList.remove('is-scroll-hidden');
            }

            this.syncTopNavDock();
            lastScroll = Math.max(0, currentScroll);
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(updateNavVisibility);
        };

        const bindScroll = () => {
            const isPlayground = !!document.querySelector('.app-root-playground');
            if (isPlayground) {
                nav.classList.remove('is-scroll-hidden');
                return;
            }

            const isMobile = window.innerWidth <= 1200;
            const scroller = isMobile ? window : document.getElementById('scroll-container');
            if (scroller) scroller.addEventListener('scroll', onScroll, { passive: true });
            updateNavVisibility();
        };

        bindScroll();
    },

    initMoreProjectsDeck: function() {
        if (typeof MoreProjectsDeck !== 'undefined') {
            MoreProjectsDeck.init();
        }
    },

    initMoreProjectsPreview: function() {
        this.initMoreProjectsDeck();
    },

    initAboutAwardPreviews: function() {
        if (window.matchMedia('(max-width: 900px)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const section = document.querySelector('.home-about-copy');
        if (!section || section.dataset.awardPreviewInit) return;
        section.dataset.awardPreviewInit = '1';

        let preview = document.getElementById('home-award-preview');
        if (!preview) {
            preview = document.createElement('div');
            preview.id = 'home-award-preview';
            preview.className = 'home-award-preview';
            preview.setAttribute('aria-hidden', 'true');
            preview.innerHTML = '<img src="" alt="">';
            document.body.appendChild(preview);
        }

        const img = preview.querySelector('img');
        const width = 240;
        const height = 160;
        const gap = 28;
        let activeLink = null;

        const positionPreview = (x, y) => {
            let left = x + gap;
            let top = y - height / 2;
            const pad = 12;

            if (left + width > window.innerWidth - pad) {
                left = x - width - gap;
            }
            if (top < pad) top = pad;
            if (top + height > window.innerHeight - pad) {
                top = window.innerHeight - height - pad;
            }

            preview.style.left = left + 'px';
            preview.style.top = top + 'px';
        };

        const hidePreview = () => {
            activeLink = null;
            preview.classList.remove('is-visible');
        };

        const showPreview = (link, x, y) => {
            const src = link.getAttribute('data-award-preview');
            if (!src) return;
            activeLink = link;
            if (img.getAttribute('src') !== src) {
                img.src = src;
            }
            img.alt = link.textContent.trim();
            positionPreview(x, y);
            preview.classList.add('is-visible');
        };

        section.addEventListener('mouseover', (e) => {
            const link = e.target.closest('.home-about-award-link');
            if (!link || !link.getAttribute('data-award-preview')) return;
            showPreview(link, e.clientX, e.clientY);
        });

        section.addEventListener('mouseout', (e) => {
            const link = e.target.closest('.home-about-award-link');
            if (!link || link !== activeLink) return;
            const next = e.relatedTarget;
            if (next && link.contains(next)) return;
            hidePreview();
        });

        section.addEventListener('mousemove', (e) => {
            if (!activeLink) return;
            if (!activeLink.contains(e.target)) {
                hidePreview();
                return;
            }
            positionPreview(e.clientX, e.clientY);
        });

        document.addEventListener('mousemove', (e) => {
            if (!activeLink) return;
            if (!e.target.closest('.home-about-award-link')) {
                hidePreview();
            }
        });

        window.addEventListener('scroll', hidePreview, { passive: true });
        window.addEventListener('blur', hidePreview);
    },

    initHomeCanBringCards: function() {
        const cards = document.querySelectorAll('.home-can-bring-card');
        if (!cards.length || document.body.dataset.canBringCardsBound) return;
        document.body.dataset.canBringCardsBound = '1';

        cards.forEach(function(card) {
            card.addEventListener('click', function() {
                const flipped = card.classList.toggle('is-flipped');
                if (flipped) {
                    card.dataset.clickFlipped = '1';
                } else {
                    delete card.dataset.clickFlipped;
                }
            });
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    },

    initHomeHeaderComposition: function() {
        if (window.matchMedia('(max-width: 1199px)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const figure = document.querySelector('.home-header-composition');
        const inner = figure ? figure.querySelector('.home-header-composition__float') : null;
        const artHost = figure ? figure.querySelector('.home-header-composition__art') : null;
        if (!figure || !inner || !artHost || figure.dataset.compositionInit) return;

        const parallaxLayers = [
            ['.comp-shape--purple', { mx: 24, my: 38, rx: -5, ry: -7, sx: 0.05, kx: 0, ky: 0 }],
            ['.comp-shape--orange', { mx: 52, my: -20, rx: 14, ry: 4, sx: 0.11, kx: 0, ky: 0 }],
            ['.comp-shape--green', { mx: -18, my: 46, rx: 6, ry: -12, sx: 0.04, kx: 0, ky: 0 }],
            ['.comp-shape--blue', { mx: 36, my: 28, rx: -10, ry: 10, sx: 0.09, kx: 0, ky: 0 }],
            ['.comp-shape--pink', { mx: 42, my: -34, rx: -15, ry: 8, sx: 0.03, kx: 6, ky: 0 }],
            ['.comp-shape--sage', { mx: 12, my: 50, rx: 4, ry: 5, sx: 0.04, kx: 0, ky: 0 }],
            ['.comp-bridge', { mx: 48, my: 14, rx: -7, ry: -3, sx: 0.02, kx: 0, ky: 5 }],
            ['.comp-chrome', { mx: 14, my: 30, rx: 3, ry: 6, sx: 0.015, kx: 0, ky: 0 }],
            ['.comp-crosses', { mx: 58, my: -44, rx: 20, ry: -12, sx: 0.1, kx: -4, ky: 3 }]
        ];

        let layerNodes = [];
        let svgRoot = null;
        let moveFrame = 0;
        let lastMoveEvent = null;

        const amplifyAxis = (value) => value * (1 + Math.abs(value) * 1.35);

        const applyLayerTransform = (layer, x, y) => {
            const { node, mx, my, rx, ry, sx, kx, ky } = layer;
            const tx = x * mx;
            const ty = y * my;
            const rotation = x * rx + y * ry;
            const scale = 1 + (Math.abs(x) + Math.abs(y)) * sx * 0.5;
            const skewX = x * kx;
            const skewY = y * ky;
            const parts = [`translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`];

            if (rotation) parts.push(`rotate(${rotation.toFixed(2)}deg)`);
            if (skewX || skewY) parts.push(`skew(${skewX.toFixed(2)}deg, ${skewY.toFixed(2)}deg)`);
            if (scale !== 1) parts.push(`scale(${scale.toFixed(3)})`);

            node.style.transform = parts.join(' ');
        };

        const cacheLayers = () => {
            if (!svgRoot) return false;
            layerNodes = parallaxLayers.map(([selector, config]) => {
                const node = svgRoot.querySelector(`${selector} .comp-parallax`);
                return node ? { node, ...config } : null;
            }).filter(Boolean);
            return layerNodes.length > 0;
        };

        const resetLayers = () => {
            layerNodes.forEach(({ node }) => {
                node.style.transform = '';
            });
        };

        const updateFigureTilt = (event) => {
            const rect = figure.getBoundingClientRect();
            if (!rect.width || !rect.height) return;

            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            figure.style.setProperty('--comp-tilt-x', `${(-y * 9).toFixed(2)}deg`);
            figure.style.setProperty('--comp-tilt-y', `${(-3 + x * 5).toFixed(2)}deg`);
        };

        const resetFigureTilt = () => {
            figure.style.removeProperty('--comp-tilt-x');
            figure.style.removeProperty('--comp-tilt-y');
        };

        const paintLayers = (event) => {
            const rect = figure.getBoundingClientRect();
            if (!rect.width || !rect.height) return;

            const x = amplifyAxis((event.clientX - rect.left) / rect.width - 0.5);
            const y = amplifyAxis((event.clientY - rect.top) / rect.height - 0.5);

            figure.classList.add('is-interacting');
            updateFigureTilt(event);
            layerNodes.forEach((layer) => applyLayerTransform(layer, x, y));
        };

        const onMove = (event) => {
            lastMoveEvent = event;
            if (moveFrame) return;
            moveFrame = requestAnimationFrame(() => {
                moveFrame = 0;
                if (lastMoveEvent) paintLayers(lastMoveEvent);
            });
        };

        const onLeave = () => {
            lastMoveEvent = null;
            if (moveFrame) {
                cancelAnimationFrame(moveFrame);
                moveFrame = 0;
            }
            figure.classList.remove('is-interacting');
            resetFigureTilt();
            resetLayers();
        };

        const onMoveTiltOnly = (event) => {
            figure.classList.add('is-interacting');
            updateFigureTilt(event);
        };

        const onLeaveTiltOnly = () => {
            figure.classList.remove('is-interacting');
            resetFigureTilt();
        };

        const bindTiltOnly = () => {
            figure.dataset.compositionInit = '1';
            figure.addEventListener('mousemove', onMoveTiltOnly);
            figure.addEventListener('mouseleave', onLeaveTiltOnly);
        };

        const bind = () => {
            if (!cacheLayers()) {
                bindTiltOnly();
                return;
            }
            figure.dataset.compositionInit = '1';
            figure.addEventListener('mousemove', onMove);
            figure.addEventListener('mouseleave', onLeave);
        };

        const svgSrc = artHost.dataset.src || 'assets/img/Michelle/portfolio-composition-animated.svg';
        const canvasWrap = figure.querySelector('.home-header-composition__canvas-wrap');
        const stage = figure.querySelector('.home-header-composition__stage');

        const syncCanvasToPortrait = () => {
            if (!canvasWrap || !stage || !svgRoot) return;
            const portrait = svgRoot.querySelector('.comp-portrait image');
            if (!portrait) return;

            const stageRect = stage.getBoundingClientRect();
            const portraitRect = portrait.getBoundingClientRect();
            if (!stageRect.width || !stageRect.height || !portraitRect.width || !portraitRect.height) return;

            const left = ((portraitRect.left - stageRect.left) / stageRect.width) * 100;
            const top = ((portraitRect.top - stageRect.top) / stageRect.height) * 100;
            const right = ((stageRect.right - portraitRect.right) / stageRect.width) * 100;
            const bottom = ((stageRect.bottom - portraitRect.bottom) / stageRect.height) * 100;

            canvasWrap.style.setProperty('--portrait-left', `${left.toFixed(3)}%`);
            canvasWrap.style.setProperty('--portrait-top', `${top.toFixed(3)}%`);
            canvasWrap.style.setProperty('--portrait-right', `${right.toFixed(3)}%`);
            canvasWrap.style.setProperty('--portrait-bottom', `${bottom.toFixed(3)}%`);
        };

        const scheduleCanvasSync = () => {
            requestAnimationFrame(() => {
                syncCanvasToPortrait();
                requestAnimationFrame(syncCanvasToPortrait);
            });
        };

        if (!figure.dataset.compositionCanvasSync) {
            figure.dataset.compositionCanvasSync = '1';
            window.addEventListener('resize', scheduleCanvasSync);
        }

        fetch(svgSrc)
            .then((response) => {
                if (!response.ok) throw new Error('composition svg failed to load');
                return response.text();
            })
            .then((svgText) => {
                artHost.innerHTML = svgText.replace(
                    /href="portrait-composition\.png"/g,
                    'href="assets/img/Michelle/portrait-composition.png"'
                );
                svgRoot = artHost.querySelector('svg');
                if (svgRoot) {
                    svgRoot.setAttribute('aria-hidden', 'true');
                    svgRoot.classList.add('home-header-composition__svg');
                }
                const portrait = svgRoot ? svgRoot.querySelector('.comp-portrait image') : null;
                if (portrait) {
                    if (portrait.complete) {
                        scheduleCanvasSync();
                    } else {
                        portrait.addEventListener('load', scheduleCanvasSync, { once: true });
                    }
                }
                bind();
                this.bindCompositionEyes(svgRoot);
            })
            .catch(() => {
                artHost.innerHTML = `<img class="home-header-composition__fallback" src="${svgSrc}" alt="" aria-hidden="true">`;
                bindTiltOnly();
            });
    },

    // Googly eyes on select header shapes — pupils follow the cursor like the nav
    // logo. Pupils are SVG <circle class="comp-pupil"> inside <g class="comp-eye">.
    bindCompositionEyes: function(svgRoot) {
        const eyes = svgRoot ? svgRoot.querySelectorAll('.comp-eye') : [];
        if (!eyes.length || typeof EyeFollow === 'undefined') return;
        EyeFollow.registerNodeList(eyes, '.comp-pupil');
    },

    initSidebarMotion: function(pageType) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (pageType === 'home') {
            const motionRoot = document.querySelector('.home-page-header');
            if (motionRoot) motionRoot.classList.add('sidebar-motion');
            return;
        }
        if (pageType === 'playground') {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) sidebar.classList.add('sidebar-motion');
            return;
        }
        if (pageType !== 'about' && this.getProject(pageType)) {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) sidebar.classList.add('sidebar-motion', 'sidebar-motion--project');
        }
    },

    initEntryEffects: function(pageType) {
        const isGridPage = pageType === 'home';

        if (pageType !== 'home' && pageType !== 'playground') {
            this.initSidebarMotion(pageType);
        }

        // Monster: enter from very bottom on playground & about (home uses cascade)
        if ((isGridPage || pageType === 'about' || pageType === 'playground') && pageType !== 'home') {
            const monsterBody = document.querySelector('.monster-body');
            if (monsterBody) {
                monsterBody.classList.remove('monster-enter');
                setTimeout(() => {
                    monsterBody.classList.add('monster-enter');
                }, 80);
            }
        }

        if (pageType === 'home') {
            this.initHomeCascadeAnimations();
        } else if (pageType === 'about') {
            this.initHomeCascadeAnimations();
        } else if (pageType === 'playground') {
            /* board handles its own layout */
        } else if (isGridPage) {
            const cards = document.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
                card.classList.remove('project-enter');
                const delay = 0.15 + index * 0.06;
                card.style.animationDelay = `${delay}s`;
                requestAnimationFrame(() => {
                    card.classList.add('project-enter');
                });
            });
        } else if (pageType !== 'about') {
            this.initProjectPageEnterAnimations();
        }
    },

    initProjectPageEnterAnimations: function() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const scrollTargets = [];

        document.querySelectorAll('.case-section').forEach((section) => {
            section.classList.add('case-enter', 'case-enter--section');
            scrollTargets.push(section);
        });

        document.querySelectorAll('.next-projects-section, .mobile-project-actions').forEach((el) => {
            el.classList.add('case-enter', 'case-enter--section');
            scrollTargets.push(el);
        });

        if (!scrollTargets.length) return;

        if (reducedMotion) {
            scrollTargets.forEach((el) => el.classList.add('is-entered'));
            return;
        }

        this.bindCaseScrollEnter(scrollTargets);
    },

    bindCaseScrollEnter: function(targets) {
        if (this._caseEnterObserver) {
            this._caseEnterObserver.disconnect();
            this._caseEnterObserver = null;
        }

        const createObserver = () => {
            if (this._caseEnterObserver) {
                this._caseEnterObserver.disconnect();
            }

            this._caseEnterObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-entered');
                    this._caseEnterObserver.unobserve(entry.target);
                });
            }, {
                root: this.getHomeScrollRoot(),
                threshold: 0.1,
                rootMargin: '0px 0px -6% 0px'
            });

            targets.forEach((el) => {
                if (!el.classList.contains('is-entered')) {
                    this._caseEnterObserver.observe(el);
                }
            });
        };

        createObserver();

        // Fallback reveal: some mobile browsers don't fire the IntersectionObserver
        // reliably (wrong scroll root, timing). Manually reveal targets as they
        // enter the viewport so case-study sections can never stay stuck hidden.
        // Runs an initial check, then on scroll (window + the desktop scroller),
        // and detaches itself once everything has entered.
        const revealInView = () => {
            const vh = window.innerHeight || document.documentElement.clientHeight;
            let remaining = 0;
            targets.forEach((el) => {
                if (el.classList.contains('is-entered')) return;
                const r = el.getBoundingClientRect();
                if (r.top < vh * 0.94 && r.bottom > 0) {
                    el.classList.add('is-entered');
                    if (this._caseEnterObserver) this._caseEnterObserver.unobserve(el);
                } else {
                    remaining++;
                }
            });
            if (!remaining) {
                window.removeEventListener('scroll', revealInView);
                const sc = document.getElementById('scroll-container');
                if (sc) sc.removeEventListener('scroll', revealInView);
            }
        };
        window.addEventListener('scroll', revealInView, { passive: true });
        const scrollerEl = document.getElementById('scroll-container');
        if (scrollerEl) scrollerEl.addEventListener('scroll', revealInView, { passive: true });
        // A couple of delayed initial checks catch anything already in view on load.
        requestAnimationFrame(revealInView);
        window.setTimeout(revealInView, 400);

        if (!this._caseEnterResizeBound) {
            this._caseEnterResizeBound = true;
            window.addEventListener('resize', () => {
                window.clearTimeout(this._caseEnterResizeTimer);
                this._caseEnterResizeTimer = window.setTimeout(createObserver, 150);
            });
        }
    },

    initHomeCascadeAnimations: function() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const STEP_MS = 85;
        const POP = 'home-reveal--bubble-pop';

        const steps = [
            { selector: '.hero-title-line', extraClass: POP },
            { selector: '.hero-identity-label', extraClass: POP },
            { selector: '.hero-greeting-row .sidebar-social-link', extraClass: POP },
            { selector: '.sidebar-intro', extraClass: POP },
            { selector: '.home-hero-cta-wrap', extraClass: POP },
            { selector: '.home-header-composition', extraClass: POP },
            { selector: '.home-spotlight-card', extraClass: POP },
            { selector: '.home-can-bring-title', extraClass: POP },
            { selector: '.home-can-bring-scroll-hint', extraClass: POP },
            { selector: '.home-can-bring-card', extraClass: POP, stepMs: 110 },
            { selector: '.home-can-bring-ai-note', extraClass: POP },
            { selector: '.stack-card', extraClass: POP, stepMs: 90 },
            { selector: '.projects-more-title', extraClass: POP },
            { selector: '.projects-more-intro', extraClass: POP },
            { selector: '.projects-more-card', extraClass: POP, stepMs: 110 },
            { selector: '.home-about-title', extraClass: POP },
            { selector: '.home-about-copy', extraClass: POP },
            { selector: '.home-about-note-stickers .note-deco-sticker', extraClass: POP, stepMs: 90 },
            { selector: '.home-about-photo-card', extraClass: POP, stepMs: 100 },
            { selector: '.home-about-photo-stickers .photo-deco-sticker', extraClass: POP, stepMs: 95 },
            { selector: '.home-about-career .about-exp-group', extraClass: POP },
            { selector: '.home-about-career .about-exp-item', extraClass: POP, stepMs: 95 },
            { selector: '.home-toolbox-stickers .tool-sticker', extraClass: POP },
            { selector: '.about-cta__intro, .about-cta__actions, .about-cta__socials', extraClass: POP, stepMs: 100 },
            { selector: '.site-contact-col--intro', extraClass: POP },
            { selector: '.site-contact-col--intro .sidebar-social-link', extraClass: POP },
            { selector: '.site-contact-col--body', extraClass: POP },
            { selector: '.site-contact-fields', extraClass: POP }
        ];

        const targets = [];

        steps.forEach(({ selector, extraClass, stepMs }) => {
            const delayStep = stepMs || STEP_MS;
            document.querySelectorAll(selector).forEach((el, groupIndex) => {
                el.classList.remove('project-enter', 'monster-enter');
                el.classList.add('home-reveal');
                if (extraClass) {
                    extraClass.split(/\s+/).forEach((cls) => el.classList.add(cls));
                }
                el.style.setProperty('--home-reveal-delay', `${groupIndex * delayStep}ms`);
                targets.push(el);
            });
        });

        if (!targets.length) return;

        this._homeRevealTargets = targets;

        const revealAll = () => {
            targets.forEach((el) => el.classList.add('is-revealed'));
        };

        if (reducedMotion) {
            revealAll();
            return;
        }

        this.bindHomeScrollReveal(targets);
        this.revealAboveFoldHero(targets);
        this.bindAboutPhotoBubbleReveal();
    },

    revealAboveFoldHero: function(targets) {
        const header = document.querySelector('.home-page-header');
        if (!header) return;

        const heroTargets = targets.filter((el) => header.contains(el) && !el.classList.contains('is-revealed'));
        if (!heroTargets.length) return;

        const revealStaggered = () => {
            heroTargets.forEach((el, index) => {
                window.setTimeout(() => {
                    el.classList.add('is-revealed');
                    if (this._homeRevealObserver) {
                        this._homeRevealObserver.unobserve(el);
                    }
                }, index * 75);
            });
        };

        requestAnimationFrame(() => requestAnimationFrame(revealStaggered));
    },

    bindAboutPhotoBubbleReveal: function() {
        const frontPhoto = document.querySelector('.home-about-photo-card--front');
        const bubble = document.querySelector('.home-about-photo-bubble');
        if (!frontPhoto || !bubble) return;

        bubble.classList.add('home-reveal', 'home-reveal--bubble-pop');

        const revealBubble = () => {
            bubble.classList.add('is-revealed');
        };

        const scheduleAfterPhoto = () => {
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (reducedMotion) {
                revealBubble();
                return;
            }

            let finished = false;
            const finish = () => {
                if (finished) return;
                finished = true;
                window.setTimeout(revealBubble, 80);
            };

            frontPhoto.addEventListener('animationend', (event) => {
                if (event.animationName === 'homeBubblePop') {
                    finish();
                }
            }, { once: true });
            frontPhoto.addEventListener('transitionend', (event) => {
                if (event.propertyName === 'transform' || event.propertyName === 'opacity') {
                    finish();
                }
            }, { once: true });
            window.setTimeout(finish, 1200);
        };

        if (frontPhoto.classList.contains('is-revealed')) {
            scheduleAfterPhoto();
            return;
        }

        const observer = new MutationObserver(() => {
            if (!frontPhoto.classList.contains('is-revealed')) return;
            observer.disconnect();
            scheduleAfterPhoto();
        });
        observer.observe(frontPhoto, { attributes: true, attributeFilter: ['class'] });
    },

    refreshHomeScrollReveal: function() {
        if (!this._homeRevealTargets || !this._homeRevealTargets.length) return;
        this.bindHomeScrollReveal(this._homeRevealTargets);
    },

    getHomeScrollRoot: function() {
        const isMobile = window.matchMedia('(max-width: 1200px)').matches;
        if (isMobile) return null;
        return document.getElementById('scroll-container');
    },

    bindHomeScrollReveal: function(targets) {
        if (this._homeRevealObserver) {
            this._homeRevealObserver.disconnect();
            this._homeRevealObserver = null;
        }

        const createObserver = () => {
            if (this._homeRevealObserver) {
                this._homeRevealObserver.disconnect();
            }

            this._homeRevealObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-revealed');
                    this._homeRevealObserver.unobserve(entry.target);
                });
            }, {
                root: this.getHomeScrollRoot(),
                threshold: 0.12,
                rootMargin: '0px 0px -4% 0px'
            });

            targets.forEach((el) => {
                if (!el.classList.contains('is-revealed')) {
                    this._homeRevealObserver.observe(el);
                }
            });
        };

        createObserver();

        if (!this._homeRevealResizeBound) {
            this._homeRevealResizeBound = true;
            window.addEventListener('resize', () => {
                window.clearTimeout(this._homeRevealResizeTimer);
                this._homeRevealResizeTimer = window.setTimeout(createObserver, 150);
            });
        }
    }
};
