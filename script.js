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
            silentOpenFreeFireIOS();
          }, 1000);
        }
      });
    }, seq.delay);
  });
}

// Fungsi khusus untuk buka Free Fire di iOS tanpa prompt
function silentOpenFreeFireIOS() {
  // Cek apakah ini iOS
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (!isIOS) {
    showNotification('iOS device required');
    return;
  }
  
  // URL untuk Free Fire di iOS
  const freefireURL = 'freefire://';
  const freefireMAXURL = 'freefiremax://';
  const appStoreURL = 'itms-apps://itunes.apple.com/app/id1300096749';
  const webAppStoreURL = 'https://apps.apple.com/app/id1300096749';
  
  console.log('Attempting to launch Free Fire on iOS...');
  
  // Flag untuk menandai apakah app berhasil terbuka
  let appLaunched = false;
  
  // Event listener untuk mendeteksi jika app terbuka (tab menjadi hidden)
  document.addEventListener('visibilitychange', function() {
    if (document.hidden || document.visibilityState === 'hidden') {
      appLaunched = true;
      console.log('Free Fire launched successfully!');
    }
  });
  
  // Start time untuk timeout
  const startTime = Date.now();
  
  // Fungsi untuk cek apakah sudah timeout
  function checkTimeout() {
    const elapsed = Date.now() - startTime;
    return elapsed > 2000; // 2 detik timeout
  }
  
  // Teknik 1: Coba dengan iframe invisible (lebih stealth)
  function trySilentLaunch() {
    try {
      // Teknik iframe dengan user gesture
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.position = 'absolute';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      
      // Coba Free Fire biasa dulu
      iframe.src = freefireURL;
      document.body.appendChild(iframe);
      
      console.log('Trying Free Fire URL scheme...');
      
      // Set timeout untuk coba Free Fire MAX jika pertama gagal
      setTimeout(() => {
        if (!appLaunched && !checkTimeout()) {
          console.log('Trying Free Fire MAX URL scheme...');
          iframe.src = freefireMAXURL;
        }
      }, 500);
      
      // Set timeout untuk fallback ke App Store
      setTimeout(() => {
        if (!appLaunched || document.visibilityState === 'visible') {
          console.log('Fallback to App Store...');
          openAppStore();
        }
      }, 1500);
      
      // Cleanup iframe
      setTimeout(() => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
      }, 2000);
      
      return true;
    } catch (e) {
      console.log('Silent launch failed:', e);
      return false;
    }
  }
  
  // Fungsi untuk buka App Store
  function openAppStore() {
    // Coba deep link App Store dulu
    window.location.href = appStoreURL;
    
    // Fallback ke web App Store jika deep link gagal
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        window.location.href = webAppStoreURL;
      }
    }, 1000);
  }
  
  // Teknik 2: Direct window location (fallback)
  function tryDirectLaunch() {
    try {
      window.location.href = freefireURL;
      return true;
    } catch (e) {
      console.log('Direct launch failed:', e);
      return false;
    }
  }
  
  // Mulai dengan teknik silent terlebih dahulu
  trySilentLaunch();
  
  // Backup: Jika setelah 1 detik masih belum terbuka, coba direct
  setTimeout(() => {
    if (!appLaunched && document.visibilityState === 'visible') {
      console.log('Trying direct launch...');
      tryDirectLaunch();
    }
  }, 1000);
  
  // Ultimate fallback: Jika setelah 3 detik masih belum terbuka, ke App Store
  setTimeout(() => {
    if (!appLaunched && document.visibilityState === 'visible') {
      console.log('Ultimate fallback to App Store...');
      openAppStore();
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
});
