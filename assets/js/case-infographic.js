/**
 * Scroll-triggered motion infographics for case study pages.
 */
const CaseInfographic = {
    motionSelector: [
        '.case-problem-card',
        '.qb-finding-item',
        '.qb-goal-card',
        '.qb-tech-item',
        '.law-goal-card',
        '.law-phase-card',
        '.mag-goal-card',
        '.mag-phase-card',
        '.uav-stat-card',
        '.uav-goal-card',
        '.uav-phase-card',
        '.un-problem-card',
        '.lt-problem-card',
        '.lt-phase-card',
        '.lcm-problem-card',
        '.lcm-goal-card',
        '.lcm-phase-card',
        '.p2s-phase-card',
        '.p2s-phase-block',
        '.case-phase-block',
        '.p2s-goal-card',
        '.p2s-card',
        '.p2s-highlight-card',
        '.p2s-decision-card',
        '.p2s-impact-card',
        '.case-research-chart',
        '.p2s-research-chart',
        '.case-pie-chart'
    ].join(','),

    flowGridSelector: [
        '.law-phase-grid',
        '.mag-phase-grid',
        '.uav-phase-grid',
        '.lcm-phase-grid'
    ].join(','),

    staggerGridSelector: [
        '.qb-findings',
        '.qb-goal-grid',
        '.law-problem-grid',
        '.law-goal-grid',
        '.mag-problem-grid',
        '.mag-goal-grid',
        '.uav-goal-grid',
        '.uav-stat-row',
        '.un-problem-grid',
        '.lt-problem-grid',
        '.lcm-problem-grid',
        '.lcm-goal-grid',
        '.p2s-grid-3',
        '.p2s-goal-grid',
        '.p2s-phase-grid',
        '.p2s-phase-pairs',
        '.case-phase-pairs',
        '.p2s-highlight-row',
        '.p2s-decision-grid',
        '.p2s-impact-grid'
    ].join(','),

    introHeaderSelector: [
        '.qb-2col-header',
        '.law-2col-header',
        '.mag-2col-header',
        '.uav-2col-header',
        '.p2s-2col-header',
        '.un-2col-header',
        '.lt-2col-header',
        '.lcm-2col-header'
    ].join(','),

    visualGridSelector: [
        '.qb-findings',
        '.qb-goal-grid',
        '.law-problem-grid',
        '.law-goal-grid',
        '.mag-problem-grid',
        '.mag-goal-grid',
        '.uav-stat-row',
        '.uav-goal-grid',
        '.un-problem-grid',
        '.lt-problem-grid',
        '.lcm-problem-grid',
        '.lcm-goal-grid',
        '.p2s-grid-3',
        '.p2s-goal-grid',
        '.p2s-phase-grid',
        '.p2s-phase-pairs',
        '.case-phase-pairs'
    ].join(','),

    init() {
        if (!document.querySelector('.case-section, .single-page-wrapper')) return;

        this.enhanceGrids();
        this.nestPhaseCharts();
        this.initResearchCharts();
        this.initPieCharts();
        this.initPhoneStageMotion();
        this.collapseRedundantIntros();
        this.trimLongBodyBlocks();
        this.observeMotion();
    },

    nestPhaseCharts() {
        document.querySelectorAll('.case-phase-block-inner--with-chart').forEach((inner) => {
            const copy = inner.querySelector('.case-phase-block-copy');
            const chart = inner.querySelector('.case-research-chart, .p2s-research-chart');
            if (!copy || !chart || copy.contains(chart)) return;
            copy.appendChild(chart);
        });
    },

    initResearchCharts() {
        document.querySelectorAll('.case-research-chart, .p2s-research-chart').forEach((chart) => {
            chart.classList.add('case-motion');
            chart.querySelectorAll('.case-chart-bar, .p2s-chart-bar').forEach((bar) => {
                const inline = bar.style.width;
                if (inline && !bar.style.getPropertyValue('--target')) {
                    const pct = parseFloat(inline);
                    if (!Number.isNaN(pct)) {
                        bar.style.setProperty('--target', String(pct));
                    }
                    bar.style.width = '';
                }
            });
        });
    },

    initPieCharts() {
        document.querySelectorAll('.case-pie-chart').forEach((chart) => {
            chart.classList.add('case-motion');
        });
    },

    initPhoneStageMotion() {
        document.querySelectorAll('.p2s-phone-frame--device').forEach((frame) => {
            frame.classList.add('case-motion', 'case-motion--phone-device');
        });
    },

    enhanceGrids() {
        document.querySelectorAll(this.staggerGridSelector).forEach((grid) => {
            grid.classList.add('case-motion-stagger');
        });

        document.querySelectorAll(this.flowGridSelector).forEach((grid) => {
            grid.classList.add('case-info-flow');
            grid.classList.add('case-motion-stagger');
            grid.querySelectorAll('[class*="-phase-card"]').forEach((card) => {
                card.classList.add('case-info-flow-step');
            });
        });

        document.querySelectorAll(this.motionSelector).forEach((el) => {
            el.classList.add('case-motion');
        });
    },

    collapseRedundantIntros() {
        document.querySelectorAll(this.introHeaderSelector).forEach((header) => {
            const section = header.closest('.case-section, section');
            if (!section) return;
            const hasVisualGrid = section.querySelector(this.visualGridSelector);
            if (!hasVisualGrid) return;

            const introCol = header.querySelector(':scope > div:last-child');
            const intro = introCol?.querySelector(
                '.qb-intro, .law-intro, .mag-intro, .uav-intro, .p2s-section-intro, .lcm-intro, .un-intro, .lt-intro, p'
            );
            if (intro) intro.classList.add('case-info-intro-collapsed');
        });
    },

    trimLongBodyBlocks() {
        const uavBody = document.querySelector('.uav-section.case-section--problem .uav-body');
        const uavHasStrip = document.querySelector('.uav-section.case-section--problem .case-info-stat-strip');
        if (uavBody && !uavHasStrip && uavBody.textContent.length > 120) {
            const strip = document.createElement('ul');
            strip.className = 'case-info-stat-strip case-motion-stagger';
            strip.innerHTML = `
                <li class="case-info-stat case-motion">
                    <span class="case-info-stat-value">One platform</span>
                    <span class="case-info-stat-label">Mapping, spraying, and thermal imaging in a single drone system</span>
                </li>
                <li class="case-info-stat case-motion">
                    <span class="case-info-stat-value">12-hour shifts</span>
                    <span class="case-info-stat-label">Technician UI must stay clear under long operational load</span>
                </li>
                <li class="case-info-stat case-motion">
                    <span class="case-info-stat-value">Zero overload</span>
                    <span class="case-info-stat-label">Attachments, diagnostics, and repairs without cognitive friction</span>
                </li>
            `;
            uavBody.replaceWith(strip);
        }

        document.querySelectorAll('.law-process-block > .law-body:first-of-type, .mag-process-block > .mag-body:first-of-type').forEach((p) => {
            if (p.textContent.length > 200) {
                p.classList.add('case-info-intro-collapsed');
            }
        });
    },

    observeMotion() {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const targets = document.querySelectorAll('.case-motion, .case-info-flow');

        if (reduced) {
            targets.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        targets.forEach((el) => observer.observe(el));
    }
};
