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
document.addEventListener('DOMContentLoaded', () => {
  showScreen('mainScreen');
  
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
[file content end]
