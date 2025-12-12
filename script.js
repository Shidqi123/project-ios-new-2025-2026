// Navigasi antar screen
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
  
  // Jika kembali ke main screen, reset opacity
  if (screenId === 'mainScreen') {
    document.body.style.opacity = '1';
    document.body.style.transition = '';
  }
}

// Kembali ke menu
function backToMenu() {
  showScreen('mainScreen');
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

// Simpan pengaturan fitur
let freeFireSettings = {
  aimAssist: true,
  headshotRate: 90,
  lockSpeed: 7,
  antiBan: true,
  autoUpdate: true
};

// Fungsi untuk apply features
function applyFeatures() {
  // Update semua toggle switch
  document.querySelectorAll('#freefireScreen .toggle-switch input').forEach(toggle => {
    toggle.checked = true;
  });
  
  // Update semua slider
  document.querySelectorAll('.feature-slider').forEach(slider => {
    if (slider.id === 'headshotRate') slider.value = 95;
    if (slider.id === 'lockSpeed') slider.value = 8;
    
    // Update nilai display
    const valueElement = document.getElementById(slider.id + 'Value');
    if (valueElement) {
      valueElement.textContent = slider.value + (slider.id.includes('headshotRate') ? '%' : '');
    }
  });
  
  // Simpan pengaturan
  freeFireSettings.aimAssist = true;
  freeFireSettings.headshotRate = 95;
  freeFireSettings.lockSpeed = 8;
  freeFireSettings.antiBan = true;
  freeFireSettings.autoUpdate = true;
  
  showNotification('All features applied successfully!');
  
  // Simpan ke localStorage
  localStorage.setItem('freeFireSettings', JSON.stringify(freeFireSettings));
}

// Fungsi utama Saii
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
            launchFreeFire();
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

// Launch Free Fire tanpa popup
function launchFreeFire() {
  if (!isIOSDevice()) {
    showNotification('iOS device (iPhone/iPad) required');
    return;
  }

  console.log('Starting Saii process for Free Fire...');
  
  // Gunakan metode tanpa popup
  const launchGame = () => {
    // Cek fitur yang aktif
    const activeFeatures = Object.values(freeFireSettings).filter(v => v === true || (typeof v === 'number' && v > 0)).length;
    console.log(`${activeFeatures} features active for Free Fire`);
    
    // Buat hidden iframe untuk launch
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;border:none;';
    
    // Daftar scheme Free Fire
    const schemes = [
      'freefiremax://',
      'freefire://',
      'freefiremobile://',
      'com.dts.freefireth://',
      'com.dts.freefiremax://'
    ];
    
    let current = 0;
    
    const tryScheme = () => {
      if (current < schemes.length) {
        console.log(`Trying scheme: ${schemes[current]}`);
        iframe.src = schemes[current] + 'launch';
        document.body.appendChild(iframe);
        
        // Coba scheme berikutnya setelah delay
        setTimeout(() => {
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
          current++;
          tryScheme();
        }, 300);
      } else {
        // Semua scheme gagal, coba web link
        fallbackLaunch();
      }
    };
    
    tryScheme();
  };
  
  const fallbackLaunch = () => {
    console.log('Using web fallback');
    
    // Gunakan window.location dengan delay
    setTimeout(() => {
      window.location.href = 'https://freefiremobile.com/game';
      
      // Jika masih di halaman ini setelah 3 detik, beri opsi kembali
      setTimeout(() => {
        if (document.getElementById('saiiScreen').classList.contains('active')) {
          showNotification('Make sure Free Fire is installed');
        }
      }, 3000);
    }, 500);
  };
  
  // Mulai launch
  launchGame();
  
  // Beri feedback visual
  setTimeout(() => {
    // Reduce opacity sedikit
    document.body.style.opacity = '0.7';
    document.body.style.transition = 'opacity 0.5s';
    
    // Setelah 2 detik, reset opacity
    setTimeout(() => {
      document.body.style.opacity = '1';
      
      // Tambahkan event untuk kembali
      document.addEventListener('click', function backHandler() {
        backToMenu();
        document.removeEventListener('click', backHandler);
      }, { once: true });
    }, 2000);
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
              (key.includes('headshotRate') ? '%' : '');
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
          (this.id.includes('headshotRate') ? '%' : '');
      }
      
      // Save setting
      freeFireSettings[this.id] = parseInt(this.value);
      localStorage.setItem('freeFireSettings', JSON.stringify(freeFireSettings));
    });
  });
  
  // Setup untuk toggle switches Free Fire
  document.querySelectorAll('#freefireScreen .toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', function() {
      // Save setting
      freeFireSettings[this.id] = this.checked;
      localStorage.setItem('freeFireSettings', JSON.stringify(freeFireSettings));
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

// Log startup
console.log('SaiKuto Saii Process loaded');
