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
