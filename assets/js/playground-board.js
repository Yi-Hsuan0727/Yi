/**
 * PlaygroundBoard: draggable mood-board items on the playground page.
 */
const PlaygroundBoard = {
    storageKey: 'playground-board-positions-v1',
    zCounter: 10,
    dragThreshold: 6,

    init: function() {
        const board = document.getElementById('playground-board');
        if (!board) return;

        this.board = board;

        const boot = () => {
            this.restorePositions();
            board.querySelectorAll('.playground-item').forEach((item) => {
                this.makeDraggable(item);
            });
            this.refreshScroll();
        };

        requestAnimationFrame(() => requestAnimationFrame(boot));
    },

    refreshScroll: function() {
        const refresh = () => {
            if (window.__lenis) window.__lenis.resize();
        };

        refresh();
        setTimeout(refresh, 120);
        setTimeout(refresh, 480);

        this.board.querySelectorAll('img').forEach((img) => {
            if (img.complete) return;
            img.addEventListener('load', refresh, { once: true });
        });

        window.addEventListener('load', refresh, { once: true });
    },

    getBoardRect: function() {
        return this.board.getBoundingClientRect();
    },

    applyPosition: function(item, left, top) {
        item.style.left = `${left}px`;
        item.style.top = `${top}px`;
    },

    readStoredPositions: function() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            return raw ? JSON.parse(raw) : {};
        } catch (error) {
            return {};
        }
    },

    restorePositions: function() {
        const stored = this.readStoredPositions();
        const boardRect = this.getBoardRect();

        this.board.querySelectorAll('.playground-item').forEach((item) => {
            const saved = stored[item.dataset.playgroundId];
            if (!saved) return;

            if (typeof saved.z === 'number') {
                item.style.zIndex = String(saved.z);
                this.zCounter = Math.max(this.zCounter, saved.z);
            }

            if (typeof saved.leftPercent === 'number' && typeof saved.topPercent === 'number') {
                item.style.left = `${saved.leftPercent}%`;
                item.style.top = `${saved.topPercent}px`;
                return;
            }

            if (typeof saved.left === 'number' && typeof saved.top === 'number' && boardRect.width) {
                this.applyPosition(item, saved.left, saved.top);
            }
        });
    },

    savePosition: function(item) {
        const stored = this.readStoredPositions();
        const boardRect = this.getBoardRect();
        const itemRect = item.getBoundingClientRect();
        const left = itemRect.left - boardRect.left;
        const top = itemRect.top - boardRect.top;

        stored[item.dataset.playgroundId] = {
            left: Math.round(left),
            top: Math.round(top),
            leftPercent: boardRect.width ? (left / boardRect.width) * 100 : null,
            topPercent: top,
            z: parseInt(item.style.zIndex, 10) || this.zCounter
        };

        try {
            localStorage.setItem(this.storageKey, JSON.stringify(stored));
        } catch (error) {
            /* ignore quota errors */
        }
    },

    makeDraggable: function(item) {
        let startX = 0;
        let startY = 0;
        let originLeft = 0;
        let originTop = 0;
        let isDragging = false;
        let activePointerId = null;

        const finishDrag = (event) => {
            if (activePointerId !== null && item.hasPointerCapture(activePointerId)) {
                item.releasePointerCapture(activePointerId);
            }

            item.classList.remove('is-dragging');
            item.removeEventListener('pointermove', onPointerMove);
            item.removeEventListener('pointerup', onPointerUp);
            item.removeEventListener('pointercancel', onPointerUp);

            if (isDragging) {
                this.savePosition(item);
            }

            isDragging = false;
            activePointerId = null;
        };

        const beginDrag = (event) => {
            isDragging = true;
            activePointerId = event.pointerId;
            event.preventDefault();
            item.setPointerCapture(event.pointerId);
            item.classList.add('is-dragging');

            this.zCounter += 1;
            item.style.zIndex = String(this.zCounter);

            const boardRect = this.getBoardRect();
            const itemRect = item.getBoundingClientRect();
            originLeft = itemRect.left - boardRect.left;
            originTop = itemRect.top - boardRect.top;

            this.applyPosition(item, originLeft, originTop);
        };

        const onPointerMove = (event) => {
            if (activePointerId !== null && event.pointerId !== activePointerId) return;

            if (!isDragging) {
                const dx = event.clientX - startX;
                const dy = event.clientY - startY;
                if (Math.hypot(dx, dy) < this.dragThreshold) return;
                beginDrag(event);
            }

            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            this.applyPosition(item, originLeft + dx, originTop + dy);
        };

        const onPointerUp = (event) => {
            finishDrag(event);
        };

        const onPointerDown = (event) => {
            if (event.pointerType === 'mouse' && event.button !== 0) return;

            isDragging = false;
            activePointerId = null;
            startX = event.clientX;
            startY = event.clientY;

            item.addEventListener('pointermove', onPointerMove);
            item.addEventListener('pointerup', onPointerUp);
            item.addEventListener('pointercancel', onPointerUp);
        };

        item.addEventListener('pointerdown', onPointerDown);
    }
};
