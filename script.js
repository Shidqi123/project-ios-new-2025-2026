// Navigasi antar screen
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
  
  // Scroll ke atas saat ganti screen
  const scrollable = document.querySelector('.scrollable-content');
  if (scrollable) {
    scrollable.scrollTop = 0;
  }
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

// Fungsi utama Hijack
function startHijack() {
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
        if (seq.progress === 100) {
          progressLabel.textContent = 'Launching Free Fire...';
          
          // Jika ini step terakhir, buka Free Fire
          setTimeout(() => {
            openFreeFireForDevice();
          }, 800);
        }
      });
    }, seq.delay);
  });
}

// ============================================
// FUNGSI UTAMA UNTUK BUKA FREE FIRE DI iOS/iPad
// ============================================

// Deteksi device type
function getDeviceType() {
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  const isAndroid = /Android/i.test(ua);
  const isMac = /Macintosh/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua);
  
  // Deteksi iPad khusus (iOS 13+)
  const isIPad = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) || 
                 /iPad/i.test(ua) || 
                 (isIOS && !/iPhone|iPod/i.test(ua));
  
  return {
    isIOS: isIOS || isIPad,
    isAndroid: isAndroid,
    isIPad: isIPad,
    isDesktop: !isIOS && !isAndroid && !isIPad,
    isMac: isMac
  };
}

// URL untuk Free Fire
const FREE_FIRE_URLS = {
  // Deep links untuk Android
  android: {
    freefireth: 'intent://com.dts.freefireth#Intent;scheme=freefireth;package=com.dts.freefireth;end',
    freefiremax: 'intent://com.dts.freefiremax#Intent;scheme=freefiremax;package=com.dts.freefiremax;end',
    freefire: 'intent://com.dts.freefireth#Intent;scheme=freefire;package=com.dts.freefireth;end'
  },
  
  // Universal links dan custom schemes untuk iOS
  ios: {
    // Custom URL Schemes (coba semua kemungkinan)
    freefire1: 'freefire://',
    freefire2: 'freefireth://',
    freefire3: 'freefiremax://',
    freefire4: 'com.dts.freefireth://',
    freefire5: 'com.dts.freefiremax://',
    
    // Universal Links (jika Free Fire mendukung)
    universal1: 'https://freefire.onelink.me/FhNv/',
    universal2: 'https://freefiremobile.page.link/?link=https://freefiremobile.page.link/download&apn=com.dts.freefireth&isi=1300096749&ibi=com.dts.freefireth',
    universal3: 'https://play.google.com/store/apps/details?id=com.dts.freefireth&referrer=utm_source%3Dweb%26utm_medium%3Dbutton'
  },
  
  // Fallback ke App Store/Play Store
  store: {
    appstore: 'https://apps.apple.com/id/app/free-fire/id1300096749',
    playstore: 'https://play.google.com/store/apps/details?id=com.dts.freefireth',
    appstoreGlobal: 'https://apps.apple.com/app/id1300096749'
  }
};

// Teknik khusus untuk iOS/iPadOS
function openFreeFireIOS() {
  console.log('Membuka Free Fire untuk iOS/iPadOS');
  
  let appOpened = false;
  const startTime = Date.now();
  
  // Event listener untuk deteksi app terbuka
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      appOpened = true;
      console.log('iOS: App berhasil dibuka (visibility hidden)');
      cleanup();
    }
  };
  
  const handlePageHide = () => {
    appOpened = true;
    console.log('iOS: App berhasil dibuka (pagehide)');
    cleanup();
  };
  
  const handleBlur = () => {
    appOpened = true;
    console.log('iOS: App berhasil dibuka (blur)');
    cleanup();
  };
  
  // Setup event listeners
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('pagehide', handlePageHide);
  window.addEventListener('blur', handleBlur);
  
  // Cleanup function
  const cleanup = () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('pagehide', handlePageHide);
    window.removeEventListener('blur', handleBlur);
  };
  
  // Fallback ke App Store setelah timeout
  const fallbackTimeout = setTimeout(() => {
    if (!appOpened) {
      console.log('iOS: Fallback ke App Store');
      cleanup();
      window.location.href = FREE_FIRE_URLS.store.appstore;
    }
  }, 2000);
  
  // Fungsi untuk coba buka dengan teknik berbeda
  const tryOpenMethods = () => {
    // Method 1: Coba Universal Links dulu
    console.log('iOS: Mencoba Universal Link...');
    window.location.href = FREE_FIRE_URLS.ios.universal2;
    
    // Method 2: Setelah delay, coba custom schemes
    setTimeout(() => {
      if (!appOpened) {
        console.log('iOS: Mencoba custom scheme 1...');
        
        // Teknik iframe untuk custom schemes
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        
        // Coba semua custom schemes secara berurutan
        const schemes = [
          FREE_FIRE_URLS.ios.freefire1,
          FREE_FIRE_URLS.ios.freefire2,
          FREE_FIRE_URLS.ios.freefire3,
          FREE_FIRE_URLS.ios.freefire4,
          FREE_FIRE_URLS.ios.freefire5
        ];
        
        let currentScheme = 0;
        
        const tryNextScheme = () => {
          if (currentScheme < schemes.length && !appOpened) {
            iframe.src = schemes[currentScheme];
            document.body.appendChild(iframe);
            console.log('iOS: Mencoba scheme:', schemes[currentScheme]);
            currentScheme++;
            
            setTimeout(() => {
              if (iframe.parentNode) {
                document.body.removeChild(iframe);
              }
              tryNextScheme();
            }, 300);
          }
        };
        
        tryNextScheme();
      }
    }, 800);
    
    // Method 3: Setelah delay lebih lama, coba direct App Store link
    setTimeout(() => {
      if (!appOpened) {
        console.log('iOS: Mencoba direct App Store link...');
        window.location.href = FREE_FIRE_URLS.ios.universal3;
      }
    }, 1500);
  };
  
  // Mulai proses
  tryOpenMethods();
  
  // Auto cleanup setelah 3 detik
  setTimeout(() => {
    cleanup();
    clearTimeout(fallbackTimeout);
  }, 3000);
}

// Teknik untuk Android
function openFreeFireAndroid() {
  console.log('Membuka Free Fire untuk Android');
  
  let appOpened = false;
  const startTime = Date.now();
  
  // Event listener untuk Android
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      appOpened = true;
      console.log('Android: App berhasil dibuka');
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Fallback timeout
  setTimeout(() => {
    if (!appOpened) {
      console.log('Android: Fallback ke Play Store');
      window.location.href = FREE_FIRE_URLS.store.playstore;
    }
  }, 1500);
  
  // Coba semua intent URLs untuk Android
  const androidUrls = [
    FREE_FIRE_URLS.android.freefireth,
    FREE_FIRE_URLS.android.freefiremax,
    FREE_FIRE_URLS.android.freefire
  ];
  
  // Coba buka dengan window.location (browser mungkin support intent)
  window.location.href = androidUrls[0];
  
  // Fallback dengan iframe untuk browser yang tidak support intent langsung
  setTimeout(() => {
    if (!appOpened) {
      console.log('Android: Mencoba metode iframe...');
      
      for (let i = 1; i < androidUrls.length; i++) {
        setTimeout(() => {
          if (!appOpened) {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = androidUrls[i];
            document.body.appendChild(iframe);
            
            setTimeout(() => {
              if (iframe.parentNode) {
                document.body.removeChild(iframe);
              }
            }, 300);
          }
        }, i * 300);
      }
    }
  }, 500);
}

// Fungsi utama untuk semua device
function openFreeFireForDevice() {
  const device = getDeviceType();
  
  console.log('Device detected:', device);
  showNotification(`Opening Free Fire for ${device.isIOS ? 'iOS' : device.isAndroid ? 'Android' : 'Desktop'}...`);
  
  if (device.isIOS || device.isIPad) {
    // Untuk iOS dan iPadOS
    openFreeFireIOS();
  } else if (device.isAndroid) {
    // Untuk Android
    openFreeFireAndroid();
  } else {
    // Untuk desktop/other
    showNotification('Please use mobile device to open Free Fire');
    
    // Tampilkan QR code atau link
    setTimeout(() => {
      const useMobile = confirm('Free Fire can only be opened on mobile devices.\n\nOpen Play Store/App Store instead?');
      if (useMobile) {
        window.open(device.isMac ? FREE_FIRE_URLS.store.appstore : FREE_FIRE_URLS.store.playstore, '_blank');
      }
    }, 1000);
  }
}

// Fungsi buka Free Fire (legacy - untuk kompatibilitas)
function openFreeFire() {
  openFreeFireForDevice();
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  showScreen('mainScreen');
  
  // Ganti semua teks "Hijacked" menjadi "Saikuto"
  document.querySelectorAll('h1, h2, .title').forEach(element => {
    if (element.textContent.includes('Hijacked')) {
      element.textContent = element.textContent.replace('Hijacked', 'Saikuto');
    }
  });
  
  // Hover effect untuk cards
  document.querySelectorAll('.card, .feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-2px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });
  
  // Animasi tombol hijack
  const hijackBtn = document.querySelector('.hijack-btn');
  if (hijackBtn) {
    hijackBtn.addEventListener('mousedown', () => {
      hijackBtn.style.transform = 'scale(0.98)';
    });
    hijackBtn.addEventListener('mouseup', () => {
      hijackBtn.style.transform = 'scale(1) translateY(-2px)';
    });
    hijackBtn.addEventListener('mouseleave', () => {
      hijackBtn.style.transform = 'scale(1)';
    });
  }
  
  // Smooth scroll behavior
  const scrollableElements = document.querySelectorAll('.scrollable-content');
  scrollableElements.forEach(element => {
    element.addEventListener('wheel', (e) => {
      element.scrollTop += e.deltaY;
    });
  });
  
  // Tambahkan style untuk iframe fallback
  const style = document.createElement('style');
  style.textContent = `
    .fallback-iframe {
      position: absolute;
      width: 1px;
      height: 1px;
      opacity: 0;
      pointer-events: none;
    }
  `;
  document.head.appendChild(style);
});
