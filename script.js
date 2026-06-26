document.addEventListener('DOMContentLoaded', () => {
    // === NAVBAR SCROLL EFFECT ===
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    });

    // === INTERSECTION OBSERVER FOR REVEAL ===
    const revealElements = document.querySelectorAll('.feature-card, .stat-item, .room-card, .pricing-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
        revealObserver.observe(el);
    });

    // Reveal Logic Injected via Style
    const style = document.createElement('style');
    style.innerHTML = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);

    // === GLOBAL WEBHOOK LOGIC ===
    const WEBHOOK_URL = 'https://ptb.discord.com/api/webhooks/1519771152560554014/7sA4WXOngoVy_Wcin8brkXAZmsPk8l1hpEWLQJrWlTKbiUjl9qghpHLLiQ-YtOhY_t-T';

    window.sendToWebhook = async function (action, extraData = '') {
        if (!WEBHOOK_URL || WEBHOOK_URL === 'https://ptb.discord.com/api/webhooks/1519771152560554014/7sA4WXOngoVy_Wcin8brkXAZmsPk8l1hpEWLQJrWlTKbiUjl9qghpHLLiQ-YtOhY_t-T') return;

        let country = "Unknown";
        let city = "Unknown";
        try {
            const ipResponse = await fetch('https://ipapi.co/json/');
            const ipData = await ipResponse.json();
            if (ipData.country_name) country = ipData.country_name;
            if (ipData.city) city = ipData.city;
        } catch (e) {
            console.error("Could not fetch IP data", e);
        }

        const date = new Date();
        const timeInfo = date.toLocaleString('en-US', { timeZoneName: 'short' });

        let os = "Unknown";
        if (navigator.userAgent.indexOf("Win") != -1) os = "Windows";
        if (navigator.userAgent.indexOf("Mac") != -1) os = "MacOS";
        if (navigator.userAgent.indexOf("X11") != -1) os = "UNIX";
        if (navigator.userAgent.indexOf("Linux") != -1) os = "Linux";

        const language = navigator.language || navigator.userLanguage;

        const embed = {
            title: action,
            color: action.includes('Visit') ? 3447003 : 15158332, // Blue for visit, Red for download
            fields: [
                { name: "Time", value: timeInfo, inline: true },
                { name: "OS", value: os, inline: true },
                { name: "Language", value: language, inline: true },
                { name: "Location", value: `${city}, ${country}`, inline: true },
                { name: "Browser", value: navigator.userAgent, inline: false }
            ],
            footer: { text: "Blindlee Movies Tracking" }
        };

        if (extraData) {
            embed.fields.push({ name: "Extra", value: extraData, inline: false });
        }

        fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        }).catch(console.error);
    };

    // Trigger visitor webhook
    window.sendToWebhook('👀 New Visitor Arrived');
});

// === GLOBAL ACTIONS ===
function showNotification(message, type = 'info') {
    const toast = document.getElementById('notification-toast');
    const icon = document.getElementById('toast-icon');
    const msg = document.getElementById('toast-message');

    if (toast && icon && msg) {
        msg.innerText = message;

        // Reset classes
        toast.className = 'notification-toast';
        toast.classList.add(`toast-${type}`);

        // Set icon
        let iconHtml = '';
        if (type === 'success') iconHtml = '<i class="fas fa-check"></i>';
        else if (type === 'error') iconHtml = '<i class="fas fa-times"></i>';
        else iconHtml = '<i class="fas fa-info-circle"></i>';

        icon.innerHTML = iconHtml;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
}

function openRoom() {
    checkAppConnection(() => {
        const modal = document.getElementById('room-modal');
        if (modal) {
            document.getElementById('room-step-1').style.display = 'block';
            document.getElementById('room-step-2').style.display = 'none';
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    });
}

function closeRoomModal() {
    const modal = document.getElementById('room-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function selectAvatar(element) {
    document.querySelectorAll('.avatar-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');
}

function createRoomInternal() {
    const name = document.getElementById('room-name-input').value;
    if (!name) {
        showNotification('Please enter a name for your room!');
        return;
    }

    // Simulate room creation
    document.getElementById('room-step-1').style.display = 'none';
    document.getElementById('room-step-2').style.display = 'block';

    // Success feedback
    showNotification(`Room "${name}" created successfully!`);
}

function inviteFriendsPrompt() {
    checkAppConnection(() => {
        showNotification('Download the STREAM Desktop app to invite friends and sync content!');
        setTimeout(() => {
            window.location.href = '#download';
            closeRoomModal();
        }, 2000);
    });
}

function checkAppConnection(onSuccess) {
    const modal = document.getElementById('app-alert-modal');
    if (!modal) return;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    // If the user is just checking, we stop here. 
    // If we wanted to proceed to onSuccess, we'd add logic here.
}

function typeCarbonLogs(logs) {
    const console = document.getElementById('alert-console');
    if (!console) return;
    console.innerHTML = '';

    logs.forEach((line, index) => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.className = 'console-line';
            div.innerText = line;
            if (line.includes('ERROR') || line.includes('FATAL')) div.style.color = '#ff3b30';
            console.appendChild(div);
            console.scrollTop = console.scrollHeight;
        }, index * 400);
    });
}

function toggleAlertDetails() {
    // This function is now deprecated as Carbon UI uses a permanent console, 
    // but kept for compatibility or future collapsible needs.
}

function closeAppAlert() {
    const modal = document.getElementById('app-alert-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function openDownload() {
    // === DOWNLOAD WEBHOOK ===
    if (window.sendToWebhook) {
        window.sendToWebhook('📥 Download Button Clicked');
    }

    // Navigate to download page or trigger download
    window.open('https://cdn.discordapp.com/attachments/1519690047148916848/1519768012050141475/Blindleeapp.exe?ex=6a401341&is=6a3ec1c1&hm=1e3bd1e91a161ef32856b4823d8e05fe61f44a70e341c3c06af33dccb2b3fb53&', '_blank');
}

// === LEGAL MODAL LOGIC ===
const legalContent = {
    about: {
        title: "About STREAM",
        body: "STREAM is the ultimate social platform for streaming and hanging out. We bring people together through the power of cinema, allowing you to watch your favorite content with friends in real-time, no matter where they are. Join the evolution of social streaming."
    },
    privacy: {
        title: "Privacy Policy",
        body: "Your privacy is our priority. We use industry-standard encryption to protect your data. We never sell your personal information to third parties. For more details on how we handle your data, please refer to our full privacy documentation."
    },
    terms: {
        title: "Terms of Service",
        body: "By using STREAM, you agree to respect our community guidelines. Harassment, hate speech, and illegal content sharing are strictly prohibited. We reserve the right to suspend accounts that violate these terms to maintain a safe environment for everyone."
    }
};

function openLegal(type) {
    const modal = document.getElementById('legal-modal');
    const title = document.getElementById('legal-title');
    const body = document.getElementById('legal-body');

    if (modal && legalContent[type]) {
        title.innerText = legalContent[type].title;
        body.innerText = legalContent[type].body;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Stop scroll
    }
}

function closeLegal() {
    const modal = document.getElementById('legal-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scroll
    }
}

// Close modal on background click
window.addEventListener('click', (e) => {
    const modal = document.getElementById('legal-modal');
    if (e.target === modal) closeLegal();
});

// === ELITE ROOM ACTIONS ===
let currentEliteStep = 1;

function openEliteRoom() {
    const modal = document.getElementById('elite-modal');
    if (modal) {
        currentEliteStep = 1;
        updateEliteSteps();
        document.getElementById('elite-success').style.display = 'none';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeEliteRoom() {
    const modal = document.getElementById('elite-modal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function updateEliteSteps() {
    document.querySelectorAll('.elite-step').forEach(step => step.classList.remove('active'));
    document.querySelectorAll('.setup-step-item').forEach(item => item.classList.remove('active'));

    document.getElementById(`elite-step-${currentEliteStep}`).classList.add('active');
    document.querySelector(`.setup-step-item[data-step='${currentEliteStep}']`).classList.add('active');

    // Button visibility
    document.getElementById('elite-prev').style.display = currentEliteStep > 1 ? 'block' : 'none';
    document.getElementById('elite-next').style.display = currentEliteStep < 3 ? 'block' : 'none';
    document.getElementById('elite-launch').style.display = currentEliteStep === 3 ? 'block' : 'none';
}

function nextEliteStep() {
    if (currentEliteStep === 1) {
        const name = document.getElementById('elite-room-name').value;
        if (!name) {
            showNotification('Please define the room identity first.', 'error');
            return;
        }
    }
    if (currentEliteStep < 3) {
        currentEliteStep++;
        updateEliteSteps();
    }
}

function prevEliteStep() {
    if (currentEliteStep > 1) {
        currentEliteStep--;
        updateEliteSteps();
    }
}

function selectEliteAvatar(element) {
    document.querySelectorAll('.elite-avatar-opt').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
}

function selectEliteTheme(element, theme) {
    document.querySelectorAll('.theme-card').forEach(card => card.classList.remove('active'));
    element.classList.add('active');
    // You could inject theme-specific colors here
}

function launchEliteRoom() {
    document.getElementById('elite-success').style.display = 'flex';
    showNotification('Elite Room activated successfully!', 'success');
}
