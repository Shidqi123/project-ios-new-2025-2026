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

// Fungsi khusus untuk buka Free Fire di iOS
function openFreeFireIOS() {
  // Cek apakah ini benar-benar iOS
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (!isIOS) {
    // Jika bukan iOS, tampilkan pesan
    showNotification('This tool is for iOS devices only');
    setTimeout(() => {
      window.location.href = 'https://www.apple.com/ios/';
    }, 2000);
    return;
  }
  
  // Deep links untuk Free Fire di iOS
  const freefireIOSLinks = [
    'freefire://',                    // URL Scheme biasa
    'freefiremax://',                 // URL Scheme Free Fire MAX
    'com.garena.games.ffios://',      // Bundle ID URL Scheme
    'https://ff.garena.com/',         // Universal Link
    'itms-apps://itunes.apple.com/app/id1300096749' // Direct App Store
  ];
  
  console.log('iOS device detected, launching Free Fire...');
  
  // Teknik 1: Coba URL Scheme langsung
  function tryDirectScheme() {
    try {
      // Coba Free Fire biasa
      window.location.href = freefireIOSLinks[0];
      
      // Set timeout untuk cek apakah berhasil
      setTimeout(() => {
        // Jika setelah 800ms masih di halaman ini, coba link lain
        if (document.visibilityState !== 'hidden') {
          tryIframeMethod();
        }
      }, 800);
      
      return true;
    } catch (e) {
      console.log('Direct scheme failed:', e);
      return false;
    }
  }
  
  // Teknik 2: Gunakan iframe (fallback)
  function tryIframeMethod() {
    try {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      iframe.style.width = '0';
      iframe.style.height = '0';
      
      // Coba beberapa scheme
      iframe.src = freefireIOSLinks[0];
      document.body.appendChild(iframe);
      
      // Set timeout untuk coba scheme kedua
      setTimeout(() => {
        if (document.visibilityState !== 'hidden') {
          // Coba Free Fire MAX
          iframe.src = freefireIOSLinks[1];
        }
      }, 300);
      
      // Set timeout untuk universal link
      setTimeout(() => {
        if (document.visibilityState !== 'hidden') {
          // Coba universal link
          window.location.href = freefireIOSLinks[3];
        }
      }, 600);
      
      // Hapus iframe setelah beberapa detik
      setTimeout(() => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
      }, 2000);
      
      return true;
    } catch (e) {
      console.log('Iframe method failed:', e);
      return false;
    }
  }
  
  // Teknik 3: Direct App Store
  function openAppStore() {
    setTimeout(() => {
      window.location.href = freefireIOSLinks[4];
    }, 1000);
  }
  
  // Event listener untuk detect app terbuka
  let appLaunched = false;
  
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      appLaunched = true;
      console.log('Free Fire app launched successfully!');
    }
  });
  
  // Mulai proses
  tryDirectScheme();
  
  // Fallback ke App Store jika setelah 2 detik belum terbuka
  setTimeout(() => {
    if (!appLaunched && document.visibilityState !== 'hidden') {
      console.log('App not launched, opening App Store...');
      openAppStore();
    }
  }, 2000);
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
});
