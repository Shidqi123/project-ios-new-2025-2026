// Navigasi antar screen
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

// Tampilkan notifikasi
function showNotification(message) {
  // Coba gunakan Web Notifications API jika tersedia dan app berjalan sebagai PWA
  if ('Notification' in window && Notification.permission === 'granted' && isRunningAsPWA()) {
    new Notification('Saikuto', {
      body: message,
      icon: '/icon-192.png',
      silent: true
    });
  } else {
    // Fallback ke toast notification
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 2000);
  }
}

// Deteksi apakah app berjalan sebagai PWA
function isRunningAsPWA() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone ||
         document.referrer.includes('android-app://');
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
  
  // Simpan state sebelum launch
  sessionStorage.setItem('saikutoLastAction', 'launchingFreeFire');
  sessionStorage.setItem('saikutoLaunchTime', Date.now());
  
  // Save app state untuk kembali nanti
  if (isRunningAsPWA()) {
    localStorage.setItem('saikutoAppState', JSON.stringify({
      lastScreen: 'saiiScreen',
      timestamp: Date.now()
    }));
  }
  
  // Gunakan beberapa metode sekaligus untuk meningkatkan keberhasilan
  const launchAttempts = [
    // Method 1: Universal Links dengan timeout
    () => {
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;border:none;';
      iframe.src = 'https://freefiremobile.com/game';
      document.body.appendChild(iframe);
      setTimeout(() => {
        if (iframe.parentNode) document.body.removeChild(iframe);
      }, 100);
    },
    
    // Method 2: Deep link langsung
    () => {
      window.location.href = 'freefiremax://launch';
    },
    
    // Method 3: Alternate scheme dengan fallback
    () => {
      setTimeout(() => {
        window.location.href = 'freefire://';
      }, 50);
    },
    
    // Method 4: Alternate universal link
    () => {
      setTimeout(() => {
        window.location.href = 'https://freefiremobile.com/open-app';
      }, 100);
    }
  ];
  
  // Eksekusi semua metode dengan jeda
  launchAttempts.forEach((method, index) => {
    setTimeout(method, index * 150);
  });
  
  // Jika berjalan sebagai PWA, tampilkan layar loading untuk mencegah reload browser
  if (isRunningAsPWA()) {
    setTimeout(() => {
      document.body.innerHTML = `
        <div style="
          background: #000;
          color: #fff;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
          padding: 20px;
          text-align: center;
        ">
          <div style="font-size: 48px; margin-bottom: 20px;">🎮</div>
          <h1 style="margin-bottom: 10px;">Launching Free Fire...</h1>
          <p style="color: #8a8a8e; margin-bottom: 30px;">You can return to Saikuto from the app switcher</p>
          <div style="
            width: 100px;
            height: 4px;
            background: linear-gradient(90deg, #ff7a00, #ff0058);
            border-radius: 2px;
            margin: 20px 0;
            animation: pulse 1.5s infinite;
          "></div>
          <button onclick="window.location.reload()" style="
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            color: white;
            padding: 12px 24px;
            border-radius: 12px;
            margin-top: 30px;
            cursor: pointer;
          ">
            Return to Saikuto
          </button>
        </div>
      `;
    }, 2000);
  }
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  showScreen('mainScreen');
  
  // Cek apakah ada state yang tersimpan untuk PWA
  if (isRunningAsPWA()) {
    const savedState = localStorage.getItem('saikutoAppState');
    if (savedState) {
      const state = JSON.parse(savedState);
      // Jika belum 30 detik sejak terakhir launch, tetap di main screen
      if (Date.now() - state.timestamp < 30000) {
        showScreen(state.lastScreen || 'mainScreen');
      }
    }
    
    // Sembunyikan browser UI
    document.body.style.overflow = 'hidden';
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
  
  // Preload resources
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preconnect';
  preloadLink.href = 'https://freefiremobile.com';
  document.head.appendChild(preloadLink);
  
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
  
  // Setup untuk toggle switches
  document.querySelectorAll('.toggle-switch input').forEach(toggle => {
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
  
  // Tampilkan install prompt jika belum diinstall
  let deferredPrompt;
  const installPrompt = document.getElementById('installPrompt');
  const installBtn = document.getElementById('installBtn');
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Tampilkan install prompt setelah 3 detik
    setTimeout(() => {
      if (!isRunningAsPWA()) {
        installPrompt.style.display = 'flex';
      }
    }, 3000);
  });
  
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        installPrompt.style.display = 'none';
        showNotification('Saikuto installed successfully!');
      }
      
      deferredPrompt = null;
    });
  }
});

// Register Service Worker untuk PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registered:', registration.scope);
        
        // Periksa update
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showNotification('New version available! Refresh to update.');
            }
          });
        });
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}

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

// Handle visibility change untuk PWA
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && isRunningAsPWA()) {
    // App kembali ke foreground
    console.log('App returned to foreground');
  }
});

// Handle page hide/show untuk iOS
let pageHideTime;
window.addEventListener('pagehide', () => {
  pageHideTime = Date.now();
});

window.addEventListener('pageshow', () => {
  if (pageHideTime && Date.now() - pageHideTime > 1000) {
    // User kembali setelah >1 detik, mungkin dari Free Fire
    if (isRunningAsPWA()) {
      showScreen('mainScreen');
      showNotification('Welcome back to Saikuto');
    }
  }
});
