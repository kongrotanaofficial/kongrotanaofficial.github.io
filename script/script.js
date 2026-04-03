// Set current year in footer
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ═══════════════════════════════════════════
// THEME TOGGLE
// ═══════════════════════════════════════════
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const currentTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const ct = htmlElement.getAttribute('data-theme');
        const nt = ct === 'light' ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', nt);
        localStorage.setItem('theme', nt);
        updateThemeIcon(nt);
    });
}

function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('svg');
    if (!icon) return;
    if (theme === 'dark') {
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
    } else {
        icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
    }
}

// ═══════════════════════════════════════════
// NEON CANVAS BACKGROUND
// ═══════════════════════════════════════════
function createNeonCanvas() {
    const canvas = document.createElement('canvas');
    canvas.id = 'neon-bg-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let W, H, nodes = [];

    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

    function initNodes(n) {
        nodes = [];
        for (let i = 0; i < n; i++) {
            nodes.push({ x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4, r: Math.random()*1.8+0.5 });
        }
    }

    function getCyanColor() {
        return htmlElement.getAttribute('data-theme') === 'light' ? '0,112,187' : '0,245,255';
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        const c = getCyanColor();

        // Subtle grid
        ctx.strokeStyle = `rgba(${c},0.025)`;
        ctx.lineWidth = 0.5;
        const gs = 60;
        for (let x = 0; x < W; x += gs) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
        for (let y = 0; y < H; y += gs) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

        nodes.forEach(n => {
            n.x += n.vx; n.y += n.vy;
            if (n.x < 0 || n.x > W) n.vx *= -1;
            if (n.y < 0 || n.y > H) n.vy *= -1;
        });

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const d = Math.sqrt(dx*dx + dy*dy);
                if (d < 130) {
                    const alpha = (1 - d/130) * 0.18;
                    ctx.strokeStyle = `rgba(${c},${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
                }
            }
        }

        nodes.forEach(n => {
            ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
            ctx.fillStyle = `rgba(${c},0.4)`;
            ctx.shadowColor = `rgba(${c},1)`;
            ctx.shadowBlur = 6; ctx.fill(); ctx.shadowBlur = 0;
        });

        requestAnimationFrame(draw);
    }

    resize(); initNodes(window.innerWidth < 640 ? 40 : 80); draw();
    window.addEventListener('resize', () => { resize(); initNodes(window.innerWidth < 640 ? 40 : 80); });
}

// ═══════════════════════════════════════════
// ANIMATED BACKGROUND + PARTICLES
// ═══════════════════════════════════════════
function createAnimatedBackground() {
    const animatedBg = document.createElement('div');
    animatedBg.className = 'animated-bg';
    document.body.appendChild(animatedBg);
}

function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    for (let i = 0; i < 18; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 1;
        particle.style.width  = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left   = Math.random() * 100 + '%';
        particle.style.top    = Math.random() * 100 + '%';
        particle.style.animationDelay    = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particlesContainer.appendChild(particle);
    }
    document.body.appendChild(particlesContainer);
}

createAnimatedBackground();
createParticles();
createNeonCanvas();

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