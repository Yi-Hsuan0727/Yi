/*
 * LayoutComponents: Reusable HTML builder functions for the portfolio layout.
 */
const LayoutComponents = {

    logoSVG: function() {
        return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><text x="32" y="54" font-size="72" font-weight="900" font-family="Arial" fill="#2ecc71" text-anchor="middle">M</text></svg>`;
    },

    buildSidebarTop: function(pageData, projectMeta, pageType) {
        let html = '';
        let tagsHTML = '';
        if (projectMeta && projectMeta.tags && projectMeta.tags.length) {
            tagsHTML = projectMeta.tags.map(function(t) {
                return `<span class="sidebar-tag">${t}</span>`;
            }).join('');
        }
        const introText = !projectMeta && (pageData.briefIntro || pageData.desc);
        const introHTML = introText
            ? `<p class="sidebar-intro">${introText}</p>`
            : '';
        const greetingHTML = pageData.heroGreeting && !projectMeta && pageType !== 'home'
            ? `<p class="hero-title-greeting">${pageData.heroGreeting}</p>`
            : '';
        const heroInner = pageType === 'home' && !projectMeta
            ? `<h1>${pageData.title}</h1>
            <div class="hero-greeting-row">
                <p class="hero-identity-label">Product Designer Michelle Chen</p>
                <div class="hero-social-cluster">
                    ${this.buildHomeAboutQuickLink()}
                    ${this.buildSidebarSocials()}
                </div>
            </div>${introHTML}`
            : `${greetingHTML}<h1>${pageData.title}</h1>${projectMeta && projectMeta.subtitle ? `<span class="sidebar-meta-value">${projectMeta.subtitle}</span>` : ''}${tagsHTML ? `<div class="sidebar-tags">${tagsHTML}</div>` : ''}${introHTML}`;
        const heroContent = `<div class="hero-text">${heroInner}</div>`;
        const metaHTML = projectMeta ? this.buildSidebarProjectMeta(projectMeta) : '';
        html += heroContent + metaHTML;
        return html;
    },

    /* --- Sidebar scroll spy (project pages); timeline/role live under hero --- */
    buildSidebarScrollSpy: function() {
        return `
            <nav class="sidebar-scroll-spy" aria-label="On this page">
                <ul class="sidebar-scroll-spy-list"></ul>
            </nav>`;
    },

    getCaseHeroToolItems: function(projectMeta) {
        if (!projectMeta || !projectMeta.tools) return [];
        if (Array.isArray(projectMeta.tools)) {
            return projectMeta.tools.filter(Boolean);
        }
        return projectMeta.tools.split(',').map(function(item) {
            return item.trim();
        }).filter(Boolean);
    },

    getCaseHeroToolSlug: function(toolName) {
        const map = {
            'Figma': 'figma',
            'React': 'react',
            'Tailwind CSS': 'tailwindcss',
            'Drupal': 'drupal',
            'WordPress': 'wordpress',
            'GitHub': 'github',
            'Google Gemini': 'googlegemini',
            'Adobe Illustrator': 'adobeillustrator',
            'Adobe Photoshop': 'adobephotoshop',
            'VS Code': 'visualstudiocode',
            'Visual Studio Code': 'visualstudiocode',
            'Unity': 'unity',
            'Sketch': 'sketch',
            'Notion': 'notion',
            'Miro': 'miro'
        };
        return map[toolName] || null;
    },

    getTeamMemberCount: function(teamRoster) {
        return teamRoster.reduce(function(sum, item) {
            const match = item.match(/^(\d+)/);
            return sum + (match ? parseInt(match[1], 10) : 1);
        }, 0);
    },

    buildSidebarTeamText: function(teamRoster) {
        const lines = teamRoster.map(function(item) {
            return item.replace(/^\d+\s+/, '').trim();
        });
        return `<span class="sidebar-project-meta-team-text">${lines.join(', ')}</span>`;
    },

    buildSidebarToolIcons: function(toolItems) {
        const self = this;
        if (!toolItems.length) return '';

        const icons = toolItems.map(function(tool) {
            const safeTool = tool.replace(/"/g, '&quot;');
            const tip = `<span class="sidebar-project-meta-tool-tip">${safeTool}</span>`;
            const slug = self.getCaseHeroToolSlug(tool);
            if (slug) {
                return `<span class="sidebar-project-meta-tool-icon" role="listitem"><img src="${self.toolIconSrc(slug)}" alt=""><span class="visually-hidden">${safeTool}</span>${tip}</span>`;
            }
            return `<span class="sidebar-project-meta-tool-chip" role="listitem">${tool.split(/\s+/).map(function(word) {
                return word.charAt(0);
            }).join('').slice(0, 3).toUpperCase()}${tip}</span>`;
        });

        return `<div class="sidebar-project-meta-tools" role="list" aria-label="Project tools">${icons.join('')}</div>`;
    },

    formatSidebarTimeline: function(timeline) {
        if (!timeline) return '';
        const parts = timeline.split(/\s*[–—-]\s*/);
        if (parts.length < 2) {
            return timeline;
        }
        const start = parts[0].trim();
        const end = parts.slice(1).join(' – ').trim();
        return `<span class="sidebar-project-meta-timeline"><span class="sidebar-project-meta-timeline-start">${start}</span><span class="sidebar-project-meta-timeline-sep" aria-hidden="true">|</span><span class="sidebar-project-meta-timeline-end">${end}</span></span>`;
    },

    buildSidebarProjectMeta: function(projectMeta) {
        if (!projectMeta) return '';

        const self = this;
        const cells = [];
        const teamRoster = self.getCaseHeroTeamRoster(projectMeta);
        const teamCount = self.getTeamMemberCount(teamRoster);
        const toolItems = self.getCaseHeroToolItems(projectMeta);

        if (teamRoster.length) {
            cells.push(`
                <div class="sidebar-project-meta-cell sidebar-project-meta-cell--team">
                    <span class="sidebar-project-meta-label">Team${teamCount ? ` (${teamCount})` : ''}</span>
                    <div class="sidebar-project-meta-value">${self.buildSidebarTeamText(teamRoster)}</div>
                </div>`);
        }

        if (projectMeta.timeline) {
            cells.push(`
                <div class="sidebar-project-meta-cell sidebar-project-meta-cell--timeline">
                    <span class="sidebar-project-meta-label">Timeline</span>
                    <span class="sidebar-project-meta-value">${self.formatSidebarTimeline(projectMeta.timeline)}</span>
                </div>`);
        }

        if (toolItems.length) {
            cells.push(`
                <div class="sidebar-project-meta-cell sidebar-project-meta-cell--tools">
                    <span class="sidebar-project-meta-label">${toolItems.length === 1 ? 'Tool' : 'Tools'}</span>
                    <div class="sidebar-project-meta-value">${self.buildSidebarToolIcons(toolItems)}</div>
                </div>`);
        }

        if (!cells.length) return '';

        return `
            <div class="sidebar-project-meta" aria-label="Project details">
                <div class="sidebar-project-meta-grid sidebar-project-meta-grid--cols-${Math.min(cells.length, 4)}">
                    ${cells.join('')}
                </div>
            </div>`;
    },

    buildCaseHeroMeta: function(projectMeta) {
        return this.buildSidebarProjectMeta(projectMeta);
    },

    getCaseHeroTeamRoster: function(projectMeta) {
        if (projectMeta.teamRoster && projectMeta.teamRoster.length) {
            return projectMeta.teamRoster;
        }
        if (projectMeta.team === 'Solo' && projectMeta.role) {
            return [`1 ${projectMeta.role} (me)`];
        }
        const roster = [];
        if (projectMeta.role) {
            roster.push(`1 ${projectMeta.role} (me)`);
        }
        if (projectMeta.team && projectMeta.team !== 'Solo') {
            projectMeta.team.split(',').forEach(function(part) {
                const trimmed = part.trim();
                if (trimmed) roster.push(trimmed);
            });
        }
        return roster;
    },

    buildSidebarMeta: function(pageType, projectMeta) {
        if (!projectMeta || pageType === 'playground' || pageType === 'about') return '';
        return this.buildSidebarScrollSpy();
    },

    buildHomeHeaderComposition: function() {
        return `
            <figure class="home-header-composition cursor-hover" aria-hidden="true">
                <div class="home-header-composition__float">
                    <div class="home-header-composition__stage">
                        <div class="home-header-composition__canvas-wrap" aria-hidden="true">
                            <div class="home-header-composition__selection"></div>
                            <div class="home-header-composition__canvas"></div>
                            <div class="home-header-composition__frame">
                                <span class="home-header-composition__handle home-header-composition__handle--tl"></span>
                                <span class="home-header-composition__handle home-header-composition__handle--tr"></span>
                                <span class="home-header-composition__handle home-header-composition__handle--bl"></span>
                                <span class="home-header-composition__handle home-header-composition__handle--br"></span>
                                <span class="home-header-composition__handle home-header-composition__handle--tm"></span>
                                <span class="home-header-composition__handle home-header-composition__handle--bm"></span>
                                <span class="home-header-composition__handle home-header-composition__handle--lm"></span>
                                <span class="home-header-composition__handle home-header-composition__handle--rm"></span>
                            </div>
                            <span class="home-header-composition__measure home-header-composition__measure--width">451</span>
                            <span class="home-header-composition__measure home-header-composition__measure--height">975</span>
                            <span class="home-header-composition__tick home-header-composition__tick--top-left-h"></span>
                            <span class="home-header-composition__tick home-header-composition__tick--top-left-v"></span>
                            <span class="home-header-composition__tick home-header-composition__tick--top-right-h"></span>
                            <span class="home-header-composition__tick home-header-composition__tick--top-right-v"></span>
                            <span class="home-header-composition__tick home-header-composition__tick--bottom-left-h"></span>
                            <span class="home-header-composition__tick home-header-composition__tick--bottom-left-v"></span>
                        </div>
                        <div
                            class="home-header-composition__art"
                            data-src="assets/img/Michelle/portfolio-composition-animated.svg?v=20260701b"
                            role="img"
                            aria-hidden="true"
                        ></div>
                    </div>
                </div>
            </figure>`;
    },

    buildHomeHeroCtaArrowSvg: function() {
        return `<svg class="home-hero-cta-arrow__svg" viewBox="0 0 88 60" fill="none" aria-hidden="true" focusable="false">
                            <path class="home-hero-cta-arrow__shaft" pathLength="1" d="M 80 18 C 58 21 34 28 15 30" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                            <path class="home-hero-cta-arrow__head" pathLength="1" d="M 27 22 L 14 30 L 27 38" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>`;
    },

    buildHomeHeroCta: function() {
        // Two hand-drawn arrows fanning back toward the button (tips on the left, near the button).
        return `
            <div class="home-hero-cta-wrap">
                <div class="home-hero-cta-cluster">
                    <a href="#featured-work" class="home-hero-cta">
                        <span class="home-hero-cta__eyes monster-eyes-wrapper" aria-hidden="true">
                            <span class="monster-eye home-hero-cta__eye"><span class="monster-pupil"></span></span>
                            <span class="monster-eye home-hero-cta__eye"><span class="monster-pupil"></span></span>
                        </span>
                        <span class="home-hero-cta__label">View my work</span>
                    </a>
                    <span class="home-hero-cta-arrow home-hero-cta-arrow--a" aria-hidden="true">
                        ${this.buildHomeHeroCtaArrowSvg()}
                    </span>
                    <span class="home-hero-cta-arrow home-hero-cta-arrow--b" aria-hidden="true">
                        ${this.buildHomeHeroCtaArrowSvg()}
                    </span>
                </div>
                <p class="home-hero-cta-hint" aria-hidden="true">Tap to explore featured projects</p>
            </div>`;
    },

    buildHomePageHeader: function(pageData) {
        return `
            <header class="home-page-header">
                <div class="home-page-header-main">
                    ${this.buildSidebarTop(pageData, null, 'home')}
                </div>
                <div class="home-page-header-aside">
                    ${this.buildHomeHeaderComposition()}
                </div>
            </header>`;
    },

    buildHomeTechLogoCursor: function() {
        return `<svg class="home-header-tech-logo home-header-tech-logo--cursor" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2 3 6.5v11L12 22l9-4.5v-11L12 2zm0 2.45 6.75 3.38v6.74L12 18.55l-6.75-3.38V7.83L12 4.45z"/></svg>`;
    },

    buildHomeTechLogoClaude: function() {
        return `<svg class="home-header-tech-logo home-header-tech-logo--claude" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2.4c.35 2.45 2.15 4.25 4.6 4.6-2.45.35-4.25 2.15-4.6 4.6-.35-2.45-2.15-4.25-4.6-4.6 2.45-.35 4.25-2.15 4.6-4.6zm0 8.8c.35 2.45 2.15 4.25 4.6 4.6-2.45.35-4.25 2.15-4.6 4.6-.35-2.45-2.15-4.25-4.6-4.6 2.45-.35 4.25-2.15 4.6-4.6zm-6.4 4.4c.35 2.45 2.15 4.25 4.6 4.6-2.45.35-4.25 2.15-4.6 4.6-.35-2.45-2.15-4.25-4.6-4.6 2.45-.35 4.25-2.15 4.6-4.6zm12.8 0c.35 2.45 2.15 4.25 4.6 4.6-2.45.35-4.25 2.15-4.6 4.6-.35-2.45-2.15-4.25-4.6-4.6 2.45-.35 4.25-2.15 4.6-4.6z"/></svg>`;
    },

    buildHomeTechLogoGithub: function() {
        return `<i class="fab fa-github" aria-hidden="true"></i>`;
    },

    buildHomeTechNote: function() {
        return `
            <div class="home-header-tech">
                <p class="home-header-tech-text">
                    This Portfolio is built with pure HTML / CSS / JS. Co-built with
                    <a href="https://cursor.com" target="_blank" rel="noopener noreferrer" class="home-header-tech-inline">Cursor ${this.buildHomeTechLogoCursor()}</a>
                    &amp;
                    <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" class="home-header-tech-inline">Claude ${this.buildHomeTechLogoClaude()}</a>.
                    <span class="home-header-tech-host">Hosted on
                    <a href="https://github.com/Yi-Hsuan0727/Yi" target="_blank" rel="noopener noreferrer" class="home-header-tech-inline">GitHub ${this.buildHomeTechLogoGithub()}</a>.</span>
                </p>
            </div>`;
    },

    buildHomeTechNoteInline: function() {
        return `This Portfolio is built with pure HTML / CSS / JS. Co-built with
            <a href="https://cursor.com" target="_blank" rel="noopener noreferrer" class="home-header-tech-inline footer-tech-inline">Cursor ${this.buildHomeTechLogoCursor()}</a>
            &amp;
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" class="home-header-tech-inline footer-tech-inline">Claude ${this.buildHomeTechLogoClaude()}</a>.
            Hosted on
            <a href="https://github.com/Yi-Hsuan0727/Yi" target="_blank" rel="noopener noreferrer" class="home-header-tech-inline footer-tech-inline">GitHub ${this.buildHomeTechLogoGithub()}</a>.`;
    },

    buildHomeAboutQuickLink: function() {
        return `
            <a href="about.html" class="sidebar-about-quick-link cursor-hover" aria-label="About me page">
                <img src="assets/img/Michelle/about%20me%20link.png" alt="" aria-hidden="true" loading="lazy" decoding="async">
                <span class="sidebar-about-quick-link__label">About me</span>
            </a>`;
    },

    buildSidebarSocials: function() {
        return `
            <div class="sidebar-socials" aria-label="Social links">
                <a href="https://www.linkedin.com/in/mchen0727/" target="_blank" rel="noopener noreferrer" class="sidebar-social-link" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                <a href="mailto:yche1356@asu.edu" class="sidebar-social-link" aria-label="Email"><i class="fas fa-envelope"></i></a>
                <a href="assets/img/resume.pdf" target="_blank" rel="noopener noreferrer" class="sidebar-social-link sidebar-resume-link">Resume</a>
            </div>`;
    },

    buildSidebarBottom: function(pageType, pageData) {
        if (pageType === 'home' || pageType === 'playground') {
            return '';
        }
        if (pageType === 'about') {
            return '';
        }
        const sidebarLink = pageData.liveLink;
        if (!sidebarLink || sidebarLink === '#') return '';
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
            <div class="bio-container sidebar-visit-wrap">
                <a href="${sidebarLink}" target="_blank" class="visit-btn">${sidebarLabel} <i class="fas ${sidebarIcon}" style="margin-left:5px;"></i></a>
            </div>`;
    },

    toolIconSrc: function(slug) {
        return `https://cdn.jsdelivr.net/npm/simple-icons@11.14.0/icons/${slug}.svg`;
    },

    toolIconBrandSrc: function(slug) {
        return `https://cdn.simpleicons.org/${slug}`;
    },

    buildToolSticker: function(modifier, innerHTML, href, label) {
        return `<a class="tool-sticker tool-sticker--${modifier}" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}" role="listitem">${innerHTML}</a>`;
    },

    buildToolStickers: function(wrapperClass) {
        const brand = this.toolIconBrandSrc.bind(this);
        const icon = this.toolIconSrc.bind(this);
        const stickers = [
            this.buildToolSticker('figma', `<img src="${icon('figma')}" alt="">`, 'https://www.figma.com/', 'Figma'),
            this.buildToolSticker('ai', '<span class="tool-sticker-mark" aria-hidden="true">Ai</span>', 'https://www.adobe.com/products/illustrator.html', 'Adobe Illustrator'),
            this.buildToolSticker('ps', '<span class="tool-sticker-mark" aria-hidden="true">Ps</span>', 'https://www.adobe.com/products/photoshop.html', 'Adobe Photoshop'),
            this.buildToolSticker('code', '<span class="tool-sticker-code-mark" aria-hidden="true"><span>HTML</span><span>CSS</span></span>', 'https://developer.mozilla.org/en-US/docs/Web', 'HTML and CSS'),
            this.buildToolSticker('drupal', `<img src="${icon('drupal')}" alt="">`, 'https://www.drupal.org/', 'Drupal'),
            this.buildToolSticker('wordpress', `<img src="${icon('wordpress')}" alt="">`, 'https://wordpress.org/', 'WordPress'),
            this.buildToolSticker('indesign', '<span class="tool-sticker-mark tool-sticker-mark--id" aria-hidden="true">Id</span>', 'https://www.adobe.com/products/indesign.html', 'Adobe InDesign'),
            this.buildToolSticker('vscode', `<img src="${icon('visualstudiocode')}" alt="">`, 'https://code.visualstudio.com/', 'VS Code'),
            this.buildToolSticker('github', `<img src="${icon('github')}" alt="">`, 'https://github.com/Yi-Hsuan0727/Yi', 'GitHub'),
            this.buildToolSticker('cursor', `<img src="${brand('cursor')}" alt="">`, 'https://cursor.com/', 'Cursor'),
            this.buildToolSticker('claude', `<img src="${icon('anthropic')}" alt="">`, 'https://claude.ai/', 'Claude'),
            this.buildToolSticker('gemini', `<img src="${icon('googlegemini')}" alt="">`, 'https://gemini.google.com/', 'Gemini'),
            this.buildToolSticker('chatgpt', `<img src="${icon('openai')}" alt="">`, 'https://chat.openai.com/', 'ChatGPT')
        ];
        const wrapper = wrapperClass || 'home-toolbox-stickers';
        return `<div class="${wrapper}" role="list" aria-label="Tools and technologies">${stickers.join('')}</div>`;
    },

    /* Skills list (static) + auto-scrolling tool logos (all pages with sidebar) */
    buildSidebarToolsMarquee: function() {
        const designUxSkills = [
            'UX/UI Design',
            'User Research',
            'Product Design',
            'Wireframing',
            'Prototyping',
            'Usability Testing',
            'Responsive Development',
            'Accessibility'
        ];
        const skillItems = designUxSkills.map(function(skill) {
            return `<li class="sidebar-skill-item"><span class="sidebar-skill-chip">${skill}</span></li>`;
        }).join('');

        const tools = [
            { name: 'Figma', slug: 'figma' },
            { name: 'Adobe Illustrator', slug: 'adobeillustrator' },
            { name: 'Visual Studio Code', slug: 'visualstudiocode' },
            { name: 'WordPress', slug: 'wordpress' },
            { name: 'Drupal', slug: 'drupal' },
            { name: 'HTML5', slug: 'html5' },
            { name: 'CSS3', slug: 'css3' },
            { name: 'Anthropic', slug: 'anthropic' }
        ];
        const iconSrc = this.toolIconSrc.bind(this);
        const toolItems = tools.map(function(t) {
            return `<li class="sidebar-tool-item">
                <img class="sidebar-tool-logo" src="${iconSrc(t.slug)}" alt="${t.name}" width="36" height="36" loading="lazy" decoding="async" />
            </li>`;
        }).join('');
        const toolRow = toolItems + toolItems;

        return `
            <div class="sidebar-tools-marquee" aria-label="Skills and tools used across projects">
                <div class="sidebar-skills-block">
                    <p class="sidebar-tools-label">Skill Set</p>
                    <ul class="sidebar-skills-track sidebar-skills-static">${skillItems}</ul>
                </div>
                <div class="sidebar-tools-block">
                    <p class="sidebar-tools-label">Tools</p>
                    <div class="sidebar-tools-viewport">
                        <ul class="sidebar-tools-track">${toolRow}</ul>
                    </div>
                </div>
            </div>`;
    },

    buildCaseStudyArrowIcon: function(extraClass) {
        const classes = ['case-study-arrow-icon', extraClass].filter(Boolean).join(' ');
        return `<svg class="${classes}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 17L17 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M9 7h8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    },

    buildWorksHeader: function() {
        return '';
    },

    buildFeaturedSpotlightCard: function(project) {
        const stats = (project.spotlightStats || []).map(function(stat) {
            const valueClass = stat.accent ? ' home-spotlight-stat__value--accent' : '';
            return `<div class="home-spotlight-stat">
                <dt class="home-spotlight-stat__value${valueClass}">${stat.value}</dt>
                <dd class="home-spotlight-stat__label">${stat.label}</dd>
            </div>`;
        }).join('');
        const imgSrc = project.image || '';
        const objectPosition = project.cardImagePosition || 'center center';
        return `
            <article class="home-spotlight-card" data-project-id="${project.id || ''}">
                <a class="home-spotlight-card__link" href="${project.link}">
                    <div class="home-spotlight-card__visual">
                        <img class="home-spotlight-card__hero" src="${imgSrc}" alt="${project.title}" loading="lazy" decoding="async" style="object-position:${objectPosition};">
                    </div>
                    <div class="home-spotlight-card__body">
                        <p class="home-spotlight-card__eyebrow">${project.spotlightEyebrow || project.audience || ''}</p>
                        <h3 class="home-spotlight-card__title">${project.spotlightTitle || project.cardHeadline || project.title}</h3>
                        <p class="home-spotlight-card__desc">${project.spotlightDesc || project.demoIntro || project.desc || ''}</p>
                        <dl class="home-spotlight-card__stats">${stats}</dl>
                        <span class="home-spotlight-card__cta">Read the case study <i class="fas fa-arrow-right" aria-hidden="true"></i></span>
                    </div>
                </a>
            </article>`;
    },

    /* Sticky stacking deck — full-width split cards that pin and fan into a stack on scroll. */
    buildStackDeck: function(projects) {
        if (!projects || !projects.length) return '';
        const cards = projects.map((p, i) => this.buildStackCard(p, i)).join('');
        return `<div class="stack-deck">${cards}</div>`;
    },

    buildStackCard: function(project, index) {
        const headline = project.spotlightTitle || project.cardHeadline || project.title;
        const tags = (project.tags || []).map(function(t) {
            return `<li class="stack-card__tag">${t}</li>`;
        }).join('');
        const imgSrc = project.image || '';
        const objectPosition = project.cardImagePosition || 'center center';
        /* Stepped sticky offset: 28, 92, 156… (≈64px header height per card behind). */
        const top = 28 + index * 64;
        const isSoon = !!project.comingSoon;
        const cta = isSoon
            ? ''
            : `<span class="stack-card__cta"><span class="visually-hidden">View case study</span>${this.buildCaseStudyArrowIcon('stack-card__cta-arrow')}</span>`;
        const media = project.cardVideo
            ? `<video src="${project.cardVideo}" autoplay muted playsinline loop preload="auto" poster="${imgSrc}" aria-label="${project.title}" style="object-position:${objectPosition};"></video>`
            : `<img src="${imgSrc}" alt="${project.title}" loading="lazy" decoding="async" style="object-position:${objectPosition};">`;
        const inner = `
                    <div class="stack-card__split">
                        <div class="stack-card__media">
                            ${isSoon ? `<span class="stack-card__soon-badge">Coming soon</span>` : ''}
                            ${media}
                        </div>
                        <div class="stack-card__content">
                            <h3 class="stack-card__headline">${headline}</h3>
                            <ul class="stack-card__tags">${tags}</ul>
                            ${cta}
                        </div>
                    </div>`;
        const body = isSoon
            ? `<div class="stack-card__link stack-card__link--soon" aria-disabled="true">${inner}</div>`
            : `<a class="stack-card__link" href="${project.link}">${inner}</a>`;
        return `
            <article class="stack-card" data-project-id="${project.id || ''}" style="--stack-top:${top}px; z-index:${index + 1};">
                ${body}
            </article>`;
    },

    /* A single stack card holding every "more work" project as a grid of linked tiles. */
    buildMoreWorkCard: function(projects, index) {
        if (!projects || !projects.length) return '';
        const top = 28 + index * 64;
        const tiles = projects.map(function(p) {
            const img = p.image || p.heroImage || '';
            const title = p.moreCardTitle || p.title;
            return `
                <a class="more-work-tile" href="${p.link}" aria-label="${title}">
                    <span class="more-work-tile__img"><img src="${img}" alt="${title}" loading="lazy" decoding="async"></span>
                </a>`;
        }).join('');
        return `
            <article class="stack-card stack-card--more" style="--stack-top:${top}px; z-index:${index + 1};">
                <div class="stack-card__link stack-card__link--static">
                    <div class="more-work-card">
                        <div class="more-work-card__head">
                            <h3 class="stack-card__headline">More work</h3>
                            <p class="more-work-card__intro">Client work, class explorations, and side builds that shaped how I approach accessible web products.</p>
                        </div>
                        <div class="more-work-carousel" aria-label="More work projects carousel">
                            <div class="more-work-carousel-track">${tiles}${tiles}</div>
                        </div>
                    </div>
                </div>
            </article>`;
    },

    buildFeaturedProjectCard: function(project) {
        const tagsHTML = typeof PortfolioApp !== 'undefined' && PortfolioApp.buildProjectOverlayTags
            ? PortfolioApp.buildProjectOverlayTags(project)
            : '';
        const category = typeof PortfolioApp !== 'undefined'
            ? PortfolioApp.getProjectFilterCategory(project)
            : (project.filterType || 'web');
        const containerClass = project.cardVideo ? 'image-container image-container--video' : 'image-container';
        const imgObjectPosition = project.cardImagePosition ? ` object-position:${project.cardImagePosition};` : '';
        const mediaHTML = project.cardVideo
            ? `<video src="${project.cardVideo}" autoplay muted playsinline loop preload="auto" aria-label="${project.title}"></video>`
            : `<img src="${project.image}" alt="${project.title}" style="width:100%;height:100%;object-fit:cover;${imgObjectPosition}">`;
        return `
            <div class="project-card" data-category="${category}" data-project-id="${project.id || ''}" onclick="window.location.href='${project.link}'">
                <div class="${containerClass}">
                    ${mediaHTML}
                </div>
                <div class="project-card-info">
                    <h3 class="project-card-title">${project.cardHeadline || project.title}</h3>
                    <div class="project-card-tags">${tagsHTML}</div>
                </div>
            </div>`;
    },

    buildMoreProjectsNameMarkup: function(title) {
        return `<span class="projects-more-card-name">
            <span class="projects-more-card-name__text">${title}</span>
            <svg class="projects-more-card-name__underline" viewBox="0 0 120 8" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path class="projects-more-card-name__stroke" pathLength="1" d="M2 5.4 C20 3.6 38 6.3 58 4.7 C78 3.2 98 6.1 118 4.1" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </span>`;
    },

    buildMoreProjectsDeckItems: function(projects) {
        if (!projects || !projects.length) return '';
        const rowStyles = [
            { tilt: '-2deg', z: 1 },
            { tilt: '2deg', z: 2 },
            { tilt: '-1deg', z: 3 },
            { tilt: '1.5deg', z: 4 },
            { tilt: '-1.5deg', z: 5 },
            { tilt: '1deg', z: 6 }
        ];

        return projects.map((p, index) => {
            const style = rowStyles[index % rowStyles.length];
            const heroSrc = p.image || p.heroImage || '';
            const awardLabel = p.awardShort || p.award || '';
            const displayTitle = p.moreCardTitle || p.title;
            const cardLabel = awardLabel ? `${displayTitle}, ${awardLabel}` : displayTitle;
            const cardWidth = p.moreCardWidth || 140;
            const cardStyle = [
                `--card-tilt:${style.tilt}`,
                `--card-z:${style.z}`,
                `--more-card-width:${cardWidth}px`
            ].join(';');
            return `
                <button type="button" class="projects-more-card projects-more-card--flat${awardLabel ? ' has-award' : ''}" data-project-id="${p.id || ''}" style="${cardStyle}" aria-haspopup="dialog" aria-label="${cardLabel}">
                    <span class="projects-more-card-surface">
                        <img class="projects-more-card-image" src="${heroSrc}" alt="" loading="lazy" decoding="async">
                    </span>
                </button>`;
        }).join('');
    },

    buildMoreProjectsListItems: function(projects) {
        return this.buildMoreProjectsDeckItems(projects);
    },

    buildHeroTitleShapes: function() {
        return `<span class="projects-more-shapes" aria-hidden="true"><span class="shape shape-circle"></span><span class="shape shape-triangle"></span><span class="shape shape-square"></span></span>`;
    },

    buildMoreWorkPaintFilters: function() {
        return `<svg class="visually-hidden" aria-hidden="true" focusable="false" width="0" height="0">
            <defs>
                <filter id="projects-more-paint-stipple" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
                    <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" seed="7" result="noise"/>
                    <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 21 -9" result="alpha"/>
                    <feComposite in="SourceGraphic" in2="alpha" operator="in"/>
                </filter>
                <filter id="projects-more-paint-splatter" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
                    <feTurbulence type="fractalNoise" baseFrequency="0.38" numOctaves="3" seed="19" result="noise"/>
                    <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 13 -5.5" result="alpha"/>
                    <feComposite in="SourceGraphic" in2="alpha" operator="in"/>
                </filter>
            </defs>
        </svg>`;
    },

    buildMoreProjectsSection: function(projects) {
        const items = this.buildMoreProjectsListItems(projects);
        if (!items) return '';
        return `
            <section class="projects-more" id="projects-more" aria-labelledby="projects-more-heading">
                <div class="projects-more-inner">
                    <h2 class="projects-more-title" id="projects-more-heading"><span class="projects-more-title-text">More projects</span>${this.buildHeroTitleShapes()}</h2>
                    <p class="projects-more-intro">Beyond the featured case studies above, these are additional projects: client work, class explorations, and side builds that shaped how I approach accessible web products.</p>
                    <div class="projects-more-row-wrap" aria-label="More work projects">
                        <div class="projects-more-row" id="projects-more-list" role="list">${items}</div>
                    </div>
                </div>
            </section>`;
    },

    /* Mobile-only: visit live site above next projects (project pages) */
    buildMobileProjectActions: function(projectMeta) {
        if (!projectMeta) return '';
        const liveLink = projectMeta.liveLink;
        if (!liveLink || liveLink === '#') return '';
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
            </div>`;
    },

    /* --- Next Projects section (project pages only) --- */
    buildNextProjects: function(projects) {
        if (!projects || !projects.length) return '';
        let cardsHTML = projects.map(function(p) {
            let tagsHTML = typeof PortfolioApp !== 'undefined' && PortfolioApp.buildProjectOverlayTags
                ? PortfolioApp.buildProjectOverlayTags(p)
                : p.tags.map(function(t) {
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

    buildContactForm: function() {
        return `
            <section class="site-contact-band" id="contact" aria-labelledby="site-contact-heading">
                <div class="site-contact-inner">
                    <form class="site-contact-form">
                        <div class="site-contact-layout">
                            <div class="site-contact-col site-contact-col--intro home-reveal">
                                <p class="site-contact-kicker"><span class="site-contact-kicker-dot" aria-hidden="true"></span>Get in touch</p>
                                <h2 class="site-contact-heading" id="site-contact-heading">Let&apos;s build something<br>that ships.</h2>
                                ${this.buildSidebarSocials()}
                            </div>
                            <div class="site-contact-divider" aria-hidden="true"></div>
                            <div class="site-contact-col site-contact-col--body home-reveal">
                                <p class="site-contact-lead">Open to new opportunities, collaborations, or just a good conversation about design.</p>
                                <div class="site-contact-fields">
                                    <div class="site-contact-row">
                                        <label class="site-contact-label" for="contact-name">Name <span class="site-contact-required" aria-hidden="true">*</span></label>
                                        <input class="site-contact-input" id="contact-name" name="name" type="text" autocomplete="name" required aria-required="true" minlength="1" placeholder="Your name">
                                    </div>
                                    <div class="site-contact-row">
                                        <label class="site-contact-label" for="contact-email">Email <span class="site-contact-required" aria-hidden="true">*</span></label>
                                        <input class="site-contact-input" id="contact-email" name="email" type="email" autocomplete="email" required aria-required="true" placeholder="you@email.com">
                                    </div>
                                    <div class="site-contact-row">
                                        <label class="site-contact-label" for="contact-message">Message <span class="site-contact-required" aria-hidden="true">*</span></label>
                                        <textarea class="site-contact-input site-contact-textarea" id="contact-message" name="message" rows="4" required aria-required="true" minlength="1" maxlength="2000" placeholder="What would you like to share?" aria-describedby="contact-message-count"></textarea>
                                        <p class="site-contact-word-count" id="contact-message-count" aria-live="polite">0 / 250 words</p>
                                    </div>
                                    <input type="text" name="_honey" class="site-contact-honey" tabindex="-1" autocomplete="off" aria-hidden="true">
                                    <div class="site-contact-actions">
                                        <button type="submit" class="site-contact-btn site-contact-btn--primary site-contact-submit">Say hello <i class="fas fa-arrow-up-right" aria-hidden="true"></i></button>
                                    </div>
                                    <p class="site-contact-error" role="alert" hidden></p>
                                </div>
                            </div>
                        </div>
                        <div class="site-contact-success comic-speech-bubble" role="status" tabindex="-1" hidden>
                            <i class="fas fa-check-circle" aria-hidden="true"></i>
                            <p class="site-contact-success-title">Message sent!</p>
                            <p class="site-contact-success-text">Thanks for reaching out. I&apos;ve received your note and will contact you soon.</p>
                        </div>
                    </form>
                </div>
            </section>`;
    },

    buildFooter: function(pageType) {
        const showMonsterFooter = (pageType === 'home' || pageType === 'playground');
        const monsterHTML = showMonsterFooter
            ? `
                <div class="site-footer-monster">
                    <div class="monster-container">
                        <div class="monster-body">
                            <div class="monster-speech-cluster" aria-hidden="true">
                                <p class="monster-chat-bubble comic-speech-bubble comic-speech-bubble--tail-down monster-chat-bubble--1">Say hello!</p>
                                <p class="monster-chat-bubble comic-speech-bubble comic-speech-bubble--tail-down monster-chat-bubble--2">Got a project in mind?</p>
                                <p class="monster-chat-bubble comic-speech-bubble comic-speech-bubble--tail-down monster-chat-bubble--3">Or just want to chat?</p>
                                <p class="monster-chat-bubble comic-speech-bubble comic-speech-bubble--tail-down monster-chat-bubble--4">Drop me a note below!</p>
                            </div>
                            <div class="monster-eyes-wrapper" aria-hidden="true">
                                <div class="monster-eye"><div class="monster-pupil"></div></div>
                                <div class="monster-eye"><div class="monster-pupil"></div></div>
                            </div>
                        </div>
                    </div>
                </div>`
            : '';
        const contactFormHTML = showMonsterFooter ? this.buildContactForm() : '';
        const socialsInFooter = pageType !== 'home';
        const socialsHTML = socialsInFooter
            ? `<div class="socials">
                        <span class="connect-label" style="font-weight:700;">Connect with me:</span>
                        <a href="https://www.linkedin.com/in/mchen0727/" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                        <a href="mailto:yche1356@asu.edu" class="social-link" aria-label="Email"><i class="fas fa-envelope"></i></a>
                        <a href="assets/img/resume.pdf" target="_blank" rel="noopener noreferrer" class="social-link resume-link">Resume</a>
                    </div>`
            : '';
        const footerOnlyClass = !socialsInFooter ? ' site-footer--sidebar-socials' : '';
        const copyrightHTML = pageType === 'home'
            ? ''
            : `<span class="footer-copyright">&copy; 2025 Michelle Chen. All Rights Reserved. This website is built with pure HTML / CSS / JS. <a href="https://github.com/Yi-Hsuan0727/Yi" target="_blank" rel="noopener noreferrer" class="footer-tech-link">Hosted on GitHub</a></span>`;
        const homeTechNoteHTML = pageType === 'home'
            ? `<span class="footer-tech-note">${this.buildHomeTechNoteInline()}</span>`
            : '';
        const footerBarHTML = (copyrightHTML || socialsHTML || homeTechNoteHTML)
            ? `<footer class="site-footer ${monsterHTML ? 'site-footer-green' : ''}${footerOnlyClass}">
                    ${homeTechNoteHTML}
                    ${copyrightHTML}
                    ${socialsHTML}
                </footer>`
            : '';
        return `
            <div class="site-footer-shell ${monsterHTML ? 'site-footer-shell-green' : ''}">
                ${monsterHTML}
                ${contactFormHTML}
                ${footerBarHTML}
            </div>`;
    },

    buildPlaygroundAwardArrow: function(modifier) {
        return `<svg class="playground-award-arrow playground-award-arrow--${modifier}" viewBox="0 0 72 40" aria-hidden="true" focusable="false">
            <path d="M2 6 C22 4 48 18 68 34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="3 4"/>
            <path d="M62 30 L68 34 L62 38" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
    },

    buildPlaygroundBoard: function() {
        const items = [
            {
                id: 'enchanter',
                kind: 'project',
                src: 'assets/img/playground/Enchanter.png',
                alt: 'Enchanter game',
                caption: "Enchanter — 3D adventure game on Endstar",
                href: 'https://studio.endlessstudios.com/endstar/e25c3c59-a822-4576-acd1-3ebfd5b52d09/?assetType=game',
                external: true,
                x: 20,
                y: 24,
                width: 128,
                rotate: 3,
                z: 3
            },
            {
                id: 'note-enchanter-award',
                kind: 'note',
                awardFor: 'enchanter',
                text: "People's Choice<br>Endstar Spark '25",
                x: 17,
                y: 19,
                width: 98,
                rotate: 5,
                z: 16
            },
            {
                id: 'tnaf-mockup',
                kind: 'project',
                src: 'assets/img/playground/tnaf-mockup.png',
                alt: 'TNAF mobile mockups',
                x: 38,
                y: 20,
                width: 168,
                rotate: 2,
                z: 9
            },
            {
                id: 'spring',
                kind: 'project',
                src: 'assets/img/playground/spring-before.png',
                alt: 'Echoes of the Four Seasons typography prototype',
                caption: 'Echoes of the Four Seasons — interactive typography',
                href: 'spring/phome.html',
                external: false,
                x: 56,
                y: 22,
                width: 108,
                rotate: -3,
                z: 11
            },
            {
                id: 'tnaf-gif',
                kind: 'project',
                src: 'assets/img/playground/tnaf.gif',
                alt: 'TNAF interaction GIF',
                x: 72,
                y: 17,
                width: 168,
                rotate: 8,
                z: 13
            },
            {
                id: 'dailymoo',
                kind: 'project',
                src: 'assets/img/playground/DailyMooMood.png',
                alt: 'Daily Moo Mood interface',
                caption: 'Daily Moo Mood — cow-themed emotional wellness tracker',
                href: 'https://devpost.com/software/daily-moo-mood',
                external: true,
                x: 20,
                y: 60,
                width: 158,
                rotate: 6,
                z: 4
            },
            {
                id: 'note-dailymoo-award',
                kind: 'note',
                awardFor: 'dailymoo',
                text: '2nd Place<br>RoseHack 2025',
                x: 17,
                y: 54,
                width: 98,
                rotate: -8,
                z: 15
            },
            {
                id: 'me-teammate',
                kind: 'project',
                src: 'assets/img/playground/me and teammate.png',
                alt: 'Me and teammates at a design sprint',
                caption: 'My team mid affinity-mapping, sticky notes everywhere',
                x: 38,
                y: 66,
                width: 192,
                rotate: -4,
                z: 8
            },
            {
                id: 'stiffy',
                kind: 'project',
                src: 'assets/img/main images/Stiffy.png',
                alt: 'Stiffy Wanderers',
                caption: 'Stiffy Wanderers — location-based mobile game',
                href: 'https://devpost.com/software/stiffy-wanderers',
                external: true,
                x: 68,
                y: 62,
                width: 142,
                rotate: -5,
                z: 7
            },
            {
                id: 'note-yellow',
                kind: 'note',
                text: 'Keep the weird ideas.<br>Some of them become projects.',
                x: 62,
                y: 70,
                width: 128,
                rotate: -5,
                z: 6
            }
        ];

        const itemHTML = items.map((item) => {
            const style = [
                `--pg-x:${item.x}%`,
                `--pg-y:${item.y}%`,
                `--pg-rotate:${item.rotate}deg`,
                `--pg-z:${item.z}`,
                item.width ? `--pg-width:${item.width}px` : ''
            ].filter(Boolean).join(';');

            if (item.kind === 'project') {
                const linkedClass = item.href ? ' playground-item--linked' : '';
                const noCaptionClass = item.caption ? '' : ' playground-item--no-caption';
                const hrefAttrs = item.href
                    ? ` data-href="${item.href}"${item.external ? ' data-href-external="true"' : ''}`
                    : '';
                const ariaLabel = item.href
                    ? ` aria-label="${item.alt}. Opens ${item.external ? 'in a new tab' : 'project site'}"`
                    : '';
                const captionHTML = item.caption
                    ? `<p class="playground-item__caption">${item.caption}</p>`
                    : '';
                return `<div class="playground-item playground-item--project${linkedClass}${noCaptionClass}" data-playground-id="${item.id}"${hrefAttrs}${ariaLabel} style="${style}">
                    <div class="playground-item__media" role="img" aria-label="${item.alt}">
                        <img src="${item.src}" alt="${item.alt}" loading="lazy" decoding="async" draggable="false">
                    </div>
                    ${captionHTML}
                </div>`;
            }

            if (item.kind === 'note') {
                const awardClass = item.awardFor ? ` playground-item--award-note playground-item--award-note--${item.awardFor}` : '';
                const arrowHTML = item.awardFor ? this.buildPlaygroundAwardArrow(item.awardFor) : '';
                return `<div class="playground-item playground-item--note${awardClass}" data-playground-id="${item.id}" style="${style}">
                    ${arrowHTML}
                    <p>${item.text}</p>
                </div>`;
            }

            return '';
        }).join('');

        return `
            <section class="playground-page" aria-labelledby="playground-board-title">
                <div class="playground-board-shell">
                    <header class="playground-board-header">
                        <div class="playground-board-header__icon" aria-hidden="true">
                            <i class="far fa-image"></i>
                            <i class="far fa-image"></i>
                        </div>
                        <h1 class="playground-board-header__title" id="playground-board-title">Playground</h1>
                        <p class="playground-board-header__subtitle">Old work, side projects, or random explorations</p>
                        <p class="playground-board-header__hint">Drag the pieces around the board</p>
                    </header>
                    <div class="playground-board" id="playground-board">
                        ${itemHTML}
                    </div>
                </div>
            </section>`;
    },

    buildProgressBar: function() {
        return `<div id="progress-bar"></div>`;
    },

    buildTopNavIconLink: function(href, label, iconClass, isCurrent) {
        const currentClass = isCurrent
            ? 'site-top-nav__link site-top-nav__link--current cursor-hover'
            : 'site-top-nav__link cursor-hover';
        const currentAttr = isCurrent ? ' aria-current="page"' : '';
        return `<li><a class="${currentClass}" href="${href}" aria-label="${label}"${currentAttr}><span class="site-top-nav__link-icon" aria-hidden="true"><i class="fas ${iconClass}"></i></span></a></li>`;
    },

    buildTopNav: function(pageType) {
        const isHome = pageType === 'home';
        const isPlayground = pageType === 'playground';
        const isAbout = pageType === 'about';
        const workHref = isHome ? '#featured-work' : 'index.html#featured-work';
        const contactHref = isHome ? '#contact' : 'index.html#contact';

        return `
            <nav class="site-top-nav site-top-nav--auto-hide" aria-label="Primary">
                <div class="site-top-nav__inner">
                    <a href="index.html" class="site-top-nav__brand cursor-hover" aria-label="Home">
                        <span class="site-top-nav__avatar" aria-hidden="true">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="28" height="28" focusable="false">
                                <rect width="64" height="64" fill="#2ecc71"/>
                                <g class="site-top-nav__eye">
                                    <ellipse fill="#fff" cx="18" cy="32" rx="10.5" ry="9.5"/>
                                    <circle class="site-top-nav__pupil" fill="#111" cx="18" cy="32" r="4.2"/>
                                </g>
                                <g class="site-top-nav__eye">
                                    <ellipse fill="#fff" cx="46" cy="32" rx="10.5" ry="9.5"/>
                                    <circle class="site-top-nav__pupil" fill="#111" cx="46" cy="32" r="4.2"/>
                                </g>
                            </svg>
                        </span>
                    </a>
                    <ul class="site-top-nav__links" id="site-top-nav-menu">
                        ${this.buildTopNavIconLink(workHref, 'Work', 'fa-briefcase', false)}
                        ${this.buildTopNavIconLink('playground.html', 'Play', 'fa-gamepad', isPlayground)}
                        ${this.buildTopNavIconLink('about.html', 'About', 'fa-user', isAbout)}
                        ${this.buildTopNavIconLink(contactHref, 'Contact', 'fa-envelope', false)}
                    </ul>
                    <button type="button" class="site-top-nav__menu-toggle cursor-hover" aria-label="Open menu" aria-expanded="false" aria-controls="site-top-nav-menu">
                        <span class="site-top-nav__menu-toggle-icon site-top-nav__menu-toggle-icon--open" aria-hidden="true">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 5h11M2.5 8h11M2.5 11h11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </span>
                        <span class="site-top-nav__menu-toggle-icon site-top-nav__menu-toggle-icon--close" aria-hidden="true">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4l8 8M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </span>
                    </button>
                </div>
            </nav>`;
    },

    buildBackToTop: function() {
        return `<button class="back-to-top" aria-label="Back to top"><i class="fas fa-arrow-up"></i></button>`;
    }
};
