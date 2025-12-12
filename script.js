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
            silentLaunchFreeFire();
          }, 1000);
        }
      });
    }, seq.delay);
  });
}

// Deteksi iOS
function isIOSDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
}

// Teknik khusus untuk menghindari prompt iOS
function silentLaunchFreeFire() {
  if (!isIOSDevice()) {
    showNotification('iOS device required');
    return;
  }
  
  console.log('Starting silent launch...');
  
  // Buat tombol hidden untuk trigger user interaction
  const hiddenButton = document.createElement('button');
  hiddenButton.style.position = 'absolute';
  hiddenButton.style.width = '1px';
  hiddenButton.style.height = '1px';
  hiddenButton.style.opacity = '0';
  hiddenButton.style.pointerEvents = 'none';
  document.body.appendChild(hiddenButton);
  
  // Simpan timestamp
  const startTime = Date.now();
  let appLaunched = false;
  
  // Event listener untuk detect app terbuka
  const handleVisibilityChange = () => {
    if (document.hidden || document.visibilityState === 'hidden') {
      appLaunched = true;
      console.log('App launched successfully!');
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Fungsi untuk coba buka dengan teknik iframe khusus
  function tryStealthOpen() {
    try {
      // Teknik 1: Hidden iframe dengan user interaction
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      
      // Simulasikan user click pada hidden button dulu
      hiddenButton.click();
      
      // Tunggu sedikit untuk event propagation
      setTimeout(() => {
        // Coba Free Fire biasa
        iframe.src = 'freefire://';
        document.body.appendChild(iframe);
        console.log('Trying freefire://');
        
        // Tunggu dan coba Free Fire MAX
        setTimeout(() => {
          if (!appLaunched && (Date.now() - startTime) < 2000) {
            iframe.src = 'freefiremax://';
            console.log('Trying freefiremax://');
          }
        }, 400);
        
        // Cleanup
        setTimeout(() => {
          if (iframe.parentNode) {
            document.body.removeChild(iframe);
          }
        }, 3000);
      }, 50);
      
      return true;
    } catch (e) {
      console.log('Stealth open failed:', e);
      return false;
    }
  }
  
  // Fungsi untuk direct open (fallback)
  function tryDirectOpen() {
    try {
      // Trigger click pada hidden button untuk user interaction context
      hiddenButton.click();
      
      // Tunggu microtask
      setTimeout(() => {
        window.location.href = 'freefire://';
      }, 10);
      
      return true;
    } catch (e) {
      console.log('Direct open failed:', e);
      return false;
    }
  }
  
  // Fungsi untuk buka App Store
  function openAppStore() {
    // Deep link ke App Store (lebih smooth)
    window.location.href = 'itms-apps://itunes.apple.com/app/id1300096749';
    
    // Fallback ke web setelah delay
    setTimeout(() => {
      if (!document.hidden) {
        window.location.href = 'https://apps.apple.com/app/id1300096749';
      }
    }, 1000);
  }
  
  // Strategy 1: Coba teknik stealth pertama
  tryStealthOpen();
  
  // Strategy 2: Jika setelah 800ms belum terbuka, coba direct
  setTimeout(() => {
    if (!appLaunched && (Date.now() - startTime) < 2500) {
      console.log('Trying direct open...');
      tryDirectOpen();
    }
  }, 800);
  
  // Strategy 3: Jika setelah 2.5 detik belum terbuka, ke App Store
  setTimeout(() => {
    if (!appLaunched) {
      console.log('Fallback to App Store...');
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Cleanup hidden button
      if (hiddenButton.parentNode) {
        document.body.removeChild(hiddenButton);
      }
      
      openAppStore();
    }
  }, 2500);
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
