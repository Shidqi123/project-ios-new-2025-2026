// Navigasi antar screen
function showScreen(screenId) {
  // Sembunyikan semua screen
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Tampilkan screen yang dipilih
  document.getElementById(screenId).classList.add('active');
}

// Fungsi Hijack
function startHijack() {
  // Tampilkan screen hijacking
  showScreen('hijackScreen');
  
  // URL untuk membuka Free Fire
  const freeFireUrls = {
    freefire: 'freefire://',
    freefireth: 'freefireth://',
    freefiremax: 'freefiremax://',
    playstore: 'https://play.google.com/store/apps/details?id=com.dts.freefireth',
    appstore: 'https://apps.apple.com/app/id1300096749'
  };
  
  // Simulasi proses hijacking
  simulateHijackProcess();
  
  // Coba buka Free Fire setelah delay
  setTimeout(() => {
    openFreeFire(freeFireUrls);
  }, 2500);
}

// Simulasi proses hijacking dengan animasi progress bar
function simulateHijackProcess() {
  const progresses = document.querySelectorAll('.progress');
  const texts = document.querySelectorAll('.process-text');
  
  // Reset semua progress
  progresses.forEach(progress => {
    progress.style.width = '0%';
  });
  
  // Animasi progress 1
  setTimeout(() => {
    progresses[0].style.width = '100%';
    texts[0].textContent = '✓ System verified';
  }, 800);
  
  // Animasi progress 2
  setTimeout(() => {
    progresses[1].style.width = '100%';
    texts[1].textContent = '✓ Binaries patched';
  }, 1500);
  
  // Animasi progress 3
  setTimeout(() => {
    progresses[2].style.width = '100%';
    texts[2].textContent = '✓ Security bypassed';
  }, 2200);
  
  // Animasi progress 4
  setTimeout(() => {
    progresses[3].style.width = '100%';
    texts[3].textContent = 'Launching Free Fire...';
  }, 2900);
}

// Fungsi untuk membuka Free Fire
function openFreeFire(urls) {
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  
  // Deteksi jika di Vercel preview (desktop)
  const isDesktop = !isIOS && !isAndroid;
  
  if (isDesktop) {
    // Di desktop, buka Play Store/App Store
    window.open(isIOS ? urls.appstore : urls.playstore, '_blank');
    return;
  }
  
  // Mobile: coba buka dengan deep link
  let appOpened = false;
  
  // Function untuk cek apakah app berhasil dibuka
  const startTime = Date.now();
  const checkVisibility = () => {
    const elapsed = Date.now() - startTime;
    
    // Jika user masih di halaman web setelah 1 detik, asumsikan app gagal dibuka
    if (elapsed > 1000 && !appOpened && document.visibilityState === 'visible') {
      // Fallback ke store
      window.location.href = isIOS ? urls.appstore : urls.playstore;
    }
  };
  
  // Event listener untuk visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      appOpened = true;
    }
  });
  
  // Coba berbagai URL scheme
  const schemes = isAndroid ? 
    [urls.freefireth, urls.freefiremax, urls.freefire] : 
    [urls.freefire, urls.freefiremax];
  
  // Coba buka dengan iframe method
  const tryOpenWithIframe = (url) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    
    setTimeout(() => {
      document.body.removeChild(iframe);
      checkVisibility();
    }, 500);
  };
  
  // Coba semua scheme
  schemes.forEach(scheme => {
    tryOpenWithIframe(scheme);
  });
  
  // Fallback setelah 1.5 detik
  setTimeout(() => {
    if (!appOpened) {
      window.location.href = isIOS ? urls.appstore : urls.playstore;
    }
  }, 1500);
}

// Fungsi lainnya
function restartSpringBoard() {
  alert('SpringBoard restart simulated!\nIn real jailbreak, this would restart the SpringBoard.');
}

function rebootUserSpace() {
  alert('UserSpace reboot simulated!\nIn real jailbreak, this would reboot the UserSpace.');
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  // Set screen utama aktif
  showScreen('mainScreen');
  
  // Update jam real-time
  function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    // Jika ada elemen waktu di UI, bisa di-update di sini
  }
  
  // Update waktu setiap menit
  setInterval(updateTime, 60000);
  updateTime();
});
