/*
 * CaseScrollSpy: Section navigation in the project page sidebar.
 */
const CaseScrollSpy = {
    labelSelector: [
        '.case-section-label',
        '.p2s-section-number',
        '[class$="-label"]:not([class*="callout"]):not([class*="findings"]):not([class*="pivot"]):not([class*="placeholder"]):not([class*="decision"])'
    ].join(', '),

    headerSelector: [
        '.case-section-header',
        '.law-header',
        '.uav-header',
        '.qb-header-block',
        '.p2s-overview-hero-text',
        '.p2s-2col-header > div:first-child',
        '.lcm-2col-header > div:first-child',
        '.lt-2col-header > div:first-child',
        '.mag-2col-header > div:first-child',
        '.un-2col-header > div:first-child',
        '.wn-2col-header > div:first-child'
    ].join(', '),

    homeSections: [
        { selector: '#featured-work', labelFrom: '#featured-work-heading' },
        { selector: '#projects-more', labelFrom: '#projects-more-heading' },
        { selector: '#home-can-bring', labelFrom: '#home-can-bring-heading' },
        { selector: '.site-contact-band', labelFrom: '#site-contact-heading' }
    ],

    init: function() {
        const nav = document.querySelector('.sidebar-scroll-spy');
        const list = document.querySelector('.sidebar-scroll-spy-list');
        if (!nav || !list) return;

        list.innerHTML = '';

        if (this.isMobile()) {
            nav.hidden = true;
            return;
        }

        nav.hidden = false;
        const isHome = !!document.querySelector('#featured-work, .home-featured-edge');
        const sections = isHome ? this.collectHomeSections() : this.collectCaseSections();
        const items = this.buildNavItems(list, sections);

        if (!items.length) {
            nav.hidden = true;
            return;
        }

        items[0].link.classList.add('is-active');
        this.bindScrollSpy(items);
    },

    collectCaseSections: function() {
        return Array.from(document.querySelectorAll('.single-page-wrapper .case-section'));
    },

    collectHomeSections: function() {
        const wrapper = document.querySelector('.single-page-wrapper');
        if (!wrapper) return [];

        return this.homeSections
            .map(function(config) {
                const section = wrapper.querySelector(config.selector);
                if (!section) return null;
                return { section: section, label: CaseScrollSpy.getHomeSectionLabel(section, config) };
            })
            .filter(function(item) { return item && item.label; });
    },

    getHomeSectionLabel: function(section, config) {
        if (config.labelFrom) {
            const labelEl = document.querySelector(config.labelFrom);
            if (labelEl && labelEl.textContent.trim()) {
                return labelEl.textContent.trim();
            }
        }
        const labelledBy = section.getAttribute('aria-labelledby');
        if (labelledBy) {
            const labelEl = document.getElementById(labelledBy);
            if (labelEl && labelEl.textContent.trim()) {
                return labelEl.textContent.trim();
            }
        }
        return '';
    },

    buildNavItems: function(list, sections) {
        const items = [];

        sections.forEach(function(entry, index) {
            const section = entry.section || entry;
            const label = entry.label || CaseScrollSpy.findSectionLabel(section);
            if (!label) return;

            const id = section.id || CaseScrollSpy.slugify(label, index);
            if (!section.id) section.id = id;

            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.className = 'sidebar-scroll-spy-link';
            link.textContent = label;
            link.addEventListener('click', function(event) {
                CaseScrollSpy.onNavClick(event, section);
            });
            li.appendChild(link);
            list.appendChild(li);
            items.push({ section: section, link: link });
        });

        return items;
    },

    findSectionLabel: function(section) {
        const inner = section.querySelector(':scope > [class$="-inner"], :scope > .case-section-inner, :scope > .p2s-overview-hero-inner');
        const root = inner || section;
        const headers = root.querySelectorAll(this.headerSelector);

        for (let i = 0; i < headers.length; i++) {
            const labelEl = headers[i].querySelector(this.labelSelector);
            if (labelEl && labelEl.textContent.trim()) {
                return labelEl.textContent.trim();
            }
        }

        const fallback = root.querySelector(this.labelSelector);
        return fallback && fallback.textContent.trim() ? fallback.textContent.trim() : '';
    },

    slugify: function(label, index) {
        const slug = label
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        return slug ? `section-${slug}` : `section-${index + 1}`;
    },

    isMobile: function() {
        return window.innerWidth <= 1200;
    },

    getScrollRoot: function() {
        return document.getElementById('scroll-container');
    },

    getScrollTop: function() {
        if (this.isMobile()) return window.scrollY || 0;
        if (window.__lenis) return window.__lenis.scroll || 0;
        const root = this.getScrollRoot();
        return root ? root.scrollTop : 0;
    },

    getSectionScrollPos: function(section) {
        const root = this.getScrollRoot();
        const current = this.getScrollTop();
        const sectionRect = section.getBoundingClientRect();

        if (this.isMobile() || !root) {
            return current + sectionRect.top;
        }

        const rootRect = root.getBoundingClientRect();
        return current + sectionRect.top - rootRect.top;
    },

    onNavClick: function(event, section) {
        event.preventDefault();
        const isMobile = this.isMobile();

        if (!isMobile && window.__lenis) {
            window.__lenis.scrollTo(section, { offset: -20 });
        } else {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (section.id) {
            history.replaceState(null, '', `#${section.id}`);
        }
    },

    bindScrollSpy: function(items) {
        const offset = 100;
        let ticking = false;

        const updateActive = () => {
            ticking = false;
            const scrollTop = this.getScrollTop();
            let activeItem = items[0];

            items.forEach(function(item) {
                if (CaseScrollSpy.getSectionScrollPos(item.section) <= scrollTop + offset) {
                    activeItem = item;
                }
            });

            items.forEach(function(item) {
                item.link.classList.toggle('is-active', item === activeItem);
            });
        };

        const onScroll = function() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(updateActive);
        };

        updateActive();

        if (!this.isMobile() && window.__lenis) {
            window.__lenis.on('scroll', onScroll);
        } else if (this.isMobile()) {
            window.addEventListener('scroll', onScroll, { passive: true });
        } else {
            const root = this.getScrollRoot();
            if (root) root.addEventListener('scroll', onScroll, { passive: true });
        }

        window.addEventListener('resize', onScroll, { passive: true });
    }
};
