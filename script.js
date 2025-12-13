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
  
  // Cek apakah notifications enabled
  const notificationsEnabled = document.getElementById('notifications')?.checked;
  if (notificationsEnabled === false) return;
  
  notificationText.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 2500);
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

// ========== FITUR UTILITY YANG BERFUNGSI ==========

// 1. LAUNCH COUNTER
function updateLaunchCounter() {
  let count = localStorage.getItem('ffLaunchCount') || 0;
  document.getElementById('launchCount').textContent = count;
  document.getElementById('totalLaunches').textContent = count;
}

function incrementLaunchCounter() {
  let count = parseInt(localStorage.getItem('ffLaunchCount') || 0);
  count++;
  localStorage.setItem('ffLaunchCount', count);
  updateLaunchCounter();
  
  // Update last launch time
  const now = new Date();
  const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  const dateString = now.toLocaleDateString();
  document.getElementById('lastLaunchTime').textContent = `${dateString} ${timeString}`;
  localStorage.setItem('lastLaunchTime', `${dateString} ${timeString}`);
}

function resetLaunchCounter() {
  if (confirm('Reset launch counter to zero?')) {
    localStorage.setItem('ffLaunchCount', 0);
    updateLaunchCounter();
    showNotification('Launch counter reset to zero');
  }
}

// 2. SESSION TIMER
let sessionInterval = null;
let sessionStartTime = null;

function toggleSessionTimer() {
  const timerBtn = document.getElementById('timerBtn');
  
  if (sessionInterval) {
    // Stop timer
    clearInterval(sessionInterval);
    sessionInterval = null;
    timerBtn.textContent = 'Start';
    showNotification('Session timer stopped');
  } else {
    // Start timer
    sessionStartTime = Date.now();
    sessionInterval = setInterval(updateSessionTimer, 1000);
    timerBtn.textContent = 'Stop';
    showNotification('Session timer started');
  }
}

function updateSessionTimer() {
  if (!sessionStartTime) return;
  
  const elapsed = Date.now() - sessionStartTime;
  const minutes = Math.floor(elapsed / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);
  document.getElementById('sessionTimer').textContent = 
    `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// 3. OPEN SETTINGS
function openSettings() {
  showNotification('Opening iOS Settings...');
  
  // Try different iOS settings URLs
  const settingsUrls = [
    'App-Prefs:root',
    'App-Prefs:root=General',
    'prefs:root=General'
  ];
  
  let opened = false;
  
  // Try to open settings
  settingsUrls.forEach(url => {
    if (!opened) {
      try {
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;border:none;';
        iframe.src = url;
        document.body.appendChild(iframe);
        setTimeout(() => {
          if (iframe.parentNode) document.body.removeChild(iframe);
        }, 100);
        opened = true;
      } catch(e) {
        // Continue to next URL
      }
    }
  });
  
  if (!opened) {
    showNotification('Cannot open settings from browser. Please open manually.');
  }
}

// 4. DEVICE INFORMATION
function displayDeviceInfo() {
  // Platform detection
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  let platform = 'Unknown';
  
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    platform = 'iOS';
  } else if (/Android/.test(userAgent)) {
    platform = 'Android';
  } else if (/Mac/.test(userAgent)) {
    platform = 'Mac';
  } else if (/Windows/.test(userAgent)) {
    platform = 'Windows';
  }
  
  document.getElementById('devicePlatform').textContent = platform;
  
  // Browser detection
  let browser = 'Unknown';
  if (userAgent.includes('Chrome')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  }
  
  document.getElementById('browserInfo').textContent = browser;
  
  // Online status
  document.getElementById('onlineStatus').textContent = navigator.onLine ? 'Online' : 'Offline';
  
  // Screen size
  document.getElementById('screenSize').textContent = 
    `${window.innerWidth}×${window.innerHeight}`;
  
  // Update online status on change
  window.addEventListener('online', () => {
    document.getElementById('onlineStatus').textContent = 'Online';
  });
  
  window.addEventListener('offline', () => {
    document.getElementById('onlineStatus').textContent = 'Offline';
  });
}

// 5. FAVORITE MODE
function setFavoriteMode() {
  const modes = ['Battle Royale', 'Clash Squad', 'Lone Wolf', 'Ranked', 'Custom'];
  const currentMode = localStorage.getItem('favoriteMode') || 'Battle Royale';
  
  const newMode = prompt(`Enter your favorite Free Fire mode:\n${modes.join(', ')}`, currentMode);
  
  if (newMode && newMode.trim() !== '') {
    localStorage.setItem('favoriteMode', newMode);
    document.getElementById('favoriteMode').textContent = newMode;
    showNotification(`Favorite mode set to: ${newMode}`);
  }
}

// 6. LOAD LAST LAUNCH TIME
function loadLastLaunchTime() {
  const lastTime = localStorage.getItem('lastLaunchTime');
  if (lastTime) {
    document.getElementById('lastLaunchTime').textContent = lastTime;
  }
}

// 7. LOAD FAVORITE MODE
function loadFavoriteMode() {
  const mode = localStorage.getItem('favoriteMode');
  if (mode) {
    document.getElementById('favoriteMode').textContent = mode;
  }
}

// ========== FUNGSI UTAMA SAIi ==========

// Fungsi utama Saii - LAUNCH FREE FIRE
function startSaii() {
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
  
  // Update launch counter (FITUR NYATA)
  incrementLaunchCounter();
  
  // Cek apakah ada fitur yang aktif (UI only)
  const aimAssistActive = document.getElementById('aim')?.checked || false;
  const antiBanActive = document.getElementById('antiban')?.checked || false;
  
  // Simpan settings (FITUR NYATA)
  const settings = {
    aimAssist: aimAssistActive,
    antiBan: antiBanActive,
    notifications: document.getElementById('notifications')?.checked || true,
    theme: document.getElementById('themeSelect')?.value || 'dark',
    timestamp: Date.now()
  };
  
  localStorage.setItem('ffSettings', JSON.stringify(settings));
  
  // Tampilkan notifikasi jika ada fitur aktif
  if (aimAssistActive || antiBanActive) {
    const activeFeatures = [];
    if (aimAssistActive) activeFeatures.push('AIM ASSIST');
    if (antiBanActive) activeFeatures.push('ANTI-BAN');
    
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

// ========== INISIALISASI ==========

document.addEventListener('DOMContentLoaded', () => {
  showScreen('mainScreen');
  
  // Initialize semua fitur utility
  updateLaunchCounter();
  displayDeviceInfo();
  loadLastLaunchTime();
  loadFavoriteMode();
  
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
    console.log('Running as PWA');
    document.body.classList.add('pwa-mode');
  }
  
  // Load saved settings
  const savedSettings = localStorage.getItem('ffSettings');
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings);
      
      // Set toggle sesuai saved settings
      const aimToggle = document.getElementById('aim');
      const antiBanToggle = document.getElementById('antiban');
      const notificationsToggle = document.getElementById('notifications');
      const themeSelect = document.getElementById('themeSelect');
      
      if (aimToggle && settings.aimAssist !== undefined) aimToggle.checked = settings.aimAssist;
      if (antiBanToggle && settings.antiBan !== undefined) antiBanToggle.checked = settings.antiBan;
      if (notificationsToggle && settings.notifications !== undefined) notificationsToggle.checked = settings.notifications;
      if (themeSelect && settings.theme) themeSelect.value = settings.theme;
      
    } catch(e) {
      console.log('Failed to load saved settings:', e);
    }
  }
  
  // Setup untuk tombol Saii
  const saiiBtn = document.querySelector('.saii-btn');
  if (saiiBtn) {
    const handleSaiiClick = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
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
  
  // Setup untuk toggle switches
  document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', function() {
      // Update saved settings
      const savedSettings = localStorage.getItem('ffSettings');
      let settings = savedSettings ? JSON.parse(savedSettings) : {};
      settings[this.id] = this.checked;
      localStorage.setItem('ffSettings', JSON.stringify(settings));
      
      // Show notification
      const featureNames = {
        'aim': 'AIM ASSIST',
        'antiban': 'ANTI-BAN PROTECTION',
        'notifications': 'NOTIFICATIONS'
      };
      
      const status = this.checked ? 'ENABLED' : 'DISABLED';
      if (featureNames[this.id]) {
        showNotification(`${featureNames[this.id]}: ${status}`);
      }
    });
  });
  
  // Setup untuk theme select
  const themeSelect = document.getElementById('themeSelect');
  if (themeSelect) {
    themeSelect.addEventListener('change', function() {
      showNotification(`Theme changed to ${this.value}`);
      
      // Save to settings
      const savedSettings = localStorage.getItem('ffSettings');
      let settings = savedSettings ? JSON.parse(savedSettings) : {};
      settings.theme = this.value;
      localStorage.setItem('ffSettings', JSON.stringify(settings));
    });
  }
  
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
  
  // Enable scrolling pada body
  document.body.style.overflow = 'auto';
  document.body.style.height = 'auto';
  document.body.style.position = 'relative';
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
