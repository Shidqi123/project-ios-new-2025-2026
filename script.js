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
  }, 3000);
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

// Fungsi utama Saii - hanya aktifkan fitur yang di-toggle ON
function startSaii() {
  // Cek apakah ada fitur yang aktif
  const aimAssistActive = document.getElementById('aim')?.checked || false;
  const antiBanActive = document.getElementById('antiban')?.checked || false;
  
  if (!aimAssistActive && !antiBanActive) {
    showNotification('⚠️ Please enable at least one feature in Settings');
    return;
  }
  
  showScreen('saiiScreen');
  
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.querySelector('.progress-percent');
  const progressLabel = document.querySelector('.progress-label span');
  
  if (progressBar) progressBar.style.width = '0%';
  if (progressPercent) progressPercent.textContent = '0%';
  if (progressLabel) progressLabel.textContent = 'Initializing...';
  
  // Tentukan teks berdasarkan fitur yang aktif
  let featureText = '';
  if (aimAssistActive && antiBanActive) {
    featureText = 'AIM ASSIST & ANTI-BAN';
  } else if (aimAssistActive) {
    featureText = 'AIM ASSIST';
  } else {
    featureText = 'ANTI-BAN PROTECTION';
  }
  
  const sequences = [
    { lineId: 'line2', text: 'Verifying system compatibility...', delay: 500, typingSpeed: 40, progress: 25 },
    { lineId: 'line3', text: 'Loading security modules...', delay: 1500, typingSpeed: 40, progress: 50 },
    { lineId: 'line4', text: `Activating ${featureText}...`, delay: 2500, typingSpeed: 40, progress: 75 },
    { lineId: 'line5', text: 'Launching Free Fire...', delay: 3500, typingSpeed: 50, progress: 100 }
  ];
  
  sequences.forEach((seq, index) => {
    setTimeout(() => {
      typeWithBlur(seq.lineId, seq.text, seq.typingSpeed, () => {
        if (progressBar) progressBar.style.width = seq.progress + '%';
        if (progressPercent) progressPercent.textContent = seq.progress + '%';
        
        if (progressLabel) {
          if (seq.progress === 25) progressLabel.textContent = 'Verifying...';
          if (seq.progress === 50) progressLabel.textContent = 'Securing...';
          if (seq.progress === 75) progressLabel.textContent = 'Activating...';
          if (seq.progress === 100) progressLabel.textContent = 'Launching...';
        }
        
        if (seq.progress === 100) {
          setTimeout(() => {
            activateSelectedFeatures();
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

// Fungsi aktifkan hanya fitur yang dipilih
function activateSelectedFeatures() {
  if (!isIOSDevice()) {
    showNotification('⚠️ iOS device (iPhone/iPad) required');
    setTimeout(() => showScreen('mainScreen'), 1500);
    return;
  }
  
  console.log('Activating selected features...');
  
  // Ambil status fitur dari toggle
  const aimAssistActive = document.getElementById('aim')?.checked || false;
  const antiBanActive = document.getElementById('antiban')?.checked || false;
  
  // Simpan settings ke localStorage
  const settings = {
    aimAssist: aimAssistActive,
    antiBan: antiBanActive,
    timestamp: Date.now()
  };
  
  localStorage.setItem('ffSettings', JSON.stringify(settings));
  
  // Tampilkan aktivasi fitur
  const activeFeatures = [];
  if (aimAssistActive) activeFeatures.push('🎯 AIM ASSIST');
  if (antiBanActive) activeFeatures.push('🛡️ ANTI-BAN');
  
  if (activeFeatures.length > 0) {
    showNotification(`${activeFeatures.join(' + ')} ACTIVATED\nLaunching Free Fire...`);
  } else {
    showNotification('⚠️ No features selected');
    setTimeout(() => showScreen('mainScreen'), 1500);
    return;
  }
  
  // Generate session data
  const sessionData = {
    features: settings,
    sessionId: 'SAI_' + Date.now(),
    timestamp: Date.now(),
    deviceId: generateDeviceId()
  };
  
  localStorage.setItem('ffSession', JSON.stringify(sessionData));
  
  // Mulai proses launch
  setTimeout(() => {
    launchFreeFireWithFeatures(sessionData);
  }, 1200);
}

// Generate device ID
function generateDeviceId() {
  const randomPart = Math.random().toString(36).substring(2, 15);
  const timePart = Date.now().toString(36);
  return `IOS_${randomPart}_${timePart}`.toUpperCase();
}

// Launch Free Fire dengan fitur terpilih
function launchFreeFireWithFeatures(sessionData) {
  console.log('Launching Free Fire with selected features...');
  
  // Encode feature data
  const featureData = btoa(JSON.stringify(sessionData.features)).replace(/=/g, '');
  
  // Multiple launch methods
  const launchMethods = [
    // Method 1: Universal Link
    () => {
      try {
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;border:none;';
        iframe.src = `https://freefiremobile.com/launch?features=${featureData}`;
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
          window.location.href = `freefiremax://launch?features=${featureData}`;
        } catch(e) {}
      }, 200);
    },
    
    // Method 3: Alternate Scheme
    () => {
      setTimeout(() => {
        try {
          window.location.href = `freefire://game?features=${featureData}`;
        } catch(e) {}
      }, 400);
    }
  ];
  
  // Eksekusi semua metode
  launchMethods.forEach((method, index) => {
    setTimeout(method, index * 250);
  });
  
  // Kembali ke main screen
  setTimeout(() => {
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.querySelector('.progress-percent');
    
    if (progressBar) progressBar.style.width = '100%';
    if (progressPercent) progressPercent.textContent = '100%';
    
    setTimeout(() => {
      showScreen('mainScreen');
      
      // Notifikasi sesuai fitur yang aktif
      const settings = JSON.parse(localStorage.getItem('ffSettings') || '{}');
      let message = '✅ Free Fire launched';
      if (settings.aimAssist) message += '\n🎯 AIM ASSIST: ACTIVE';
      if (settings.antiBan) message += '\n🛡️ ANTI-BAN: ACTIVE';
      
      showNotification(message);
    }, 1000);
  }, 2000);
}

// ========== PWA FUNCTIONS ==========

// Register Service Worker
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registered:', registration.scope);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed:', error);
        });
    });
  }
}

// Check if running as PWA
function isRunningAsPWA() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone ||
         document.referrer.includes('android-app://');
}

// Show install prompt
function showInstallPrompt() {
  let deferredPrompt;
  const installPrompt = document.getElementById('installPrompt');
  const installBtn = document.getElementById('installBtn');
  
  if (!installPrompt || !installBtn) return;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install prompt after 5 seconds if not installed as PWA
    setTimeout(() => {
      if (!isRunningAsPWA()) {
        installPrompt.classList.add('show');
      }
    }, 5000);
  });
  
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      installPrompt.classList.remove('show');
      showNotification('✅ Saikuto installed successfully!');
    }
    
    deferredPrompt = null;
  });
}

// ========== INITIALIZATION ==========

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  showScreen('mainScreen');
  
  // Register Service Worker
  registerServiceWorker();
  
  // Show install prompt if available
  showInstallPrompt();
  
  // Load saved settings
  const savedSettings = localStorage.getItem('ffSettings');
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings);
      // Set toggle sesuai saved settings
      const aimToggle = document.getElementById('aim');
      const antiBanToggle = document.getElementById('antiban');
      const kernelToggle = document.getElementById('kernel');
      const tweakToggle = document.getElementById('tweak');
      
      if (aimToggle) aimToggle.checked = settings.aimAssist || false;
      if (antiBanToggle) antiBanToggle.checked = settings.antiBan || false;
      if (kernelToggle) kernelToggle.checked = settings.kernelExploit !== false;
      if (tweakToggle) tweakToggle.checked = settings.tweakInjection !== false;
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
  
  // Setup untuk semua toggle switches
  document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    // Load initial state dari localStorage
    const savedSettings = localStorage.getItem('ffSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings[toggle.id] !== undefined) {
          toggle.checked = settings[toggle.id];
        }
      } catch(e) {}
    }
    
    // Event listener untuk perubahan
    toggle.addEventListener('change', function() {
      // Update saved settings
      const savedSettings = localStorage.getItem('ffSettings');
      let settings = savedSettings ? JSON.parse(savedSettings) : {};
      settings[this.id] = this.checked;
      localStorage.setItem('ffSettings', JSON.stringify(settings));
      
      // Show notification
      const featureNames = {
        'aim': '🎯 AIM ASSIST',
        'antiban': '🛡️ ANTI-BAN PROTECTION',
        'kernel': 'Kernel Exploit',
        'tweak': 'Tweak Injection',
        'logs': 'Verbose Logs',
        'jit': 'JIT Compilation'
      };
      
      const status = this.checked ? '✅ ENABLED' : '❌ DISABLED';
      showNotification(`${featureNames[this.id] || this.id}: ${status}`);
    });
  });
  
  // Setup untuk theme select
  const themeSelect = document.querySelector('.theme-select');
  if (themeSelect) {
    themeSelect.addEventListener('change', function() {
      showNotification(`Theme changed to ${this.value}`);
      localStorage.setItem('theme', this.value);
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      themeSelect.value = savedTheme;
    }
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
  
  // Jika running sebagai PWA, tambahkan style khusus
  if (isRunningAsPWA()) {
    document.body.classList.add('pwa-mode');
  }
});

// ========== SYSTEM OVERRIDES ==========

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

// Handle app visibility changes
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && isRunningAsPWA()) {
    // App kembali ke foreground
    console.log('App returned to foreground');
  }
});
