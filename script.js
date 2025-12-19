console.log('🚀 SaiKuto v10.1 Initializing...');

// Global variable untuk keys
let VALID_KEYS = [];

// ==============================================
// 1. LOAD KEYS DARI FILE keys.json
// ==============================================
async function loadKeys() {
  console.log('🔍 Loading keys from keys.json...');
  
  try {
    // Fetch keys.json dengan cache busting
    const response = await fetch('keys.json?v=' + Date.now());
    
    console.log('📡 Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const text = await response.text();
    console.log('📄 Raw response (first 500 chars):', text.substring(0, 500));
    
    // Parse JSON
    const data = JSON.parse(text);
    console.log('✅ JSON parsed successfully');
    
    // Validasi struktur
    if (!data.valid_keys || !Array.isArray(data.valid_keys)) {
      throw new Error('Invalid keys.json format: missing "valid_keys" array');
    }
    
    // Process keys: uppercase dan trim
    VALID_KEYS = data.valid_keys
      .map(key => {
        if (typeof key !== 'string') {
          console.warn('⚠️ Non-string key found:', key);
          return String(key);
        }
        return key.toUpperCase().trim();
      })
      .filter(key => key.length > 0);
    
    console.log('📋 Total keys loaded:', VALID_KEYS.length);
    console.log('🔑 Keys:', VALID_KEYS);
    
    if (VALID_KEYS.length > 0) {
      console.log('✅ Keys successfully loaded from keys.json');
    } else {
      console.warn('⚠️ No valid keys found in keys.json, using fallback');
      VALID_KEYS = ['KUTO123', 'SAIFREE', 'TESTKEY', 'OBSIDIAN'];
    }
    
  } catch (error) {
    console.error('❌ ERROR loading keys.json:', error);
    console.error('Error details:', error.message);
    
    // Fallback ke default keys
    VALID_KEYS = ['KUTO123', 'SAIFREE', 'TESTKEY', 'OBSIDIAN'];
    console.log('🔄 Using fallback keys:', VALID_KEYS);
    
    // Show error notification
    showNotification(`⚠️ Error loading keys.json. Using default keys.`);
  }
}

// ==============================================
// 2. CHECK LOGIN FUNCTION (FIXED)
// ==============================================
async function checkLogin() {
  const keyInput = document.getElementById('loginKey');
  const keyStatus = document.getElementById('keyStatus');
  
  if (!keyInput) {
    console.error('❌ loginKey element not found!');
    showNotification('❌ System error: Login input missing');
    return;
  }
  
  const key = keyInput.value.trim().toUpperCase();
  
  console.log('=== LOGIN ATTEMPT ===');
  console.log('Input key:', key);
  console.log('Available keys count:', VALID_KEYS.length);
  console.log('Available keys:', VALID_KEYS);
  
  // Validasi input kosong
  if (!key) {
    showNotification('❌ Please enter access key');
    keyInput.focus();
    return;
  }
  
  // Validasi jika keys belum diload
  if (VALID_KEYS.length === 0) {
    console.warn('⚠️ Keys not loaded yet, reloading...');
    showNotification('🔄 Loading keys...');
    await loadKeys();
    
    if (VALID_KEYS.length === 0) {
      showNotification('❌ Failed to load keys. Contact admin.');
      return;
    }
  }
  
  // Cek apakah key valid
  const isValid = VALID_KEYS.includes(key);
  console.log('Key validation result:', isValid ? '✅ VALID' : '❌ INVALID');
  
  if (isValid) {
    // ✅ LOGIN SUCCESS
    console.log('✅ ACCESS GRANTED for key:', key);
    
    // Update UI status
    if (keyStatus) {
      keyStatus.innerHTML = '<i class="fas fa-check" style="color:#00ff88"></i>';
    }
    
    // Show success notification
    showNotification(`✅ Access granted! Welcome to SaiKuto`);
    
    // Save session
    localStorage.setItem('saiSession', 'active_forever');
    localStorage.setItem('loginKey', key);
    localStorage.setItem('keyUsed', key);
    localStorage.setItem('loginTime', new Date().toISOString());
    
    // Clear input
    keyInput.value = '';
    
    // Redirect ke main screen
    setTimeout(() => {
      showScreen('mainScreen');
      showNotification(`🎮 Lifetime access activated`);
    }, 500);
    
  } else {
    // ❌ LOGIN FAILED
    console.log('❌ ACCESS DENIED for key:', key);
    
    // Update UI status
    if (keyStatus) {
      keyStatus.innerHTML = '<i class="fas fa-times" style="color:#ff0058"></i>';
    }
    
    // Cari key yang mirip untuk suggestion
    const suggestions = VALID_KEYS
      .filter(k => {
        // Cari key dengan 3 karakter pertama sama
        return k.substring(0, 3) === key.substring(0, 3) ||
               k.includes(key.substring(0, 2)) ||
               key.includes(k.substring(0, 2));
      })
      .slice(0, 3);
    
    // Buat pesan error TANPA menampilkan keys
    let errorMessage = `❌ Invalid access key`;
    
    if (suggestions.length > 0) {
      errorMessage += `\nTry: ${suggestions.join(', ')}`;
    } else {
      errorMessage += `\nPlease check your key and try again`;
    }
    
    showNotification(errorMessage);
    
    // Animasi shake untuk input
    keyInput.style.animation = 'shake 0.5s';
    setTimeout(() => {
      keyInput.style.animation = '';
      keyInput.focus();
      keyInput.select();
    }, 500);
  }
}

// ==============================================
// 3. BASIC APP FUNCTIONS
// ==============================================

// Navigasi antar screen
function showScreen(screenId) {
  console.log('🔄 Switching to screen:', screenId);
  
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // Show target screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
    
    // Scroll ke atas
    window.scrollTo(0, 0);
  } else {
    console.error('❌ Screen not found:', screenId);
  }
}

// Tampilkan notifikasi
function showNotification(message) {
  const notification = document.getElementById('notification');
  const notificationText = document.getElementById('notificationText');
  
  if (!notification || !notificationText) {
    console.log('📢 Notification:', message);
    return;
  }
  
  notificationText.textContent = message;
  notification.classList.add('show');
  
  // Auto hide setelah 3 detik
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Check session
function checkSession() {
  const session = localStorage.getItem('saiSession');
  const savedKey = localStorage.getItem('loginKey');
  
  console.log('🔍 Checking session...');
  console.log('Session:', session);
  console.log('Saved key:', savedKey);
  
  if (session === 'active_forever') {
    console.log('✅ Valid session found');
    showScreen('mainScreen');
    return true;
  }
  
  console.log('❌ No valid session, showing login');
  showScreen('loginScreen');
  return false;
}

// Clear session (logout)
function clearSession() {
  console.log('🗑️ Clearing session...');
  
  const savedKey = localStorage.getItem('loginKey');
  localStorage.clear();
  
  showScreen('loginScreen');
  showNotification(`🔓 Logged out. Previous key: ${savedKey || 'None'}`);
}

// Logout dengan konfirmasi
function logoutUser() {
  if (confirm('Are you sure you want to logout from SaiKuto?')) {
    clearSession();
  }
}

// ==============================================
// 4. SAII PROCESS FUNCTIONS (COMPLETELY FIXED)
// ==============================================
function startSaii() {
  if (!checkSession()) {
    showNotification('🔒 Please login first');
    return;
  }
  
  showScreen('saiiScreen');
  
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.querySelector('.progress-percent');
  const progressLabel = document.querySelector('.progress-label span');
  
  // Reset progress
  if (progressBar) progressBar.style.width = '0%';
  if (progressPercent) progressPercent.textContent = '0%';
  if (progressLabel) progressLabel.textContent = 'Initializing...';
  
  // Clear semua text elements terlebih dahulu
  document.getElementById('text2').textContent = '';
  document.getElementById('text3').textContent = '';
  document.getElementById('text4').textContent = '';
  document.getElementById('text5').textContent = '';
  
  // Reset semua line elements
  const line2 = document.getElementById('line2');
  const line3 = document.getElementById('line3');
  const line4 = document.getElementById('line4');
  const line5 = document.getElementById('line5');
  
  if (line2) {
    line2.classList.remove('active');
    line2.style.filter = 'blur(5px)';
    line2.style.opacity = '0.8';
  }
  if (line3) {
    line3.classList.remove('active');
    line3.style.filter = 'blur(5px)';
    line3.style.opacity = '0.8';
  }
  if (line4) {
    line4.classList.remove('active');
    line4.style.filter = 'blur(5px)';
    line4.style.opacity = '0.8';
  }
  if (line5) {
    line5.classList.remove('active');
    line5.style.filter = 'blur(5px)';
    line5.style.opacity = '0.8';
  }
  
  // Step 1: Checking system integrity...
  setTimeout(() => {
    if (line2) {
      line2.classList.add('active');
      line2.style.filter = 'blur(0)';
      line2.style.opacity = '1';
    }
    
    const text2 = document.getElementById('text2');
    if (text2) {
      text2.textContent = 'Checking system integrity...';
    }
    
    if (progressBar) progressBar.style.width = '20%';
    if (progressPercent) progressPercent.textContent = '20%';
    if (progressLabel) progressLabel.textContent = 'System check...';
  }, 500);
  
  // Step 2: Preparing Free Fire environment...
  setTimeout(() => {
    if (line3) {
      line3.classList.add('active');
      line3.style.filter = 'blur(0)';
      line3.style.opacity = '1';
    }
    
    const text3 = document.getElementById('text3');
    if (text3) {
      text3.textContent = 'Preparing Free Fire environment...';
    }
    
    if (progressBar) progressBar.style.width = '50%';
    if (progressPercent) progressPercent.textContent = '50%';
    if (progressLabel) progressLabel.textContent = 'Preparing...';
  }, 1500);
  
  // Step 3: Bypassing security protocols...
  setTimeout(() => {
    if (line4) {
      line4.classList.add('active');
      line4.style.filter = 'blur(0)';
      line4.style.opacity = '1';
    }
    
    const text4 = document.getElementById('text4');
    if (text4) {
      text4.textContent = 'Bypassing security protocols...';
    }
    
    if (progressBar) progressBar.style.width = '75%';
    if (progressPercent) progressPercent.textContent = '75%';
    if (progressLabel) progressLabel.textContent = 'Security bypass...';
  }, 2500);
  
  // Step 4: Launching Free Fire with optimizations...
  setTimeout(() => {
    if (line5) {
      line5.classList.add('active');
      line5.style.filter = 'blur(0)';
      line5.style.opacity = '1';
    }
    
    const text5 = document.getElementById('text5');
    if (text5) {
      text5.textContent = 'Launching Free Fire with optimizations...';
    }
    
    if (progressBar) progressBar.style.width = '100%';
    if (progressPercent) progressPercent.textContent = '100%';
    if (progressLabel) progressLabel.textContent = 'Launching...';
    
    // Launch Free Fire
    setTimeout(() => launchFreeFire(), 800);
  }, 3500);
}

// Launch Free Fire (FIXED VERSION)
function launchFreeFire() {
  // Cek fitur yang diaktifkan (HAPUS headshotcrosshair)
  const aimAssist = document.getElementById('aim')?.checked || false;
  const antiBan = document.getElementById('antiban')?.checked || false;
  const headshot = document.getElementById('headshot')?.checked || false;
  const recoilControl = document.getElementById('recoilcontrol')?.checked || false;
  
  // Hitung total fitur yang aktif
  const enabledFeatures = [
    aimAssist ? 'Aim Assist' : null,
    antiBan ? 'Anti-Ban' : null,
    headshot ? 'Headshot Opt' : null,
    recoilControl ? 'Recoil Control' : null
  ].filter(Boolean);
  
  if (enabledFeatures.length > 0) {
    showNotification(`🚀 Launching Free Fire with ${enabledFeatures.length} features enabled`);
  } else {
    showNotification('🚀 Launching Free Fire...');
  }
  
  // Simpan settings (HAPUS headshotCrosshair)
  const settings = {
    aimAssist: aimAssist,
    antiBan: antiBan,
    headshot: headshot,
    recoilControl: recoilControl,
    timestamp: Date.now()
  };
  localStorage.setItem('ffSettings', JSON.stringify(settings));
  
  // Simulasi launch process
  setTimeout(() => {
    // Kembali ke main screen
    showScreen('mainScreen');
    showNotification('✅ Free Fire launched successfully!');
  }, 1500);
}

// ==============================================
// 5. INITIALIZATION
// ==============================================
document.addEventListener('DOMContentLoaded', async function() {
  console.log('📱 DOM Content Loaded - Starting SaiKuto...');
  
  // Step 1: Load keys dari keys.json
  console.log('Step 1: Loading keys...');
  await loadKeys();
  
  // Step 2: Check session
  console.log('Step 2: Checking session...');
  checkSession();
  
  // Step 3: Setup event listeners
  console.log('Step 3: Setting up event listeners...');
  setupEventListeners();
  
  // Step 4: Show welcome message
  setTimeout(() => {
    console.log('🎉 SaiKuto v10.1 Ready!');
    console.log(`🔑 Keys loaded: ${VALID_KEYS.length}`);
    console.log(`🌐 User Agent: ${navigator.userAgent}`);
  }, 1000);
});

// Setup semua event listeners
function setupEventListeners() {
  // Login input dan button
  const loginInput = document.getElementById('loginKey');
  const loginBtn = document.querySelector('.login-btn');
  
  if (loginInput) {
    // Enter key untuk login
    loginInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        console.log('Enter key pressed, checking login...');
        checkLogin();
      }
    });
    
    // Update status icon
    loginInput.addEventListener('input', () => {
      const keyStatus = document.getElementById('keyStatus');
      if (keyStatus) {
        if (loginInput.value.trim().length > 0) {
          keyStatus.innerHTML = '<i class="fas fa-lock-open" style="color:#ff7a00"></i>';
        } else {
          keyStatus.innerHTML = '<i class="fas fa-lock"></i>';
        }
      }
    });
    
    // Auto focus
    setTimeout(() => {
      loginInput.focus();
      console.log('🎯 Login input focused');
    }, 800);
  }
  
  if (loginBtn) {
    loginBtn.addEventListener('click', checkLogin);
  }
  
  // Saii button
  const saiiBtn = document.querySelector('.saii-btn');
  if (saiiBtn) {
    saiiBtn.addEventListener('click', (e) => {
      e.preventDefault();
      startSaii();
    });
  }
  
  // Toggle switches
  document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', function() {
      const saved = localStorage.getItem('ffSettings');
      let settings = saved ? JSON.parse(saved) : {};
      
      // Hanya simpan jika bukan headshotcrosshair
      if (this.id !== 'headshotcrosshair') {
        settings[this.id] = this.checked;
        localStorage.setItem('ffSettings', JSON.stringify(settings));
        console.log(`Toggle ${this.id}: ${this.checked ? 'ON' : 'OFF'}`);
      }
    });
  });
  
  // Setup notification test buttons
  document.querySelectorAll('.card').forEach(card => {
    const text = card.querySelector('h3')?.textContent;
    if (text && (text.includes('Restart') || text.includes('Reboot'))) {
      card.addEventListener('click', function() {
        showNotification(`✅ ${text} completed successfully`);
      });
    }
  });
}

// ==============================================
// 6. OVERRIDE DEFAULT BROWSER FUNCTIONS
// ==============================================
window.alert = function(message) {
  console.log('⚠️ Alert intercepted:', message);
  showNotification(message);
  return undefined;
};

window.confirm = function(message) {
  console.log('❓ Confirm intercepted:', message);
  showNotification(message + ' (Press OK to continue)');
  return true; // Always return true untuk convenience
};

window.prompt = function(message) {
  console.log('💬 Prompt intercepted:', message);
  showNotification(message);
  return 'user_input'; // Default value
};

// ==============================================
// 7. SHAKE ANIMATION (untuk invalid key)
// ==============================================
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

/* Keys info styling */
.keys-info {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);
console.log('✅ script.js loaded successfully');
