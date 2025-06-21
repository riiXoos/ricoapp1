// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD31ArwVR9L9H8p_ewGXq5b0cDcva0cqF0",
    authDomain: "visitor-logger-89c4b.firebaseapp.com",
    projectId: "visitor-logger-89c4b",
    storageBucket: "visitor-logger-89c4b.appspot.com",
    messagingSenderId: "82770471301",
    appId: "1:82770471301:web:8ae6147496f9075ca47cec"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Firebase Collections
const COLLECTIONS = {
    VISITORS: 'visitors',
    BLOCKED_IPS: 'blocked_ips',
    ACCESS_LOGS: 'access_logs',
    SETTINGS: 'settings',
    STATISTICS: 'statistics'
};

// Firebase Helper Functions
const FirebaseHelper = {
    // Add visitor log
    async addVisitor(visitorData) {
        try {
            const docRef = await db.collection(COLLECTIONS.VISITORS).add({
                ...visitorData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                date: new Date().toISOString().split('T')[0]
            });
            console.log('Visitor added with ID: ', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error adding visitor: ', error);
            throw error;
        }
    },

    // Get all visitors
    async getVisitors(limit = 100) {
        try {
            const snapshot = await db.collection(COLLECTIONS.VISITORS)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            
            const visitors = [];
            snapshot.forEach(doc => {
                visitors.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return visitors;
        } catch (error) {
            console.error('Error getting visitors: ', error);
            throw error;
        }
    },

    // Get visitors by date
    async getVisitorsByDate(date) {
        try {
            const snapshot = await db.collection(COLLECTIONS.VISITORS)
                .where('date', '==', date)
                .get();
            
            const visitors = [];
            snapshot.forEach(doc => {
                visitors.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return visitors;
        } catch (error) {
            console.error('Error getting visitors by date: ', error);
            throw error;
        }
    },

    // Block IP
    async blockIP(ip, reason = 'Manual block') {
        try {
            await db.collection(COLLECTIONS.BLOCKED_IPS).doc(ip).set({
                ip: ip,
                reason: reason,
                blockedAt: firebase.firestore.FieldValue.serverTimestamp(),
                blockedBy: 'admin'
            });
            console.log('IP blocked: ', ip);
        } catch (error) {
            console.error('Error blocking IP: ', error);
            throw error;
        }
    },

    // Unblock IP
    async unblockIP(ip) {
        try {
            await db.collection(COLLECTIONS.BLOCKED_IPS).doc(ip).delete();
            console.log('IP unblocked: ', ip);
        } catch (error) {
            console.error('Error unblocking IP: ', error);
            throw error;
        }
    },

    // Check if IP is blocked
    async isIPBlocked(ip) {
        try {
            const doc = await db.collection(COLLECTIONS.BLOCKED_IPS).doc(ip).get();
            return doc.exists;
        } catch (error) {
            console.error('Error checking IP block status: ', error);
            return false;
        }
    },

    // Get blocked IPs
    async getBlockedIPs() {
        try {
            const snapshot = await db.collection(COLLECTIONS.BLOCKED_IPS).get();
            const blockedIPs = [];
            snapshot.forEach(doc => {
                blockedIPs.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return blockedIPs;
        } catch (error) {
            console.error('Error getting blocked IPs: ', error);
            throw error;
        }
    },

    // Log access attempt
    async logAccess(accessData) {
        try {
            await db.collection(COLLECTIONS.ACCESS_LOGS).add({
                ...accessData,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                date: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error('Error logging access: ', error);
        }
    },

    // Get access logs
    async getAccessLogs(limit = 50) {
        try {
            const snapshot = await db.collection(COLLECTIONS.ACCESS_LOGS)
                .orderBy('timestamp', 'desc')
                .limit(limit)
                .get();
            
            const logs = [];
            snapshot.forEach(doc => {
                logs.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            return logs;
        } catch (error) {
            console.error('Error getting access logs: ', error);
            throw error;
        }
    },

    // Update statistics
    async updateStatistics(statType, increment = 1) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const statRef = db.collection(COLLECTIONS.STATISTICS).doc(today);
            
            await statRef.set({
                [statType]: firebase.firestore.FieldValue.increment(increment),
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        } catch (error) {
            console.error('Error updating statistics: ', error);
        }
    },

    // Get statistics
    async getStatistics(days = 7) {
        try {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - days);
            
            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];
            
            const snapshot = await db.collection(COLLECTIONS.STATISTICS)
                .where(firebase.firestore.FieldPath.documentId(), '>=', startDateStr)
                .where(firebase.firestore.FieldPath.documentId(), '<=', endDateStr)
                .get();
            
            const stats = {};
            snapshot.forEach(doc => {
                stats[doc.id] = doc.data();
            });
            return stats;
        } catch (error) {
            console.error('Error getting statistics: ', error);
            throw error;
        }
    },

    // Get today's statistics
    async getTodayStats() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const doc = await db.collection(COLLECTIONS.STATISTICS).doc(today).get();
            
            if (doc.exists) {
                return doc.data();
            } else {
                return {
                    totalVisitors: 0,
                    successfulAccess: 0,
                    failedAccess: 0,
                    uniqueIPs: 0
                };
            }
        } catch (error) {
            console.error('Error getting today stats: ', error);
            return {
                totalVisitors: 0,
                successfulAccess: 0,
                failedAccess: 0,
                uniqueIPs: 0
            };
        }
    },

    // Real-time listener for visitors
    onVisitorsChange(callback) {
        return db.collection(COLLECTIONS.VISITORS)
            .orderBy('timestamp', 'desc')
            .limit(10)
            .onSnapshot(callback);
    },

    // Real-time listener for statistics
    onStatsChange(callback) {
        const today = new Date().toISOString().split('T')[0];
        return db.collection(COLLECTIONS.STATISTICS)
            .doc(today)
            .onSnapshot(callback);
    },

    // Cleanup old data (call periodically)
    async cleanupOldData(daysToKeep = 30) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
            
            // Clean visitors
            const visitorsSnapshot = await db.collection(COLLECTIONS.VISITORS)
                .where('timestamp', '<', cutoffDate)
                .get();
            
            const batch = db.batch();
            visitorsSnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            
            // Clean access logs
            const logsSnapshot = await db.collection(COLLECTIONS.ACCESS_LOGS)
                .where('timestamp', '<', cutoffDate)
                .get();
            
            logsSnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            
            await batch.commit();
            console.log('Old data cleaned up');
        } catch (error) {
            console.error('Error cleaning up old data: ', error);
        }
    }
};

// Export for use in other files
window.FirebaseHelper = FirebaseHelper;
window.COLLECTIONS = COLLECTIONS;

