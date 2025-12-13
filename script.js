// Navigasi antar screen
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

// Tampilkan notifikasi
function showNotification(message) {
  const notification = document.getElementById('notification');
  const notificationText = document.getElementById('notificationText');
  
  notificationText.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2500);
}

// KEY YANG VALID (default jika keys.json tidak ada)
let VALID_KEYS = ['KUTO123', 'SAIFREE2024', 'TESTKEY'];

// Load keys dari file
async function loadKeys() {
  try {
    const response = await fetch('keys.json');
    const data = await response.json();
    if (data.valid_keys) {
      VALID_KEYS = data.valid_keys.map(key => key.toString().toUpperCase());
    }
  } catch (e) {
    // Tetap pakai default keys
    console.log('Using default keys');
  }
}

// Check Login
async function checkLogin() {
  const keyInput = document.getElementById('loginKey');
  const key = keyInput.value.trim().toUpperCase();
  const keyStatus = document.getElementById('keyStatus');
  
  if (!key) {
    showNotification('Please enter access key');
    return;
  }
  
  // Cek key
  if (VALID_KEYS.includes(key)) {
    // ✅ Key valid
    keyStatus.innerHTML = '<i class="fas fa-check" style="color:#00ff88"></i>';
    showNotification('✅ Access granted!');
    
    // Simpan session
    localStorage.setItem('saiSession', 'active_forever');
    localStorage.setItem('loginKey', key);
    
    // Redirect ke main screen
    setTimeout(() => showScreen('mainScreen'), 800);
  } else {
    // ❌ Key invalid
    keyStatus.innerHTML = '<i class="fas fa-times" style="color:#ff0058"></i>';
    showNotification('Invalid key. Try: KUTO123');
    keyInput.value = '';
    keyInput.focus();
  }
}

// Check session
function checkSession() {
  if (localStorage.getItem('saiSession') === 'active_forever') {
    showScreen('mainScreen');
    return true;
  }
  showScreen('loginScreen');
  return false;
}

// Clear session
function clearSession() {
  localStorage.clear();
  showScreen('loginScreen');
  showNotification('Logged out');
}

// Logout
function logoutUser() {
  if (confirm('Logout?')) clearSession();
}

// Typewriter effect
function typeWithBlur(elementId, text, speed, callback) {
  const element = document.getElementById(elementId);
  const textElement = document.getElementById(`text${elementId.replace('line', '')}`);
  let i = 0;
  
  if (!element || !textElement) return;
  
  textElement.textContent = '';
  element.classList.remove('active');
  element.style.filter = 'blur(5px)';
  element.style.opacity = '0.8';
  element.style.transform = 'translateY(20px)';
  
  setTimeout(() => {
    element.classList.add('active');
    element.style.filter = 'blur(0)';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    
    function type() {
      if (i < text.length) {
        textElement.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else if (callback) callback();
    }
    type();
  }, 300);
}

// Start Saii
function startSaii() {
  if (!checkSession()) {
    showNotification('Please login');
    return;
  }
  
  showScreen('saiiScreen');
  
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.querySelector('.progress-percent');
  const progressLabel = document.querySelector('.progress-label span');
  
  if (progressBar) progressBar.style.width = '0%';
  if (progressPercent) progressPercent.textContent = '0%';
  if (progressLabel) progressLabel.textContent = 'Initializing...';
  
  const sequences = [
    { lineId: 'line2', text: 'Checking system...', delay: 500, typingSpeed: 40, progress: 20 },
    { lineId: 'line3', text: 'Preparing Free Fire...', delay: 1500, typingSpeed: 40, progress: 50 },
    { lineId: 'line4', text: 'Bypassing security...', delay: 2500, typingSpeed: 40, progress: 75 },
    { lineId: 'line5', text: 'Launching Free Fire...', delay: 3500, typingSpeed: 50, progress: 100 }
  ];
  
  sequences.forEach((seq, index) => {
    setTimeout(() => {
      typeWithBlur(seq.lineId, seq.text, seq.typingSpeed, () => {
        if (progressBar) progressBar.style.width = seq.progress + '%';
        if (progressPercent) progressPercent.textContent = seq.progress + '%';
        
        if (progressLabel) {
          if (seq.progress === 20) progressLabel.textContent = 'Checking...';
          if (seq.progress === 50) progressLabel.textContent = 'Preparing...';
          if (seq.progress === 75) progressLabel.textContent = 'Bypassing...';
          if (seq.progress === 100) progressLabel.textContent = 'Launching...';
        }
        
        if (seq.progress === 100) {
          setTimeout(() => launchFreeFire(), 800);
        }
      });
    }, seq.delay);
  });
}

// Deteksi iOS
function isIOSDevice() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isIPad = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return isIOS || isIPad;
}

// Launch Free Fire
function launchFreeFire() {
  if (!isIOSDevice()) {
    showNotification('⚠️ iOS device required');
    setTimeout(() => showScreen('mainScreen'), 1500);
    return;
  }
  
  // Cek fitur
  const aimAssist = document.getElementById('aim')?.checked || false;
  const antiBan = document.getElementById('antiban')?.checked || false;
  
  const settings = {
    aimAssist: aimAssist,
    antiBan: antiBan,
    timestamp: Date.now()
  };
  
  localStorage.setItem('ffSettings', JSON.stringify(settings));
  
  if (aimAssist || antiBan) {
    showNotification('Launching Free Fire with features');
  } else {
    showNotification('Launching Free Fire...');
  }
  
  // Launch methods
  setTimeout(() => {
    try {
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;border:none;';
      iframe.src = 'https://freefiremobile.com/game';
      document.body.appendChild(iframe);
      setTimeout(() => {
        if (iframe.parentNode) document.body.removeChild(iframe);
      }, 150);
    } catch(e) {}
  }, 200);
  
  setTimeout(() => {
    try { window.location.href = 'freefiremax://'; } catch(e) {}
  }, 400);
  
  setTimeout(() => {
    try { window.location.href = 'freefire://'; } catch(e) {}
  }, 600);
  
  // Kembali ke main screen
  setTimeout(() => {
    if (progressBar) progressBar.style.width = '100%';
    if (progressPercent) progressPercent.textContent = '100%';
    setTimeout(() => {
      showScreen('mainScreen');
      showNotification('✅ Free Fire launched');
    }, 1000);
  }, 2000);
}

// PWA Installation
let deferredPrompt;
const installPrompt = document.getElementById('installPrompt');
const installBtn = document.getElementById('installBtn');
const closeInstall = document.getElementById('closeInstall');

function showInstallPrompt() {
  if (!window.matchMedia('(display-mode: standalone)').matches && deferredPrompt) {
    installPrompt.classList.remove('hidden');
  }
}

function hideInstallPrompt() {
  installPrompt.classList.add('hidden');
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', async () => {
  // Load keys dulu
  await loadKeys();
  
  // Check session
  checkSession();
  
  // Setup login
  const loginInput = document.getElementById('loginKey');
  const loginBtn = document.querySelector('.login-btn');
  
  if (loginInput) {
    loginInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkLogin();
    });
    setTimeout(() => loginInput.focus(), 500);
  }
  
  if (loginBtn) {
    loginBtn.addEventListener('click', checkLogin);
  }
  
  // PWA
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    setTimeout(() => showInstallPrompt(), 3000);
  });
  
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') showNotification('✅ SaiKuto installed');
      deferredPrompt = null;
      hideInstallPrompt();
    });
  }
  
  if (closeInstall) {
    closeInstall.addEventListener('click', hideInstallPrompt);
  }
  
  // Load settings
  const savedSettings = localStorage.getItem('ffSettings');
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings);
      const toggles = ['aim', 'antiban', 'kernel', 'tweak', 'performance', 'reduceping', 'highfps', 'bloom', 'antialiasing', 'touch', 'autofire', 'threedtouch', 'lowpowermode', 'dndmode', 'autolock', 'reducemotion', 'wifipriority', 'backgroundrefresh'];
      toggles.forEach(id => {
        const toggle = document.getElementById(id);
        if (toggle && settings[id] !== undefined) toggle.checked = settings[id];
      });
    } catch(e) {}
  }
  
  // Setup Saii button
  const saiiBtn = document.querySelector('.saii-btn');
  if (saiiBtn) {
    saiiBtn.addEventListener('click', (e) => {
      e.preventDefault();
      startSaii();
    });
  }
  
  // Setup toggles
  document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', function() {
      const saved = localStorage.getItem('ffSettings');
      let settings = saved ? JSON.parse(saved) : {};
      settings[this.id] = this.checked;
      localStorage.setItem('ffSettings', JSON.stringify(settings));
    });
  });
});

// Override alerts
window.alert = function(msg) {
  showNotification(msg);
  return undefined;
};

window.confirm = function(msg) {
  return true;
};

window.prompt = function(msg) {
  return '';
};

window.onerror = function() {
  return true;
};
