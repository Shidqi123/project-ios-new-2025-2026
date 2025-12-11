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

// Fungsi utama Hijack
function startHijack() {
  showScreen('hijackScreen');
  
  // Reset semua progress bar
  document.querySelectorAll('.progress-bar').forEach(bar => {
    bar.style.width = '0%';
  });
  
  // Animasikan progress step by step SAMA PERSIS SS
  const steps = [
    { id: 'progress1', text: 'Verifying system compatibility...', time: 800 },
    { id: 'progress2', text: 'Patching critical binaries...', time: 1600 },
    { id: 'progress3', text: 'Bypassing security checks...', time: 2400 },
    { id: 'progress4', text: 'Launching Free Fire...', time: 3200 }
  ];
  
  steps.forEach((step, index) => {
    setTimeout(() => {
      const progressBar = document.getElementById(step.id);
      const stepElement = document.getElementById(`step${index + 1}`).querySelector('.step-text');
      
      // Update progress bar ke 100%
      progressBar.style.width = '100%';
      stepElement.textContent = `✓ ${step.text.replace('...', '')}`;
      
      // Step terakhir: buka Free Fire
      if (index === 3) {
        setTimeout(() => {
          openFreeFire();
        }, 500);
      }
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
  
  // Deteksi jika di desktop/browser
  const isDesktop = !isIOS && !isAndroid;
  
  if (isDesktop) {
    // Di desktop, buka store di tab baru
    window.open(isIOS ? urls.appstore : urls.playstore, '_blank');
    showNotification('Redirecting to app store...');
    return;
  }
  
  // Mobile: coba buka dengan deep link
  let appOpened = false;
  
  // Function untuk deteksi apakah app terbuka
  const startTime = Date.now();
  const checkAppOpened = () => {
    const elapsed = Date.now() - startTime;
    
    // Jika masih di halaman web setelah 1 detik, fallback ke store
    if (elapsed > 1000 && !appOpened && document.visibilityState === 'visible') {
      window.location.href = isIOS ? urls.appstore : urls.playstore;
    }
  };
  
  // Listen untuk visibility change (user pindah ke app)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      appOpened = true;
    }
  });
  
  // Coba buka dengan iframe method (workaround untuk iOS/Android)
  const tryOpenApp = (url) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    
    setTimeout(() => {
      document.body.removeChild(iframe);
      checkAppOpened();
    }, 300);
  };
  
  // Coba berbagai scheme berdasarkan device
  if (isAndroid) {
    tryOpenApp(urls.freefireth);
    setTimeout(() => tryOpenApp(urls.freefiremax), 100);
    setTimeout(() => tryOpenApp(urls.freefire), 200);
  } else if (isIOS) {
    tryOpenApp(urls.freefire);
    setTimeout(() => tryOpenApp(urls.freefiremax), 100);
  }
  
  // Fallback ke store setelah 1.5 detik
  setTimeout(() => {
    if (!appOpened) {
      window.location.href = isIOS ? urls.appstore : urls.playstore;
    }
  }, 1500);
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  // Set screen utama aktif
  showScreen('mainScreen');
  
  // Tambahkan event listener untuk semua menu button
  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      this.style.opacity = '0.7';
      setTimeout(() => {
        this.style.opacity = '1';
      }, 200);
    });
  });
  
  // Animasi tombol hijack
  const hijackBtn = document.querySelector('.hijack-btn');
  if (hijackBtn) {
    hijackBtn.addEventListener('mousedown', () => {
      hijackBtn.style.transform = 'scale(0.98)';
    });
    hijackBtn.addEventListener('mouseup', () => {
      hijackBtn.style.transform = 'scale(1)';
    });
    hijackBtn.addEventListener('mouseleave', () => {
      hijackBtn.style.transform = 'scale(1)';
    });
  }
});
