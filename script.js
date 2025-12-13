// SaiKuto v10.1 - Fixed Key System
console.log('🚀 SaiKuto v10.1 Initializing...');

// Global variable for keys
let VALID_KEYS = ['KUTO123', 'SAIFREE', 'TESTKEY'];

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

// Load keys dari file dengan debugging
async function loadKeys() {
  try {
    console.log('🔑 Loading keys from keys.json...');
    
    // Force no-cache dengan timestamp
    const response = await fetch('keys.json?v=' + Date.now());
    
    if (!response.ok) {
      throw new Error('HTTP ' + response.status);
    }
    
    const data = await response.json();
    console.log('✅ Keys loaded successfully:', data);
    
    if (data.valid_keys && Array.isArray(data.valid_keys)) {
      // Convert semua keys ke uppercase dan trim
      VALID_KEYS = data.valid_keys.map(key => {
        return key.toString().toUpperCase().trim();
      });
      
      console.log('📋 Valid keys set to:', VALID_KEYS);
      console.log('🔢 Total keys available:', VALID_KEYS.length);
      
      // Tampilkan di console untuk debugging
      console.log('=== AVAILABLE KEYS ===');
      VALID_KEYS.forEach((key, index) => {
        console.log(`${index + 1}. ${key}`);
      });
      
    } else {
      console.warn('⚠️ Invalid keys.json format, using default keys');
    }
  } catch (error) {
    console.error('❌ Failed to load keys.json:', error);
    console.log('ℹ️ Using default keys:', VALID_KEYS);
    showNotification('Using default keys - ' + VALID_KEYS.length + ' available');
  }
}

// Check Login dengan debugging lengkap
async function checkLogin() {
  const keyInput = document.getElementById('loginKey');
  const key = keyInput.value.trim().toUpperCase();
  const keyStatus = document.getElementById('keyStatus');
  
  console.log('=== LOGIN ATTEMPT ===');
  console.log('Input key:', key);
  console.log('Valid keys:', VALID_KEYS);
  
  if (!key) {
    showNotification('❌ Please enter access key');
    return;
  }
  
  // Debug: Check exact match
  const isExactMatch = VALID_KEYS.includes(key);
  console.log('Exact match?', isExactMatch);
  
  // Debug: Check partial matches
  const partialMatches = VALID_KEYS.filter(k => k.includes(key) || key.includes(k));
  console.log('Partial matches:', partialMatches);
  
  if (isExactMatch) {
    // ✅ Key valid
    console.log('✅ Access granted for key:', key);
    keyStatus.innerHTML = '<i class="fas fa-check" style="color:#00ff88"></i>';
    showNotification('✅ Access granted! Welcome to SaiKuto');
    
    // Simpan session
    localStorage.setItem('saiSession', 'active_forever');
    localStorage.setItem('loginKey', key);
    localStorage.setItem('keyUsed', key);
    
    // Clear input
    keyInput.value = '';
    
    // Redirect ke main screen
    setTimeout(() => {
      showScreen('mainScreen');
      showNotification('🎮 Lifetime access activated');
    }, 800);
    
  } else {
    // ❌ Key invalid
    console.log('❌ Invalid key:', key);
    keyStatus.innerHTML = '<i class="fas fa-times" style="color:#ff0058"></i>';
    
    // Suggest similar keys
    const suggestions = VALID_KEYS.filter(k => 
      k.startsWith(key.substring(0, 3)) || 
      key.startsWith(k.substring(0, 3))
    ).slice(0, 3);
    
    let message = '❌ Invalid access key';
    if (suggestions.length > 0) {
      message += '\nTry: ' + suggestions.join(', ');
    }
    
    showNotification(message);
    
    // Shake animation
    keyInput.style.animation = 'shake 0.5s';
    setTimeout(() => {
      keyInput.style.animation = '';
      keyInput.focus();
      keyInput.select();
    }, 500);
  }
}

// Check session
function checkSession() {
  const session = localStorage.getItem('saiSession');
  const savedKey = localStorage.getItem('loginKey');
  
  console.log('🔍 Checking session...');
  console.log('Session:', session);
  console.log('Saved key:', savedKey);
  
  if (session === 'active_forever') {
    console.log('✅ Session valid, showing main screen');
    showScreen('mainScreen');
    return true;
  }
  
  console.log('❌ No valid session, showing login');
  showScreen('loginScreen');
  return false;
}

// Clear session
function clearSession() {
  localStorage.clear();
  showScreen('loginScreen');
  showNotification('🗑️ Session cleared');
  console.log('🗑️ All sessions cleared');
}

// Logout
function logoutUser() {
  if (confirm('Logout from SaiKuto?')) {
    clearSession();
  }
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
    showNotification('🔒 Please login first');
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
    { lineId: 'line2', text: 'Checking system integrity...', delay: 500, typingSpeed: 40, progress: 20 },
    { lineId: 'line3', text: 'Preparing Free Fire environment...', delay: 1500, typingSpeed: 40, progress: 50 },
    { lineId: 'line4', text: 'Bypassing security protocols...', delay: 2500, typingSpeed: 40, progress: 75 },
    { lineId: 'line5', text: 'Launching Free Fire with optimizations...', delay: 3500, typingSpeed: 50, progress: 100 }
  ];
  
  sequences.forEach((seq, index) => {
    setTimeout(() => {
      typeWithBlur(seq.lineId, seq.text, seq.typingSpeed, () => {
        if (progressBar) progressBar.style.width = seq.progress + '%';
        if (progressPercent) progressPercent.textContent = seq.progress + '%';
        
        if (progressLabel) {
          if (seq.progress === 20) progressLabel.textContent = 'System check...';
          if (seq.progress === 50) progressLabel.textContent = 'Preparing...';
          if (seq.progress === 75) progressLabel.textContent = 'Security bypass...';
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
    showNotification('⚠️ iOS device required for direct launch');
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
    showNotification('🚀 Launching Free Fire with enabled features');
  } else {
    showNotification('🚀 Launching Free Fire...');
  }
  
  // Try multiple launch methods
  setTimeout(() => {
    try {
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;border:none;';
      iframe.src = 'https://freefiremobile.com/game';
      document.body.appendChild(iframe);
      setTimeout(() => {
        if (iframe.parentNode) document.body.removeChild(iframe);
      }, 150);
    } catch(e) {
      console.log('Iframe method failed');
    }
  }, 200);
  
  setTimeout(() => {
    try { 
      window.location.href = 'freefiremax://'; 
      console.log('Attempted freefiremax://');
    } catch(e) {
      console.log('freefiremax:// failed');
    }
  }, 400);
  
  setTimeout(() => {
    try { 
      window.location.href = 'freefire://'; 
      console.log('Attempted freefire://');
    } catch(e) {
      console.log('freefire:// failed');
    }
  }, 600);
  
  // Kembali ke main screen
  setTimeout(() => {
    if (progressBar) progressBar.style.width = '100%';
    if (progressPercent) progressPercent.textContent = '100%';
    setTimeout(() => {
      showScreen('mainScreen');
      showNotification('✅ Free Fire launched successfully!');
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
  console.log('📱 DOM loaded, initializing SaiKuto...');
  
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
    
    loginInput.addEventListener('input', () => {
      const keyStatus = document.getElementById('keyStatus');
      if (loginInput.value.trim().length > 0) {
        keyStatus.innerHTML = '<i class="fas fa-lock-open" style="color:#ff7a00"></i>';
      } else {
        keyStatus.innerHTML = '<i class="fas fa-lock"></i>';
      }
    });
    
    setTimeout(() => {
      loginInput.focus();
      console.log('🎯 Login input focused');
    }, 500);
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
      if (outcome === 'accepted') showNotification('✅ SaiKuto installed as PWA');
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
    } catch(e) {
      console.log('Error loading settings:', e);
    }
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
      console.log('Toggle changed:', this.id, this.checked);
    });
  });
  
  // Show welcome message
  setTimeout(() => {
    console.log('🎉 SaiKuto v10.1 ready!');
    console.log('🔑 Available keys:', VALID_KEYS.length);
  }, 1000);
});

// Override alerts
window.alert = function(msg) {
  showNotification(msg);
  return undefined;
};

window.confirm = function(msg) {
  showNotification(msg + ' (Press OK)');
  return true;
};

window.prompt = function(msg) {
  showNotification(msg);
  return '';
};

// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
`;
document.head.appendChild(style);
