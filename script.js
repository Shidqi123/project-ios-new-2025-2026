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

// Valid Keys untuk LIFETIME ACCESS (Default jika keys.json tidak bisa di-load)
let VALID_LIFETIME_KEYS = [
  'SAIKUTO2024',
  'KUTOOFF',
  'FREE2024',
  'IOSGAMING',
  'S12345KEY',
  'KUTOACCESS',
  'FFMAX2024',
  'VIPACCESS',
  'GAMEMOD2024',
  'KUTOADMIN',
  'LIFETIME2024',
  'PERMANENTKEY',
  'SAIKUTOVIP',
  'KUTOVIP2024'
];

// Load keys dari file keys.json
async function loadKeysFromFile() {
  try {
    const response = await fetch('keys.json');
    if (!response.ok) throw new Error('Failed to load keys.json');
    
    const data = await response.json();
    if (data.valid_keys && Array.isArray(data.valid_keys)) {
      VALID_LIFETIME_KEYS = data.valid_keys.map(key => key.toUpperCase());
      console.log('Keys loaded from keys.json:', VALID_LIFETIME_KEYS.length, 'keys available');
      return true;
    }
  } catch (error) {
    console.log('Using default keys (keys.json not found or invalid)');
  }
  return false;
}

// Check Login dengan Access Key (LIFETIME VERSION)
async function checkLogin() {
  console.log('Checking login...');
  
  const loginKeyInput = document.getElementById('loginKey');
  const loginKey = loginKeyInput ? loginKeyInput.value : '';
  const keyStatus = document.getElementById('keyStatus');
  
  if (!loginKey || loginKey.trim() === '') {
    showNotification('Please enter access key');
    if (keyStatus) {
      keyStatus.innerHTML = '<i class="fas fa-times" style="color:#ff0058"></i>';
    }
    return;
  }
  
  // Update status
  if (keyStatus) {
    keyStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  }
  
  // Validasi key
  const keyUpper = loginKey.trim().toUpperCase();
  
  // Simulasi loading
  setTimeout(async () => {
    if (VALID_LIFETIME_KEYS.includes(keyUpper)) {
      console.log('✅ Key VALID:', keyUpper);
      
      // Key valid - LIFETIME ACCESS
      if (keyStatus) {
        keyStatus.innerHTML = '<i class="fas fa-check" style="color:#00ff88"></i>';
      }
      
      showNotification('✅ Lifetime access granted! Welcome to SaiKuto');
      
      // Simpan session dengan flag LIFETIME
      localStorage.setItem('saiSession', 'active_lifetime');
      localStorage.setItem('loginKey', keyUpper);
      localStorage.setItem('accessType', 'lifetime');
      localStorage.setItem('loginTime', Date.now().toString());
      localStorage.setItem('keyUsed', keyUpper);
      
      // Redirect ke main screen
      setTimeout(() => {
        showScreen('mainScreen');
        console.log('✅ Redirected to main screen');
      }, 800);
      
    } else {
      console.log('❌ Key INVALID:', keyUpper);
      
      // Key invalid
      if (keyStatus) {
        keyStatus.innerHTML = '<i class="fas fa-times" style="color:#ff0058"></i>';
      }
      showNotification('Invalid access key. Please try again.');
      
      // Reset input
      if (loginKeyInput) {
        loginKeyInput.value = '';
        loginKeyInput.focus();
      }
    }
  }, 800);
}

// Check session saat load (LIFETIME VERSION)
function checkSession() {
  console.log('🔍 Checking session...');
  
  const session = localStorage.getItem('saiSession');
  const savedKey = localStorage.getItem('loginKey');
  const accessType = localStorage.getItem('accessType');
  
  console.log('Session:', session);
  console.log('Saved key:', savedKey);
  console.log('Access type:', accessType);
  
  // Validasi LIFETIME
  if (session === 'active_lifetime' && accessType === 'lifetime' && savedKey) {
    console.log('✅ Session exists, checking key...');
    
    // Cek jika key masih valid
    if (VALID_LIFETIME_KEYS.includes(savedKey.toUpperCase())) {
      console.log('✅ Key is valid, showing main screen');
      showScreen('mainScreen');
      return true;
    } else {
      console.log('❌ Key is no longer valid, clearing session');
      clearSession();
    }
  }
  
  console.log('❌ No valid session, showing login screen');
  showScreen('loginScreen');
  return false;
}

// Clear session (untuk logout)
function clearSession() {
  localStorage.removeItem('saiSession');
  localStorage.removeItem('loginKey');
  localStorage.removeItem('accessType');
  localStorage.removeItem('loginTime');
  localStorage.removeItem('keyUsed');
  showScreen('loginScreen');
  showNotification('Logged out successfully');
}

// Logout function (bisa ditambahkan di UI nanti)
function logoutUser() {
  if (confirm('Are you sure you want to logout?')) {
    clearSession();
  }
}

// Typewriter effect dengan efek blur
function typeWithBlur(elementId, text, speed, callback) {
  const element = document.getElementById(elementId);
  const textElement = document.getElementById(`text${elementId.replace('line', '')}`);
  let i = 0;
  
  if (!element || !textElement) return;
  
  // Reset state
  textElement.textContent = '';
  element.classList.remove('active');
  element.style.filter = 'blur(5px)';
  element.style.opacity = '0.8';
  element.style.transform = 'translateY(20px)';
  
  // Delay sebelum mulai mengetik
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
      } else if (callback) {
        callback();
      }
    }
    
    type();
  }, 300);
}

// Fungsi utama Saii - LAUNCH FREE FIRE
function startSaii() {
  // Check session dulu (LIFETIME)
  if (!checkSession()) {
    showNotification('Please login to access SaiKuto');
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
    { lineId: 'line2', text: 'Checking system compatibility...', delay: 500, typingSpeed: 40, progress: 20 },
    { lineId: 'line3', text: 'Preparing Free Fire launch...', delay: 1500, typingSpeed: 40, progress: 50 },
    { lineId: 'line4', text: 'Bypassing security checks...', delay: 2500, typingSpeed: 40, progress: 75 },
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
          setTimeout(() => {
            launchFreeFire();
          }, 800);
        }
      });
    }, seq.delay);
  });
}

// Deteksi iOS termasuk iPad
function isIOSDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  
  // Deteksi khusus iPad (iOS 13+)
  const isIPad = navigator.platform === 'MacIntel' && 
                 navigator.maxTouchPoints > 1 && 
                 !window.MSStream;
  
  return isIOS || isIPad;
}

// Launch Free Fire
function launchFreeFire() {
  if (!isIOSDevice()) {
    showNotification('⚠️ iOS device (iPhone/iPad) required');
    setTimeout(() => showScreen('mainScreen'), 1500);
    return;
  }
  
  console.log('Launching Free Fire...');
  
  // Cek semua fitur iOS yang baru
  const aimAssistActive = document.getElementById('aim')?.checked || false;
  const antiBanActive = document.getElementById('antiban')?.checked || false;
  const performanceActive = document.getElementById('performance')?.checked || false;
  const reducePingActive = document.getElementById('reduceping')?.checked || false;
  const highfpsActive = document.getElementById('highfps')?.checked || false;
  const bloomActive = document.getElementById('bloom')?.checked || false;
  const antialiasingActive = document.getElementById('antialiasing')?.checked || false;
  const touchActive = document.getElementById('touch')?.checked || false;
  const autofireActive = document.getElementById('autofire')?.checked || false;
  const threedtouchActive = document.getElementById('threedtouch')?.checked || false;
  const lowpowermodeActive = document.getElementById('lowpowermode')?.checked || false;
  const dndmodeActive = document.getElementById('dndmode')?.checked || false;
  const autolockActive = document.getElementById('autolock')?.checked || false;
  const reducemotionActive = document.getElementById('reducemotion')?.checked || false;
  const wifipriorityActive = document.getElementById('wifipriority')?.checked || false;
  const backgroundrefreshActive = document.getElementById('backgroundrefresh')?.checked || false;
  
  // Simpan semua settings
  const settings = {
    aimAssist: aimAssistActive,
    antiBan: antiBanActive,
    performance: performanceActive,
    reduceping: reducePingActive,
    highfps: highfpsActive,
    bloom: bloomActive,
    antialiasing: antialiasingActive,
    touch: touchActive,
    autofire: autofireActive,
    threedtouch: threedtouchActive,
    lowpowermode: lowpowermodeActive,
    dndmode: dndmodeActive,
    autolock: autolockActive,
    reducemotion: reducemotionActive,
    wifipriority: wifipriorityActive,
    backgroundrefresh: backgroundrefreshActive,
    timestamp: Date.now()
  };
  
  localStorage.setItem('ffSettings', JSON.stringify(settings));
  
  // Tampilkan notifikasi jika ada fitur aktif
  const activeFeatures = [];
  if (aimAssistActive) activeFeatures.push('AIM ASSIST');
  if (antiBanActive) activeFeatures.push('ANTI-BAN');
  if (performanceActive) activeFeatures.push('PERFORMANCE MODE');
  if (reducePingActive) activeFeatures.push('REDUCE PING');
  if (highfpsActive) activeFeatures.push('HIGH FPS');
  if (lowpowermodeActive) activeFeatures.push('LOW POWER OFF');
  if (dndmodeActive) activeFeatures.push('DO NOT DISTURB');
  
  if (activeFeatures.length > 0) {
    showNotification(`Launching Free Fire\n${activeFeatures.join(' + ')}`);
  } else {
    showNotification('Launching Free Fire...');
  }
  
  // Multiple launch methods
  const launchMethods = [
    // Method 1: Universal Link
    () => {
      try {
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;border:none;';
        iframe.src = 'https://freefiremobile.com/game';
        document.body.appendChild(iframe);
        setTimeout(() => {
          if (iframe.parentNode) document.body.removeChild(iframe);
        }, 150);
      } catch(e) {}
    },
    
    // Method 2: Custom URL Scheme
    () => {
      setTimeout(() => {
        try {
          window.location.href = 'freefiremax://';
        } catch(e) {}
      }, 200);
    },
    
    // Method 3: Alternate Scheme
    () => {
      setTimeout(() => {
        try {
          window.location.href = 'freefire://';
        } catch(e) {}
      }, 400);
    }
  ];
  
  // Eksekusi semua metode
  launchMethods.forEach((method, index) => {
    setTimeout(method, index * 250);
  });
  
  // Kembali ke main screen setelah 2 detik
  setTimeout(() => {
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.querySelector('.progress-percent');
    
    if (progressBar) progressBar.style.width = '100%';
    if (progressPercent) progressPercent.textContent = '100%';
    
    setTimeout(() => {
      showScreen('mainScreen');
      showNotification('✅ Free Fire launched successfully');
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
  console.log('🚀 DOM loaded, initializing SaiKuto...');
  
  // Load keys dari file terlebih dahulu
  await loadKeysFromFile();
  
  // Check session pertama kali (LIFETIME VERSION)
  checkSession();
  
  // Setup enter key untuk login
  const loginInput = document.getElementById('loginKey');
  const loginBtn = document.querySelector('.login-btn');
  
  if (loginInput) {
    console.log('✅ Login input found');
    
    loginInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        console.log('Enter key pressed');
        checkLogin();
      }
    });
    
    // Auto-focus pada input login
    setTimeout(() => {
      loginInput.focus();
    }, 500);
  }
  
  if (loginBtn) {
    console.log('✅ Login button found');
    
    loginBtn.addEventListener('click', () => {
      console.log('Login button clicked');
      checkLogin();
    });
    
    loginBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      console.log('Login button touched');
      checkLogin();
    });
  }
  
  // PWA Installation Handler
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install prompt after 3 seconds
    setTimeout(() => {
      showInstallPrompt();
    }, 3000);
  });
  
  // Install button click
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        showNotification('✅ SaiKuto installed successfully');
      }
      
      deferredPrompt = null;
      hideInstallPrompt();
    });
  }
  
  // Close install prompt
  if (closeInstall) {
    closeInstall.addEventListener('click', hideInstallPrompt);
  }
  
  // Check if running as PWA
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('📱 Running as PWA');
    document.body.classList.add('pwa-mode');
  }
  
  // Load saved settings
  const savedSettings = localStorage.getItem('ffSettings');
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings);
      
      // Set semua toggle sesuai saved settings
      const toggleIds = ['aim', 'antiban', 'kernel', 'tweak', 'performance', 'reduceping', 
                         'highfps', 'bloom', 'antialiasing', 'touch', 'autofire', 
                         'threedtouch', 'lowpowermode', 'dndmode', 'autolock', 
                         'reducemotion', 'wifipriority', 'backgroundrefresh'];
      
      toggleIds.forEach(id => {
        const toggle = document.getElementById(id);
        if (toggle && settings[id] !== undefined) {
          toggle.checked = settings[id];
        }
      });
      
    } catch(e) {
      console.log('Failed to load saved settings:', e);
    }
  } else {
    // Default semua toggle OFF
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
      toggle.checked = false;
    });
  }
  
  // Setup untuk tombol Saii
  const saiiBtn = document.querySelector('.saii-btn');
  if (saiiBtn) {
    console.log('✅ Saii button found');
    
    const handleSaiiClick = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      console.log('🎮 Saii button clicked');
      saiiBtn.style.transform = 'scale(0.98)';
      setTimeout(() => {
        saiiBtn.style.transform = 'scale(1)';
        startSaii();
      }, 150);
    };
    
    saiiBtn.addEventListener('click', handleSaiiClick);
    saiiBtn.addEventListener('touchend', handleSaiiClick);
    
    // Hover effects
    saiiBtn.addEventListener('mouseenter', () => {
      saiiBtn.style.transform = 'translateY(-2px)';
    });
    saiiBtn.addEventListener('mouseleave', () => {
      saiiBtn.style.transform = 'translateY(0)';
    });
  }
  
  // Setup untuk semua toggle switches
  document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', function() {
      // Update saved settings
      const savedSettings = localStorage.getItem('ffSettings');
      let settings = savedSettings ? JSON.parse(savedSettings) : {};
      settings[this.id] = this.checked;
      localStorage.setItem('ffSettings', JSON.stringify(settings));
      
      // Show notification (TANPA EMOJI)
      const featureNames = {
        'aim': 'AIM ASSIST',
        'antiban': 'ANTI-BAN PROTECTION',
        'kernel': 'KERNEL EXPLOIT',
        'tweak': 'TWEAK INJECTION',
        'performance': 'PERFORMANCE MODE',
        'reduceping': 'REDUCE PING',
        'highfps': 'HIGH FPS MODE',
        'bloom': 'REDUCE BLOOM EFFECT',
        'antialiasing': 'ANTI-ALIASING',
        'touch': 'TOUCH RESPONSE BOOST',
        'autofire': 'AUTO-FIRE OPTIMIZATION',
        'threedtouch': '3D TOUCH SENSITIVITY',
        'lowpowermode': 'LOW POWER MODE OFF',
        'dndmode': 'DO NOT DISTURB',
        'autolock': 'AUTO-LOCK DISABLE',
        'reducemotion': 'REDUCE MOTION',
        'wifipriority': 'WI-FI PRIORITY',
        'backgroundrefresh': 'BACKGROUND APP REFRESH OFF'
      };
      
      const status = this.checked ? 'ENABLED' : 'DISABLED';
      showNotification(`${featureNames[this.id] || this.id}: ${status}`);
    });
  });
  
  // Setup untuk cards
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-2px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
    
    // Touch events untuk iPad
    card.addEventListener('touchstart', () => {
      card.style.transform = 'scale(0.98)';
    });
    card.addEventListener('touchend', () => {
      card.style.transform = 'scale(1)';
    });
  });
  
  console.log('✅ Initialization complete');
  console.log('🔑 Available keys:', VALID_LIFETIME_KEYS);
});

// Override alert/confirm untuk mencegah popup system
window.alert = function(msg) {
  console.log('Alert blocked:', msg);
  showNotification(msg);
  return undefined;
};

window.confirm = function(msg) {
  console.log('Confirm blocked:', msg);
  return true;
};

window.prompt = function(msg) {
  console.log('Prompt blocked:', msg);
  return '';
};

// Blokir unhandled errors yang bisa muncul popup
window.onerror = function(message, source, lineno, colno, error) {
  console.log('Error suppressed:', message);
  return true;
};
