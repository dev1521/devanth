const iconToggle = document.querySelector('.toggle_icon');
const navbarMenu = document.querySelector('.menu');
const menuLinks = document.querySelectorAll('.menulink');
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
        });
    });
}

// Change background header
function scrollHeader() {
    const header = document.getElementById('header');
    if (header) {
        this.scrollY >= 20 ? header.classList.add('active') : header.classList.remove('active');
    }
}

window.addEventListener('scroll', scrollHeader);

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

if (contactBtn) {
    contactBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        // Prevent duplicate submissions
        if (isSending) return; 

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // Basic validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!name || !email || !message || !emailRegex.test(email)) {
            showToast("Please fill in all required fields correctly. Make sure your email is valid.", "error");
            return;
        }

        // Sending state
        isSending = true;
        const originalText = contactBtnText.textContent;
        contactBtnText.textContent = "Sending...";
        contactBtn.style.opacity = "0.7";

        try {
            // === BACKEND INTEGRATION ===
            const API_URL = 'http://localhost:5000/api/contact';
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            if (response.ok) {
                // Parse the response to ensure success from backend
                const data = await response.json();
                if (data.success) {
                    showToast("Mail sent to Devanth Saravanan.", "success");
                    // Reset form
                    nameInput.value = '';
                    emailInput.value = '';
                    messageInput.value = '';
                } else {
                    throw new Error(data.message || "Backend failed to send");
                }
            } else {
                throw new Error(`HTTP Error: ${response.status}`);
            }
        } catch (error) {
            // Shows for backend errors, network errors, etc.
            showToast("Mail hasn't been sent. Please try again.", "error");
            console.error("Contact Form Error:", error.message || error);
        } finally {
            // Restore button state
            isSending = false;
            contactBtnText.textContent = originalText;
            contactBtn.style.opacity = "1";
        }
    });
}
