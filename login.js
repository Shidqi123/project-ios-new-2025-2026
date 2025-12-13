// Login System for SaiKuto

const LOGIN_CONFIG = {
  validKeys: [
    'SAIKUTO2024',
    'KUTOOFF',
    'FREE2024',
    'IOSGAMING',
    'S12345KEY',
    'KUTOACCESS',
    'FFMAX2024',
    'VIPACCESS',
    'GAMEMOD2024',
    'KUTOADMIN'
  ],
  sessionDuration: 24 * 60 * 60 * 1000, // 24 jam dalam milidetik
  localStorageKey: 'saiSession',
  lastLoginKey: 'lastLogin'
};

// Fungsi utama untuk check login
async function checkLogin() {
  const loginKey = document.getElementById('loginKey')?.value;
  const keyStatus = document.getElementById('keyStatus');
  
  if (!loginKey) {
    showNotification('Please enter access key');
    if (keyStatus) keyStatus.innerHTML = '<i class="fas fa-times" style="color:#ff0058"></i>';
    return false;
  }
  
  if (keyStatus) keyStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
  
  // Simulasi validasi (nanti bisa ganti dengan fetch ke server)
  return new Promise(resolve => {
    setTimeout(() => {
      const isValid = validateKey(loginKey);
      
      if (isValid) {
        if (keyStatus) keyStatus.innerHTML = '<i class="fas fa-check" style="color:#00ff88"></i>';
        createSession();
        showNotification('Access granted! Welcome to SaiKuto');
        resolve(true);
      } else {
        if (keyStatus) keyStatus.innerHTML = '<i class="fas fa-times" style="color:#ff0058"></i>';
        showNotification('Invalid access key. Please try again.');
        document.getElementById('loginKey').value = '';
        document.getElementById('loginKey').focus();
        resolve(false);
      }
    }, 1000);
  });
}

// Validasi key
function validateKey(key) {
  const upperKey = key.trim().toUpperCase();
  return LOGIN_CONFIG.validKeys.includes(upperKey);
}

// Buat session
function createSession() {
  localStorage.setItem(LOGIN_CONFIG.localStorageKey, 'active');
  localStorage.setItem(LOGIN_CONFIG.lastLoginKey, Date.now().toString());
}

// Check apakah session masih valid
function checkSession() {
  const session = localStorage.getItem(LOGIN_CONFIG.localStorageKey);
  const lastLogin = localStorage.getItem(LOGIN_CONFIG.lastLoginKey);
  
  if (session === 'active' && lastLogin) {
    const now = Date.now();
    const diff = now - parseInt(lastLogin);
    
    // Check jika session masih dalam durasi yang valid
    if (diff < LOGIN_CONFIG.sessionDuration) {
      return true;
    }
  }
  
  // Clear session jika expired
  clearSession();
  return false;
}

// Hapus session
function clearSession() {
  localStorage.removeItem(LOGIN_CONFIG.localStorageKey);
  localStorage.removeItem(LOGIN_CONFIG.lastLoginKey);
}

// Auto logout setelah waktu tertentu
function setupAutoLogout() {
  // Check session setiap 5 menit
  setInterval(() => {
    if (!checkSession() && window.location.hash !== '#login') {
      showNotification('Session expired. Please login again.');
      showScreen('loginScreen');
    }
  }, 5 * 60 * 1000);
}

// Setup event listener untuk login
function setupLoginListeners() {
  const loginInput = document.getElementById('loginKey');
  const loginBtn = document.querySelector('.login-btn');
  
  if (loginInput) {
    loginInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        checkLogin().then(valid => {
          if (valid) {
            setTimeout(() => showScreen('mainScreen'), 1000);
          }
        });
      }
    });
  }
  
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      checkLogin().then(valid => {
        if (valid) {
          setTimeout(() => showScreen('mainScreen'), 1000);
        }
      });
    });
  }
}

// Initialize login system
function initLoginSystem() {
  if (checkSession()) {
    showScreen('mainScreen');
  } else {
    showScreen('loginScreen');
  }
  
  setupLoginListeners();
  setupAutoLogout();
}

// Export fungsi jika perlu
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkLogin,
    checkSession,
    clearSession,
    initLoginSystem
  };
}
