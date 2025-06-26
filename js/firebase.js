// ===== firebase.js (الربط المباشر مع Firebase Firestore) =====

// التأكد إن firebaseConfig تم تعريفه في ملف firebase-config.js
firebase.initializeApp(firebaseConfig);

// تهيئة قاعدة البيانات
const db = firebase.firestore();
