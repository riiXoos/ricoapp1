// ===== firebase.js (تهيئة الاتصال بـ Firebase وقراءة البيانات) =====

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyABc5eY3qqvL1SzIpKH8-gWaEcrRdx6pZQ",
  authDomain: "ricowa-63945.firebaseapp.com",
  projectId: "ricowa-63945",
  storageBucket: "ricowa-63945.appspot.com",
  messagingSenderId: "529651579810",
  appId: "1:529651579810:web:1a8684ba801974e780d0fb"
};

// تأكد من عدم تهيئة Firebase مرتين
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const db = firebase.firestore();

// تحميل البيانات من Firestore
function loadSecretsFromFirestore() {
  db.collection("config").doc("secrets").get()
    .then(doc => {
      if (doc.exists) {
        secretLinks = doc.data();
        console.log("✅ تم تحميل البيانات من Firebase:", secretLinks);
        if (typeof initApp === 'function') initApp();
      } else {
        console.error("⚠️ لم يتم العثور على الوثيقة.");
      }
    })
    .catch(error => {
      console.error("❌ خطأ أثناء تحميل البيانات:", error);
    });
}

// استدعاء الدالة
loadSecretsFromFirestore();
