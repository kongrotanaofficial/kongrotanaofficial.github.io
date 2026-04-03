// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

<<<<<<< HEAD
=======
// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme or default to light
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    if (themeToggle) {
        const icon = themeToggle.querySelector('svg');
        if (icon) {
            if (theme === 'dark') {
                icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
            } else {
                icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
            }
        }
    }
}

// Create Animated Background
function createAnimatedBackground() {
    const animatedBg = document.createElement('div');
    animatedBg.className = 'animated-bg';
    document.body.appendChild(animatedBg);
}

// Create Floating Particles
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        
        particlesContainer.appendChild(particle);
    }
    
    document.body.appendChild(particlesContainer);
}

// Initialize animations
createAnimatedBackground();
createParticles();

>>>>>>> ceb171d (Rotana portfolio)
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const mobileMenuEl = document.getElementById('mobile-menu');

        if (targetId && targetId.length > 1 && targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                if (mobileMenuEl && !mobileMenuEl.classList.contains('hidden')) {
                    mobileMenuEl.classList.add('hidden');
                }
            }
        } else if (targetId === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (mobileMenuEl && !mobileMenuEl.classList.contains('hidden')) {
                mobileMenuEl.classList.add('hidden');
            }
        }
    });
});

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Header shrink on scroll
const header = document.getElementById('header');
if (header) { // Add null check for header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('py-2', 'shadow-md');
            header.classList.remove('py-3');
        } else {
            header.classList.remove('py-2', 'shadow-md');
            header.classList.add('py-3');
        }
    });
}


// Active navigation link highlighting on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a.nav-link');
const mobileNavLinks = document.querySelectorAll('#mobile-menu a.data-section-mobile');

function changeLinkState() {
    let index = sections.length;
    while (--index >= 0 && window.scrollY + 100 < sections[index].offsetTop) { }

    navLinks.forEach((link) => link.classList.remove('active'));
    mobileNavLinks.forEach((link) => link.classList.remove('bg-blue-100', 'text-blue-600'));

    if (index >= 0) {
        const currentSectionId = sections[index].id;
        const activeDesktopLink = document.querySelector(`nav a.nav-link[data-section="${currentSectionId}"]`);
        const activeMobileLink = document.querySelector(`#mobile-menu a.data-section-mobile[data-section="${currentSectionId}"]`);

        if (activeDesktopLink) activeDesktopLink.classList.add('active');
        if (activeMobileLink) activeMobileLink.classList.add('bg-blue-100', 'text-blue-600');
    } else if (sections.length > 0 && navLinks.length > 0 && mobileNavLinks.length > 0) { // Ensure sections[0] exists
        const firstSectionId = sections[0].id;
        const activeDesktopLink = document.querySelector(`nav a.nav-link[data-section="${firstSectionId}"]`);
        const activeMobileLink = document.querySelector(`#mobile-menu a.data-section-mobile[data-section="${firstSectionId}"]`);
        if (activeDesktopLink) activeDesktopLink.classList.add('active');
        if (activeMobileLink) activeMobileLink.classList.add('bg-blue-100', 'text-blue-600');
    }
}
if (sections.length > 0) { // Only run if sections exist
    changeLinkState();
    window.addEventListener('scroll', changeLinkState);
}


// Contact form submission
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('form-message');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const nameInput = document.getElementById('name');
        const name = nameInput ? nameInput.value : "there"; // Fallback name
        if (formMessage) {
            formMessage.innerHTML = `<p class="text-green-600 font-medium">Thank you, ${name}! Your message has been sent successfully. I'll get back to you soon.</p>`;
            setTimeout(() => { formMessage.innerHTML = ''; }, 5000);
        }
        contactForm.reset();
    });
}

// Fade-in animation for sections
const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

fadeElements.forEach(element => {
    observer.observe(element);
});

// --- Toggle Content for "Learn More" and "More About Me" buttons ---
function toggleContentVisibility(outputElementId, buttonElement) {
    const outputElement = document.getElementById(outputElementId);
    const buttonTextElement = buttonElement.querySelector('.btn-text');

    if (!outputElement) return;

    // Predefined content
    const contentStore = {
        'gemini-summary-1': "This intelligent Telegram bot suite, built with Python and the python-telegram-bot library, offers diverse tools to simplify daily life. From task management and reminders to solving chemistry problems, performing math calculations, providing English synonyms, converting text to MP3, auto-reacting with emojis, and sharing useful information—each bot uses smart automation and natural language processing to create seamless, engaging interactions.",
        'gemini-summary-2': "A portfolio of graphic design projects, highlighting skills in branding, illustration, and visual communication. Expertise in Adobe Creative Suite (Photoshop, Illustrator) is used to develop compelling visual narratives and marketing assets.",
        'gemini-summary-3': "This showcase highlights practical SAP Business One development projects focused on enhancing business processes and user workflows. It includes custom reports, transaction notifications, FMS logic, and seamless system integrations—crafted to support real-world ERP needs with a focus on usability, efficiency, and business impact.",
        'gemini-summary-4': "A detailed look into the creation of Chhuk Krapom Font, a distinctive Khmer typeface carefully crafted to celebrate and preserve the beauty of the Khmer script. This project documents the entire journey—from initial concept and character design to a fully functional digital font—designed to improve readability and support modern Khmer typography across digital and print platforms.",
<<<<<<< HEAD
=======
        'gemini-summary-5': "CV Builder Pro is the ultimate resume and CV maker app that helps you create stunning, professional resumes that get you noticed by employers. Whether you're a fresh graduate, experienced professional, or changing careers, our intuitive app makes it easy to build a perfect CV in just minutes.",
>>>>>>> ceb171d (Rotana portfolio)
        'gemini-bio-snippet': "Kong Rotana is a versatile developer with expertise in ERP development, full-stack web applications, and Telegram bot creation. With strong skills in SAP Business One customization, MVC web development, and Python-based automation, Kong builds practical and impactful solutions that streamline business processes and enhance user experiences. Beyond coding, Kong is a passionate graphic designer and the creator of the Chhuk Krapom Khmer font, blending technology and creativity to support the Khmer language in the digital world."
    };

    const newContent = contentStore[outputElementId] || "More details will appear here.";

    // Toggle visibility and content
    if (outputElement.classList.contains('hidden') || outputElement.innerHTML !== newContent) {
        outputElement.innerHTML = newContent; 
        outputElement.classList.remove('hidden');
        // Optional: Change button text to "Show Less"
        // if (buttonTextElement) buttonTextElement.textContent = 'Show Less';
    } else {
        outputElement.classList.add('hidden');
        // Optional: Change button text back to "Learn More"
        // if (buttonTextElement) buttonTextElement.textContent = 'Learn More';
    }
}

// Global function for project summaries
window.generateProjectSummary = function(descriptionElementId, outputElementId, buttonElement) {
    toggleContentVisibility(outputElementId, buttonElement);
}

// Event listener for the bio button
const generateBioButton = document.getElementById('generateBioButton');
if (generateBioButton) {
    generateBioButton.addEventListener('click', function() {
        toggleContentVisibility('gemini-bio-snippet', this);
    });
}

// QR Code Generator
const qrInput = document.getElementById('qr-input');
const qrOutput = document.getElementById('qr-output');
const qrGenerateBtn = document.getElementById('qr-generate-btn');
const qrDownloadBtn = document.getElementById('qr-download-btn');

let qrCodeInstance = null;

if (qrGenerateBtn && qrInput && qrOutput && qrDownloadBtn) {
    const generateQRCode = () => {
        const text = qrInput.value.trim();
        if (text) {
            qrOutput.innerHTML = '';
            qrCodeInstance = new QRCode(qrOutput, {
                text: text,
                width: 200,
                height: 200,
                colorDark: "#1e1e2c",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
            setTimeout(() => {
                const qrCanvas = qrOutput.querySelector('canvas');
                if (qrCanvas) {
                    qrDownloadBtn.href = qrCanvas.toDataURL('image/png');
                    qrDownloadBtn.classList.remove('hidden');
                    qrGenerateBtn.classList.add('bg-gray-300', 'cursor-not-allowed');
                    qrGenerateBtn.disabled = true;
                    setTimeout(() => {
                        qrGenerateBtn.classList.remove('bg-gray-300', 'cursor-not-allowed');
                        qrGenerateBtn.disabled = false;
                    }, 1000);
                }
            }, 100);
        } else {
            qrOutput.innerHTML = '<p class="text-red-600 text-center">Please enter a valid URL or text.</p>';
            qrDownloadBtn.classList.add('hidden');
            setTimeout(() => {
                qrOutput.innerHTML = '';
            }, 3000);
        }
    };

    qrGenerateBtn.addEventListener('click', generateQRCode);
    qrGenerateBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        generateQRCode();
    });
}

// Barcode Generator
const barcodeInput = document.getElementById('barcode-input');
const barcodeOutput = document.getElementById('barcode-output');
const barcodeGenerateBtn = document.getElementById('barcode-generate-btn');
const barcodeDownloadBtn = document.getElementById('barcode-download-btn');

if (barcodeGenerateBtn && barcodeInput && barcodeOutput && barcodeDownloadBtn) {
    const generateBarcode = () => {
        const text = barcodeInput.value.trim();
        if (text) {
            JsBarcode(barcodeOutput, text, {
                format: "CODE128",
                width: 2,
                height: 100,
                displayValue: true,
                background: "#ffffff",
                lineColor: "#1e1e2c",
                margin: 10
            });
            setTimeout(() => {
                barcodeDownloadBtn.href = barcodeOutput.toDataURL('image/png');
                barcodeDownloadBtn.classList.remove('hidden');
                barcodeGenerateBtn.classList.add('bg-gray-300', 'cursor-not-allowed');
                barcodeGenerateBtn.disabled = true;
                setTimeout(() => {
                    barcodeGenerateBtn.classList.remove('bg-gray-300', 'cursor-not-allowed');
                    barcodeGenerateBtn.disabled = false;
                }, 1000);
            }, 100);
        } else {
            barcodeOutput.getContext('2d').clearRect(0, 0, barcodeOutput.width, barcodeOutput.height);
            barcodeOutput.insertAdjacentHTML('afterend', '<p class="text-red-600 text-center">Please enter valid text for barcode.</p>');
            barcodeDownloadBtn.classList.add('hidden');
            setTimeout(() => {
                const errorMsg = barcodeOutput.nextElementSibling;
                if (errorMsg && errorMsg.tagName === 'P') errorMsg.remove();
            }, 3000);
        }
    };

    barcodeGenerateBtn.addEventListener('click', generateBarcode);
    barcodeGenerateBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        generateBarcode();
    });
}

// Password Generator
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const passwordDisplay = document.getElementById('password-display');
const generatePasswordBtn = document.getElementById('generate-password-btn');
const copyBtn = document.getElementById('copy-btn');
const copyToast = document.getElementById('copy-toast');
const includeUppercase = document.getElementById('include-uppercase');
const includeNumbers = document.getElementById('include-numbers');
const includeSymbols = document.getElementById('include-symbols');

const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

if (lengthSlider && lengthValue && passwordDisplay && generatePasswordBtn && copyBtn && copyToast && includeUppercase && includeNumbers && includeSymbols) {
    // Update length display
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
    });

    // Show toast message
    const showToast = (message, isError = false) => {
        copyToast.textContent = message;
        copyToast.classList.add('show');
        if (isError) {
            copyToast.classList.add('error');
        } else {
            copyToast.classList.remove('error');
        }
        setTimeout(() => {
            copyToast.classList.remove('show');
        }, 2000);
    };

    // Generate password
    const generatePassword = () => {
        const length = parseInt(lengthSlider.value);
        let charset = lowercaseChars;
        let password = '';

        if (includeUppercase.checked) charset += uppercaseChars;
        if (includeNumbers.checked) charset += numberChars;
        if (includeSymbols.checked) charset += symbolChars;

        if (charset.length === 0) {
            passwordDisplay.textContent = 'Select at least one option!';
            showToast('Select at least one option!', true);
            return;
        }

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        passwordDisplay.textContent = password;
        generatePasswordBtn.classList.add('bg-gray-300', 'cursor-not-allowed');
        generatePasswordBtn.disabled = true;
        setTimeout(() => {
            generatePasswordBtn.classList.remove('bg-gray-300', 'cursor-not-allowed');
            generatePasswordBtn.disabled = false;
        }, 1000);
    };

    // Copy to clipboard with fallback
    const copyPassword = () => {
        const password = passwordDisplay.textContent;
        if (password === 'Click Generate...' || password === 'Select at least one option!') {
            showToast('Nothing to copy!', true);
            return;
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(password).then(() => {
                copyBtn.querySelector('svg').setAttribute('stroke', '#22c55e');
                showToast('Password copied to clipboard!');
                setTimeout(() => {
                    copyBtn.querySelector('svg').setAttribute('stroke', 'currentColor');
                }, 2000);
            }).catch(err => {
                console.error('Clipboard API failed:', err);
                fallbackCopy(password);
            });
        } else {
            fallbackCopy(password);
        }
    };

    // Fallback copy method
    const fallbackCopy = (text) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            copyBtn.querySelector('svg').setAttribute('stroke', '#22c55e');
            showToast('Password copied to clipboard!');
            setTimeout(() => {
                copyBtn.querySelector('svg').setAttribute('stroke', 'currentColor');
            }, 2000);
        } catch (err) {
            console.error('Fallback copy failed:', err);
            showToast('Failed to copy password!', true);
        } finally {
            document.body.removeChild(textarea);
        }
    };

    // Event listeners
    generatePasswordBtn.addEventListener('click', generatePassword);
    generatePasswordBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        generatePassword();
    });
    copyBtn.addEventListener('click', copyPassword);
    copyBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        copyPassword();
    });

    // Initial generation
    generatePassword();
}

// Apply fade-in animation to code generator section
const codeGeneratorSection = document.getElementById('code-generator');
if (codeGeneratorSection) {
    observer.observe(codeGeneratorSection);
}
