// Main JavaScript file for Rico World App

// ===== GLOBAL VARIABLES =====
let currentUser = null;
let isAdminLoggedIn = false;
let visitorsListener = null;
let statsListener = null;
let secretLinks = {};

// ===== SHOW OFFLINE SCREEN =====
function showOfflineScreen() {
  const blackout = document.createElement("div");
  blackout.style.position = "fixed";
  blackout.style.top = 0;
  blackout.style.left = 0;
  blackout.style.width = "100%";
  blackout.style.height = "100%";
  blackout.style.backgroundColor = "black";
  blackout.style.zIndex = 99999;
  blackout.style.display = "flex";
  blackout.style.alignItems = "center";
  blackout.style.justifyContent = "center";
  blackout.style.color = "white";
  blackout.style.fontSize = "20px";
  blackout.textContent = "⚠️ تم فقد الاتصال بالإنترنت";
  document.body.innerHTML = "";
  document.body.appendChild(blackout);
}

window.addEventListener("offline", showOfflineScreen);

// ===== FIREBASE INITIALIZATION =====
firebase.initializeApp({
  apiKey: "AIzaSyABc5eY3qqvL1SzIpKH8-gWaEcrRdx6pZQ",
  authDomain: "ricowa-63945.firebaseapp.com",
  projectId: "ricowa-63945"
});
const db = firebase.firestore();

// ===== LOAD SECRETS FROM FIRESTORE =====
db.collection("config").doc("secrets").get()
  .then((doc) => {
    if (doc.exists) {
      secretLinks = doc.data();
      console.log("✅ تم تحميل البيانات:", secretLinks);
      if (typeof initApp === 'function') initApp();
    } else {
      console.error("❌ البيانات غير موجودة");
    }
  })
  .catch((error) => {
    console.error("❌ خطأ في تحميل البيانات:", error);
  });

// ===== APPLICATION INIT =====
function initApp() {
  setupEventListeners();
  setupPasswordCheck();
  setupGameAccess();
}

// ===== SETUP EVENTS =====
function setupEventListeners() {
  const passwordInput = document.getElementById('passwordInput');
  if (passwordInput) {
    passwordInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') checkPassword();
    });
  }

  const gameIdInput = document.getElementById('gameIdInput');
  if (gameIdInput) {
    gameIdInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') checkGamePassword();
    });
  }
}

// ===== CHECK PASSWORD =====
function checkPassword() {
  const input = document.getElementById('passwordInput');
  const code = input.value.trim();

  if (!code) {
    showError('Please enter access code');
    return;
  }

  if (secretLinks[code]) {
    const url = atob(secretLinks[code]);
    openSecretContent(url);
  } else {
    showError('Invalid access code!');
  }
}

function checkGamePassword() {
  const input = document.getElementById('gameIdInput');
  const code = input.value.trim();

  if (!code) {
    showError('Please enter access code');
    return;
  }

  if (secretLinks[code]) {
    const url = atob(secretLinks[code]);
    openSecretContent(url);
  } else {
    showError('Invalid access code!');
  }
}

// ===== OPEN SECRET CONTENT =====
function openSecretContent(url) {
  const frame = document.getElementById('contentFrame');
  const container = document.getElementById('mainContainer');
  const backBtn = document.getElementById('backBtn');

  if (frame && container && backBtn) {
    frame.src = url;
    frame.classList.add('visible');
    container.style.display = 'none';
    backBtn.classList.add('visible');
  }
}

function goBack() {
  const frame = document.getElementById('contentFrame');
  const container = document.getElementById('mainContainer');
  const backBtn = document.getElementById('backBtn');
  const input = document.getElementById('passwordInput');

  if (frame && container && backBtn) {
    frame.src = '';
    frame.classList.remove('visible');
    container.style.display = 'flex';
    backBtn.classList.remove('visible');
    if (input) input.value = '';
  }
}

// ===== ERROR DISPLAY =====
function showError(msg) {
  const box = document.getElementById('errorMsg');
  if (box) {
    box.querySelector('.message-text').textContent = msg;
    box.style.display = 'flex';
    setTimeout(() => box.style.display = 'none', 4000);
  }
}

// ===== GAME MENU =====
function toggleGamesMenu() {
  const menu = document.getElementById('gamesMenu');
  if (menu) menu.classList.toggle('visible');
}

function openGameIdPage(version) {
  const title = document.getElementById('selectedGameTitle');
  const page = document.getElementById('gameIdPage');
  const input = document.getElementById('gameIdInput');
  if (title && page && input) {
    title.textContent = version;
    page.classList.add('visible');
    setTimeout(() => input.focus(), 300);
  }
}

function closeGameIdPage() {
  const page = document.getElementById('gameIdPage');
  const input = document.getElementById('gameIdInput');
  if (page && input) {
    input.value = '';
    page.classList.remove('visible');
  }
}

function openDiscord() {
  window.open('https://discord.gg/YDB8MfQ8', '_blank');
}

// ===== EXPORT TO WINDOW =====
window.checkPassword = checkPassword;
window.checkGamePassword = checkGamePassword;
window.goBack = goBack;
window.toggleGamesMenu = toggleGamesMenu;
window.openGameIdPage = openGameIdPage;
window.closeGameIdPage = closeGameIdPage;
window.openDiscord = openDiscord;
