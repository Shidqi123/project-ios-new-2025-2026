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

// Silent Launch yang otomatis coba kedua versi
function silentLaunchFreeFire() {
  if (!isIOSDevice()) {
    showNotification('iOS device (iPhone/iPad) required');
    return;
  }

  console.log('Launching Free Fire (trying both versions)...');
  
  // Semua scheme URLs untuk Free Fire biasa dan MAX
  const launchMethods = [
    // 1. Coba Free Fire MAX dulu (prioritas tinggi)
    () => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'freefiremax://';
      document.body.appendChild(iframe);
      setTimeout(() => document.body.removeChild(iframe), 100);
    },
    
    // 2. Coba Free Fire MAX alternate scheme
    () => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'com.dts.freefiremax://';
      document.body.appendChild(iframe);
      setTimeout(() => document.body.removeChild(iframe), 100);
    },
    
    // 3. Coba Free Fire biasa
    () => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'freefiremobile://';
      document.body.appendChild(iframe);
      setTimeout(() => document.body.removeChild(iframe), 100);
    },
    
    // 4. Coba Free Fire biasa alternate scheme
    () => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'com.dts.freefireth://';
      document.body.appendChild(iframe);
      setTimeout(() => document.body.removeChild(iframe), 100);
    },
    
    // 5. Universal Link App Store Free Fire MAX
    () => {
      window.location.href = 'https://apps.apple.com/app/id1583327865';
    },
    
    // 6. Universal Link App Store Free Fire biasa
    () => {
      window.location.href = 'https://apps.apple.com/app/id1300096749';
    }
  ];
  
  // Coba semua methods secara berurutan
  let currentMethod = 0;
  let launched = false;
  
  function tryNextMethod() {
    if (currentMethod < launchMethods.length && !launched) {
      try {
        launchMethods[currentMethod]();
        
        // Cek apakah launch berhasil (aplikasi terbuka)
        setTimeout(() => {
          if (!document.hasFocus() && !launched) {
            // Aplikasi berhasil terbuka
            launched = true;
            console.log('Launch successful with method', currentMethod + 1);
          }
        }, 100);
        
      } catch (e) {
        console.log(`Method ${currentMethod + 1} failed, trying next...`);
      }
      currentMethod++;
      
      // Delay antar method
      if (currentMethod < launchMethods.length && !launched) {
        setTimeout(tryNextMethod, 200);
      }
    }
  }
  
  // Mulai dengan method pertama
  tryNextMethod();
  
  // Fallback ke App Store jika semua gagal
  setTimeout(() => {
    if (document.hasFocus() && !launched) {
      // Masih di web, coba App Store secara random
      const randomStore = Math.random() > 0.5 ? 
        'https://apps.apple.com/app/id1583327865' : // Free Fire MAX
        'https://apps.apple.com/app/id1300096749';  // Free Fire biasa
      window.location.href = randomStore;
    }
  }, 2500);
}

// Smart detection untuk cek versi mana yang terinstall
function detectInstalledVersion() {
  return new Promise((resolve) => {
    const versions = [
      { name: 'max', scheme: 'freefiremax://' },
      { name: 'regular', scheme: 'freefiremobile://' }
    ];
    
    let detected = 'regular'; // default
    
    versions.forEach(version => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = version.scheme;
      
      iframe.onload = function() {
        setTimeout(() => {
          if (!document.hasFocus()) {
            detected = version.name;
          }
        }, 100);
      };
      
      document.body.appendChild(iframe);
      setTimeout(() => document.body.removeChild(iframe), 50);
    });
    
    setTimeout(() => resolve(detected), 300);
  });
}

// Inisialisasi dengan smart detection
document.addEventListener('DOMContentLoaded', () => {
  showScreen('mainScreen');
  
  // Preload resources
  const preloadLinks = [
    'https://apps.apple.com',
    'https://itunes.apple.com'
  ];
  
  preloadLinks.forEach(url => {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preconnect';
    preloadLink.href = url;
    document.head.appendChild(preloadLink);
  });
  
  // Setup untuk tombol launch
  const launchBtn = document.querySelector('.launch-btn, .saii-btn');
  if (launchBtn) {
    launchBtn.addEventListener('mousedown', () => {
      launchBtn.style.transform = 'scale(0.98)';
    });
    launchBtn.addEventListener('mouseup', () => {
      launchBtn.style.transform = 'scale(1)';
    });
    launchBtn.addEventListener('mouseleave', () => {
      launchBtn.style.transform = 'scale(1)';
    });
    
    // Touch events untuk iPad
    launchBtn.addEventListener('touchstart', () => {
      launchBtn.style.transform = 'scale(0.98)';
    });
    launchBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      launchBtn.style.transform = 'scale(1)';
      startSaii();
    });
    
    launchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      startSaii();
    });
  }
  
  // Card hover effects
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-2px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
    
    // Jika card diklik, langsung launch juga
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card')) {
        startSaii();
      }
    });
    
    card.addEventListener('touchend', (e) => {
      if (e.target.closest('.card')) {
        startSaii();
      }
    });
  });
  
  // Auto-start jika ada parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('launch') === 'true') {
    setTimeout(startSaii, 1000);
  }
});
