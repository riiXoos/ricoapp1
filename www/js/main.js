// ===== Rico World - main.js (Firebase Direct Access - Encoded URL) =====

let secretLinks = {};
let isAdminLoggedIn = false;

// ===== Offline Blackout =====
window.addEventListener("offline", () => {
  const blackout = document.createElement("div");
  blackout.style = `
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    background-color: black; color: white;
    font-size: 24px; display: flex;
    align-items: center; justify-content: center;
    z-index: 99999;
  `;
  blackout.innerText = "⚠️ تم فقد الاتصال بالإنترنت. أعد تحميل الصفحة.";
  document.body.appendChild(blackout);
});

// ===== Firebase Config (encoded) =====
const encodedConfig = "eyJhcGlLZXkiOiJBSXphU3lBQmM1ZVkzcXF2TDFTeklwS0g4LWdhRWNyUmR4NnBaUSIsImF1dGhEb21haW4iOiJyaWNvd2EtNjM5NDUuZmlyZWJhc2VhcHAuY29tIiwicHJvamVjdElkIjoicmljb3dhLTYzOTQ1Iiwic3RvcmFnZUJ1Y2tldCI6InJpY293YS02Mzk0NS5maXJlYmFzZXN0b3JhZ2UuYXBwIiwibWVzc2FnaW5nU2VuZGVySWQiOiI1Mjk2NTE1Nzk4MTAiLCJhcHBJZCI6IjE6NTI5NjUxNTc5ODEwOndlYjoxYTg2ODRiYTgwMTk3NGU3ODBkMGZiIn0=";
const decodedConfig = JSON.parse(atob(encodedConfig));
firebase.initializeApp(decodedConfig);

// ===== Load Secrets from Realtime DB =====
firebase.database().ref("/config/secrets").once("value")
  .then(snapshot => {
    secretLinks = snapshot.val() || {};
    console.log("✅ تم تحميل البيانات:", secretLinks);
    if (typeof initApp === 'function') initApp();
  })
  .catch(err => {
    console.error("❌ خطأ في تحميل البيانات:", err);
  });

// ===== Init App =====
function initApp() {
  hideLoading();
  setupUI();
  console.log("✅ التطبيق جاهز");
}

function checkPassword() {
  const input = document.getElementById("passwordInput");
  const code = input.value.trim();
  if (!code || !secretLinks[code]) {
    showError("رمز الدخول غير صالح");
    return;
  }
  const decodedURL = atob(secretLinks[code]);
  showSuccess("تم التحقق! جارٍ التحويل...");
  setTimeout(() => openSecret(decodedURL), 1500);
}

function openSecret(url) {
  const iframe = document.getElementById("contentFrame");
  const container = document.getElementById("mainContainer");
  iframe.src = url;
  iframe.classList.add("visible");
  container.style.display = "none";
  document.body.classList.add("no-scroll");
}

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
    setTimeout(() => screen.style.display = "none", 500);
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
