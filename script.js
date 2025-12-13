// ==============================================
// SAIKUTO v10.1 - FIXED KEYS SYSTEM
// ==============================================
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
      
      // Update UI
      updateKeysInfoUI();
      
    } else {
      console.warn('⚠️ No valid keys found in keys.json, using fallback');
      VALID_KEYS = ['KUTO123', 'SAIFREE', 'TESTKEY', 'OBSIDIAN'];
      updateKeysInfoUI();
    }
    
  } catch (error) {
    console.error('❌ ERROR loading keys.json:', error);
    console.error('Error details:', error.message);
    
    // Fallback ke default keys
    VALID_KEYS = ['KUTO123', 'SAIFREE', 'TESTKEY', 'OBSIDIAN'];
    console.log('🔄 Using fallback keys:', VALID_KEYS);
    
    // Update UI
    updateKeysInfoUI();
    
    // Show error notification
    showNotification(`⚠️ Error loading keys.json. Using default keys.`);
  }
}

// Update UI dengan info keys
function updateKeysInfoUI() {
  setTimeout(() => {
    // Update di login footer
    const footer = document.querySelector('.login-footer');
    if (footer) {
      // Remove existing info jika ada
      const existingInfo = footer.querySelector('.keys-info');
      if (existingInfo) existingInfo.remove();
    
    // Update di debug info
    const debugInfo = document.getElementById('debugInfo');
    if (debugInfo) {
      debugInfo.innerHTML = `
        Keys Loaded: ${VALID_KEYS.length}<br>
        First 3: ${VALID_KEYS.slice(0, 3).join(', ')}<br>
        Last Load: ${new Date().toLocaleTimeString()}
      `;
    }
    
    // Update counter di Credits
    const keysCounter = document.getElementById('currentKeysCount');
    if (keysCounter) {
      keysCounter.textContent = VALID_KEYS.length;
    }
    
  }, 500);
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
      showNotification(`🎮 Lifetime access activated (${VALID_KEYS.length} keys available)`);
    }, 800);
    
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
    
    // Buat pesan error
    let errorMessage = `❌ Invalid access key`;
    
    if (suggestions.length > 0) {
      errorMessage += `\nTry: ${suggestions.join(', ')}`;
    } else if (VALID_KEYS.length > 0) {
      errorMessage += `\nAvailable keys: ${VALID_KEYS.slice(0, 3).join(', ')}...`;
    }
    
    if (VALID_KEYS.length > 0) {
      errorMessage += `\n(Total ${VALID_KEYS.length} keys loaded)`;
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
// 4. SAII PROCESS FUNCTIONS
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
  
  if (progressBar) progressBar.style.width = '0%';
  if (progressPercent) progressPercent.textContent = '0%';
  if (progressLabel) progressLabel.textContent = 'Initializing...';
  
  const sequences = [
    { lineId: 'line2', text: 'Checking system integrity...', delay: 500, typingSpeed: 40, progress: 20 },
    { lineId: 'line3', text: 'Preparing Free Fire environment...', delay: 1500, typingSpeed: 40, progress: 50 },
    { lineId: 'line4', text: 'Bypassing security protocols...', delay: 2500, typingSpeed: 40, progress: 75 },
    { lineId: 'line5', text: 'Launching Free Fire with optimizations...', delay: 3500, typingSpeed: 50, progress: 100 }
  ];
  
  sequences.forEach((seq, index) => {
    setTimeout(() => {
      typeWithBlur(seq.lineId, seq.text, seq.typingSpeed, () => {
        if (progressBar) progressBar.style.width = seq.progress + '%';
        if (progressPercent) progressPercent.textContent = seq.progress + '%';
        
        if (progressLabel) {
          if (seq.progress === 20) progressLabel.textContent = 'System check...';
          if (seq.progress === 50) progressLabel.textContent = 'Preparing...';
          if (seq.progress === 75) progressLabel.textContent = 'Security bypass...';
          if (seq.progress === 100) progressLabel.textContent = 'Launching...';
        }
        
        if (seq.progress === 100) {
          setTimeout(() => launchFreeFire(), 800);
        }
      });
    }, seq.delay);
  });
}

// Typewriter effect untuk terminal
function typeWithBlur(elementId, text, speed, callback) {
  const element = document.getElementById(elementId);
  const textElement = document.getElementById(`text${elementId.replace('line', '')}`);
  
  if (!element || !textElement) return;
  
  textElement.textContent = '';
  element.classList.remove('active');
  element.style.filter = 'blur(5px)';
  element.style.opacity = '0.8';
  
  setTimeout(() => {
    element.classList.add('active');
    element.style.filter = 'blur(0)';
    element.style.opacity = '1';
    
    let i = 0;
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

// Launch Free Fire
function launchFreeFire() {
  // Cek fitur yang diaktifkan
  const aimAssist = document.getElementById('aim')?.checked || false;
  const antiBan = document.getElementById('antiban')?.checked || false;
  
  if (aimAssist || antiBan) {
    showNotification('🚀 Launching Free Fire with enabled features');
  } else {
    showNotification('🚀 Launching Free Fire...');
  }
  
  // Simpan settings
  const settings = {
    aimAssist: aimAssist,
    antiBan: antiBan,
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
// 5. DEBUG & TEST FUNCTIONS
// ==============================================

// Reload keys manual
window.reloadKeys = async function() {
  console.log('🔄 Manually reloading keys...');
  showNotification('🔄 Reloading keys from keys.json...');
  await loadKeys();
  showNotification(`✅ Reloaded ${VALID_KEYS.length} keys`);
  return VALID_KEYS;
};

// Show all keys di console
window.showAllKeys = function() {
  console.log('🔑 === ALL VALID KEYS ===');
  VALID_KEYS.forEach((key, index) => {
    console.log(`${(index + 1).toString().padStart(2, '0')}. ${key}`);
  });
  console.log(`📊 Total: ${VALID_KEYS.length} keys`);
  return VALID_KEYS;
};

// Test key tertentu
window.testKey = function(keyToTest) {
  if (!keyToTest) {
    keyToTest = prompt('Enter key to test:');
    if (!keyToTest) return false;
  }
  
  const key = keyToTest.toUpperCase().trim();
  const isValid = VALID_KEYS.includes(key);
  
  console.log(`🔍 Testing key: "${key}"`);
  console.log(`Result: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
  
  if (isValid) {
    showNotification(`✅ Key "${key}" is VALID`);
  } else {
    // Cari key yang mirip
    const similar = VALID_KEYS.filter(k => 
      k.substring(0, 3) === key.substring(0, 3) ||
      k.includes(key) || key.includes(k)
    ).slice(0, 3);
    
    let message = `❌ Key "${key}" is INVALID`;
    if (similar.length > 0) {
      message += `\nSimilar keys: ${similar.join(', ')}`;
    }
    
    showNotification(message);
  }
  
  return isValid;
};

// Export keys ke clipboard
window.copyAllKeys = function() {
  const keysText = VALID_KEYS.join('\n');
  navigator.clipboard.writeText(keysText)
    .then(() => {
      console.log('📋 Keys copied to clipboard');
      showNotification(`📋 ${VALID_KEYS.length} keys copied to clipboard`);
    })
    .catch(err => {
      console.error('Failed to copy keys:', err);
    });
};

// ==============================================
// 6. INITIALIZATION
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
      settings[this.id] = this.checked;
      localStorage.setItem('ffSettings', JSON.stringify(settings));
      console.log(`Toggle ${this.id}: ${this.checked ? 'ON' : 'OFF'}`);
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
// 7. OVERRIDE DEFAULT BROWSER FUNCTIONS
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
// 8. SHAKE ANIMATION (untuk invalid key)
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

// ==============================================
// END OF SCRIPT
// ==============================================
console.log('✅ script.js loaded successfully');
