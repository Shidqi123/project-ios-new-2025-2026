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

// Fungsi untuk membuka aplikasi dengan scheme URL
function openAppWithScheme(scheme, fallback) {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'display:none;border:0;width:0;height:0;';
    iframe.src = scheme;
    
    document.body.appendChild(iframe);
    
    // Cek apakah aplikasi terbuka
    setTimeout(() => {
      const appOpened = !document.hasFocus();
      
      // Hapus iframe
      setTimeout(() => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
      }, 100);
      
      // Jika aplikasi tidak terbuka dan ada fallback, coba fallback
      if (!appOpened && fallback) {
        setTimeout(() => {
          window.location.href = fallback;
        }, 300);
      }
      
      resolve(appOpened);
    }, 500);
  });
}

// Silent Launch langsung ke aplikasi Free Fire
function silentLaunchFreeFire() {
  if (!isIOSDevice()) {
    showNotification('iOS device (iPhone/iPad) required');
    return;
  }

  console.log('Attempting to launch Free Fire...');
  
  // Daftar scheme URLs untuk Free Fire (tanpa App Store)
  const freeFireSchemes = [
    // Free Fire MAX
    'freefiremax://',
    'com.dts.freefiremax://',
    'com.garena.game.freefiremax://',
    
    // Free Fire Original
    'freefiremobile://',
    'com.dts.freefireth://',
    'com.garena.game.freefire://',
    'freefire://',
    
    // Scheme alternatif
    'garena-freefire://',
    'ff-game://',
    'fflaunch://'
  ];
  
  // URL fallback khusus untuk Indonesia (tanpa region lock)
  const indonesiaFallback = 'https://apps.apple.com/id/app/free-fire/id1300096749';
  const indonesiaFallbackMax = 'https://apps.apple.com/id/app/free-fire-max/id1583327865';
  
  let currentIndex = 0;
  
  function tryNextScheme() {
    if (currentIndex < freeFireSchemes.length) {
      const scheme = freeFireSchemes[currentIndex];
      const fallback = scheme.includes('max') ? indonesiaFallbackMax : indonesiaFallback;
      
      console.log(`Trying scheme: ${scheme}`);
      
      openAppWithScheme(scheme, fallback).then((appOpened) => {
        if (!appOpened) {
          currentIndex++;
          
          if (currentIndex < freeFireSchemes.length) {
            // Coba scheme berikutnya dengan delay
            setTimeout(tryNextScheme, 300);
          } else {
            // Semua scheme gagal, tampilkan pilihan
            showNotification('Free Fire not installed');
            setTimeout(() => {
              // Tampilkan pilihan install
              if (confirm('Free Fire is not installed. Would you like to install Free Fire MAX (recommended) or Free Fire Original?')) {
                const installMax = confirm('Install Free Fire MAX with better graphics?\nOK for MAX, Cancel for Original');
                if (installMax) {
                  window.location.href = indonesiaFallbackMax;
                } else {
                  window.location.href = indonesiaFallback;
                }
              }
            }, 1000);
          }
        } else {
          console.log('Successfully opened with scheme:', scheme);
        }
      });
    }
  }
  
  // Mulai mencoba scheme pertama
  tryNextScheme();
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  showScreen('mainScreen');
  
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
});
