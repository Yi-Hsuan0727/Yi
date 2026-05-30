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

    init: function() {
        const nav = document.querySelector('.sidebar-scroll-spy');
        const list = document.querySelector('.sidebar-scroll-spy-list');
        if (!nav || !list) return;

        const sections = Array.from(document.querySelectorAll('.single-page-wrapper .case-section'));
        const items = [];

        sections.forEach((section, index) => {
            const label = this.findSectionLabel(section);
            if (!label) return;

            const id = section.id || this.slugify(label, index);
            if (!section.id) section.id = id;

            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.className = 'sidebar-scroll-spy-link';
            link.textContent = label;
            link.addEventListener('click', (event) => this.onNavClick(event, section));
            li.appendChild(link);
            list.appendChild(li);
            items.push({ section: section, link: link });
        });

        if (!items.length) {
            nav.hidden = true;
            return;
        }

        items[0].link.classList.add('is-active');
        this.bindScrollSpy(items);
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
