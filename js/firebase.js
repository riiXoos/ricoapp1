// js/firebase.js

// استيراد Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// إعدادات Firebase (من المشروع الخاص بك)
const firebaseConfig = {
  apiKey: "AIzaSyABc5eY3qqvL1SzIpKH8-gWaEcrRdx6pZQ",
  authDomain: "ricowa-63945.firebaseapp.com",
  projectId: "ricowa-63945"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تصدير Firestore
export const db = getFirestore(app);
