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

// Method langsung launch ke Free Fire tanpa popup
function launchFreeFireDirectly() {
  console.log('Attempting direct Free Fire launch...');
  
  // List semua scheme URL yang mungkin
  const schemes = [
    // Free Fire MAX
    'freefiremax://',
    'com.dts.freefiremax://',
    'ffmax://',
    'freefiremax://launch',
    'freefiremax://open',
    'freefiremax://start',
    
    // Free Fire Original
    'freefire://',
    'freefiremobile://',
    'com.dts.freefireth://',
    'com.garena.freefire://',
    'ff://',
    'freefire://launch',
    'freefire://open',
    'freefire://start',
    'garena-freefire://',
    
    // Alternate schemes
    'freefire-ios://',
    'freefire-game://',
    'freefireapp://',
    'freefirenow://'
  ];
  
  // Mencoba SEMUA schemes sekaligus untuk meningkatkan peluang
  schemes.forEach((scheme, index) => {
    setTimeout(() => {
      console.log(`Trying scheme: ${scheme}`);
      
      // Method 1: iframe (tanpa popup)
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'display:none;border:none;width:0;height:0;';
      iframe.src = scheme;
      document.body.appendChild(iframe);
      
      // Method 2: window.location (setelah delay kecil)
      setTimeout(() => {
        try {
          window.location = scheme;
        } catch(e) {
          console.log(`Location method failed for ${scheme}`);
        }
      }, 50);
      
      // Method 3: anchor click (alternatif)
      setTimeout(() => {
        try {
          const link = document.createElement('a');
          link.href = scheme;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch(e) {
          console.log(`Anchor method failed for ${scheme}`);
        }
      }, 100);
      
      // Cleanup iframe setelah 200ms
      setTimeout(() => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
      }, 200);
      
    }, index * 100); // Coba tiap scheme dengan interval 100ms
  });
  
  // Setelah mencoba semua schemes, beri feedback
  setTimeout(() => {
    showNotification('Free Fire should be launching...');
    
    // Jika masih di web setelah 3 detik, coba lagi dengan cara lain
    setTimeout(() => {
      if (document.hasFocus()) {
        console.log('Still on web page, trying fallback method...');
        
        // Fallback: coba buka dengan user gesture
        const confirmLaunch = confirm('Free Fire launch may require manual confirmation.\n\nClick OK to try alternative launch method.');
        
        if (confirmLaunch) {
          // Direct user interaction launch
          window.location.href = 'freefiremax://';
          setTimeout(() => {
            window.location.href = 'freefire://';
          }, 500);
        }
      }
    }, 3000);
  }, schemes.length * 100);
}

// Main launch function - TANPA about:blank
function silentLaunchFreeFire() {
  if (!isIOSDevice()) {
    showNotification('iOS device (iPhone/iPad) required');
    return;
  }

  console.log('Launching Free Fire directly...');
  
  // Hanya mencoba launch, TIDAK ada redirect ke about:blank
  launchFreeFireDirectly();
  
  // Beri feedback setelah beberapa saat
  setTimeout(() => {
    showNotification('Launch initiated...');
  }, 1500);
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  showScreen('mainScreen');
  
  // Setup untuk tombol Saii
  const saiiBtn = document.querySelector('.saii-btn');
  if (saiiBtn) {
    const handleLaunch = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      saiiBtn.style.transform = 'scale(0.98)';
      setTimeout(() => {
        saiiBtn.style.transform = 'scale(1)';
        startSaii();
      }, 150);
    };
    
    saiiBtn.addEventListener('click', handleLaunch, true);
    saiiBtn.addEventListener('touchend', handleLaunch, true);
    
    // Hover effects
    saiiBtn.addEventListener('mouseenter', () => {
      saiiBtn.style.transform = 'translateY(-2px)';
    });
    saiiBtn.addEventListener('mouseleave', () => {
      saiiBtn.style.transform = 'translateY(0)';
    });
  }
  
  // Setup untuk menu cards
  document.querySelectorAll('.card').forEach(card => {
    // Hanya untuk card yang tidak ada onclick di HTML
    if (!card.getAttribute('onclick')) {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        startSaii();
      });
    }
  });
  
  // Setup toggle switches
  document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', function() {
      showNotification(`${this.id} ${this.checked ? 'enabled' : 'disabled'}`);
    });
  });
  
  // Setup theme select
  const themeSelect = document.querySelector('.theme-select');
  if (themeSelect) {
    themeSelect.addEventListener('change', function() {
      showNotification(`Theme changed to ${this.value}`);
    });
  }
});

// Override alert/confirm untuk mencegah popup
window.alert = function(msg) {
  console.log('Alert blocked:', msg);
  return undefined;
};

window.confirm = function(msg) {
  console.log('Confirm blocked:', msg);
  return true;
};

window.prompt = function(msg) {
  console.log('Prompt blocked:', msg);
  return '';
};

// Tambahkan meta tag untuk iOS secara dinamis
const meta = document.createElement('meta');
meta.name = 'apple-mobile-web-app-capable';
meta.content = 'yes';
document.head.appendChild(meta);

const meta2 = document.createElement('meta');
meta2.name = 'mobile-web-app-capable';
meta2.content = 'yes';
document.head.appendChild(meta2);
