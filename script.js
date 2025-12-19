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

// ==============================================
// HEADSHOT TRAINING SYSTEM
// ==============================================

let headshotTrainer = {
  isActive: false,
  isTraining: false,
  canvas: null,
  ctx: null,
  targets: [],
  stats: {
    shots: 0,
    hits: 0,
    headshots: 0,
    startTime: 0,
    accuracy: 0
  },
  settings: {
    sensitivity: 50,
    targetSpeed: 30,
    targetSize: 25
  }
};

// Initialize Headshot Trainer
function initHeadshotTrainer() {
  console.log('🎯 Initializing Headshot Trainer...');
  
  // Setup canvas
  headshotTrainer.canvas = document.getElementById('headshotCanvas');
  if (!headshotTrainer.canvas) {
    console.error('Canvas not found');
    return;
  }
  
  headshotTrainer.ctx = headshotTrainer.canvas.getContext('2d');
  
  // Setup event listeners
  const trainerToggle = document.getElementById('headshotTrainer');
  const startBtn = document.getElementById('startTraining');
  const resetBtn = document.getElementById('resetTraining');
  const sensSlider = document.getElementById('sensitivitySlider');
  const speedSlider = document.getElementById('speedSlider');
  
  // Toggle trainer
  if (trainerToggle) {
    trainerToggle.addEventListener('change', function() {
      headshotTrainer.isActive = this.checked;
      const container = document.getElementById('trainingCanvasContainer');
      if (container) {
        container.style.display = this.checked ? 'block' : 'none';
      }
      
      if (this.checked) {
        showNotification('🎯 Headshot Trainer activated');
        setupCanvas();
      } else {
        stopTraining();
      }
    });
  }
  
  // Start training
  if (startBtn) {
    startBtn.addEventListener('click', function() {
      if (!headshotTrainer.isTraining) {
        startHeadshotTraining();
      } else {
        stopTraining();
      }
    });
  }
  
  // Reset training
  if (resetBtn) {
    resetBtn.addEventListener('click', resetHeadshotTraining);
  }
  
  // Sensitivity slider
  if (sensSlider) {
    sensSlider.addEventListener('input', function() {
      headshotTrainer.settings.sensitivity = this.value;
      document.getElementById('sensValue').textContent = this.value;
    });
  }
  
  // Speed slider
  if (speedSlider) {
    speedSlider.addEventListener('input', function() {
      headshotTrainer.settings.targetSpeed = this.value;
      document.getElementById('speedValue').textContent = this.value;
    });
  }
  
  // Canvas click event
  headshotTrainer.canvas.addEventListener('click', handleHeadshotClick);
  
  console.log('✅ Headshot Trainer ready');
}

// Setup canvas
function setupCanvas() {
  const canvas = headshotTrainer.canvas;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  drawTrainingScene();
}

// Start headshot training
function startHeadshotTraining() {
  if (!headshotTrainer.isActive) return;
  
  headshotTrainer.isTraining = true;
  headshotTrainer.stats = {
    shots: 0,
    hits: 0,
    headshots: 0,
    startTime: Date.now(),
    accuracy: 0
  };
  headshotTrainer.targets = [];
  
  // Update button
  const startBtn = document.getElementById('startTraining');
  if (startBtn) {
    startBtn.innerHTML = '<i class="fas fa-pause"></i> STOP';
    startBtn.style.background = 'linear-gradient(135deg, #ff0058, #cc0046)';
  }
  
  // Start spawning targets
  spawnHeadshotTarget();
  
  // Start game loop
  headshotTrainer.gameLoop = requestAnimationFrame(updateHeadshotTraining);
  
  showNotification('🎯 Headshot training started!');
}

// Stop training
function stopTraining() {
  headshotTrainer.isTraining = false;
  
  // Update button
  const startBtn = document.getElementById('startTraining');
  if (startBtn) {
    startBtn.innerHTML = '<i class="fas fa-play"></i> START';
    startBtn.style.background = 'linear-gradient(135deg, #00ff88, #00ccff)';
  }
  
  // Stop game loop
  if (headshotTrainer.gameLoop) {
    cancelAnimationFrame(headshotTrainer.gameLoop);
  }
}

// Reset training
function resetHeadshotTraining() {
  stopTraining();
  headshotTrainer.stats = {
    shots: 0,
    hits: 0,
    headshots: 0,
    startTime: 0,
    accuracy: 0
  };
  headshotTrainer.targets = [];
  
  updateHeadshotStats();
  drawTrainingScene();
  
  showNotification('🎯 Training reset');
}

// Spawn a new target
function spawnHeadshotTarget() {
  if (!headshotTrainer.isTraining) return;
  
  const canvas = headshotTrainer.canvas;
  const size = headshotTrainer.settings.targetSize;
  
  // Random position
  const x = size + Math.random() * (canvas.width - size * 2);
  const y = size + Math.random() * (canvas.height - size * 2);
  
  // 50% chance for head target
  const isHead = Math.random() > 0.5;
  
  const target = {
    x: x,
    y: y,
    size: size,
    isHead: isHead,
    isHit: false,
    spawnTime: Date.now()
  };
  
  headshotTrainer.targets.push(target);
  
  // Schedule next spawn
  const spawnDelay = 1000 - (headshotTrainer.settings.targetSpeed * 8);
  headshotTrainer.spawnTimer = setTimeout(spawnHeadshotTarget, spawnDelay);
}

// Update training loop
function updateHeadshotTraining() {
  if (!headshotTrainer.isTraining) return;
  
  // Remove old targets (3 seconds)
  const now = Date.now();
  headshotTrainer.targets = headshotTrainer.targets.filter(target => 
    !target.isHit && (now - target.spawnTime < 3000)
  );
  
  drawTrainingScene();
  updateHeadshotStats();
  
  headshotTrainer.gameLoop = requestAnimationFrame(updateHeadshotTraining);
}

// Draw training scene
function drawTrainingScene() {
  const ctx = headshotTrainer.ctx;
  const canvas = headshotTrainer.canvas;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw background grid
  drawGrid();
  
  // Draw targets
  headshotTrainer.targets.forEach(target => {
    if (!target.isHit) {
      drawHeadshotTarget(target);
    }
  });
}

// Draw grid background
function drawGrid() {
  const ctx = headshotTrainer.ctx;
  const canvas = headshotTrainer.canvas;
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  
  // Draw grid lines
  for (let x = 0; x < canvas.width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  for (let y = 0; y < canvas.height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Draw a target
function drawHeadshotTarget(target) {
  const ctx = headshotTrainer.ctx;
  
  // Draw outer circle
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.size, 0, Math.PI * 2);
  
  if (target.isHead) {
    // Head target (red)
    ctx.fillStyle = 'rgba(255, 0, 88, 0.2)';
    ctx.strokeStyle = '#ff0058';
  } else {
    // Body target (orange)
    ctx.fillStyle = 'rgba(255, 122, 0, 0.2)';
    ctx.strokeStyle = '#ff7a00';
  }
  
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
  
  // Draw head zone (smaller circle for headshots)
  if (target.isHead) {
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.size * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 0, 88, 0.4)';
    ctx.fill();
  }
  
  // Draw crosshair inside
  ctx.strokeStyle = target.isHead ? '#ff0058' : '#ff7a00';
  ctx.lineWidth = 1;
  
  ctx.beginPath();
  ctx.moveTo(target.x - target.size * 0.3, target.y);
  ctx.lineTo(target.x + target.size * 0.3, target.y);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(target.x, target.y - target.size * 0.3);
  ctx.lineTo(target.x, target.y + target.size * 0.3);
  ctx.stroke();
}

// Handle canvas click
function handleHeadshotClick(event) {
  if (!headshotTrainer.isTraining) return;
  
  const rect = headshotTrainer.canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  headshotTrainer.stats.shots++;
  
  // Check if hit any target
  let hit = false;
  let isHeadshot = false;
  
  headshotTrainer.targets.forEach(target => {
    if (!target.isHit) {
      const distance = Math.sqrt(
        Math.pow(x - target.x, 2) + Math.pow(y - target.y, 2)
      );
      
      if (distance <= target.size) {
        target.isHit = true;
        hit = true;
        headshotTrainer.stats.hits++;
        
        // Check if headshot
        if (target.isHead && distance <= target.size * 0.4) {
          isHeadshot = true;
          headshotTrainer.stats.headshots++;
          
          // Show headshot effect
          showHeadshotEffect(x, y);
        } else {
          // Show hit effect
          showHitEffect(x, y);
        }
      }
    }
  });
  
  // Update stats
  updateHeadshotStats();
  
  // Draw hit effect
  if (hit) {
    drawHitCircle(x, y, isHeadshot ? '#ff0058' : '#ff7a00');
  }
}

// Draw hit circle
function drawHitCircle(x, y, color) {
  const ctx = headshotTrainer.ctx;
  
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Show headshot effect
function showHeadshotEffect(x, y) {
  const effect = document.createElement('div');
  effect.textContent = 'HEADSHOT!';
  effect.style.position = 'absolute';
  effect.style.left = `${x}px`;
  effect.style.top = `${y}px`;
  effect.style.color = '#ff0058';
  effect.style.fontWeight = 'bold';
  effect.style.fontSize = '16px';
  effect.style.textShadow = '0 0 10px #ff0058';
  effect.style.pointerEvents = 'none';
  effect.style.zIndex = '1000';
  effect.style.animation = 'fadeOut 1s forwards';
  
  headshotTrainer.canvas.parentElement.appendChild(effect);
  
  setTimeout(() => {
    effect.remove();
  }, 1000);
}

// Show hit effect
function showHitEffect(x, y) {
  const effect = document.createElement('div');
  effect.textContent = 'HIT!';
  effect.style.position = 'absolute';
  effect.style.left = `${x}px`;
  effect.style.top = `${y}px`;
  effect.style.color = '#ff7a00';
  effect.style.fontWeight = 'bold';
  effect.style.fontSize = '14px';
  effect.style.textShadow = '0 0 10px #ff7a00';
  effect.style.pointerEvents = 'none';
  effect.style.zIndex = '1000';
  effect.style.animation = 'fadeOut 0.8s forwards';
  
  headshotTrainer.canvas.parentElement.appendChild(effect);
  
  setTimeout(() => {
    effect.remove();
  }, 800);
}

// Update stats display
function updateHeadshotStats() {
  const stats = headshotTrainer.stats;
  
  // Calculate accuracy
  const accuracy = stats.shots > 0 ? Math.round((stats.hits / stats.shots) * 100) : 0;
  stats.accuracy = accuracy;
  
  // Update displays
  document.getElementById('hsAccuracy').textContent = `${accuracy}%`;
  document.getElementById('hsCount').textContent = stats.headshots;
  
  // Update time
  if (stats.startTime > 0) {
    const time = Math.floor((Date.now() - stats.startTime) / 1000);
    document.getElementById('hsTime').textContent = `${time}s`;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add this to your existing DOMContentLoaded function
  setTimeout(initHeadshotTrainer, 1000);
});

// Add fadeOut animation to style.css
const style = document.createElement('style');
style.textContent = `
@keyframes fadeOut {
  0% { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(-20px) scale(1.5); }
}
`;
document.head.appendChild(style);
