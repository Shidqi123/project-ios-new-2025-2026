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

// Silent Launch langsung ke Free Fire
function silentLaunchFreeFire() {
  if (!isIOSDevice()) {
    showNotification('iOS device (iPhone/iPad) required');
    return;
  }

  console.log('Launching Free Fire directly...');
  
  // Multiple launch methods untuk meningkatkan keberhasilan
  const launchMethods = [
    // 1. Scheme URL langsung (jika sudah terinstall)
    () => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = 'freefiremobile://';
      document.body.appendChild(iframe);
      setTimeout(() => document.body.removeChild(iframe), 100);
    },
    
    // 2. Universal Link App Store (fallback)
    () => {
      window.location.href = 'https://apps.apple.com/app/id1300096749';
    },
    
    // 3. Direct App Store link
    () => {
      window.location.href = 'itms-apps://itunes.apple.com/app/id1300096749';
    },
    
    // 4. Alternative App Store link
    () => {
      window.location.href = 'itms-apps://apps.apple.com/us/app/free-fire/id1300096749';
    }
  ];
  
  // Coba semua methods secara berurutan
  let currentMethod = 0;
  
  function tryNextMethod() {
    if (currentMethod < launchMethods.length) {
      try {
        launchMethods[currentMethod]();
      } catch (e) {
        console.log(`Method ${currentMethod + 1} failed, trying next...`);
      }
      currentMethod++;
      
      // Delay antar method
      if (currentMethod < launchMethods.length) {
        setTimeout(tryNextMethod, 300);
      }
    }
  }
  
  // Mulai dengan method pertama
  tryNextMethod();
  
  // Fallback ke App Store jika semua gagal
  setTimeout(() => {
    if (document.hasFocus()) {
      // Masih di web, redirect ke App Store
      window.location.href = 'https://apps.apple.com/app/id1300096749';
    }
  }, 2000);
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  showScreen('mainScreen');
  
  // Preload resources untuk launch lebih smooth
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preconnect';
  preloadLink.href = 'https://apps.apple.com';
  document.head.appendChild(preloadLink);
  
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-2px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
  
  const saiiBtn = document.querySelector('.saii-btn');
  if (saiiBtn) {
    saiiBtn.addEventListener('mousedown', () => {
      saiiBtn.style.transform = 'scale(0.98)';
    });
    saiiBtn.addEventListener('mouseup', () => {
      saiiBtn.style.transform = 'scale(1) translateY(-2px)';
    });
    saiiBtn.addEventListener('mouseleave', () => {
      saiiBtn.style.transform = 'scale(1)';
    });
    
    // Tambahkan touch events untuk iPad
    saiiBtn.addEventListener('touchstart', () => {
      saiiBtn.style.transform = 'scale(0.98)';
    });
    saiiBtn.addEventListener('touchend', () => {
      saiiBtn.style.transform = 'scale(1)';
      startSaii();
    });
  }
  
  // Tambahkan click handler untuk launch button
  const launchBtn = document.getElementById('launchBtn');
  if (launchBtn) {
    launchBtn.addEventListener('click', startSaii);
    launchBtn.addEventListener('touchend', startSaii);
  }
});
