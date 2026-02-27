// Michelle Chen Portfolio – HTML to Figma Plugin
// Recreates index.html as a Figma design frame (1440×960 desktop layout)

figma.showUI(__html__, { width: 360, height: 220 });

figma.ui.onmessage = async function(msg) {
  if (msg.type !== 'generate') return;

  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Extra Bold' });

  // ── Design tokens ──────────────────────────────────────────────────────────
  const COLOR = {
    bg:         { r: 1,    g: 1,    b: 1    },   // #ffffff
    text:       { r: 0.067, g: 0.067, b: 0.067 }, // #111111
    secondary:  { r: 0.333, g: 0.333, b: 0.333 }, // #555555
    accent:     { r: 0.180, g: 0.800, b: 0.443 }, // #2ecc71
    border:     { r: 0.878, g: 0.878, b: 0.878 }, // #e0e0e0
    imageBg:    { r: 0.933, g: 0.933, b: 0.933 }, // #eeeeee
    blue:       { r: 0.290, g: 0.333, b: 0.878 }, // #4A55E0
    yellow:     { r: 0.910, g: 0.886, b: 0.345 }, // #E8E258
    white:      { r: 1,    g: 1,    b: 1    },
  };

  const CANVAS_W = 1440;
  const CANVAS_H = 960;
  const HEADER_H = 60;
  const FOOTER_H = 50;
  const CONTENT_H = CANVAS_H - HEADER_H - FOOTER_H;
  const SIDEBAR_W = Math.round(CANVAS_W * 0.30);   // 432 px
  const PANEL_W   = CANVAS_W - SIDEBAR_W;          // 1008 px

  // ── Helpers ────────────────────────────────────────────────────────────────
  function solid(color, a) {
    return [{ type: 'SOLID', color, opacity: a !== undefined ? a : 1 }];
  }
  function noFill()   { return []; }
  function border(color, weight) {
    return [{ type: 'SOLID', color }];
  }

  function rect(name, x, y, w, h, fillColor) {
    const n = figma.createRectangle();
    n.name = x !== undefined ? name : 'Rect';
    n.x = x; n.y = y; n.resize(w, h);
    n.fills = fillColor ? solid(fillColor) : noFill();
    return n;
  }

  function hLine(name, x, y, w, color) {
    const n = figma.createLine();
    n.name = name;
    n.x = x; n.y = y;
    n.resize(w, 0);
    n.strokes = solid(color);
    n.strokeWeight = 1;
    n.strokeAlign = 'CENTER';
    return n;
  }

  function vLine(name, x, y, h, color) {
    const n = figma.createLine();
    n.name = name;
    n.rotation = -90;
    n.x = x; n.y = y;
    n.resize(h, 0);
    n.strokes = solid(color);
    n.strokeWeight = 1;
    n.strokeAlign = 'CENTER';
    return n;
  }

  function txt(str, size, weight, colorObj, maxW) {
    const n = figma.createText();
    n.fontName = { family: 'Inter', style: weight };
    n.fontSize = size;
    n.fills = solid(colorObj);
    if (maxW) { n.textAutoResize = 'HEIGHT'; n.resize(maxW, 50); }
    else       { n.textAutoResize = 'WIDTH_AND_HEIGHT'; }
    n.characters = str;
    return n;
  }

  function pill(label, fillColor, textColor, borderColor, fontSize, padX, padY) {
    const frame = figma.createFrame();
    frame.name = label;
    frame.cornerRadius = 999;
    frame.fills = fillColor ? solid(fillColor) : noFill();
    frame.strokes = borderColor ? solid(borderColor) : [];
    frame.strokeWeight = 1;
    frame.layoutMode = 'HORIZONTAL';
    frame.counterAxisAlignItems = 'CENTER';
    frame.primaryAxisAlignItems = 'CENTER';
    frame.paddingLeft = padX; frame.paddingRight = padX;
    frame.paddingTop = padY;  frame.paddingBottom = padY;
    const t = txt(label, fontSize, 'Bold', textColor);
    t.textCase = 'UPPER';
    frame.appendChild(t);
    frame.primaryAxisSizingMode = 'AUTO';
    frame.counterAxisSizingMode = 'AUTO';
    return frame;
  }

  function autoFrame(name, direction, gap, padL, padR, padT, padB) {
    const f = figma.createFrame();
    f.name = name;
    f.fills = noFill();
    f.layoutMode = direction; // 'HORIZONTAL' | 'VERTICAL' | 'NONE'
    if (direction !== 'NONE') {
      f.itemSpacing = gap || 0;
      f.paddingLeft   = padL || 0;
      f.paddingRight  = padR || 0;
      f.paddingTop    = padT || 0;
      f.paddingBottom = padB || 0;
      f.primaryAxisSizingMode = 'AUTO';
      f.counterAxisSizingMode = 'AUTO';
    }
    return f;
  }

  // ── Root page frame ────────────────────────────────────────────────────────
  const page = figma.currentPage;
  page.name = 'Portfolio – Home (index.html)';

  const rootFrame = figma.createFrame();
  rootFrame.name = 'Desktop 1440 – Home';
  rootFrame.resize(CANVAS_W, CANVAS_H);
  rootFrame.fills = solid(COLOR.bg);
  rootFrame.x = 0; rootFrame.y = 0;

  // ── 1. HEADER ──────────────────────────────────────────────────────────────
  const header = figma.createFrame();
  header.name = 'Header';
  header.resize(CANVAS_W, HEADER_H);
  header.x = 0; header.y = 0;
  header.fills = solid(COLOR.bg);

  // Logo circle "M"
  const logoCircle = figma.createEllipse();
  logoCircle.name = 'Logo';
  logoCircle.resize(32, 32);
  logoCircle.x = 30; logoCircle.y = 14;
  logoCircle.fills = solid(COLOR.accent);
  const logoTxt = txt('M', 20, 'Bold', COLOR.white);
  logoTxt.x = 41; logoTxt.y = 18;
  logoTxt.name = 'Logo Text';
  header.appendChild(logoCircle);
  header.appendChild(logoTxt);

  // Nav links
  const navItems = [
    { label: 'Home',       active: true,  pill: true  },
    { label: 'About',      active: false, pill: false },
    { label: 'Playground', active: false, pill: false },
  ];
  let navX = 160;
  navItems.forEach(function(item) {
    if (item.pill) {
      const btn = pill(item.label, null, COLOR.accent, COLOR.accent, 12, 14, 6);
      btn.x = navX; btn.y = 18;
      header.appendChild(btn);
      navX += 80;
    } else {
      const t = txt(item.label, 12, 'Bold', COLOR.secondary);
      t.textCase = 'UPPER';
      t.x = navX; t.y = 24;
      t.name = 'Nav – ' + item.label;
      header.appendChild(t);
      navX += 110;
    }
  });

  // Theme toggle icon (moon symbol)
  const moonTxt = txt('☾', 16, 'Regular', COLOR.text);
  moonTxt.x = navX + 20; moonTxt.y = 20;
  moonTxt.name = 'Theme Toggle';
  header.appendChild(moonTxt);

  // Bottom border
  const headerBorder = hLine('Header Border', 0, HEADER_H - 1, CANVAS_W, COLOR.border);
  header.appendChild(headerBorder);

  rootFrame.appendChild(header);

  // ── 2. SIDEBAR ─────────────────────────────────────────────────────────────
  const sidebar = figma.createFrame();
  sidebar.name = 'Sidebar';
  sidebar.resize(SIDEBAR_W, CONTENT_H);
  sidebar.x = 0; sidebar.y = HEADER_H;
  sidebar.fills = solid(COLOR.bg);

  // Hero heading "Michelle Chen"
  const heroName = txt('Michelle\nChen', 52, 'Extra Bold', COLOR.text, SIDEBAR_W - 60);
  heroName.name = 'Hero Name';
  heroName.lineHeight = { value: 95, unit: 'PERCENT' };
  heroName.x = 30; heroName.y = 40;
  sidebar.appendChild(heroName);

  // Subtitle / role
  const heroRole = txt('Product Designer &\nFront-End Developer', 18, 'Medium', COLOR.text, SIDEBAR_W - 60);
  heroRole.name = 'Hero Role';
  heroRole.x = 30; heroRole.y = 185;
  sidebar.appendChild(heroRole);

  // Bio separator
  const bioSep = hLine('Bio Separator', 30, 290, SIDEBAR_W - 60, COLOR.border);
  sidebar.appendChild(bioSep);

  // Bio text
  const bioTxt = txt('Crafting thoughtful digital experiences\nthrough design and code.', 13, 'Regular', COLOR.secondary, SIDEBAR_W - 60);
  bioTxt.name = 'Bio Text';
  bioTxt.x = 30; bioTxt.y = 305;
  sidebar.appendChild(bioTxt);

  // Monster placeholder (green blob at bottom of sidebar)
  const monsterBlob = figma.createEllipse();
  monsterBlob.name = 'Monster Blob';
  monsterBlob.resize(160, 120);
  monsterBlob.x = (SIDEBAR_W - 160) / 2;
  monsterBlob.y = CONTENT_H - 180;
  monsterBlob.fills = solid(COLOR.accent, 0.9);

  // Eyes
  const eyeL = figma.createEllipse();
  eyeL.name = 'Eye Left';
  eyeL.resize(40, 32); eyeL.fills = solid(COLOR.white);
  eyeL.x = monsterBlob.x + 28; eyeL.y = monsterBlob.y + 30;

  const eyeR = figma.createEllipse();
  eyeR.name = 'Eye Right';
  eyeR.resize(40, 32); eyeR.fills = solid(COLOR.white);
  eyeR.x = monsterBlob.x + 90; eyeR.y = monsterBlob.y + 30;

  const pupilL = figma.createEllipse();
  pupilL.name = 'Pupil Left';
  pupilL.resize(14, 14); pupilL.fills = solid(COLOR.text);
  pupilL.x = eyeL.x + 13; pupilL.y = eyeL.y + 9;

  const pupilR = figma.createEllipse();
  pupilR.name = 'Pupil Right';
  pupilR.resize(14, 14); pupilR.fills = solid(COLOR.text);
  pupilR.x = eyeR.x + 13; pupilR.y = eyeR.y + 9;

  sidebar.appendChild(monsterBlob);
  sidebar.appendChild(eyeL); sidebar.appendChild(eyeR);
  sidebar.appendChild(pupilL); sidebar.appendChild(pupilR);

  // Right border
  const sidebarBorder = vLine('Sidebar Border', SIDEBAR_W, HEADER_H, CONTENT_H, COLOR.border);
  // vLine is appended to rootFrame later

  rootFrame.appendChild(sidebar);

  // ── 3. RIGHT PANEL ─────────────────────────────────────────────────────────
  const rightPanel = figma.createFrame();
  rightPanel.name = 'Right Panel';
  rightPanel.resize(PANEL_W, CONTENT_H);
  rightPanel.x = SIDEBAR_W; rightPanel.y = HEADER_H;
  rightPanel.fills = solid(COLOR.bg);

  // ── 3a. Works Header (sticky filter bar) ──────────────────────────────────
  const WORKS_HEADER_H = 46;
  const worksHeader = figma.createFrame();
  worksHeader.name = 'Works Header';
  worksHeader.resize(PANEL_W, WORKS_HEADER_H);
  worksHeader.x = 0; worksHeader.y = 0;
  worksHeader.fills = solid(COLOR.bg);

  const sectionTitle = txt('Selected Works', 14, 'Bold', COLOR.text);
  sectionTitle.name = 'Section Title';
  sectionTitle.x = 30; sectionTitle.y = 16;
  worksHeader.appendChild(sectionTitle);

  // Filter buttons: All (active), UI/UX, Code
  const filterLabels = ['All', 'UI/UX', 'Code'];
  let filterX = 175;
  filterLabels.forEach(function(label, i) {
    const isActive = i === 0;
    const btn = pill(
      label,
      null,
      isActive ? COLOR.text   : COLOR.secondary,
      isActive ? COLOR.accent : COLOR.border,
      12, 14, 6
    );
    btn.x = filterX; btn.y = 10;
    worksHeader.appendChild(btn);
    filterX += 80;
  });

  const whBorder = hLine('Works Header Border', 0, WORKS_HEADER_H - 1, PANEL_W, COLOR.border);
  worksHeader.appendChild(whBorder);
  rightPanel.appendChild(worksHeader);

  // ── 3b. Project Grid ───────────────────────────────────────────────────────
  const projects = [
    { title: 'Pic2Split',                           subtitle: 'End-to-End Design of a Social Bill-Splitting Web App', tags: ['Product Design', 'UX Research', 'UI Design', 'Web App'],                    hasImg: false },
    { title: 'International Lawfare Website',       subtitle: 'Drupal-Based Legal Scholarship Hub',                   tags: ['UI Design', 'Front-End Development', 'Web Design'],                          hasImg: false },
    { title: 'Agriculture & National Security',     subtitle: 'Research Portal for Food Security & Defense',          tags: ['UI Design', 'Front-End Development', 'Web Design'],                          hasImg: false },
    { title: 'UNESCO Volunteer Recruitment',        subtitle: 'UX Redesign for Clarity & Conversion',                 tags: ['UX Research', 'UX/UI Design', 'Web Redesign'],                               hasImg: false },
    { title: 'Indigenous Cultural Museums',         subtitle: 'WCAG AA Compliant Website for 30 Museums',             tags: ['UI Design', 'Front-End Development', 'Accessibility', 'Web Design'],          hasImg: true  },
    { title: 'Magnate Technology Official Website', subtitle: 'Corporate Website & Digital Brand System',              tags: ['Web Design', 'UI Design', 'Front-End Development', 'Branding'],              hasImg: true  },
    { title: 'Tainan Art Festival 2023 Website',    subtitle: 'Large-Scale Event Website Design',                     tags: ['Web Design', 'UI Design', 'Front-End Development'],                          hasImg: true  },
    { title: 'Longtan Walker Pace Counter APP',     subtitle: 'Behavior-Driven Mobility App Concept',                 tags: ['UX Research', 'Product Design', 'Mobile App', 'Prototyping'],                hasImg: true  },
  ];

  const GRID_PAD   = 30;
  const GRID_GAP   = 30;
  const COL_W      = Math.floor((PANEL_W - GRID_PAD * 2 - GRID_GAP) / 2);
  const IMG_H      = Math.round(COL_W * 9 / 16);

  let cardY = WORKS_HEADER_H + GRID_PAD;

  for (let i = 0; i < projects.length; i += 2) {
    const rowH = IMG_H + 12 + 22 + 16 + 24 + 16 + 16; // img + gap + title + subtitle + tags + shapes

    for (let col = 0; col < 2; col++) {
      const p = projects[i + col];
      if (!p) break;

      const cardX = GRID_PAD + col * (COL_W + GRID_GAP);

      // Card frame
      const card = figma.createFrame();
      card.name = 'Card – ' + p.title;
      card.resize(COL_W, rowH);
      card.x = cardX; card.y = cardY;
      card.fills = noFill();

      // Image container
      const imgBox = figma.createRectangle();
      imgBox.name = 'Image Container';
      imgBox.resize(COL_W, IMG_H);
      imgBox.x = 0; imgBox.y = 0;
      imgBox.cornerRadius = 8;
      imgBox.fills = solid(COLOR.imageBg);
      imgBox.strokes = solid(COLOR.border);
      imgBox.strokeWeight = 2;
      imgBox.strokeAlign = 'INSIDE';
      card.appendChild(imgBox);

      // Placeholder label inside image (when no real img)
      if (!p.hasImg) {
        const imgLabel = txt(p.title, 13, 'Bold', { r: 0.467, g: 0.467, b: 0.467 }, COL_W - 40);
        imgLabel.name = 'Image Label';
        imgLabel.x = 20; imgLabel.y = IMG_H / 2 - 10;
        imgLabel.textAlignHorizontal = 'CENTER';
        card.appendChild(imgLabel);
      }

      // Project title
      const titleTxt = txt(p.title, 16, 'Bold', COLOR.text, COL_W);
      titleTxt.name = 'Project Title';
      titleTxt.x = 0; titleTxt.y = IMG_H + 12;
      card.appendChild(titleTxt);

      // Subtitle
      const subTxt = txt(p.subtitle, 12, 'Regular', COLOR.secondary, COL_W);
      subTxt.name = 'Project Subtitle';
      subTxt.x = 0; subTxt.y = IMG_H + 12 + 22;
      card.appendChild(subTxt);

      // Tags row
      let tagX = 0;
      const TAG_Y = IMG_H + 12 + 22 + 20;
      p.tags.forEach(function(tagLabel) {
        const tagFrame = figma.createFrame();
        tagFrame.name = 'Tag – ' + tagLabel;
        tagFrame.cornerRadius = 20;
        tagFrame.fills = noFill();
        tagFrame.strokes = solid(COLOR.border);
        tagFrame.strokeWeight = 1;
        tagFrame.layoutMode = 'HORIZONTAL';
        tagFrame.paddingLeft = 10; tagFrame.paddingRight = 10;
        tagFrame.paddingTop = 3;   tagFrame.paddingBottom = 3;
        const tl = txt(tagLabel, 9, 'Bold', COLOR.secondary);
        tl.textCase = 'UPPER';
        tagFrame.appendChild(tl);
        tagFrame.primaryAxisSizingMode = 'AUTO';
        tagFrame.counterAxisSizingMode = 'AUTO';
        tagFrame.x = tagX; tagFrame.y = TAG_Y;
        card.appendChild(tagFrame);
        tagX += tagLabel.length * 6 + 26;
      });

      // Shapes (circle, triangle, square)
      const SHAPE_Y = TAG_Y + 26;
      const circleShape = figma.createEllipse();
      circleShape.name = 'Shape Circle';
      circleShape.resize(10, 10);
      circleShape.x = 0; circleShape.y = SHAPE_Y;
      circleShape.fills = solid(COLOR.accent, 0.85);
      card.appendChild(circleShape);

      const triShape = figma.createPolygon();
      triShape.name = 'Shape Triangle';
      triShape.pointCount = 3;
      triShape.resize(10, 10);
      triShape.x = 16; triShape.y = SHAPE_Y;
      triShape.fills = solid(COLOR.yellow, 0.95);
      card.appendChild(triShape);

      const sqShape = figma.createRectangle();
      sqShape.name = 'Shape Square';
      sqShape.resize(10, 10);
      sqShape.x = 32; sqShape.y = SHAPE_Y;
      sqShape.fills = solid(COLOR.blue, 0.9);
      card.appendChild(sqShape);

      rightPanel.appendChild(card);
    }

    cardY += rowH + GRID_GAP;
  }

  // ── 3c. CTA Section ────────────────────────────────────────────────────────
  const ctaY = cardY;
  const ctaSep = hLine('CTA Top Border', GRID_PAD, ctaY, PANEL_W - GRID_PAD * 2, COLOR.border);
  rightPanel.appendChild(ctaSep);

  const ctaTitle = txt('Stay tuned for more future projects.', 26, 'Extra Bold', COLOR.text, PANEL_W - GRID_PAD * 2);
  ctaTitle.name = 'CTA Title';
  ctaTitle.x = GRID_PAD; ctaTitle.y = ctaY + 24;
  rightPanel.appendChild(ctaTitle);

  const ctaBody = txt("I'm continuously adding new case studies and experiments as I ship more work.", 14, 'Regular', COLOR.secondary, 420);
  ctaBody.name = 'CTA Body';
  ctaBody.x = GRID_PAD; ctaBody.y = ctaY + 70;
  rightPanel.appendChild(ctaBody);

  // CTA buttons
  const btnPrimary = pill('Learn more about Michelle', COLOR.accent, COLOR.white, COLOR.accent, 12, 16, 8);
  btnPrimary.name = 'CTA Button – Primary';
  btnPrimary.x = GRID_PAD; btnPrimary.y = ctaY + 120;
  rightPanel.appendChild(btnPrimary);

  const btnSecondary = pill('Visit the Playground', null, COLOR.accent, COLOR.accent, 12, 16, 8);
  btnSecondary.name = 'CTA Button – Secondary';
  btnSecondary.x = GRID_PAD + 220; btnSecondary.y = ctaY + 120;
  rightPanel.appendChild(btnSecondary);

  rootFrame.appendChild(rightPanel);

  // Sidebar vertical border (drawn on top)
  const sbBorder = figma.createLine();
  sbBorder.name = 'Sidebar Border';
  sbBorder.rotation = -90;
  sbBorder.x = SIDEBAR_W; sbBorder.y = HEADER_H;
  sbBorder.resize(CONTENT_H, 0);
  sbBorder.strokes = solid(COLOR.border);
  sbBorder.strokeWeight = 1;
  rootFrame.appendChild(sbBorder);

  // ── 4. FOOTER ──────────────────────────────────────────────────────────────
  const footer = figma.createFrame();
  footer.name = 'Footer';
  footer.resize(CANVAS_W, FOOTER_H);
  footer.x = 0; footer.y = CANVAS_H - FOOTER_H;
  footer.fills = solid(COLOR.bg);

  const footerTopLine = hLine('Footer Border', 0, 0, CANVAS_W, COLOR.border);
  footer.appendChild(footerTopLine);

  const copyright = txt('© 2025 Michelle Chen. All Rights Reserved.', 11, 'Regular', COLOR.secondary);
  copyright.name = 'Footer Copyright';
  copyright.x = 30; copyright.y = 18;
  footer.appendChild(copyright);

  const connectTxt = txt('Connect with me:', 12, 'Bold', COLOR.secondary);
  connectTxt.name = 'Connect Label';
  connectTxt.x = CANVAS_W - 360; connectTxt.y = 18;
  footer.appendChild(connectTxt);

  // Social icon placeholders
  const socials = ['in', '@', 'CV'];
  let socialX = CANVAS_W - 210;
  socials.forEach(function(icon) {
    const circle = figma.createEllipse();
    circle.name = 'Social – ' + icon;
    circle.resize(26, 26);
    circle.x = socialX; circle.y = 12;
    circle.fills = noFill();
    circle.strokes = solid(COLOR.border);
    circle.strokeWeight = 1;
    const iconTxt = txt(icon, 9, 'Bold', COLOR.accent);
    iconTxt.x = socialX + (icon.length === 2 ? 7 : 9); iconTxt.y = 19;
    footer.appendChild(circle);
    footer.appendChild(iconTxt);
    socialX += 34;
  });

  const resumeBtn = pill('Resume', null, COLOR.accent, COLOR.accent, 11, 14, 4);
  resumeBtn.name = 'Resume Button';
  resumeBtn.x = CANVAS_W - 100; resumeBtn.y = 12;
  footer.appendChild(resumeBtn);

  rootFrame.appendChild(footer);

  // ── Finalise ───────────────────────────────────────────────────────────────
  page.appendChild(rootFrame);
  figma.viewport.scrollAndZoomIntoView([rootFrame]);

  figma.ui.postMessage({ type: 'done' });
  figma.closePlugin('Design frame generated!');
};
