// Simpan status fitur
let freeFireSettings = {
  aimAssist: true,
  headshotRate: 90,
  lockSpeed: 7,
  antiBan: true,
  autoUpdate: true
};

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

// Kembali ke menu dari screen launch
function backToMenu() {
  showScreen('mainScreen');
  document.body.style.opacity = '1';
  document.body.style.transition = '';
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

// Typewriter effect
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

// Fungsi launch game
function launchGame() {
  showScreen('saiiScreen');
  
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.querySelector('.progress-percent');
  const progressLabel = document.querySelector('.progress-label span');
  
  progressBar.style.width = '0%';
  progressPercent.textContent = '0%';
  progressLabel.textContent = 'Initializing...';
  
  const sequences = [
    { lineId: 'line2', text: 'Loading aimbot module...', delay: 500, typingSpeed: 40, progress: 20 },
    { lineId: 'line3', text: 'Setting headshot rate to ' + freeFireSettings.headshotRate + '%...', delay: 1500, typingSpeed: 40, progress: 40 },
    { lineId: 'line4', text: 'Activating anti-ban protection...', delay: 2500, typingSpeed: 40, progress: 60 },
    { lineId: 'line5', text: 'Preparing to launch Free Fire...', delay: 3500, typingSpeed: 40, progress: 80 },
    { lineId: 'line5', text: 'Ready! Launching game...', delay: 4500, typingSpeed: 50, progress: 100 }
  ];
  
  sequences.forEach((seq, index) => {
    setTimeout(() => {
      typeWithBlur(seq.lineId, seq.text, seq.typingSpeed, () => {
        progressBar.style.width = seq.progress + '%';
        progressPercent.textContent = seq.progress + '%';
        
        if (seq.progress === 20) progressLabel.textContent = 'Loading modules...';
        if (seq.progress === 40) progressLabel.textContent = 'Configuring...';
        if (seq.progress === 60) progressLabel.textContent = 'Securing...';
        if (seq.progress === 80) progressLabel.textContent = 'Preparing...';
        if (seq.progress === 100) progressLabel.textContent = 'Launching...';
        
        if (seq.progress === 100) {
          setTimeout(() => {
            startGameLaunch();
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

// Fungsi utama untuk launch game
function startGameLaunch() {
  if (!isIOSDevice()) {
    showNotification('iOS device (iPhone/iPad) required');
    setTimeout(() => backToMenu(), 2000);
    return;
  }

  console.log('Launching Free Fire with features...');
  console.log('Active features:', freeFireSettings);
  
  // Show feedback
  showNotification('Opening Free Fire...');
  
  // Method 1: Universal Link langsung tanpa popup
  const launchGame = () => {
    // Coba semua scheme yang mungkin
    const schemes = [
      'freefiremax://',
      'freefire://',
      'freefiremobile://',
      'com.dts.freefireth://',
      'com.dts.freefiremax://'
    ];
    
    // Buat hidden iframe untuk launch tanpa popup
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.opacity = '0';
    
    // Coba semua scheme
    let currentScheme = 0;
    
    const tryNextScheme = () => {
      if (currentScheme < schemes.length) {
        console.log('Trying scheme:', schemes[currentScheme]);
        iframe.src = schemes[currentScheme] + '?launch=1';
        document.body.appendChild(iframe);
        
        // Jika iframe gagal, coba scheme berikutnya
        setTimeout(() => {
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
          currentScheme++;
          tryNextScheme();
        }, 300);
      } else {
        // Semua scheme gagal, tampilkan fallback
        fallbackLaunch();
      }
    };
    
    tryNextScheme();
  };
  
  // Fallback jika semua scheme gagal
  const fallbackLaunch = () => {
    console.log('Using fallback launch method');
    
    // Coba window location dengan timeout
    setTimeout(() => {
      window.location.href = 'https://freefiremobile.com/game';
    }, 500);
    
    // Setelah 3 detik, kembali ke menu jika masih di halaman ini
    setTimeout(() => {
      if (document.getElementById('saiiScreen').classList.contains('active')) {
        showNotification('Cannot open Free Fire. Make sure it is installed.');
        setTimeout(() => backToMenu(), 2000);
      }
    }, 3000);
  };
  
  // Mulai proses launch
  launchGame();
  
  // Setelah 2 detik, kembali ke menu secara otomatis
  // Ini memungkinkan user bisa kembali ke app
  setTimeout(() => {
    // Hanya fade out sedikit, bukan menghilang total
    document.body.style.opacity = '0.3';
    document.body.style.transition = 'opacity 0.5s';
    
    // Setelah fade, beri tombol back
    setTimeout(() => {
      // User masih bisa kembali dengan mengetuk layar
      document.addEventListener('click', function handler() {
        backToMenu();
        document.removeEventListener('click', handler);
      });
    }, 1000);
  }, 2000);
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
  
  // Setup untuk tombol launch
  const launchBtns = document.querySelectorAll('.saii-btn, .launch-btn');
  launchBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.style.transform = 'scale(0.98)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
        launchGame();
      }, 150);
    });
    
    // Hover effects
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
    });
  });
  
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
      
      showNotification(`${this.id.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} set to ${this.value}${this.id.includes('headshotRate') ? '%' : ''}`);
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
  { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
  { name: 'mobile-web-app-capable', content: 'yes' },
  { name: 'format-detection', content: 'telephone=no' },
  { name: 'apple-mobile-web-app-title', content: 'SaiKuto' }
];

metaTags.forEach(tag => {
  const meta = document.createElement('meta');
  meta.name = tag.name;
  meta.content = tag.content;
  document.head.appendChild(meta);
});

// Tambahkan link untuk app icon
const appleTouchIcon = document.createElement('link');
appleTouchIcon.rel = 'apple-touch-icon';
appleTouchIcon.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎮</text></svg>';
document.head.appendChild(appleTouchIcon);

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

// Tambahkan event listener untuk back button
window.addEventListener('pageshow', function(event) {
  if (event.persisted) {
    // Page was restored from bfcache
    showScreen('mainScreen');
    document.body.style.opacity = '1';
  }
});

// Log startup
console.log('SaiKuto Free Fire Launcher loaded');
console.log('Features: Aimbot, Headshot Control, Anti-Ban');
