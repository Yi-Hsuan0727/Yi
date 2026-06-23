/*
 * LayoutComponents: Reusable HTML builder functions for the portfolio layout.
 */
const LayoutComponents = {

    logoSVG: function() {
        return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><text x="32" y="54" font-size="72" font-weight="900" font-family="Arial" fill="#2ecc71" text-anchor="middle">M</text></svg>`;
    },

    buildSidebarTop: function(pageData, projectMeta, pageType) {
        let html = '';
        if (pageData.backLink && projectMeta) {
            html += `<a href="index.html" class="back-btn connect-sticker connect-sticker--back"><i class="fas fa-arrow-left"></i> Back to Home</a>`;
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
        const introText = !projectMeta && (pageData.briefIntro || pageData.desc);
        const introHTML = introText
            ? `<p class="sidebar-intro">${introText}</p>`
            : '';
        const greetingHTML = pageData.heroGreeting && !projectMeta && pageType !== 'home'
            ? `<p class="hero-title-greeting">${pageData.heroGreeting}</p>`
            : '';
        const homeActionsHTML = pageType === 'home' && !projectMeta
            ? `<div class="home-hero-actions">
                <a href="#featured-work" class="home-hero-cta">
                    <span class="home-hero-cta__eyes monster-eyes-wrapper" aria-hidden="true">
                        <span class="monster-eye home-hero-cta__eye"><span class="monster-pupil"></span></span>
                        <span class="monster-eye home-hero-cta__eye"><span class="monster-pupil"></span></span>
                    </span>
                    <span class="home-hero-cta__label">View my work</span>
                </a>
                ${this.buildSidebarSocials()}
            </div>`
            : '';
        const heroContent = `<div class="hero-text">${greetingHTML}<h1>${pageData.title}</h1>${projectMeta && projectMeta.subtitle ? `<span class="sidebar-meta-value">${projectMeta.subtitle}</span>` : ''}${tagsHTML ? `<div class="sidebar-tags">${tagsHTML}</div>` : ''}${introHTML}${homeActionsHTML}</div>`;
        html += heroContent;
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

    buildCaseHeroMeta: function(projectMeta) {
        if (!projectMeta) return '';

        const self = this;
        const sections = [];

        if (projectMeta.timeline) {
            sections.push({
                modifier: 'timeline',
                label: 'Timeline',
                body: `<span class="case-hero-meta-value">${projectMeta.timeline}</span>`
            });
        }

        const toolItems = self.getCaseHeroToolItems(projectMeta);
        if (toolItems.length) {
            sections.push({
                modifier: 'tools',
                label: 'Tools',
                body: `<span class="case-hero-meta-value case-hero-meta-tools">${toolItems.join(' / ')}</span>`
            });
        }

        const teamRoster = self.getCaseHeroTeamRoster(projectMeta);
        if (teamRoster.length) {
            sections.push({
                modifier: 'team',
                label: 'Team',
                body: `<ul class="case-hero-meta-list">${teamRoster.map(function(item) {
                    return `<li>${item}</li>`;
                }).join('')}</ul>`
            });
        }

        if (!sections.length) return '';

        const itemsHTML = sections.map(function(section) {
            return `<div class="case-hero-meta-item case-hero-meta-item--${section.modifier}"><span class="case-hero-meta-label">${section.label}</span>${section.body}</div>`;
        }).join('');

        return `
            <div class="case-hero-meta">
                <div class="case-hero-meta-inner case-hero-meta-inner--cols-${sections.length}">
                    ${itemsHTML}
                </div>
            </div>`;
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
                            data-src="assets/img/Michelle/portfolio-composition-animated.svg"
                            role="img"
                            aria-hidden="true"
                        ></div>
                    </div>
                </div>
            </figure>`;
    },

    buildHomePageHeader: function(pageData) {
        return `
            <header class="home-page-header">
                <div class="home-page-header-main">
                    ${this.buildSidebarTop(pageData, null, 'home')}
                </div>
                <div class="home-page-header-aside">
                    ${this.buildHomeTechNote()}
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

    buildMoreProjectsDeckItems: function(projects) {
        if (!projects || !projects.length) return '';
        const deckStyles = [
            { tilt: '-2deg', z: 1 },
            { tilt: '2deg', z: 2 },
            { tilt: '-1deg', z: 3 },
            { tilt: '1.5deg', z: 4 }
        ];

        return projects.map(function(p, index) {
            const style = deckStyles[index % deckStyles.length];
            const heroSrc = p.heroImage || p.image || '';
            const awardLabel = p.awardShort || p.award || '';
            const awardHTML = awardLabel
                ? `<span class="projects-more-card-award">${awardLabel}</span>`
                : '';
            const cardLabel = awardLabel ? `${p.title} — ${awardLabel}` : p.title;
            return `
                <button type="button" class="projects-more-card${awardLabel ? ' has-award' : ''}" data-project-id="${p.id || ''}" style="--card-tilt:${style.tilt};--card-z:${style.z};" aria-haspopup="dialog" aria-label="${cardLabel}">
                    <span class="projects-more-card-name" aria-hidden="true">${p.title}${awardLabel ? `<span class="projects-more-card-name-award">${awardLabel}</span>` : ''}</span>
                    <span class="projects-more-card-visual">
                        ${awardHTML}
                        <img src="${heroSrc}" alt="" loading="lazy" decoding="async">
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

    buildMoreProjectsSection: function(projects) {
        const items = this.buildMoreProjectsListItems(projects);
        if (!items) return '';
        return `
            <section class="projects-more" id="projects-more" aria-labelledby="projects-more-heading">
                <div class="projects-more-inner">
                    <h2 class="projects-more-title" id="projects-more-heading"><span class="projects-more-title-text">More projects</span>${this.buildHeroTitleShapes()}</h2>
                    <p class="projects-more-intro">Beyond the featured case studies above, these are additional projects — client work, class explorations, and side builds that shaped how I approach accessible web products.</p>
                    <div class="projects-more-scroll" tabindex="0" aria-label="Scroll through more projects">
                        <div class="projects-more-deck projects-more-deck--scroll" id="projects-more-list" role="list">${items}</div>
                    </div>
                </div>
            </section>`;
    },

    /* Mobile-only: visit live site + back to home above next projects (project pages) */
    buildMobileProjectActions: function(projectMeta) {
        if (!projectMeta) return '';
        const liveLink = projectMeta.liveLink;
        if (!liveLink || liveLink === '#') return `
            <div class="mobile-project-actions">
                <a href="index.html" class="projects-cta-btn"><i class="fas fa-arrow-left" style="margin-right:8px;"></i> Back to Home</a>
            </div>`;
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
            <section class="site-contact-band" aria-labelledby="site-contact-heading">
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
                            <p class="site-contact-success-text">Thanks for reaching out — I&apos;ve received your note and will contact you soon.</p>
                        </div>
                    </form>
                </div>
            </section>`;
    },

    buildFooter: function(pageType) {
        const showMonsterFooter = (pageType === 'home' || pageType === 'playground' || pageType === 'about');
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
        const footerBarHTML = (copyrightHTML || socialsHTML)
            ? `<footer class="site-footer ${monsterHTML ? 'site-footer-green' : ''}${footerOnlyClass}">
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

    buildProgressBar: function() {
        return `<div id="progress-bar"></div>`;
    },

    buildBackToTop: function() {
        return `<button class="back-to-top" aria-label="Back to top"><i class="fas fa-arrow-up"></i></button>`;
    }
};
