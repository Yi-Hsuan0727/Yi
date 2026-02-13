/* * CursorLogic: Handles custom cursor movement and hover effects.
 */
const CursorLogic = {
    
    init: function() {
        // 1. Check if device is desktop
        if (window.innerWidth < 900) return;

        // 2. Cleanup existing
        const oldDot = document.querySelector('.cursor-dot');
        const oldOutline = document.querySelector('.cursor-outline');
        if(oldDot) oldDot.remove();
        if(oldOutline) oldOutline.remove();

        // 3. Create Elements
        const dot = document.createElement("div"); 
        dot.className = "cursor-dot";
        const outline = document.createElement("div"); 
        outline.className = "cursor-outline";
        
        document.body.appendChild(dot); 
        document.body.appendChild(outline);

        // 4. Force Initial Visibility (Fix for disappearing issue)
        dot.style.opacity = 1;
        outline.style.opacity = 1;

        // 5. State Variables
        let mx = window.innerWidth / 2;
        let my = window.innerHeight / 2;
        let ox = mx;
        let oy = my;

        // 6. Mouse Movement
        window.addEventListener('mousemove', e => { 
            mx = e.clientX; 
            my = e.clientY; 
            
            dot.style.left = mx + 'px'; 
            dot.style.top = my + 'px';
            
            // Ensure they stay visible during movement
            dot.style.opacity = 1; 
            outline.style.opacity = 1; 
        });

        // 7. Visibility Handlers
        document.addEventListener('mouseleave', () => {
            dot.style.opacity = 0;
            outline.style.opacity = 0;
        });

        document.addEventListener('mouseenter', () => {
            dot.style.opacity = 1;
            outline.style.opacity = 1;
        });
        
        // 8. Animation Loop
        function animate() {
            ox += (mx - ox) * 0.15;
            oy += (my - oy) * 0.15;
            
            outline.style.left = ox + 'px'; 
            outline.style.top = oy + 'px';
            
            requestAnimationFrame(animate);
        }
        animate();

        // 9. Hover Interactions
        document.body.addEventListener('mouseover', (e) => {
            // Added more selectors to ensure hover works on all interactive elements
            if (e.target.closest('a, button, input, textarea, .project-card, .filter-btn, .visit-btn, .theme-toggle, .nav-link, .cursor-hover')) {
                document.body.classList.add('hovering');
            } else {
                document.body.classList.remove('hovering');
            }
        });
    }
};

// Auto-init
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    CursorLogic.init();
}