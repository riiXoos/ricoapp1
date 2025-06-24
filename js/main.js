
// Firebase App (متضمن)
firebase.initializeApp({
  apiKey: "AIzaSyABc5eY3qqvL1SzIpKH8-gWaEcrRdx6pZQ",
  authDomain: "ricowa-63945.firebaseapp.com",
  projectId: "ricowa-63945",
});
const db = firebase.firestore();

// تحميل البيانات السرية من Firestore
let secretLinks = {};

firebase.firestore().collection("config").doc("secrets").get()
  .then((doc) => {
    if (doc.exists) {
      secretLinks = doc.data();
      console.log("✅ تم تحميل البيانات من Firebase:", secretLinks);

      // بعدها ممكن تبدأ تنادي دالة init() أو أي دوال تعتمد على البيانات
      initApp();
    } else {
      console.error("❌ المستند غير موجود في Firestore.");
    }
  })
  .catch((error) => {
    console.error("❌ خطأ في الاتصال بـ Firebase:", error);
  });

// مثال: استخدام البيانات بعد التحميل
function initApp() {
  // مثال بسيط: استخدام كلمة سر للتحقق
  const input = document.getElementById("passwordInput");
  const messageBox = document.getElementById("messageContainer");

  window.checkPassword = function () {
    const value = input.value.trim();
    if (secretLinks[value]) {
      window.location.href = atob(secretLinks[value]);
    } else {
      messageBox.style.display = "block";
      messageBox.innerHTML = "<span style='color:red;'>❌ كود غير صحيح</span>";
    }
  };
}
