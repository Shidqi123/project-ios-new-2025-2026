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

// Typewriter effect untuk animasi teks
function typeWriter(element, text, speed, callback) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else {
      // Hentikan blinking cursor setelah selesai
      element.style.animation = 'none';
      element.style.borderRight = 'none';
      
      if (callback) callback();
    }
  }
  
  type();
}

// Fungsi utama Hijack dengan animasi lengkap
function startHijack() {
  showScreen('hijackScreen');
  
  // Reset semua progress bar dan teks
  document.querySelectorAll('.progress-bar').forEach(bar => {
    bar.style.width = '0%';
  });
  
  document.querySelectorAll('.step-text').forEach(text => {
    text.textContent = '';
    text.style.animation = 'blinkCursor 0.7s infinite';
    text.style.borderRight = '2px solid #ff7a00';
  });
  
  // Teks untuk setiap step (SAMA PERSIS SS)
  const steps = [
    { 
      id: 'text1', 
      text: 'Verifying system compatibility...',
      icon: '⟳',
      time: 0,
      typingSpeed: 40
    },
    { 
      id: 'text2', 
      text: 'Patching critical binaries...',
      icon: '⚙',
      time: 1200,
      typingSpeed: 40
    },
    { 
      id: 'text3', 
      text: 'Bypassing security checks...',
      icon: '🛡',
      time: 2400,
      typingSpeed: 40
    },
    { 
      id: 'text4', 
      text: 'Launching Free Fire...',
      icon: '🚀',
      time: 3600,
      typingSpeed: 50
    }
  ];
  
  // Animasikan setiap step
  steps.forEach((step, index) => {
    setTimeout(() => {
      const textElement = document.getElementById(step.id);
      const progressBar = document.getElementById(`progress${index + 1}`);
      const stepIcon = document.getElementById(`step${index + 1}`).querySelector('.step-icon');
      
      // Update icon
      stepIcon.textContent = step.icon;
      
      // Mulai animasi typing
      typeWriter(textElement, step.text, step.typingSpeed, () => {
        // Setelah typing selesai, jalankan progress bar
        setTimeout(() => {
          progressBar.style.width = '100%';
          
          // Ganti icon jadi centang hijau
          setTimeout(() => {
            stepIcon.textContent = '✓';
            stepIcon.style.color = '#32d74b';
            
            // Step terakhir: buka Free Fire
            if (index === 3) {
              setTimeout(() => {
                openFreeFire();
              }, 800);
            }
          }, 300);
        }, 300);
      });
      
    }, step.time);
  });
}

// Fungsi buka Free Fire
function openFreeFire() {
  // URL untuk berbagai versi Free Fire
  const urls = {
    freefire: 'freefire://',
    freefireth: 'freefireth://',
    freefiremax: 'freefiremax://',
    playstore: 'https://play.google.com/store/apps/details?id=com.dts.freefireth',
    appstore: 'https://apps.apple.com/app/id1300096749'
  };
  
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isDesktop = !isIOS && !isAndroid;
  
  if (isDesktop) {
    window.open(isIOS ? urls.appstore : urls.playstore, '_blank');
    return;
  }
  
  // Mobile device
  let appOpened = false;
  const startTime = Date.now();
  
  const checkAppOpened = () => {
    const elapsed = Date.now() - startTime;
    if (elapsed > 1000 && !appOpened && document.visibilityState === 'visible') {
      window.location.href = isIOS ? urls.appstore : urls.playstore;
    }
  };
  
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      appOpened = true;
    }
  });
  
  // Coba buka dengan deep link
  const tryOpenApp = (url) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    
    setTimeout(() => {
      if (iframe.parentNode) {
        document.body.removeChild(iframe);
      }
      checkAppOpened();
    }, 300);
  };
  
  // Coba berbagai scheme
  if (isAndroid) {
    tryOpenApp(urls.freefireth);  // Priority 1: Free Fire TH
    setTimeout(() => tryOpenApp(urls.freefiremax), 100);  // Priority 2: Free Fire MAX
    setTimeout(() => tryOpenApp(urls.freefire), 200);     // Priority 3: Free Fire Original
  } else if (isIOS) {
    tryOpenApp(urls.freefire);    // Priority 1: Free Fire
    setTimeout(() => tryOpenApp(urls.freefiremax), 100);  // Priority 2: Free Fire MAX
  }
  
  // Fallback ke store
  setTimeout(() => {
    if (!appOpened) {
      window.location.href = isIOS ? urls.appstore : urls.playstore;
    }
  }, 1500);
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  showScreen('mainScreen');
  
  // Animasi tombol
  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
    });
  });
  
  // Animasi tombol hijack
  const hijackBtn = document.querySelector('.hijack-btn');
  if (hijackBtn) {
    hijackBtn.addEventListener('mousedown', () => {
      hijackBtn.style.transform = 'scale(0.95)';
    });
    hijackBtn.addEventListener('mouseup', () => {
      hijackBtn.style.transform = 'scale(1)';
    });
    hijackBtn.addEventListener('mouseleave', () => {
      hijackBtn.style.transform = 'scale(1)';
    });
  }
  
  // Auto update time untuk efek real-time (opsional)
  function updateTime() {
    const now = new Date();
    // Bisa ditambahkan jika butuh waktu real-time
  }
  setInterval(updateTime, 60000);
});
