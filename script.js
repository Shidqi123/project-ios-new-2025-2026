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
            openFreeFire();
          }, 1000);
        }
      });
    }, seq.delay);
  });
}

// Fungsi buka Free Fire
function openFreeFire() {
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
  
  if (isAndroid) {
    tryOpenApp(urls.freefireth);
    setTimeout(() => tryOpenApp(urls.freefiremax), 100);
    setTimeout(() => tryOpenApp(urls.freefire), 200);
  } else if (isIOS) {
    tryOpenApp(urls.freefire);
    setTimeout(() => tryOpenApp(urls.freefiremax), 100);
  }
  
  setTimeout(() => {
    if (!appOpened) {
      window.location.href = isIOS ? urls.appstore : urls.playstore;
    }
  }, 1500);
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
