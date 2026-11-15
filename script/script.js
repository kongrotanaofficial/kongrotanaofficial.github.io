// Set current year in footer
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ═══════════════════════════════════════════
// THEME TOGGLE
// ═══════════════════════════════════════════
const htmlElement = document.documentElement;
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);
updateThemeIcons(currentTheme);

document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const ct = htmlElement.getAttribute('data-theme');
        const nt = ct === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', nt);
        localStorage.setItem('theme', nt);
        updateThemeIcons(nt);
    });
});

function updateThemeIcons(theme) {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        const icon = btn.querySelector('svg');
        if (!icon) return;
        if (theme === 'dark') {
            icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        } else {
            icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
        }
    });
}

// ═══════════════════════════════════════════
// MODERN CYBER AMBIENT BACKGROUND
// ═══════════════════════════════════════════
function createAnimatedBackground() {
    if (!document.querySelector('.animated-bg')) {
        const animatedBg = document.createElement('div');
        animatedBg.className = 'animated-bg';
        document.body.prepend(animatedBg);
    }
}

createAnimatedBackground();
initContentWaveCanvas();
initHero3DCard();
initCardSpotlights();
initAppFilters();

// ═══════════════════════════════════════════
// IN-CONTENT INTERACTIVE HARMONIC WAVE CANVAS
// (Matches user's reference oscilloscope waves)
// ═══════════════════════════════════════════
function initContentWaveCanvas() {
    const canvas = document.getElementById('content-wave-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const readout = document.getElementById('wave-freq-readout');

    let W, H;
    let step = 0;
    let isHovered = false;
    let mouse = { x: -1000, y: 70, targetX: -1000, targetY: 70, velocity: 0 };
    let lastX = 0;

    function resize() {
        const rect = canvas.getBoundingClientRect();
        W = canvas.width = rect.width * (window.devicePixelRatio || 1);
        H = canvas.height = 140 * (window.devicePixelRatio || 1);
        ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }

    window.addEventListener('resize', resize);
    resize();

    // Mouse & Touch Interaction
    function handleMove(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = clientX - rect.left;
        mouse.targetY = clientY - rect.top;
        isHovered = true;

        const dx = mouse.targetX - lastX;
        mouse.velocity = Math.min(Math.abs(dx) * 0.4, 15);
        lastX = mouse.targetX;

        if (readout) {
            const freqVal = (120 + (mouse.targetX / rect.width) * 60 + mouse.velocity * 3).toFixed(1);
            readout.textContent = `${freqVal} Hz`;
        }
    }

    canvas.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
    canvas.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    canvas.addEventListener('mouseleave', () => { isHovered = false; });
    canvas.addEventListener('touchend', () => { isHovered = false; });

    // The 4 Harmonic Waves matching the reference image
    const waves = [
        { colorLight: 'rgba(0, 112, 187, 0.85)',   colorDark: 'rgba(0, 245, 255, 0.9)',    freq: 0.007, speed: 0.035, amp: 26, phase: 0 },
        { colorLight: 'rgba(114, 0, 187, 0.85)',   colorDark: 'rgba(192, 132, 252, 0.85)', freq: 0.009, speed: 0.028, amp: 32, phase: 1.8 },
        { colorLight: 'rgba(37, 99, 235, 0.75)',   colorDark: 'rgba(96, 165, 250, 0.8)',   freq: 0.011, speed: 0.022, amp: 22, phase: 3.4 },
        { colorLight: 'rgba(219, 39, 119, 0.75)',  colorDark: 'rgba(244, 114, 182, 0.8)',  freq: 0.008, speed: 0.040, amp: 28, phase: 4.9 }
    ];

    function draw() {
        const displayW = canvas.clientWidth;
        const displayH = 140;
        ctx.clearRect(0, 0, displayW, displayH);

        const isDark = htmlElement.getAttribute('data-theme') !== 'light';
        const midY = displayH / 2;
        step += 0.02;

        // Smooth cursor interpolation
        mouse.x += (mouse.targetX - mouse.x) * 0.15;
        mouse.y += (mouse.targetY - mouse.y) * 0.15;
        mouse.velocity *= 0.95;

        // 1. Draw subtle background Cartesian grid
        const gridColor = isDark ? 'rgba(0, 245, 255, 0.04)' : 'rgba(0, 112, 187, 0.04)';
        const lineAccent = isDark ? 'rgba(0, 245, 255, 0.15)' : 'rgba(0, 112, 187, 0.15)';
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;

        // Vertical grid lines
        const stepX = 50;
        for (let x = 0; x < displayW; x += stepX) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, displayH);
            ctx.stroke();
        }

        // Horizontal grid lines
        const stepY = 28;
        for (let y = 0; y < displayH; y += stepY) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(displayW, y);
            ctx.stroke();
        }

        // Baseline (center axis)
        ctx.strokeStyle = lineAccent;
        ctx.beginPath();
        ctx.moveTo(0, midY);
        ctx.lineTo(displayW, midY);
        ctx.stroke();

        // 2. Draw the 4 Harmonic Waves
        const nodes = [];

        waves.forEach((w, idx) => {
            ctx.beginPath();
            ctx.strokeStyle = isDark ? w.colorDark : w.colorLight;
            ctx.lineWidth = 2;
            ctx.shadowColor = isDark ? w.colorDark : w.colorLight;
            ctx.shadowBlur = isDark ? 8 : 3;

            for (let x = 0; x <= displayW; x += 3) {
                // Base sine wave
                let y = midY + Math.sin(x * w.freq + step * w.speed * 60 + w.phase) * w.amp;

                // Mouse interaction displacement (Gaussian pluck envelope)
                if (isHovered && mouse.x > 0) {
                    const dist = Math.abs(x - mouse.x);
                    if (dist < 140) {
                        const envelope = Math.exp(-Math.pow(dist / 65, 2));
                        const pull = (mouse.y - midY) * 0.85 + (Math.sin(dist * 0.1 - step * 5) * 8);
                        y += pull * envelope;
                    }
                }

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);

                // Sample points for decorative intersection nodes (matching image)
                if (x % 150 === 0 && (idx === 0 || idx === 1)) {
                    nodes.push({ x, y, color: isDark ? w.colorDark : w.colorLight });
                }
            }
            ctx.stroke();
            ctx.shadowBlur = 0;
        });

        // 3. Draw decorative nodes (data points) matching the uploaded image
        nodes.forEach(n => {
            ctx.beginPath();
            ctx.arc(n.x, n.y, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = n.color;
            ctx.shadowColor = n.color;
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Faint anchor ring
            ctx.beginPath();
            ctx.arc(n.x, n.y, 7, 0, Math.PI * 2);
            ctx.strokeStyle = n.color.replace('0.9', '0.2').replace('0.85', '0.2');
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // 4. Cursor tracking line indicator when hovering
        if (isHovered && mouse.x >= 0 && mouse.x <= displayW) {
            ctx.strokeStyle = isDark ? 'rgba(0, 245, 255, 0.4)' : 'rgba(0, 112, 187, 0.4)';
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(mouse.x, 0);
            ctx.lineTo(mouse.x, displayH);
            ctx.stroke();
            ctx.setLineDash([]);

            // Center tracking beacon
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#00f5ff';
            ctx.shadowColor = '#00f5ff';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        requestAnimationFrame(draw);
    }

    draw();
}

// ═══════════════════════════════════════════
// HERO 3D HOLOGRAPHIC CARD TILT PHYSICS
// ═══════════════════════════════════════════
function initHero3DCard() {
    const wrapper = document.getElementById('hero3dWrapper');
    const card = document.getElementById('hero3dCard');
    const glare = document.getElementById('cardGlare');
    if (!wrapper || !card) return;

    let bounds;

    function refreshBounds() {
        bounds = wrapper.getBoundingClientRect();
    }

    window.addEventListener('resize', refreshBounds);
    window.addEventListener('scroll', refreshBounds, { passive: true });
    refreshBounds();

    function onMove(e) {
        if (!bounds) refreshBounds();
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - bounds.x;
        const topY = mouseY - bounds.y;
        const center = {
            x: leftX - bounds.width / 2,
            y: topY - bounds.height / 2
        };

        const distance = Math.sqrt(center.x ** 2 + center.y ** 2);
        const maxDist = Math.max(bounds.width, bounds.height) / 2;

        // Rotation angles
        const rotX = -(center.y / (bounds.height / 2)) * 14;
        const rotY = (center.x / (bounds.width / 2)) * 14;

        card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;

        // Glare shine positioning
        if (glare) {
            glare.style.background = `radial-gradient(circle at ${leftX}px ${topY}px, rgba(255, 255, 255, 0.22), transparent 60%)`;
        }
    }

    function onLeave() {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        if (glare) {
            glare.style.background = 'transparent';
        }
    }

    wrapper.addEventListener('mousemove', onMove);
    wrapper.addEventListener('mouseleave', onLeave);

    // Touch support for mobile
    wrapper.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches[0]) onMove(e.touches[0]);
    }, { passive: true });
    wrapper.addEventListener('touchend', onLeave);
}

// ═══════════════════════════════════════════
// MOUSE SPOTLIGHT ON CARDS
// ═══════════════════════════════════════════
function initCardSpotlights() {
    const cards = document.querySelectorAll('.spotlight-card, .card, .marquee-card, .timeline-item > div');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

// ═══════════════════════════════════════════
// APP FILTER TABS
// ═══════════════════════════════════════════
function initAppFilters() {
    const filterButtons = document.querySelectorAll('.app-filter-btn');
    const appCards = document.querySelectorAll('.app-card-item');
    if (!filterButtons.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.style.borderColor = 'var(--dark-border)';
                b.style.color = 'var(--text-secondary)';
                b.style.background = 'transparent';
            });
            btn.classList.add('active');
            btn.style.borderColor = 'var(--neon-cyan)';
            btn.style.color = 'var(--neon-cyan)';
            btn.style.background = 'rgba(0, 245, 255, 0.08)';

            const filter = btn.getAttribute('data-filter');
            appCards.forEach(card => {
                const platform = card.getAttribute('data-platform') || '';
                if (filter === 'all' || platform.includes(filter)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ═══════════════════════════════════════════
// SMOOTH SCROLL
// ═══════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const mobileMenuEl = document.getElementById('mobile-menu');
        if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                if (mobileMenuEl && !mobileMenuEl.classList.contains('hidden')) mobileMenuEl.classList.add('hidden');
            }
        } else if (targetId === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (mobileMenuEl && !mobileMenuEl.classList.contains('hidden')) mobileMenuEl.classList.add('hidden');
        }
    });
});

// ═══════════════════════════════════════════
// MOBILE MENU
// ═══════════════════════════════════════════
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
}

// ═══════════════════════════════════════════
// HEADER SHRINK ON SCROLL
// ═══════════════════════════════════════════
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { header.classList.add('py-2','shadow-md'); header.classList.remove('py-3'); }
        else { header.classList.remove('py-2','shadow-md'); header.classList.add('py-3'); }
    });
}

// ═══════════════════════════════════════════
// ACTIVE NAV LINK
// ═══════════════════════════════════════════
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a.nav-link');
const mobileNavLinks = document.querySelectorAll('#mobile-menu a.data-section-mobile');

function changeLinkState() {
    let index = sections.length;
    while (--index >= 0 && window.scrollY + 100 < sections[index].offsetTop) {}
    navLinks.forEach(link => link.classList.remove('active'));
    mobileNavLinks.forEach(link => link.classList.remove('bg-blue-100','text-blue-600'));
    if (index >= 0) {
        const id = sections[index].id;
        const dl = document.querySelector(`nav a.nav-link[data-section="${id}"]`);
        const ml = document.querySelector(`#mobile-menu a.data-section-mobile[data-section="${id}"]`);
        if (dl) dl.classList.add('active');
        if (ml) ml.classList.add('bg-blue-100','text-blue-600');
    } else if (sections.length > 0 && navLinks.length > 0) {
        const dl = document.querySelector(`nav a.nav-link[data-section="${sections[0].id}"]`);
        if (dl) dl.classList.add('active');
    }
}
if (sections.length > 0) { changeLinkState(); window.addEventListener('scroll', changeLinkState); }

// ═══════════════════════════════════════════
// CONTACT FORM
// ═══════════════════════════════════════════
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('form-message');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nameInput = document.getElementById('name');
        const name = nameInput ? nameInput.value : 'there';
        if (formMessage) {
            formMessage.innerHTML = `<p style="color:#00ff88;font-family:'JetBrains Mono',monospace;font-size:0.85rem;">✓ Thank you, ${name}! Your message has been sent successfully. I'll get back to you soon.</p>`;
            setTimeout(() => { formMessage.innerHTML = ''; }, 5000);
        }
        contactForm.reset();
    });
}

// ═══════════════════════════════════════════
// FADE IN OBSERVER
// ═══════════════════════════════════════════
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('appear'); });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });
fadeElements.forEach(element => observer.observe(element));

// ═══════════════════════════════════════════
// READ MORE / CONTENT TOGGLE
// ═══════════════════════════════════════════
const contentStore = {
    'gemini-summary-app-1': "Khmer Book Label Studio (KH Book Label Maker) is an automated Windows desktop application designed to generate professional student book labels. Featuring authentic traditional Khmer decorative frames (Kbach), custom field layouts, school logos, and automated grid distribution on standard A4 paper, it eliminates tedious manual formatting. Published on Microsoft Store, with Google Play in closed testing.",
    'gemini-summary-app-2': "CV Builder Pro is an intuitive mobile resume maker featuring ATS-compliant modern templates, dynamic sections, live instant preview, and high-performance PDF export. Designed to help professionals and graduates craft employer-ready CVs in minutes. Live in production on Google Play with Microsoft Store desktop edition planned.",
    'gemini-summary-app-3': "Chemistry Match is an educational science matching game designed to help students master chemical elements, atomic numbers, valence bonds, and reaction formulas through interactive puzzles. Available across desktop and mobile, live on both Microsoft Store and Google Play.",
    'gemini-summary-app-4': "Khmer Frame Name Maker empowers users to craft personalized Khmer name typography enveloped in exquisite traditional ornamental borders. Perfect for avatar creation, holiday greetings, and cultural celebrations. Live on Google Play with Microsoft Store version planned.",
    'gemini-summary-1': "This intelligent Telegram bot suite, built with Python and the python-telegram-bot library, offers diverse tools to simplify daily life. From task management and reminders to solving chemistry problems, performing math calculations, providing English synonyms, converting text to MP3, auto-reacting with emojis, and sharing useful information—each bot uses smart automation and natural language processing to create seamless, engaging interactions.",
    'gemini-summary-2': "A portfolio of graphic design projects, highlighting skills in branding, illustration, and visual communication. Expertise in Adobe Creative Suite (Photoshop, Illustrator) is used to develop compelling visual narratives and marketing assets.",
    'gemini-summary-3': "This showcase highlights practical SAP Business One development projects focused on enhancing business processes and user workflows. It includes custom reports, transaction notifications, FMS logic, and seamless system integrations—crafted to support real-world ERP needs with a focus on usability, efficiency, and business impact.",
    'gemini-summary-4': "A detailed look into the creation of Chhuk Krapom Font, a distinctive Khmer typeface carefully crafted to celebrate and preserve the beauty of the Khmer script. This project documents the entire journey—from initial concept and character design to a fully functional digital font—designed to improve readability and support modern Khmer typography across digital and print platforms.",
    'gemini-summary-5': "CV Builder Pro is the ultimate resume maker that helps you create stunning, professional CVs in minutes. Whether you're a fresh graduate, seasoned professional, or career changer, our intuitive app gets you noticed by employers — fast.",
    'gemini-bio-snippet': "Kong Rotana is a versatile developer with expertise in ERP development, full-stack web applications, and Telegram bot creation. With strong skills in SAP Business One customization, MVC web development, and Python-based automation, Kong builds practical and impactful solutions that streamline business processes and enhance user experiences. Beyond coding, Kong is a passionate graphic designer and the creator of the Chhuk Krapom Khmer font, blending technology and creativity to support the Khmer language in the digital world."
};

function toggleContentVisibility(outputElementId) {
    const outputElement = document.getElementById(outputElementId);
    if (!outputElement) return;
    const newContent = contentStore[outputElementId] || 'More details will appear here.';
    if (outputElement.classList.contains('hidden') || outputElement.innerHTML !== newContent) {
        outputElement.innerHTML = newContent;
        outputElement.classList.remove('hidden');
    } else {
        outputElement.classList.add('hidden');
    }
}

window.generateProjectSummary = function(descriptionElementId, outputElementId) {
    toggleContentVisibility(outputElementId);
};

const generateBioButton = document.getElementById('generateBioButton');
if (generateBioButton) {
    generateBioButton.addEventListener('click', function() { toggleContentVisibility('gemini-bio-snippet'); });
}

// ═══════════════════════════════════════════
// HELPER: show download button properly
// ═══════════════════════════════════════════
function showDownloadBtn(btn) {
    if (!btn) return;
    btn.classList.remove('hidden');
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
}

// ═══════════════════════════════════════════
// QR CODE GENERATOR
// ═══════════════════════════════════════════
const qrInput       = document.getElementById('qr-input');
const qrOutput      = document.getElementById('qr-output');
const qrGenerateBtn = document.getElementById('qr-generate-btn');
const qrDownloadBtn = document.getElementById('qr-download-btn');

if (qrGenerateBtn && qrInput && qrOutput && qrDownloadBtn) {
    const generateQRCode = () => {
        const text = qrInput.value.trim();
        if (!text) {
            qrOutput.innerHTML = '<p style="color:#ff0080;font-size:13px;text-align:center;">Please enter a valid URL or text.</p>';
            qrDownloadBtn.style.display = 'none';
            qrDownloadBtn.classList.add('hidden');
            setTimeout(() => { qrOutput.innerHTML = ''; }, 3000);
            return;
        }

        qrOutput.innerHTML = '';
        // Hide download while generating
        qrDownloadBtn.style.display = 'none';
        qrDownloadBtn.classList.add('hidden');

        const isDark = htmlElement.getAttribute('data-theme') !== 'light';
        new QRCode(qrOutput, {
            text,
            width: 200, height: 200,
            colorDark:  isDark ? '#00f5ff' : '#0070bb',
            colorLight: isDark ? '#0a0f28' : '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });

        // QRCode renders async — poll for canvas
        let attempts = 0;
        const waitForCanvas = setInterval(() => {
            attempts++;
            const qrCanvas = qrOutput.querySelector('canvas') || qrOutput.querySelector('img');
            if (qrCanvas || attempts > 30) {
                clearInterval(waitForCanvas);
                const el = qrOutput.querySelector('canvas') || qrOutput.querySelector('img');
                if (el) {
                    let dataUrl;
                    if (el.tagName === 'CANVAS') {
                        dataUrl = el.toDataURL('image/png');
                    } else {
                        dataUrl = el.src;
                    }
                    qrDownloadBtn.href = dataUrl;
                    qrDownloadBtn.download = 'qrcode.png';
                    showDownloadBtn(qrDownloadBtn);
                }
            }
        }, 50);
    };

    qrGenerateBtn.addEventListener('click', generateQRCode);
    qrGenerateBtn.addEventListener('touchstart', (e) => { e.preventDefault(); generateQRCode(); });
}

// ═══════════════════════════════════════════
// BARCODE GENERATOR
// ═══════════════════════════════════════════
const barcodeInput       = document.getElementById('barcode-input');
const barcodeOutput      = document.getElementById('barcode-output');
const barcodeGenerateBtn = document.getElementById('barcode-generate-btn');
const barcodeDownloadBtn = document.getElementById('barcode-download-btn');

if (barcodeGenerateBtn && barcodeInput && barcodeOutput && barcodeDownloadBtn) {
    const generateBarcode = () => {
        const text = barcodeInput.value.trim();
        if (!text) {
            barcodeDownloadBtn.style.display = 'none';
            barcodeDownloadBtn.classList.add('hidden');
            return;
        }

        const isDark = htmlElement.getAttribute('data-theme') !== 'light';
        try {
            JsBarcode(barcodeOutput, text, {
                format:       'CODE128',
                width:        2,
                height:       90,
                displayValue: true,
                background:   isDark ? '#0a0f28' : '#ffffff',
                lineColor:    isDark ? '#00f5ff' : '#0070bb',
                margin:       10,
                fontSize:     14,
                fontOptions:  '',
                font:         'JetBrains Mono, monospace'
            });

            // Get data URL and show button
            const dataUrl = barcodeOutput.toDataURL('image/png');
            barcodeDownloadBtn.href = dataUrl;
            barcodeDownloadBtn.download = 'barcode.png';
            showDownloadBtn(barcodeDownloadBtn);
        } catch (err) {
            console.error('Barcode error:', err);
            barcodeDownloadBtn.style.display = 'none';
            barcodeDownloadBtn.classList.add('hidden');
        }
    };

    barcodeGenerateBtn.addEventListener('click', generateBarcode);
    barcodeGenerateBtn.addEventListener('touchstart', (e) => { e.preventDefault(); generateBarcode(); });
}

// ═══════════════════════════════════════════
// PASSWORD GENERATOR
// ═══════════════════════════════════════════
const lengthSlider        = document.getElementById('length');
const lengthValue         = document.getElementById('length-value');
const passwordDisplay     = document.getElementById('password-display');
const generatePasswordBtn = document.getElementById('generate-password-btn');
const copyBtn             = document.getElementById('copy-btn');
const copyToast           = document.getElementById('copy-toast');
const includeUppercase    = document.getElementById('include-uppercase');
const includeNumbers      = document.getElementById('include-numbers');
const includeSymbols      = document.getElementById('include-symbols');

const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numberChars    = '0123456789';
const symbolChars    = '!@#$%^&*()_+-=[]{}|;:,.<>?';

if (lengthSlider && passwordDisplay && generatePasswordBtn) {
    lengthSlider.addEventListener('input', () => { if (lengthValue) lengthValue.textContent = lengthSlider.value; });

    const showToast = (message, isError = false) => {
        if (!copyToast) return;
        copyToast.textContent = message;
        copyToast.classList.remove('hidden');
        if (isError) copyToast.classList.add('error');
        else copyToast.classList.remove('error');
        setTimeout(() => { copyToast.classList.add('hidden'); }, 2000);
    };

    const generatePassword = () => {
        const length = parseInt(lengthSlider.value);
        let charset = lowercaseChars;
        if (includeUppercase && includeUppercase.checked) charset += uppercaseChars;
        if (includeNumbers   && includeNumbers.checked)   charset += numberChars;
        if (includeSymbols   && includeSymbols.checked)   charset += symbolChars;
        if (!charset) { passwordDisplay.textContent = 'Select at least one option!'; return; }
        let password = '';
        for (let i = 0; i < length; i++) password += charset[Math.floor(Math.random() * charset.length)];
        passwordDisplay.textContent = password;
    };

    const copyPassword = () => {
        const password = passwordDisplay.textContent;
        if (password === 'Click Generate...' || password === 'Select at least one option!') { showToast('Nothing to copy!', true); return; }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(password).then(() => showToast('Password copied!')).catch(() => fallbackCopy(password));
        } else { fallbackCopy(password); }
    };

    const fallbackCopy = (text) => {
        const textarea = document.createElement('textarea');
        textarea.value = text; textarea.style.cssText = 'position:fixed;opacity:0;';
        document.body.appendChild(textarea); textarea.select();
        try { document.execCommand('copy'); showToast('Password copied!'); }
        catch { showToast('Failed to copy!', true); }
        finally { document.body.removeChild(textarea); }
    };

    generatePasswordBtn.addEventListener('click', generatePassword);
    generatePasswordBtn.addEventListener('touchstart', (e) => { e.preventDefault(); generatePassword(); });
    if (copyBtn) {
        copyBtn.addEventListener('click', copyPassword);
        copyBtn.addEventListener('touchstart', (e) => { e.preventDefault(); copyPassword(); });
    }
    generatePassword();
}

// Observe code generator section
const codeGeneratorSection = document.getElementById('code-generator');
if (codeGeneratorSection) observer.observe(codeGeneratorSection);