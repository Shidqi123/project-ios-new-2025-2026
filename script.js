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
  const textElement = element.querySelector('.text') || element;
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

// Method SILENT launch tanpa popup (iOS 9+)
function iosSilentLaunch(scheme) {
  console.log('Attempting silent launch with:', scheme);
  
  // Method 1: Menggunakan iframe dengan timeout sangat singkat
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:absolute;width:1px;height:1px;left:-9999px;top:-9999px;border:none;visibility:hidden;';
  iframe.sandbox = 'allow-scripts allow-same-origin';
  iframe.src = scheme;
  
  // Attach ke body tapi jangan tampilkan
  document.body.appendChild(iframe);
  
  // Segera hapus untuk menghindari error
  setTimeout(() => {
    if (iframe.parentNode) {
      try {
        document.body.removeChild(iframe);
      } catch (e) {
        console.log('Iframe cleanup');
      }
    }
  }, 10);
  
  // Method 2: XMLHttpRequest untuk trigger tanpa redirect
  setTimeout(() => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', scheme, true);
      xhr.timeout = 100;
      xhr.send();
    } catch (e) {
      console.log('XHR method attempted');
    }
  }, 20);
  
  // Method 3: WebSocket connection (jarang diblokir)
  setTimeout(() => {
    try {
      const ws = new WebSocket(`ws://localhost/${scheme.replace('://', '')}`);
      setTimeout(() => {
        if (ws) ws.close();
      }, 50);
    } catch (e) {
      console.log('WebSocket method attempted');
    }
  }, 30);
  
  // Method 4: fetch API dengan mode 'no-cors'
  setTimeout(() => {
    try {
      fetch(scheme, { mode: 'no-cors', cache: 'no-store' });
    } catch (e) {
      console.log('Fetch method attempted');
    }
  }, 40);
  
  return true;
}

// Main silent launch function - REVISI AKHIR
function silentLaunchFreeFire() {
  if (!isIOSDevice()) {
    showNotification('iOS device (iPhone/iPad) required');
    return;
  }

  console.log('Starting SILENT launch sequence...');
  
  // Scheme yang paling umum bekerja tanpa popup - REVISI
  const silentSchemes = [
    // Free Fire MAX schemes (prioritas)
    'freefiremax://',
    'com.dts.freefiremax://',
    'ffmax://',
    'freefire-max://',
    
    // Free Fire regular schemes
    'freefire://',
    'freefiremobile://',
    'com.dts.freefireth://',
    'ff://',
    'freefirenow://'
  ];
  
  // Coba semua scheme secara bertahap
  let attemptCount = 0;
  const maxAttempts = silentSchemes.length;
  
  function attemptLaunch() {
    if (attemptCount >= maxAttempts) {
      // Semua scheme dicoba, beri feedback positif
      setTimeout(() => {
        showNotification('Launching Free Fire...');
        
        // Auto hide page untuk clean exit
        setTimeout(() => {
          try {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s';
            
            // Redirect ke about:blank untuk menghindari error page
            setTimeout(() => {
              window.location.href = 'about:blank';
            }, 1000);
            
          } catch (e) {
            console.log('Clean exit sequence completed');
          }
        }, 1500);
      }, 1000);
      return;
    }
    
    const scheme = silentSchemes[attemptCount];
    console.log(`Silent attempt ${attemptCount + 1}: ${scheme}`);
    
    iosSilentLaunch(scheme);
    
    attemptCount++;
    
    // Coba scheme berikutnya dengan delay
    if (attemptCount < maxAttempts) {
      setTimeout(attemptLaunch, 200);
    }
  }
  
  // Mulai proses launch
  attemptLaunch();
  
  // Set timeout untuk auto-hide
  setTimeout(() => {
    // Sembunyikan halaman untuk memberikan kesan app terbuka
    document.documentElement.style.opacity = '0';
    document.documentElement.style.transition = 'opacity 0.3s';
    
    // Setelah halaman tersembunyi, redirect ke blank
    setTimeout(() => {
      try {
        // Coba close window/tab jika memungkinkan
        if (window.history.length <= 1) {
          window.close();
        } else {
          // Redirect ke blank page untuk menghindari Safari error
          window.location.replace('about:blank');
        }
      } catch (e) {
        // Fallback ke blank page
        window.location.href = 'about:blank';
      }
    }, 300);
  }, 3000);
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  showScreen('mainScreen');
  
  // Setup untuk tombol Saii
  const saiiBtn = document.querySelector('.saii-btn');
  if (saiiBtn) {
    // Event handler yang sangat minimal
    const handleLaunch = (e) => {
      if (e) e.preventDefault();
      saiiBtn.style.transform = 'scale(0.98)';
      setTimeout(() => {
        saiiBtn.style.transform = 'scale(1)';
        startSaii();
      }, 150);
    };
    
    saiiBtn.addEventListener('click', handleLaunch);
    saiiBtn.addEventListener('touchend', handleLaunch);
    
    // Hapus semua hover effects yang bisa trigger popup
    saiiBtn.addEventListener('mouseenter', () => {
      saiiBtn.style.transform = 'translateY(-2px)';
    });
    saiiBtn.addEventListener('mouseleave', () => {
      saiiBtn.style.transform = 'translateY(0)';
    });
  }
  
  // Setup untuk card (menu cards)
  document.querySelectorAll('.card').forEach(card => {
    // Hanya untuk card yang tidak ada onclick di HTML
    if (!card.getAttribute('onclick')) {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        startSaii();
      });
      card.addEventListener('touchend', (e) => {
        e.preventDefault();
        startSaii();
      });
    }
  });
  
  // Setup toggle switches
  document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', function() {
      showNotification(`${this.id} ${this.checked ? 'enabled' : 'disabled'}`);
    });
  });
  
  // Setup theme select
  const themeSelect = document.querySelector('.theme-select');
  if (themeSelect) {
    themeSelect.addEventListener('change', function() {
      showNotification(`Theme changed to ${this.value}`);
    });
  }
});

// Prevent default behavior yang bisa menyebabkan popup
window.addEventListener('beforeunload', function(e) {
  // Prevent confirmation dialog
  e.preventDefault();
  e.returnValue = '';
});

// Block semua alert/confirm/prompt system
const originalAlert = window.alert;
const originalConfirm = window.confirm;
const originalPrompt = window.prompt;

window.alert = function() { 
  console.log('Alert blocked:', arguments[0]);
  return undefined;
};

window.confirm = function() { 
  console.log('Confirm blocked:', arguments[0]);
  return true; // Always return true to prevent popups
};

window.prompt = function() { 
  console.log('Prompt blocked:', arguments[0]);
  return ''; // Return empty string
};

// Override window.open untuk mencegah popup baru
const originalOpen = window.open;
window.open = function(url, target, features) {
  console.log('Window.open blocked for:', url);
  // Alihkan ke scheme jika mencoba buka URL baru
  if (url && url.includes('freefire')) {
    return null;
  }
  return originalOpen.call(window, url, target, features);
};

// Blokir semua error popups
window.onerror = function(message, source, lineno, colno, error) {
  console.log('Error suppressed:', message);
  return true; // Mencegah error dialog
};

// Blokir unhandled rejections
window.addEventListener('unhandledrejection', function(event) {
  event.preventDefault();
  console.log('Promise rejection suppressed:', event.reason);
});
