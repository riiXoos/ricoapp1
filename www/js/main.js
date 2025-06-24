
// ===== Rico World - main.js =====

// ===== Firebase Initialization =====
firebase.initializeApp({
  apiKey: "AIzaSyABc5eY3qqvL1SzIpKH8-gWaEcrRdx6pZQ",
  authDomain: "ricowa-63945.firebaseapp.com",
  projectId: "ricowa-63945"
});
const db = firebase.firestore();

// ===== GLOBAL VARIABLES =====
let secretLinks = {};
let isAdminLoggedIn = false;

// ===== Offline Blackout =====
window.addEventListener("offline", () => {
  const blackout = document.createElement("div");
  blackout.style.position = "fixed";
  blackout.style.top = 0;
  blackout.style.left = 0;
  blackout.style.width = "100%";
  blackout.style.height = "100%";
  blackout.style.backgroundColor = "black";
  blackout.style.color = "white";
  blackout.style.fontSize = "24px";
  blackout.style.display = "flex";
  blackout.style.alignItems = "center";
  blackout.style.justifyContent = "center";
  blackout.style.zIndex = 99999;
  blackout.innerText = "⚠️ تم فقد الاتصال بالإنترنت. أعد تحميل الصفحة.";
  document.body.appendChild(blackout);
});

// ===== Load Secrets from Firebase =====
db.collection("config").doc("secrets").get().then(doc => {
  if (doc.exists) {
    secretLinks = doc.data();
    console.log("✅ Loaded secret links:", secretLinks);
    if (typeof initApp === 'function') initApp();
  } else {
    console.error("❌ No secrets found.");
  }
}).catch(error => {
  console.error("❌ Error loading secrets:", error);
});

// ===== Init App Function =====
function initApp() {
  hideLoading();
  setupUI();
  console.log("✅ App Initialized.");
}

// ===== Password Check =====
function checkPassword() {
  const input = document.getElementById("passwordInput");
  const code = input.value.trim();
  if (!code || !secretLinks[code]) {
    showError("Invalid access code.");
    return;
  }
  const decodedURL = atob(secretLinks[code]);
  showSuccess("Code accepted. Redirecting...");
  setTimeout(() => {
    openSecret(decodedURL);
  }, 1500);
}

function openSecret(url) {
  const iframe = document.getElementById("contentFrame");
  const container = document.getElementById("mainContainer");
  iframe.src = url;
  iframe.classList.add("visible");
  container.style.display = "none";
  document.body.classList.add("no-scroll");
}

// ===== Utility UI Functions =====
function showError(msg) {
  const el = document.getElementById("errorMsg");
  if (el) {
    el.querySelector(".message-text").innerText = msg;
    el.style.display = "flex";
    setTimeout(() => el.style.display = "none", 4000);
  }
}

function showSuccess(msg) {
  const el = document.getElementById("successMsg");
  if (el) {
    el.querySelector(".message-text").innerText = msg;
    el.style.display = "flex";
    setTimeout(() => el.style.display = "none", 3000);
  }
}

function hideLoading() {
  const screen = document.getElementById("loadingScreen");
  if (screen) {
    screen.style.opacity = "0";
    setTimeout(() => {
      screen.style.display = "none";
    }, 500);
  }
}

function setupUI() {
  const input = document.getElementById("passwordInput");
  if (input) {
    input.addEventListener("keypress", e => {
      if (e.key === "Enter") checkPassword();
    });
  }
}

window.checkPassword = checkPassword;
