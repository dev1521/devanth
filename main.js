const iconToggle = document.querySelector('.toggle_icon');
const navbarMenu = document.querySelector('.menu');
const menuLinks = document.querySelectorAll('.menu_link');
const iconClose = document.querySelector('.close_icon');

if (iconToggle && navbarMenu) {
    iconToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
    });
}

if (iconClose && navbarMenu) {
    iconClose.addEventListener('click', () => {
        navbarMenu.classList.remove('active');
    });
}

if (menuLinks && navbarMenu) {
    menuLinks.forEach((menuLink) => {
        menuLink.addEventListener('click', () => {
            navbarMenu.classList.remove('active');
            if (!menuLink.classList.contains('replay-nav-link')) {
                menuLinks.forEach(link => link.classList.remove('active-link'));
                menuLink.classList.add('active-link');
            }
        });
    });
}

// Change background header
function scrollHeader() {
    const header = document.getElementById('header');
    if (header) {
        window.scrollY >= 20 ? header.classList.add('active') : header.classList.remove('active');
    }
}

window.addEventListener('scroll', scrollHeader);

// Active link scrollspy
const sections = document.querySelectorAll('section[id]');
function scrollActive() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 140;
        const sectionId = current.getAttribute('id');
        const link = document.querySelector(`.menu a[href*='${sectionId}']`);
        if (link && !link.classList.contains('replay-nav-link')) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                menuLinks.forEach(l => l.classList.remove('active-link'));
                link.classList.add('active-link');
            }
        }
    });
}

window.addEventListener('scroll', scrollActive);

/* HERO TECH SCRAMBLE DECODER EFFECT */

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________0101XYZ';
        this.update = this.update.bind(this);
        this.currentText = (el.textContent || '').trim();
    }

    setText(newText) {
        const oldText = this.currentText || (this.el.textContent || '').trim();
        this.currentText = newText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 15);
            const end = start + Math.floor(Math.random() * 20) + 12;
            this.queue.push({ from, to, start, end, char: '' });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble_dud">${char}</span>`;
            } else {
                output += from;
            }
        }

        if (complete === this.queue.length) {
            this.el.textContent = this.currentText;
            this.resolve();
        } else {
            this.el.innerHTML = output;
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

const initScramble = () => {
    const scrambleEl = document.querySelector('.scramble_text');
    if (!scrambleEl) return;

    let phrases = [
        'A Software Engineer...',
        'A Developer...',
        'A Designer...',
        'A Freelancer...'
    ];

    const dataItems = scrambleEl.getAttribute('data-typed-items');
    if (dataItems) {
        const parsed = dataItems.split(',').map(s => s.trim()).filter(s => s.length > 0);
        if (parsed.length > 0) phrases = parsed;
    }

    const fx = new TextScramble(scrambleEl);
    let counter = 0;

    const next = () => {
        fx.setText(phrases[counter]).then(() => {
            setTimeout(next, 1800);
        });
        counter = (counter + 1) % phrases.length;
    };

    // Initial delay before starting first scramble cycle
    setTimeout(next, 1800);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScramble);
} else {
    initScramble();
}

/* TOAST NOTIFICATION LOGIC */
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? 'checkmark-circle' : 'alert-circle';

    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon"><ion-icon name="${icon}"></ion-icon></div>
            <span class="toast-message">${message}</span>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 50);

    // Auto remove after 4.5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 600); // Wait for shrink animation
        }
    }, 4500);
}

/* CONTACT FORM LOGIC */
const contactBtn = document.getElementById('contact-submit');
const contactBtnText = document.getElementById('contact-btn-text');
const nameInput = document.getElementById('contact-name');
const emailInput = document.getElementById('contact-email');
const messageInput = document.getElementById('contact-message');

let isSending = false;

// Remove red error highlight as soon as the user types
[nameInput, emailInput, messageInput].forEach(field => {
    if (field) {
        field.addEventListener('input', () => {
            field.classList.remove('input-error');
        });
    }
});

if (contactBtn) {
    contactBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Prevent duplicate submissions
        if (isSending) return; 

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // Clear any previous error styling
        nameInput.classList.remove('input-error');
        emailInput.classList.remove('input-error');
        messageInput.classList.remove('input-error');

        // Detailed field-specific validation with alerts
        if (!name) {
            nameInput.classList.add('input-error');
            nameInput.focus();
            showToast("Please enter your name.", "error");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            emailInput.classList.add('input-error');
            emailInput.focus();
            showToast("Please enter your email address.", "error");
            return;
        }

        if (!emailRegex.test(email)) {
            emailInput.classList.add('input-error');
            emailInput.focus();
            showToast("Invalid email ID. Please enter a valid email address (e.g. name@gmail.com).", "error");
            return;
        }

        if (!message) {
            messageInput.classList.add('input-error');
            messageInput.focus();
            showToast("Please enter your message.", "error");
            return;
        }

        // Sending state
        isSending = true;
        const originalText = contactBtnText.textContent;
        contactBtnText.textContent = "Sending...";
        contactBtn.style.opacity = "0.7";

        try {
            // === RESILIENT BACKEND INTEGRATION & FALLBACK RESOLVER ===
            const protocol = window.location.protocol;
            const hostname = window.location.hostname || '';
            const port = window.location.port || '';

            const isLoopback = /^(localhost|127\.0\.0\.1|\[::1\]|0\.0\.0\.0)$/i.test(hostname);
            const isLan = /^192\.168\.\d+\.\d+$/.test(hostname) ||
                          /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
                          /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(hostname) ||
                          hostname.endsWith('.local');
            const isLocal = protocol === 'file:' || isLoopback || isLan;

            const candidateEndpoints = [];

            // 1. Explicit global configuration if defined
            if (window.BACKEND_API) {
                candidateEndpoints.push(window.BACKEND_API);
            }

            // 2. Local dev vs production candidate priorities
            if (port === '5000') {
                // Running directly on Express backend port
                candidateEndpoints.push('/api/contact');
                candidateEndpoints.push('http://localhost:5000/api/contact');
                candidateEndpoints.push('http://127.0.0.1:5000/api/contact');
            } else if (isLocal) {
                // Running via static dev server (e.g. Live Server :5500, :8080) or file://
                // Target the Express backend listening on port 5000 directly
                if (isLan && hostname) {
                    candidateEndpoints.push(`http://${hostname}:5000/api/contact`);
                }
                candidateEndpoints.push('http://localhost:5000/api/contact');
                candidateEndpoints.push('http://127.0.0.1:5000/api/contact');
            } else {
                // Production hosting (Netlify Functions, Vercel Serverless, custom domain)
                candidateEndpoints.push('/api/contact');
                candidateEndpoints.push('/.netlify/functions/contact');
            }

            // Universal high-reliability cloud fallback (handles GitHub Pages, Netlify, static hosts)
            candidateEndpoints.push('https://formsubmit.co/ajax/devanth017@gmail.com');

            const uniqueEndpoints = [...new Set(candidateEndpoints)];

            let delivered = false;
            let lastStatus = null;
            let lastErrorMsg = null;

            for (const endpoint of uniqueEndpoints) {
                try {
                    const isFormSubmit = endpoint.includes('formsubmit.co');
                    const payload = isFormSubmit ? {
                        name,
                        email,
                        _replyto: email,
                        _subject: `Portfolio Contact Form — ${name}`,
                        message
                    } : {
                        name,
                        email,
                        message
                    };

                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });

                    lastStatus = response.status;

                    // If endpoint returned 404 (endpoint not mapped on this server) or 502/503, try next candidate
                    if (response.status === 404 || response.status === 502 || response.status === 503) {
                        console.warn(`Contact endpoint ${endpoint} returned HTTP ${response.status}. Trying next fallback candidate...`);
                        continue;
                    }

                    let data = null;
                    try {
                        data = await response.json();
                    } catch (parseErr) {
                        data = null;
                    }

                    const isSuccess = response.ok && data && (data.success === true || data.success === 'true');

                    if (isSuccess) {
                        showToast(data.message || "Mail sent to Devanth Saravanan.", "success");
                        // Reset form
                        nameInput.value = '';
                        emailInput.value = '';
                        messageInput.value = '';
                        delivered = true;
                        break;
                    } else {
                        if (data && data.message) {
                            lastErrorMsg = data.message;
                        }
                        console.warn(`Endpoint ${endpoint} did not return success. Trying next fallback...`, data);
                        continue;
                    }
                } catch (netErr) {
                    // Endpoint unreachable or port not listening, attempt next candidate
                    console.warn(`Could not reach ${endpoint}:`, netErr.message || netErr);
                    continue;
                }
            }

            if (!delivered) {
                // Construct mailto link as zero-loss fallback
                const mailtoSubject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
                const mailtoBody = encodeURIComponent(`Hi Devanth,\n\n${message}\n\nFrom: ${name} (${email})`);
                const mailtoUrl = `mailto:devanth017@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

                showToast("Opening email client to send your message directly...", "info");
                setTimeout(() => {
                    window.location.href = mailtoUrl;
                }, 1000);
            }
        } catch (error) {
            console.error("Contact Form Unexpected Error:", error.message || error);
            showToast("Unable to send message. Please ensure the backend is running ('npm start').", "error");
        } finally {
            // Restore button state
            isSending = false;
            contactBtnText.textContent = originalText;
            contactBtn.style.opacity = "1";
        }
    });
}

/* ==========================================================================
   CINEMATIC INTRO INTEGRATION & REVEAL COORDINATOR
   ========================================================================== */

window.addEventListener('devanthIntroComplete', () => {
    const introEl = document.getElementById('devanth-intro');
    const portfolioEl = document.getElementById('portfolio');

    if (introEl) {
        introEl.classList.remove('intro-visible');
        introEl.classList.add('intro-hidden');
    }

    if (portfolioEl) {
        portfolioEl.classList.remove('portfolio-hidden');
        portfolioEl.classList.add('portfolio-visible');
    }

    document.body.classList.remove('intro-active');
    document.body.classList.add('intro-complete');

    // Refresh AOS animations once portfolio is visible
    setTimeout(() => {
        if (window.AOS) {
            window.AOS.refresh();
        }
    }, 400);
});

// Replay Intro trigger from portfolio navigation
const replayIntroLink = document.getElementById('replayIntroLink');
if (replayIntroLink) {
    replayIntroLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (navbarMenu) {
            navbarMenu.classList.remove('active');
        }
        if (typeof window.replayDevanthIntro === 'function') {
            window.replayDevanthIntro();
        }
    });
}

