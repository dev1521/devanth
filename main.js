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
            // === BACKEND INTEGRATION ===
            // Dynamically target localhost:5000 if opened from file:// or other local development servers
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const isPort5000 = window.location.port === '5000';
            const API_URL = (window.location.protocol === 'file:' || (isLocal && !isPort5000))
                ? 'http://localhost:5000/api/contact'
                : '/api/contact';
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            let data = null;
            try {
                data = await response.json();
            } catch (parseErr) {
                data = null;
            }

            if (response.ok && data && data.success) {
                showToast(data.message || "Mail sent to Devanth Saravanan.", "success");
                // Reset form
                nameInput.value = '';
                emailInput.value = '';
                messageInput.value = '';
            } else {
                const errorMsg = (data && data.message)
                    ? data.message
                    : `Unable to send message (Status: ${response.status}). Please try again.`;
                showToast(errorMsg, "error");
                console.error("Contact Form Server Error:", data || `HTTP ${response.status}`);
            }
        } catch (error) {
            console.error("Contact Form Network Error:", error.message || error);
            showToast("Network error: Unable to reach contact server. Please ensure backend is running.", "error");
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

