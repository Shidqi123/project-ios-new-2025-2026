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

// Method khusus untuk iOS tanpa popup
function iosLaunchApp(scheme) {
  // Method 1: Menggunakan iframe (tanpa popup)
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'display:none;border:none;width:0;height:0;';
  iframe.src = scheme;
  document.body.appendChild(iframe);
  
  // Method 2: Menggunakan window.location dengan timeout
  setTimeout(() => {
    window.location.href = scheme;
  }, 150);
  
  // Method 3: Menggunakan window.open (iOS terkadang membutuhkan ini)
  setTimeout(() => {
    const win = window.open(scheme, '_blank');
    if (win) {
      win.focus();
    }
  }, 300);
  
  // Method 4: Menggunakan anchor click
  setTimeout(() => {
    const link = document.createElement('a');
    link.href = scheme;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, 450);
  
  // Hapus iframe setelah beberapa saat
  setTimeout(() => {
    if (iframe.parentNode) {
      document.body.removeChild(iframe);
    }
  }, 1000);
}

// Silent Launch HANYA dengan scheme URL
function silentLaunchFreeFire() {
  if (!isIOSDevice()) {
    showNotification('iOS device (iPhone/iPad) required');
    return;
  }

  console.log('Attempting direct launch to Free Fire...');
  
  // Tentukan versi berdasarkan iOS version atau preference
  const useMaxVersion = true; // Default ke MAX
  
  if (useMaxVersion) {
    // Coba Free Fire MAX dulu
    console.log('Trying Free Fire MAX...');
    
    // Scheme URLs untuk Free Fire MAX
    const maxSchemes = [
      'freefiremax://',
      'com.dts.freefiremax://',
      'com.garena.freefiremax://',
      'ffmax://',
      'garena-ffmax://'
    ];
    
    // Coba semua scheme MAX
    maxSchemes.forEach((scheme, index) => {
      setTimeout(() => {
        console.log(`Trying MAX scheme: ${scheme}`);
        iosLaunchApp(scheme);
      }, index * 500);
    });
    
    // Setelah mencoba MAX, coba regular version
    setTimeout(() => {
      console.log('Trying Free Fire Regular...');
      const regularSchemes = [
        'freefire://',
        'freefiremobile://',
        'com.dts.freefireth://',
        'com.garena.freefire://',
        'ff://',
        'garena-ff://'
      ];
      
      regularSchemes.forEach((scheme, index) => {
        setTimeout(() => {
          console.log(`Trying Regular scheme: ${scheme}`);
          iosLaunchApp(scheme);
        }, index * 500);
      });
    }, maxSchemes.length * 500);
    
  } else {
    // Coba Free Fire Regular dulu
    console.log('Trying Free Fire Regular...');
    
    const regularSchemes = [
      'freefire://',
      'freefiremobile://',
      'com.dts.freefireth://',
      'com.garena.freefire://',
      'ff://',
      'garena-ff://'
    ];
    
    regularSchemes.forEach((scheme, index) => {
      setTimeout(() => {
        console.log(`Trying Regular scheme: ${scheme}`);
        iosLaunchApp(scheme);
      }, index * 500);
    });
  }
  
  // Tampilkan petunjuk jika masih di web setelah beberapa detik
  setTimeout(() => {
    if (document.hasFocus()) {
      showNotification('Tap "Open" if prompted');
      
      // Tampilkan petunjuk tambahan
      setTimeout(() => {
        if (document.hasFocus()) {
          const useExternalBrowser = confirm(
            'Free Fire launch might work better in Safari.\n' +
            'Copy this URL and open in Safari:\n' +
            'freefiremax://\n\n' +
            'Click OK to copy, Cancel to stay.'
          );
          
          if (useExternalBrowser) {
            // Copy scheme ke clipboard
            const textArea = document.createElement('textarea');
            textArea.value = 'freefiremax://';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            showNotification('URL copied to clipboard. Open Safari and paste in address bar.');
          }
        }
      }, 3000);
    }
  }, 5000);
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  showScreen('mainScreen');
  
  // Setup untuk tombol launch
  const launchBtn = document.querySelector('.launch-btn, .saii-btn');
  if (launchBtn) {
    // Hapus semua event listener sebelumnya
    const newLaunchBtn = launchBtn.cloneNode(true);
    launchBtn.parentNode.replaceChild(newLaunchBtn, launchBtn);
    
    // Setup event listeners baru
    newLaunchBtn.addEventListener('mousedown', () => {
      newLaunchBtn.style.transform = 'scale(0.98)';
    });
    
    newLaunchBtn.addEventListener('mouseup', () => {
      newLaunchBtn.style.transform = 'scale(1)';
      startSaii();
    });
    
    newLaunchBtn.addEventListener('mouseleave', () => {
      newLaunchBtn.style.transform = 'scale(1)';
    });
    
    // Touch events untuk iPad
    newLaunchBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      newLaunchBtn.style.transform = 'scale(0.98)';
    });
    
    newLaunchBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      newLaunchBtn.style.transform = 'scale(1)';
      startSaii();
    });
    
    newLaunchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      startSaii();
    });
  }
  
  // Card hover effects
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      startSaii();
    });
    
    card.addEventListener('touchend', (e) => {
      e.preventDefault();
      startSaii();
    });
  });
});
