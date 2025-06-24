// Main JavaScript file for Rico World App

// ===== GLOBAL VARIABLES =====
let currentUser = null;
let isAdminLoggedIn = false;
let visitorsListener = null;
let statsListener = null;

function showOfflineScreen() {
  const blackout = document.createElement("div");
  blackout.style.position = "fixed";
  blackout.style.top = 0;
  blackout.style.left = 0;
  blackout.style.width = "100%";
  blackout.style.height = "100%";
  blackout.style.backgroundColor = "black";
  blackout.style.zIndex = 99999;
  document.body.appendChild(blackout);
}

window.addEventListener("offline", showOfflineScreen);

// Admin password
const ADMIN_PASSWORD = "rico011899009";

// Secret links database (same as original)
// 🔒 تحميل البيانات من Firebase
let secretLinks = {};

firebase.initializeApp({
  apiKey: "AIzaSyABc5eY3qqvL1SzIpKH8-gWaEcrRdx6pZQ",
  authDomain: "ricowa-63945.firebaseapp.com",
  projectId: "ricowa-63945"
});
const db = firebase.firestore();

firebase.firestore().collection("config").doc("secrets").get()
  .then((doc) => {
    if (doc.exists) {
      secretLinks = doc.data();
      console.log("✅ تم تحميل البيانات:", secretLinks);

      // هنا تبدأ تشتغل بالداتا
      if (typeof initApp === 'function') initApp();
    } else {
      console.error("❌ البيانات غير موجودة");
    }
  })
  .catch((error) => {
    console.error("❌ خطأ في تحميل البيانات:", error);
  });


// Game version mappings
const gameVersions = {
    'English version': 'english',
    'Vietnam version': 'vietnam', 
    'China version': 'china',
    'Turkish version': 'turkish',
    'New version': 'new',
    'Demon version': 'demon',
    'Dragon version': 'dragon'
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async function() {
    try {
        showLoading();
        await initializeApp();
        hideLoading();
    } catch (error) {
        console.error('Initialization error:', error);
        hideLoading();
        showNotification('Error loading application', 'error');
    }
});

// Initialize the application
async function initializeApp() {
    // Log visitor
    await logVisitor();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize UI components
    initializeUI();
    
    // Setup real-time listeners
    setupRealtimeListeners();
    
    console.log('Rico World App initialized successfully');
}

// ===== VISITOR LOGGING =====
async function logVisitor() {
    try {
        const ip = await Utils.getUserIP();
        const location = await Utils.getUserLocation();
        const deviceInfo = Utils.getDeviceInfo();
        
        // Check if IP is blocked
        const isBlocked = await FirebaseHelper.isIPBlocked(ip);
        if (isBlocked) {
            showBlockedMessage();
            return;
        }
        
        const visitorData = {
            ip: ip,
            location: location,
            device: deviceInfo,
            timestamp: new Date(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct',
            sessionId: generateSessionId()
        };
        
        await FirebaseHelper.addVisitor(visitorData);
        await FirebaseHelper.updateStatistics('totalVisitors');
        
        // Store session info
        Utils.setStorageItem('sessionId', visitorData.sessionId);
        Utils.setStorageItem('visitorLogged', true, 1); // 1 hour
        
        console.log('Visitor logged successfully');
    } catch (error) {
        console.error('Error logging visitor:', error);
    }
}

// Generate unique session ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Show blocked message
function showBlockedMessage() {
    const container = document.querySelector('.container');
    if (container) {
        container.innerHTML = `
            <div class="blocked-message">
                <div class="blocked-icon">
                    <i class="fas fa-ban"></i>
                </div>
                <h2>Access Blocked</h2>
                <p>Sorry, your IP address has been blocked from accessing this site.</p>
                <p>If you believe this is an error, please contact the administration.</p>
            </div>
        `;
        container.classList.add('blocked');
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Password input enter key
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
        
        passwordInput.addEventListener('input', function() {
            clearMessages();
        });
    }
    
    // Admin password input enter key
    const adminPasswordInput = document.getElementById('adminPassword');
    if (adminPasswordInput) {
        adminPasswordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyAdmin();
            }
        });
    }
    
    // Game ID input enter key
    const gameIdInput = document.getElementById('gameIdInput');
    if (gameIdInput) {
        gameIdInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkGamePassword();
            }
        });
    }
    
    // Close menus when clicking outside
    document.addEventListener('click', function(e) {
        const gamesMenu = document.getElementById('gamesMenu');
        const gamesBtn = document.querySelector('.games-btn');
        
        if (gamesMenu && !gamesMenu.contains(e.target) && !gamesBtn.contains(e.target)) {
            gamesMenu.classList.remove('visible');
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape key to close modals
        if (e.key === 'Escape') {
            closeGameIdPage();
            const gamesMenu = document.getElementById('gamesMenu');
            if (gamesMenu) gamesMenu.classList.remove('visible');
        }
        
        // Admin panel shortcut (Ctrl + Shift + A) - Only if admin is authenticated
        if (e.ctrlKey && e.shiftKey && e.key === 'A' && isAdminAuthenticated) {
            e.preventDefault();
            toggleAdminPanel();
        }
    });
}

// ===== UI INITIALIZATION =====
function initializeUI() {
    // Add loading progress animation
    animateLoadingProgress();
    
    // Initialize particle system
    createParticleSystem();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Initialize tooltips
    initializeTooltips();
}

// Animate loading progress
function animateLoadingProgress() {
    const progressBar = document.querySelector('.loading-progress');
    if (progressBar) {
        progressBar.style.width = '100%';
    }
}

// Create particle system
function createParticleSystem() {
    const particleContainer = document.querySelector('.floating-particles');
    if (!particleContainer) return;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createParticle();
        }, i * 200);
    }
    
    // Continue creating particles
    setInterval(createParticle, 2000);
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    document.querySelector('.floating-particles').appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 8000);
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Initialize tooltips
function initializeTooltips() {
    document.querySelectorAll('[title]').forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('title');
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.fontSize = '12px';
    tooltip.style.zIndex = '10000';
    tooltip.style.pointerEvents = 'none';
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    
    e.target.tooltipElement = tooltip;
    e.target.removeAttribute('title');
}

function hideTooltip(e) {
    if (e.target.tooltipElement) {
        e.target.tooltipElement.remove();
        e.target.setAttribute('title', e.target.tooltipElement.textContent);
        delete e.target.tooltipElement;
    }
}

// ===== PASSWORD CHECKING =====
async function checkPassword() {
    const passwordInput = document.getElementById('passwordInput');
    const password = passwordInput.value.trim();
    
    if (!password) {
        showError('Please enter access code');
        Utils.addAnimation(passwordInput, 'shake');
        return;
    }
    
    // Show loading state
    const button = document.querySelector('.access-btn');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    button.disabled = true;
    
    try {
        // Log access attempt
        await logAccessAttempt(password, 'main');
        
        if (secretLinks[password]) {
            const decodedUrl = Utils.base64Decode(secretLinks[password]);
            if (decodedUrl) {
                showSuccess('Verification successful! Redirecting...');
                await FirebaseHelper.updateStatistics('successfulAccess');
                
                setTimeout(() => {
                    openSecretContent(decodedUrl);
                }, 1500);
                return;
            }
        }
        
        // Invalid password
        await FirebaseHelper.updateStatistics('failedAccess');
        showError('Invalid access code!');
        Utils.addAnimation(passwordInput, 'shake');
        passwordInput.value = '';
        
    } catch (error) {
        console.error('Error checking password:', error);
        showError('Error verifying access code');
    } finally {
        // Restore button state
        button.innerHTML = originalText;
        button.disabled = false;
    }
}

// Check game password
async function checkGamePassword() {
    const gameIdInput = document.getElementById('gameIdInput');
    const password = gameIdInput.value.trim();
    const gameTitle = document.getElementById('selectedGameTitle').textContent;
    
    if (!password) {
        showGameError('Please enter access code');
        Utils.addAnimation(gameIdInput, 'shake');
        return;
    }
    
    try {
        // Log access attempt
        await logAccessAttempt(password, 'game', gameTitle);
        
        if (secretLinks[password]) {
            const decodedUrl = Utils.base64Decode(secretLinks[password]);
            if (decodedUrl) {
                showNotification('Verification successful! Redirecting...', 'success');
                await FirebaseHelper.updateStatistics('successfulAccess');
                
                setTimeout(() => {
                    openSecretContent(decodedUrl);
                    closeGameIdPage();
                }, 1500);
                return;
            }
        }
        
        // Invalid password
        await FirebaseHelper.updateStatistics('failedAccess');
        showGameError('Invalid access code!');
        Utils.addAnimation(gameIdInput, 'shake');
        gameIdInput.value = '';
        
    } catch (error) {
        console.error('Error checking game password:', error);
        showGameError('Error verifying access code');
    }
}

// Log access attempt
async function logAccessAttempt(password, type, gameTitle = null) {
    try {
        const ip = await Utils.getUserIP();
        const sessionId = Utils.getStorageItem('sessionId');
        
        const logData = {
            ip: ip,
            sessionId: sessionId,
            password: password.substring(0, 3) + '***', // Partial password for security
            type: type,
            gameTitle: gameTitle,
            success: secretLinks[password] ? true : false,
            userAgent: navigator.userAgent,
            timestamp: new Date()
        };
        
        await FirebaseHelper.logAccess(logData);
    } catch (error) {
        console.error('Error logging access attempt:', error);
    }
}

// Open secret content
function openSecretContent(url) {
    const contentFrame = document.getElementById('contentFrame');
    const backBtn = document.getElementById('backBtn');
    
    if (contentFrame && backBtn) {
        contentFrame.src = url;
        contentFrame.classList.add('visible');
        backBtn.classList.add('visible');
        
        // Hide main container
        const mainContainer = document.getElementById('mainContainer');
        if (mainContainer) {
            mainContainer.style.display = 'none';
        }
        
        // Disable body scroll
        document.body.classList.add('no-scroll');
    }
}

// Go back to main page
function goBack() {
    const contentFrame = document.getElementById('contentFrame');
    const backBtn = document.getElementById('backBtn');
    const mainContainer = document.getElementById('mainContainer');
    
    if (contentFrame) {
        contentFrame.classList.remove('visible');
        contentFrame.src = '';
    }
    
    if (backBtn) {
        backBtn.classList.remove('visible');
    }
    
    if (mainContainer) {
        mainContainer.style.display = 'flex';
    }
    
    // Enable body scroll
    document.body.classList.remove('no-scroll');
    
    // Clear password inputs
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) passwordInput.value = '';
    
    clearMessages();
}

// ===== GAMES MENU =====
function toggleGamesMenu() {
    const gamesMenu = document.getElementById('gamesMenu');
    if (gamesMenu) {
        gamesMenu.classList.toggle('visible');
        
        if (gamesMenu.classList.contains('visible')) {
            Utils.addAnimation(gamesMenu, 'slide-in-right');
        }
    }
}

function openGameIdPage(gameVersion) {
    const gameIdPage = document.getElementById('gameIdPage');
    const selectedGameTitle = document.getElementById('selectedGameTitle');
    const gameIdInput = document.getElementById('gameIdInput');
    
    if (gameIdPage && selectedGameTitle) {
        selectedGameTitle.textContent = gameVersion;
        gameIdPage.classList.add('visible');
        
        // Focus on input
        setTimeout(() => {
            if (gameIdInput) gameIdInput.focus();
        }, 300);
        
        // Close games menu
        const gamesMenu = document.getElementById('gamesMenu');
        if (gamesMenu) gamesMenu.classList.remove('visible');
        
        Utils.addAnimation(gameIdPage, 'fade-in');
    }
}

function closeGameIdPage() {
    const gameIdPage = document.getElementById('gameIdPage');
    const gameIdInput = document.getElementById('gameIdInput');
    
    if (gameIdPage) {
        gameIdPage.classList.remove('visible');
        
        // Clear input and error
        if (gameIdInput) gameIdInput.value = '';
        hideGameError();
    }
}

// ===== SOCIAL FUNCTIONS =====
function openDiscord() {
    window.open('https://discord.gg/YDB8MfQ8', '_blank');
    showNotification('Discord link opened', 'info');
}

// ===== MESSAGE FUNCTIONS =====
function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    if (errorMsg) {
        errorMsg.querySelector('.message-text').textContent = message;
        errorMsg.style.display = 'flex';
        Utils.addAnimation(errorMsg, 'slide-in-bottom');
        
        // Hide after 5 seconds
        setTimeout(() => {
            errorMsg.style.display = 'none';
        }, 5000);
    }
}

function showSuccess(message) {
    const successMsg = document.getElementById('successMsg');
    if (successMsg) {
        successMsg.querySelector('.message-text').textContent = message;
        successMsg.style.display = 'flex';
        Utils.addAnimation(successMsg, 'slide-in-bottom');
        
        // Hide after 3 seconds
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 3000);
    }
}

function showGameError(message) {
    const gameErrorMsg = document.getElementById('gameErrorMsg');
    if (gameErrorMsg) {
        gameErrorMsg.querySelector('span').textContent = message;
        gameErrorMsg.style.display = 'flex';
        Utils.addAnimation(gameErrorMsg, 'shake');
        
        // Hide after 5 seconds
        setTimeout(() => {
            gameErrorMsg.style.display = 'none';
        }, 5000);
    }
}

function hideGameError() {
    const gameErrorMsg = document.getElementById('gameErrorMsg');
    if (gameErrorMsg) {
        gameErrorMsg.style.display = 'none';
    }
}

function clearMessages() {
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');
    
    if (errorMsg) errorMsg.style.display = 'none';
    if (successMsg) successMsg.style.display = 'none';
}

// ===== ADMIN PANEL FUNCTIONS =====
// Admin panel is hidden by default and shown only after successful login
function showAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.style.display = 'block';
        Utils.addAnimation(adminPanel, 'fade-in-up');
    }
}

function hideAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        adminPanel.style.display = 'none';
    }
}

// This function is now only called when admin is authenticated
function toggleAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    if (adminPanel) {
        if (adminPanel.style.display === 'none') {
            showAdminPanel();
        } else {
            hideAdminPanel();
        }
    }
}

// ===== REAL-TIME LISTENERS =====
function setupRealtimeListeners() {
    // Listen for visitor changes
    if (FirebaseHelper.onVisitorsChange) {
        visitorsListener = FirebaseHelper.onVisitorsChange((snapshot) => {
            updateVisitorsList(snapshot);
        });
    }
    
    // Listen for stats changes
    if (FirebaseHelper.onStatsChange) {
        statsListener = FirebaseHelper.onStatsChange((doc) => {
            updateStatsDisplay(doc);
        });
    }
}

function updateVisitorsList(snapshot) {
    // This will be implemented in admin.js
    console.log('Visitors updated:', snapshot.size);
}

function updateStatsDisplay(doc) {
    if (doc.exists) {
        const stats = doc.data();
        
        // Update stats in UI
        const totalVisitors = document.getElementById('totalVisitors');
        const todayVisitors = document.getElementById('todayVisitors');
        const successfulAccess = document.getElementById('successfulAccess');
        
        if (totalVisitors) totalVisitors.textContent = stats.totalVisitors || 0;
        if (todayVisitors) todayVisitors.textContent = stats.totalVisitors || 0;
        if (successfulAccess) successfulAccess.textContent = stats.successfulAccess || 0;
    }
}

// ===== UTILITY FUNCTIONS =====
function showStats() {
    showNotification('Statistics page under development', 'info');
}

function showSettings() {
    showNotification('Settings page under development', 'info');
}

// ===== CLEANUP =====
window.addEventListener('beforeunload', () => {
    // Cleanup listeners
    if (visitorsListener) visitorsListener();
    if (statsListener) statsListener();
});

// ===== EXPORT FUNCTIONS =====
window.checkPassword = checkPassword;
window.checkGamePassword = checkGamePassword;
window.toggleGamesMenu = toggleGamesMenu;
window.openGameIdPage = openGameIdPage;
window.closeGameIdPage = closeGameIdPage;
window.openDiscord = openDiscord;
window.goBack = goBack;
window.showStats = showStats;
window.showSettings = showSettings;
window.toggleTheme = Utils.toggleTheme;


