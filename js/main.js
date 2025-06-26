// ===== main.js (Encrypted & Clean Version) =====

(function () {
  let s = {};
  let a = false;

  window.addEventListener("offline", () => {
    const d = document.createElement("div");
    Object.assign(d.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "black",
      color: "white",
      fontSize: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 99999
    });
    d.innerText = "⚠️ تم فقد الاتصال بالإنترنت. أعد تحميل الصفحة.";
    document.body.appendChild(d);
  });

  const u = atob("aHR0cHM6Ly9maXJlYmFzZWdvb2dsZWFwaXMuY29tL3YxL2JwL3JpY293YS02Mzk0NS9kYXRhL2NvbmZpZy9zZWNyZXRzIgs=");

  firebase.initializeApp({
    apiKey: "AIzaSyABc5eY3qqvL1SzIpKH8-gWaEcrRdx6pZQ",
    authDomain: "ricowa-63945.firebaseapp.com",
    projectId: "ricowa-63945"
  });
  const db = firebase.firestore();

  db.doc("config/secrets").get().then(doc => {
    if (doc.exists) {
      s = doc.data();
      console.log("✅ Loaded:", s);
      if (typeof window.i === 'function') window.i();
    } else {
      console.error("❌ No data found");
    }
  }).catch(e => console.error("❌ Firebase Error:", e));

  window.p = function () {
    const i = document.getElementById("passwordInput");
    const c = i.value.trim();
    if (!c || !s[c]) return f("رمز الدخول غير صالح");
    const u = atob(s[c]);
    h("تم التحقق! جارٍ التحويل...");
    setTimeout(() => o(u), 1500);
  };

  function o(url) {
    const f = document.getElementById("contentFrame");
    const m = document.getElementById("mainContainer");
    f.src = url;
    f.classList.add("visible");
    m.style.display = "none";
    document.body.classList.add("no-scroll");
  }

  function f(t) {
    const e = document.getElementById("errorMsg");
    if (e) {
      e.querySelector(".message-text").innerText = t;
      e.style.display = "flex";
      setTimeout(() => e.style.display = "none", 4000);
    }
  }

  function h(t) {
    const e = document.getElementById("successMsg");
    if (e) {
      e.querySelector(".message-text").innerText = t;
      e.style.display = "flex";
      setTimeout(() => e.style.display = "none", 3000);
    }
  }

  function l() {
    const e = document.getElementById("loadingScreen");
    if (e) {
      e.style.opacity = "0";
      setTimeout(() => e.style.display = "none", 500);
    }
  }

  function uI() {
    const i = document.getElementById("passwordInput");
    if (i) i.addEventListener("keypress", e => {
      if (e.key === "Enter") window.p();
    });
  }

  window.i = function () {
    l();
    uI();
    console.log("✅ Ready");
  }
})();
