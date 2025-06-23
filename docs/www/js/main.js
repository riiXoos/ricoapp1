let ADMIN_PASSWORD = "";
let secretLinks = {};

async function loadSettings() {
  try {
    const response = await fetch("https://raw.githubusercontent.com/riiXoos/ricoapp90/main/www/config/settings.json");
    const settings = await response.json();
    ADMIN_PASSWORD = settings.ADMIN_PASSWORD;
    secretLinks = settings.secretLinks;
    console.log("تم تحميل البيانات من GitHub بنجاح");
  } catch (error) {
    console.error("خطأ أثناء تحميل الإعدادات من GitHub:", error);
  }
}

loadSettings();
function showOfflineScreen() {
  let blackout = document.createElement("div");
  blackout.style.position = "fixed";
  blackout.style.top = "0";
  blackout.style.left = "0";
  blackout.style.width = "100%";
  blackout.style.height = "100%";
  blackout.style.backgroundColor = "black";
  blackout.style.zIndex = "9999";
  blackout.id = "offlineScreen";
  document.body.appendChild(blackout);
}

function hideOfflineScreen() {
  const blackout = document.getElementById("offlineScreen");
  if (blackout) {
    blackout.remove();
  }
}

window.addEventListener("offline", showOfflineScreen);
window.addEventListener("online", hideOfflineScreen);

