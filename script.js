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
  showScreen('hijackScreen');
  
  // Reset semua elemen
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.querySelector('.progress-percent');
  const progressLabel = document.querySelector('.progress-label span');
  
  progressBar.style.width = '0%';
  progressPercent.textContent = '0%';
  progressLabel.textContent = 'Initializing...';
  
  // Sequence animasi
  const sequences = [
    {
      lineId: 'line2',
      text: 'Verifying system compatibility...',
      delay: 500,
      typingSpeed: 40,
      progress: 25
    },
    {
      lineId: 'line3',
      text: 'Patching critical binaries...',
      delay: 1800,
      typingSpeed: 40,
      progress: 50
    },
    {
      lineId: 'line4',
      text: 'Bypassing security checks...',
      delay: 3100,
      typingSpeed: 40,
      progress: 75
    },
    {
      lineId: 'line5',
      text: 'Launching Free Fire...',
      delay: 4400,
      typingSpeed: 50,
      progress: 100
    }
  ];
  
  // Jalankan animasi sequence
  sequences.forEach((seq, index) => {
    setTimeout(() => {
      typeWithBlur(seq.lineId, seq.text, seq.typingSpeed, () => {
        // Update progress bar
        progressBar.style.width = seq.progress + '%';
        progressPercent.textContent = seq.progress + '%';
        
        // Update label
        if (seq.progress === 25) progressLabel.textContent = 'Verifying...';
        if (seq.progress === 50) progressLabel.textContent = 'Patching...';
        if (seq.progress === 75) progressLabel.textContent = 'Bypassing...';
        if (seq.progress === 100) progressLabel.textContent = 'Launching...';
        
        // Jika ini step terakhir, buka Free Fire
        if (seq.progress === 100) {
          setTimeout(() => {
            openFreeFireIOS();
          }, 1000);
        }
      });
    }, seq.delay);
  });
}

// Deteksi iOS yang lebih akurat (termasuk iPad)
function isIOSDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Deteksi iOS (termasuk iPad)
  const iosRegex = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  
  // Deteksi Safari di iOS
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  
  // Deteksi iOS version
  const isIOS = iosRegex || 
                (/Mac/.test(navigator.userAgent) && 'ontouchend' in document) || // iPad dengan macOS mode
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad Pro
  
  return isIOS;
}

// Fungsi untuk buka Free Fire di iOS
function openFreeFireIOS() {
  console.log('User Agent:', navigator.userAgent);
  console.log('Platform:', navigator.platform);
  
  // Cek apakah ini iOS dengan deteksi yang lebih baik
  if (!isIOSDevice()) {
    showNotification('iOS/iPad device required');
    console.log('Not an iOS device');
    return;
  }
  
  console.log('iOS/iPad detected, proceeding...');
  
  // URL untuk Free Fire iOS (skema yang benar)
  const freefireSchemes = [
    'freefire://',                    // Skema standar Free Fire
    'freefiremax://',                 // Skema Free Fire MAX
    'com.dts.freefireth://',          // Bundle ID Free Fire
    'com.garena.games.ffios://',      // Bundle ID alternatif
    'itms-apps://itunes.apple.com/app/id1300096749?action=write-review', // Deep link App Store
    'https://apps.apple.com/app/id1300096749' // Web App Store
  ];
  
  // Flag untuk tracking
  let appOpened = false;
  const startTime = Date.now();
  
  // Event listener untuk detect app terbuka
  const visibilityHandler = () => {
    if (document.hidden || document.visibilityState === 'hidden') {
      appOpened = true;
      console.log('App successfully launched!');
    }
  };
  
  document.addEventListener('visibilitychange', visibilityHandler);
  
  // Fungsi untuk cek timeout
  function isTimeout() {
    return (Date.now() - startTime) > 2500; // 2.5 detik
  }
  
  // Fungsi utama untuk coba buka app
  function tryOpenApp(schemeIndex = 0) {
    if (schemeIndex >= freefireSchemes.length || appOpened || isTimeout()) {
      // Jika semua skema dicoba atau timeout, buka App Store
      if (!appOpened) {
        console.log('Opening App Store...');
        document.removeEventListener('visibilitychange', visibilityHandler);
        window.location.href = freefireSchemes[freefireSchemes.length - 1]; // Web App Store
      }
      return;
    }
    
    const scheme = freefireSchemes[schemeIndex];
    console.log(`Trying scheme ${schemeIndex + 1}: ${scheme}`);
    
    // Teknik: Gunakan window.location langsung
    try {
      window.location.href = scheme;
    } catch (e) {
      console.log(`Error with scheme ${scheme}:`, e);
    }
    
    // Tunggu 500ms, lalu coba skema berikutnya jika belum terbuka
    setTimeout(() => {
      if (!appOpened && !isTimeout()) {
        tryOpenApp(schemeIndex + 1);
      }
    }, 500);
  }
  
  // Mulai proses
  tryOpenApp(0);
  
  // Fallback timeout (3 detik)
  setTimeout(() => {
    if (!appOpened) {
      console.log('Timeout, opening App Store...');
      document.removeEventListener('visibilitychange', visibilityHandler);
      window.location.href = 'https://apps.apple.com/app/id1300096749';
    }
  }, 3000);
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  showScreen('mainScreen');
  
  // Hover effect untuk cards
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-2px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
  
  // Animasi tombol saii
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
  }
  
  // Log device info
  console.log('Device Info:');
  console.log('- User Agent:', navigator.userAgent);
  console.log('- Platform:', navigator.platform);
  console.log('- iOS Device?', isIOSDevice());
});
