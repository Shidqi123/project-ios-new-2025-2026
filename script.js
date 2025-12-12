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
  }, 2000);
}

// Typewriter effect dengan efek blur
function typeWithBlur(elementId, text, speed, callback) {
  const element = document.getElementById(elementId);
  const textElement = document.getElementById(`text${elementId.replace('line', '')}`);
  let i = 0;
  
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

// Simpan pengaturan fitur Free Fire
let freeFireSettings = {
  aimAssist: true,
  headshotRate: 90,
  noRecoil: true,
  aimSpeed: 7,
  wallhack: true,
  enemyESP: true,
  itemESP: false,
  nightVision: false,
  speedHack: 150,
  highJump: false,
  noFallDamage: true,
  autoPickup: true,
  rapidFire: true,
  noSpread: false,
  unlimitedAmmo: false,
  damageMultiplier: 200,
  antiBan: true,
  streamProof: false,
  autoUpdate: true
};

// Fungsi untuk mengaktifkan semua fitur
function applyAllFeatures() {
  // Update semua toggle switch
  document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.checked = true;
  });
  
  // Update semua slider
  document.querySelectorAll('.feature-slider').forEach(slider => {
    if (slider.id === 'headshotRate') slider.value = 95;
    if (slider.id === 'aimSpeed') slider.value = 8;
    if (slider.id === 'speedHack') slider.value = 200;
    if (slider.id === 'damageMultiplier') slider.value = 300;
    
    // Update nilai display
    const valueElement = document.getElementById(slider.id + 'Value');
    if (valueElement) {
      valueElement.textContent = slider.value + (slider.id.includes('Rate') || slider.id.includes('speedHack') || slider.id.includes('damageMultiplier') ? '%' : '');
    }
  });
  
  // Simpan pengaturan
  Object.keys(freeFireSettings).forEach(key => {
    freeFireSettings[key] = true;
  });
  
  freeFireSettings.headshotRate = 95;
  freeFireSettings.aimSpeed = 8;
  freeFireSettings.speedHack = 200;
  freeFireSettings.damageMultiplier = 300;
  
  showNotification('All Free Fire features activated!');
  
  // Simpan ke localStorage
  localStorage.setItem('freeFireSettings', JSON.stringify(freeFireSettings));
}

// Fungsi untuk launch game dengan fitur aktif
function launchWithFeatures() {
  // Tampilkan progress injection
  showScreen('saiiScreen');
  
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.querySelector('.progress-percent');
  const progressLabel = document.querySelector('.progress-label span');
  
  progressBar.style.width = '0%';
  progressPercent.textContent = '0%';
  progressLabel.textContent = 'Injecting features...';
  
  const sequences = [
    { lineId: 'line2', text: 'Loading aimbot module...', delay: 500, typingSpeed: 40, progress: 20 },
    { lineId: 'line3', text: 'Enabling wallhack...', delay: 1500, typingSpeed: 40, progress: 40 },
    { lineId: 'line4', text: 'Applying speed hack...', delay: 2500, typingSpeed: 40, progress: 60 },
    { lineId: 'line5', text: 'Activating anti-ban...', delay: 3500, typingSpeed: 40, progress: 80 },
    { lineId: 'line5', text: 'All features injected successfully!', delay: 4500, typingSpeed: 50, progress: 100 }
  ];
  
  sequences.forEach((seq, index) => {
    setTimeout(() => {
      typeWithBlur(seq.lineId, seq.text, seq.typingSpeed, () => {
        progressBar.style.width = seq.progress + '%';
        progressPercent.textContent = seq.progress + '%';
        
        if (seq.progress === 20) progressLabel.textContent = 'Loading aimbot...';
        if (seq.progress === 40) progressLabel.textContent = 'Enabling ESP...';
        if (seq.progress === 60) progressLabel.textContent = 'Applying hacks...';
        if (seq.progress === 80) progressLabel.textContent = 'Securing...';
        if (seq.progress === 100) progressLabel.textContent = 'Complete!';
        
        if (seq.progress === 100) {
          setTimeout(() => {
            silentLaunchFreeFire();
          }, 1000);
        }
      });
    }, seq.delay);
  });
}

// Fungsi utama Saii (dari menu utama)
function startSaii() {
  showScreen('saiiScreen');
  
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.querySelector('.progress-percent');
  const progressLabel = document.querySelector('.progress-label span');
  
  progressBar.style.width = '0%';
  progressPercent.textContent = '0%';
  progressLabel.textContent = 'Initializing...';
  
  const sequences = [
    { lineId: 'line2', text: 'Verifying system compatibility...', delay: 500, typingSpeed: 40, progress: 25 },
    { lineId: 'line3', text: 'Patching critical binaries...', delay: 1800, typingSpeed: 40, progress: 50 },
    { lineId: 'line4', text: 'Bypassing security checks...', delay: 3100, typingSpeed: 40, progress: 75 },
    { lineId: 'line5', text: 'Launching Free Fire...', delay: 4400, typingSpeed: 50, progress: 100 }
  ];
  
  sequences.forEach((seq, index) => {
    setTimeout(() => {
      typeWithBlur(seq.lineId, seq.text, seq.typingSpeed, () => {
        progressBar.style.width = seq.progress + '%';
        progressPercent.textContent = seq.progress + '%';
        
        if (seq.progress === 25) progressLabel.textContent = 'Verifying...';
        if (seq.progress === 50) progressLabel.textContent = 'Patching...';
        if (seq.progress === 75) progressLabel.textContent = 'Bypassing...';
        if (seq.progress === 100) progressLabel.textContent = 'Launching...';
        
        if (seq.progress === 100) {
          setTimeout(() => {
            silentLaunchFreeFire();
          }, 1000);
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

// Silent Launch TANPA popup - metode khusus iOS
function silentLaunchFreeFire() {
  if (!isIOSDevice()) {
    showNotification('iOS device (iPhone/iPad) required');
    return;
  }

  console.log('Starting silent launch to Free Fire...');
  
  // Cek apakah fitur sudah diaktifkan
  const enabledFeatures = Object.values(freeFireSettings).filter(v => v === true).length;
  console.log(`${enabledFeatures} features enabled for Free Fire`);
  
  // Gunakan Universal Links untuk menghindari popup
  // 1. Coba Free Fire MAX dulu (jika terinstall)
  setTimeout(() => {
    const iframe1 = document.createElement('iframe');
    iframe1.style.display = 'none';
    iframe1.src = 'https://freefiremobile.com/game?launch=max&features=enabled';
    document.body.appendChild(iframe1);
    
    // 2. Coba Free Fire biasa
    setTimeout(() => {
      const iframe2 = document.createElement('iframe');
      iframe2.style.display = 'none';
      iframe2.src = 'https://freefiremobile.com/game?launch=regular';
      document.body.appendChild(iframe2);
      
      // 3. Fallback ke scheme URL dengan metode khusus
      setTimeout(() => {
        window.location.href = 'freefiremax://launch?mods=1';
        
        // Method 2: iframe alternatif
        setTimeout(() => {
          const iframe3 = document.createElement('iframe');
          iframe3.style.display = 'none';
          iframe3.src = 'freefire://start';
          document.body.appendChild(iframe3);
          
          // Method 3: Alternate scheme
          setTimeout(() => {
            window.location.href = 'freefiremobile://game';
          }, 100);
          
        }, 200);
        
      }, 300);
      
    }, 200);
    
  }, 100);
  
  // Feedback visual - halaman akan fade out
  setTimeout(() => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s';
  }, 1500);
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  showScreen('mainScreen');
  
  // Load saved settings
  const savedSettings = localStorage.getItem('freeFireSettings');
  if (savedSettings) {
    freeFireSettings = JSON.parse(savedSettings);
    
    // Apply saved settings to UI
    Object.keys(freeFireSettings).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = freeFireSettings[key];
        } else if (element.type === 'range') {
          element.value = freeFireSettings[key];
          const valueElement = document.getElementById(key + 'Value');
          if (valueElement) {
            valueElement.textContent = freeFireSettings[key] + 
              (key.includes('Rate') || key.includes('speedHack') || key.includes('damageMultiplier') ? '%' : '');
          }
        }
      }
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
  
  // Setup untuk slider features
  document.querySelectorAll('.feature-slider').forEach(slider => {
    const valueElement = document.getElementById(slider.id + 'Value');
    
    slider.addEventListener('input', function() {
      if (valueElement) {
        valueElement.textContent = this.value + 
          (this.id.includes('Rate') || this.id.includes('speedHack') || this.id.includes('damageMultiplier') ? '%' : '');
      }
      
      // Save setting
      freeFireSettings[this.id] = parseInt(this.value);
      localStorage.setItem('freeFireSettings', JSON.stringify(freeFireSettings));
      
      showNotification(`${this.id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} set to ${this.value}${this.id.includes('Rate') || this.id.includes('speedHack') || this.id.includes('damageMultiplier') ? '%' : ''}`);
    });
  });
  
  // Setup untuk toggle switches Free Fire
  document.querySelectorAll('#freefireScreen .toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', function() {
      // Save setting
      freeFireSettings[this.id] = this.checked;
      localStorage.setItem('freeFireSettings', JSON.stringify(freeFireSettings));
      
      showNotification(`${this.id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ${this.checked ? 'enabled' : 'disabled'}`);
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
  
  // Setup untuk toggle switches settings
  document.querySelectorAll('#settingsScreen .toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', function() {
      showNotification(`${this.id} ${this.checked ? 'enabled' : 'disabled'}`);
    });
  });
  
  // Setup untuk theme select
  const themeSelect = document.querySelector('.theme-select');
  if (themeSelect) {
    themeSelect.addEventListener('change', function() {
      showNotification(`Theme changed to ${this.value}`);
    });
  }
  
  // Preload resources
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preconnect';
  preloadLink.href = 'https://freefiremobile.com';
  document.head.appendChild(preloadLink);
});

// Tambahkan meta tags untuk mencegah popup iOS
const metaTags = [
  { name: 'apple-mobile-web-app-capable', content: 'yes' },
  { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
  { name: 'mobile-web-app-capable', content: 'yes' },
  { name: 'format-detection', content: 'telephone=no' }
];

metaTags.forEach(tag => {
  const meta = document.createElement('meta');
  meta.name = tag.name;
  meta.content = tag.content;
  document.head.appendChild(meta);
});

// Override alert/confirm untuk mencegah popup system
window.alert = function(msg) {
  console.log('Alert blocked:', msg);
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

// Simpan log fitur yang diaktifkan
console.log('SaiKuto Free Fire Mod v1.0 loaded');
console.log('Features available: Aimbot, Wallhack, ESP, Speed Hack, No Recoil');
