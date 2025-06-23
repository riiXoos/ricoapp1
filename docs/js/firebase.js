// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD31ArwVR9L9H8p_ewGXq5b0cDcva0cqF0",
  authDomain: "visitor-logger-89c4b.firebaseapp.com",
  databaseURL: "https://visitor-logger-89c4b-default-rtdb.firebaseio.com",
  projectId: "visitor-logger-89c4b",
  storageBucket: "visitor-logger-89c4b.firebasestorage.app",
  messagingSenderId: "82770471301",
  appId: "1:82770471301:web:8ae6147496f9075ca47cec"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to log visitor IP and details
async function logVisitor(ip) {
    const visitorRef = db.collection("visitors").doc(ip);
    await visitorRef.set({
        visits: firebase.firestore.FieldValue.increment(1),
        lastVisit: new Date().toLocaleString(),
        // You might want to add more details like user agent, referrer, etc.
    }, { merge: true });
    console.log(`Visitor ${ip} logged.`);
}

// Function to check if an IP is blocked
async function isIPBlocked(ip) {
    try {
        const doc = await db.collection("blockedIPs").doc(ip).get();
        return doc.exists;
    } catch (error) {
        console.error("Error checking blocked IP:", error);
        return false;
    }
}

// Function to block an IP
async function blockIP(ip) {
    try {
        await db.collection("blockedIPs").doc(ip).set({ blockedAt: new Date() });
        console.log(`IP ${ip} blocked.`);
    } catch (error) {
        console.error("Error blocking IP:", error);
    }
}

// Function to unblock an IP
async function unblockIP(ip) {
    try {
        await db.collection("blockedIPs").doc(ip).delete();
        console.log(`IP ${ip} unblocked.`);
    } catch (error) {
        console.error("Error unblocking IP:", error);
    }
}

// Function to load visitors (for admin panel)
async function loadVisitors() {
    try {
        const snapshot = await db.collection("visitors").orderBy("lastVisit", "desc").limit(50).get();
        const visitors = [];
        snapshot.forEach(doc => {
            visitors.push({ id: doc.id, ...doc.data() });
        });
        return visitors;
    } catch (error) {
        console.error("Error loading visitors:", error);
        return [];
    }
}

// Function to update statistics
async function updateStatistics(statName) {
    const statRef = db.collection("statistics").doc(statName);
    await statRef.set({ count: firebase.firestore.FieldValue.increment(1) }, { merge: true });
    console.log(`Statistic ${statName} updated.`);
}

// Expose functions globally if needed by other scripts
window.FirebaseHelper = {
    logVisitor,
    isIPBlocked,
    blockIP,
    unblockIP,
    loadVisitors,
    updateStatistics,
    db // Expose db instance if needed for more direct operations
};


