// Sync Module - Export/Import, Sync Code, and Firebase sync

import { state } from './state.js';
import { saveCollectionToDB } from './db.js';
import { renderCollection } from './ui.js';
import { updateStats } from './stats.js';
import { FIREBASE_CONFIG } from './config.js';

const REQUIRED_FIREBASE_FIELDS = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'appId'];

// Check if Firebase is configured
const getMissingFirebaseFields = () => REQUIRED_FIREBASE_FIELDS.filter(field => !FIREBASE_CONFIG[field]);
const isFirebaseConfigured = () => getMissingFirebaseFields().length === 0;

// State for sync
export const syncState = {
    firebaseUser: null,
    firebaseDb: null,
    isFirebaseInitialized: false,
    lastSyncTime: null,
    collectionRef: null,
    collectionListener: null,
    isResolvingConflict: false
};

function getCollectionSize(collection = state.collection) {
    return Object.values(collection || {}).reduce((sum, cardData) => {
        if (typeof cardData === 'number') {
            return sum + Math.max(cardData, 0);
        }
        
        if (cardData && typeof cardData === 'object') {
            return sum + Object.values(cardData).reduce((cardSum, qty) => cardSum + (Number(qty) || 0), 0);
        }
        
        return sum;
    }, 0);
}

function cloneCollection(collection = {}) {
    const cloned = {};
    
    Object.entries(collection || {}).forEach(([cardId, cardData]) => {
        if (cardData && typeof cardData === 'object') {
            cloned[cardId] = { ...cardData };
        } else {
            cloned[cardId] = cardData;
        }
    });
    
    return cloned;
}

function normalizeCardVariants(cardData) {
    if (typeof cardData === 'number') {
        return cardData > 0 ? { normal: cardData } : {};
    }
    
    if (cardData && typeof cardData === 'object') {
        return { ...cardData };
    }
    
    return {};
}

function mergeCollections(baseCollection = {}, incomingCollection = {}) {
    const merged = cloneCollection(baseCollection);
    
    Object.entries(incomingCollection || {}).forEach(([cardId, cardData]) => {
        if (!merged[cardId]) {
            merged[cardId] = cardData && typeof cardData === 'object'
                ? { ...cardData }
                : cardData;
            return;
        }
        
        const existingVariants = normalizeCardVariants(merged[cardId]);
        const incomingVariants = normalizeCardVariants(cardData);
        
        Object.entries(incomingVariants).forEach(([variant, qty]) => {
            existingVariants[variant] = Math.max(existingVariants[variant] || 0, qty);
        });
        
        if (Object.keys(existingVariants).length > 0) {
            merged[cardId] = existingVariants;
        }
    });
    
    return merged;
}

function formatSyncTimestamp(timestamp) {
    if (!timestamp) return 'Not synced yet';
    
    return new Date(timestamp).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });
}

function applyCollectionUI() {
    renderCollection();
    updateStats();
}

async function applyCollectionSnapshot(collection, {
    collectionUpdatedAt = state.collectionUpdatedAt,
    lastServerUpdate = state.lastServerUpdate,
    markLocalChange = false
} = {}) {
    state.collection = cloneCollection(collection);
    state.collectionUpdatedAt = collectionUpdatedAt || 0;
    state.lastServerUpdate = lastServerUpdate || 0;
    
    await saveCollectionToDB({ markLocalChange });
    applyCollectionUI();
}

function hasUnsyncedLocalChanges() {
    return (state.collectionUpdatedAt || 0) > (state.lastServerUpdate || 0);
}

function cleanupRealtimeSync() {
    if (syncState.collectionRef && syncState.collectionListener) {
        syncState.collectionRef.off('value', syncState.collectionListener);
    }
    
    syncState.collectionRef = null;
    syncState.collectionListener = null;
}

async function fetchCloudCollection(userId) {
    const collectionRef = syncState.firebaseDb.ref(`users/${userId}/collection`);
    const snapshot = await collectionRef.once('value');
    return snapshot.val();
}

async function applyServerCollection(serverData, successMessage) {
    const serverUpdatedAt = Number(serverData?.updatedAt) || Date.now();
    
    await applyCollectionSnapshot(serverData?.collection || {}, {
        collectionUpdatedAt: serverUpdatedAt,
        lastServerUpdate: serverUpdatedAt,
        markLocalChange: false
    });
    
    if (successMessage) {
        showSyncNotification(successMessage, 'success');
    }
}

function showSyncConflictDialog({ title, message, localCollection, localUpdatedAt, cloudCollection, cloudUpdatedAt }) {
    return new Promise((resolve) => {
        const dialog = document.createElement('div');
        dialog.className = 'import-dialog-overlay';
        dialog.innerHTML = `
            <div class="import-dialog">
                <h3>${title}</h3>
                <p>${message}</p>
                <p><strong>This device:</strong> ${getCollectionSize(localCollection)} cards, ${formatSyncTimestamp(localUpdatedAt)}</p>
                <p><strong>Cloud:</strong> ${getCollectionSize(cloudCollection)} cards, ${formatSyncTimestamp(cloudUpdatedAt)}</p>
                <div class="import-dialog-buttons">
                    <button class="btn btn-primary" data-action="local">Use Local Collection</button>
                    <button class="btn btn-secondary" data-action="cloud">Use Cloud Collection</button>
                    <button class="btn btn-secondary" data-action="merge">Merge Both</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
        
        dialog.querySelectorAll('button').forEach(btn => {
            btn.onclick = () => {
                dialog.remove();
                resolve(btn.dataset.action);
            };
        });
    });
}

async function resolveCollectionConflict(serverData, { initial = false } = {}) {
    if (syncState.isResolvingConflict) return;
    
    syncState.isResolvingConflict = true;
    
    try {
        const cloudCollection = serverData?.collection || {};
        const cloudUpdatedAt = Number(serverData?.updatedAt) || 0;
        const action = await showSyncConflictDialog({
            title: initial ? 'Choose Sync Source' : 'Sync Conflict Detected',
            message: initial
                ? 'We found both a local collection and a cloud collection. Pick which version to keep before syncing.'
                : 'This device has unsynced changes and the cloud collection changed too. Pick how to resolve the conflict.',
            localCollection: state.collection,
            localUpdatedAt: state.collectionUpdatedAt,
            cloudCollection,
            cloudUpdatedAt
        });
        
        if (action === 'cloud') {
            await applyServerCollection(
                serverData,
                initial ? 'Loaded your cloud collection.' : 'Applied the cloud collection.'
            );
            return;
        }
        
        if (action === 'merge') {
            state.collection = mergeCollections(state.collection, cloudCollection);
            await saveCollectionToDB();
            applyCollectionUI();
            
            await syncToFirebase({
                successMessage: initial
                    ? 'Merged local and cloud collections.'
                    : 'Merged local and cloud changes.'
            });
            return;
        }
        
        await syncToFirebase({
            successMessage: initial
                ? 'Uploaded your local collection to the cloud.'
                : 'Kept local changes and synced them to the cloud.'
        });
    } finally {
        syncState.isResolvingConflict = false;
    }
}

async function resolveInitialCloudSync(user) {
    const serverData = await fetchCloudCollection(user.uid);
    
    if (!serverData || !serverData.updatedAt) {
        if (getCollectionSize(state.collection) > 0) {
            await syncToFirebase({
                successMessage: 'Cloud collection was empty, so your local collection was uploaded.'
            });
        }
        return;
    }
    
    const serverUpdatedAt = Number(serverData.updatedAt) || 0;
    
    if (!serverUpdatedAt) return;
    
    if (!hasUnsyncedLocalChanges() && getCollectionSize(state.collection) === 0) {
        await applyServerCollection(serverData, 'Loaded your collection from the cloud.');
        return;
    }
    
    if (serverUpdatedAt > (state.lastServerUpdate || 0)) {
        if (hasUnsyncedLocalChanges()) {
            await resolveCollectionConflict(serverData, { initial: true });
        } else {
            await applyServerCollection(serverData, 'Loaded your collection from the cloud.');
        }
        return;
    }
    
    state.lastServerUpdate = Math.max(state.lastServerUpdate || 0, serverUpdatedAt);
    await saveCollectionToDB({ markLocalChange: false });
}

// ============================================
// OPTION 1: Manual Export/Import
// ============================================

export function exportCollection() {
    const exportData = {
        version: 2,
        exportDate: new Date().toISOString(),
        collection: state.collection,
        stats: {
            totalCards: Object.values(state.collection).reduce((sum, card) => {
                if (typeof card === 'object') {
                    return sum + Object.values(card).reduce((s, q) => s + q, 0);
                }
                return sum + card;
            }, 0),
            uniqueCards: Object.keys(state.collection).length
        }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pokemon-collection-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSyncNotification('Collection exported successfully!', 'success');
}

export function importCollection(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Validate data
                if (!data.collection) {
                    throw new Error('Invalid file format: missing collection data');
                }
                
                // Ask user about merge vs replace
                const action = await showImportDialog(data);
                if (action === 'cancel') {
                    resolve(false);
                    return;
                }
                
                if (action === 'replace') {
                    state.collection = cloneCollection(data.collection);
                } else if (action === 'merge') {
                    state.collection = mergeCollections(state.collection, data.collection);
                }
                
                await saveCollectionToDB();
                applyCollectionUI();
                showSyncNotification('Collection imported successfully!', 'success');
                resolve(true);
            } catch (error) {
                showSyncNotification(`Import failed: ${error.message}`, 'error');
                reject(error);
            }
        };
        reader.readAsText(file);
    });
}

// ============================================
// OPTION 2: Sync Code System
// ============================================

// Generate a short sync code
import { getFirebaseDB } from './firebase.js';

function generateSyncCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed similar looking chars
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Compress collection data for storage
function compressCollection(collection) {
    // Simple compression: store only card IDs and variant quantities
    const compressed = {};
    for (const [cardId, data] of Object.entries(collection)) {
        if (typeof data === 'object') {
            const variants = {};
            for (const [v, q] of Object.entries(data)) {
                if (q > 0) variants[v] = q;
            }
            if (Object.keys(variants).length > 0) {
                compressed[cardId] = variants;
            }
        } else if (data > 0) {
            compressed[cardId] = data;
        }
    }
    return compressed;
}

export async function createSyncCode() {
    const syncCode = generateSyncCode();
    const compressedData = compressCollection(state.collection);
    const syncData = {
        code: syncCode,
        version: 2,
        createdAt: new Date().toISOString(),
        collection: compressedData
    };
    try {
        // Store in Firebase Realtime Database
        const db = getFirebaseDB();
        // Use set to overwrite or create
        await import('firebase/database').then(({ ref, set }) =>
            set(ref(db, `syncCodes/${syncCode}`), syncData)
        );
        return syncCode;
    } catch (error) {
        console.error('Failed to create sync code:', error);
        throw error;
    }
}

export async function loadFromSyncCode(code) {
    const normalizedCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
    try {
        // Fetch from Firebase Realtime Database
        const db = getFirebaseDB();
        const { ref, get, child } = await import('firebase/database');
        const snapshot = await get(child(ref(db), `syncCodes/${normalizedCode}`));
        if (snapshot.exists()) {
            const syncData = snapshot.val();
            return syncData.collection;
        } else {
            throw new Error('Sync code not found. Make sure you entered it correctly.');
        }
    } catch (error) {
        throw error;
    }
}

export async function applySyncCode(code, mode = 'replace') {
    try {
        const collection = await loadFromSyncCode(code);
        
        if (mode === 'replace') {
            state.collection = cloneCollection(collection);
        } else {
            state.collection = mergeCollections(state.collection, collection);
        }
        
        await saveCollectionToDB();
        applyCollectionUI();
        showSyncNotification('Collection synced successfully!', 'success');
        return true;
    } catch (error) {
        showSyncNotification(`Sync failed: ${error.message}`, 'error');
        throw error;
    }
}

// ============================================
// QR Code Generation/Scanning
// ============================================

export function generateQRCode(text, container) {
    // Using QRCode.js library (loaded from CDN)
    if (typeof QRCode !== 'undefined') {
        container.innerHTML = '';
        new QRCode(container, {
            text: text,
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        });
    } else {
        container.innerHTML = '<p>QR Code library not loaded</p>';
    }
}

export async function scanQRCode() {
    return new Promise((resolve, reject) => {
        // Check if browser supports getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            reject(new Error('Camera access not supported in this browser'));
            return;
        }
        
        // Create scanner modal
        const scannerModal = document.createElement('div');
        scannerModal.className = 'qr-scanner-modal';
        scannerModal.innerHTML = `
            <div class="qr-scanner-content">
                <h3>Scan QR Code</h3>
                <video id="qr-video" autoplay playsinline></video>
                <canvas id="qr-canvas" style="display: none;"></canvas>
                <p class="qr-scanner-hint">Point your camera at a sync QR code</p>
                <button class="btn btn-secondary" id="cancel-scan">Cancel</button>
            </div>
        `;
        document.body.appendChild(scannerModal);
        
        const video = document.getElementById('qr-video');
        const canvas = document.getElementById('qr-canvas');
        const ctx = canvas.getContext('2d');
        let stream = null;
        let scanning = true;
        
        const cleanup = () => {
            scanning = false;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            scannerModal.remove();
        };
        
        document.getElementById('cancel-scan').onclick = () => {
            cleanup();
            reject(new Error('Scan cancelled'));
        };
        
        scannerModal.querySelector('.qr-scanner-modal').onclick = (e) => {
            if (e.target === scannerModal) {
                cleanup();
                reject(new Error('Scan cancelled'));
            }
        };
        
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(s => {
                stream = s;
                video.srcObject = stream;
                video.play();
                
                const scan = () => {
                    if (!scanning) return;
                    
                    if (video.readyState === video.HAVE_ENOUGH_DATA) {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        
                        // Use jsQR library if available
                        if (typeof jsQR !== 'undefined') {
                            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            const code = jsQR(imageData.data, imageData.width, imageData.height);
                            
                            if (code) {
                                cleanup();
                                resolve(code.data);
                                return;
                            }
                        }
                    }
                    
                    requestAnimationFrame(scan);
                };
                
                scan();
            })
            .catch(err => {
                cleanup();
                reject(new Error('Camera access denied'));
            });
    });
}

// ============================================
// OPTION 3: Firebase Realtime Database
// ============================================

export async function initFirebase() {
    if (syncState.isFirebaseInitialized) return;
    
    // Dynamically load Firebase SDK
    try {
        // Check if Firebase is already loaded
        if (typeof firebase === 'undefined') {
            await loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
            await loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js');
            await loadScript('https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js');
        }
        
        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }
        
        syncState.firebaseDb = firebase.database();
        syncState.isFirebaseInitialized = true;
        
        // Listen for auth state changes
        firebase.auth().onAuthStateChanged((user) => {
            syncState.firebaseUser = user;
            updateSyncUI();
            cleanupRealtimeSync();
            
            if (user) {
                resolveInitialCloudSync(user)
                    .then(() => {
                        setupRealtimeSync(user.uid);
                    })
                    .catch((error) => {
                        console.error('Failed to initialize cloud sync:', error);
                        showSyncNotification(`Cloud sync setup failed: ${error.message}`, 'error');
                    });
            }
        });
        
        console.log('Firebase initialized');
    } catch (error) {
        console.error('Failed to initialize Firebase:', error);
        throw error;
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

export async function signInWithGoogle() {
    if (!isFirebaseConfigured()) {
        const missingFields = getMissingFirebaseFields().join(', ');
        showSyncNotification(`Firebase not configured. Missing: ${missingFields}`, 'error');
        return null;
    }
    
    try {
        await initFirebase();
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithPopup(provider);
        showSyncNotification(`Signed in as ${result.user.displayName}`, 'success');
        return result.user;
    } catch (error) {
        console.error('Google sign-in failed:', error);
        showSyncNotification(`Sign-in failed: ${error.message}`, 'error');
        throw error;
    }
}

export async function signOut() {
    try {
        cleanupRealtimeSync();
        await firebase.auth().signOut();
        syncState.firebaseUser = null;
        showSyncNotification('Signed out successfully', 'success');
        updateSyncUI();
    } catch (error) {
        console.error('Sign-out failed:', error);
    }
}

function setupRealtimeSync(userId) {
    cleanupRealtimeSync();
    
    const collectionRef = syncState.firebaseDb.ref(`users/${userId}/collection`);
    
    // Listen for changes from server
    const listener = async (snapshot) => {
        const serverData = snapshot.val();
        const serverUpdatedAt = Number(serverData?.updatedAt) || 0;
        
        if (!serverUpdatedAt || serverUpdatedAt <= (state.lastServerUpdate || 0) || syncState.isResolvingConflict) {
            return;
        }
        
        try {
            if (hasUnsyncedLocalChanges()) {
                await resolveCollectionConflict(serverData);
                return;
            }
            
            await applyServerCollection(serverData, 'Cloud collection updated from another device.');
            console.log('Synced from server');
        } catch (error) {
            console.error('Realtime sync failed:', error);
            showSyncNotification(`Realtime sync failed: ${error.message}`, 'error');
        }
    };
    
    collectionRef.on('value', listener);
    syncState.collectionRef = collectionRef;
    syncState.collectionListener = listener;
}

export async function syncToFirebase(options = {}) {
    const { successMessage = 'Synced to cloud!' } = options;
    
    if (!syncState.firebaseUser) {
        throw new Error('Not signed in');
    }
    
    const userId = syncState.firebaseUser.uid;
    const collectionRef = syncState.firebaseDb.ref(`users/${userId}/collection`);
    
    const syncData = {
        collection: compressCollection(state.collection),
        updatedAt: Date.now()
    };
    
    await collectionRef.set(syncData);
    state.lastServerUpdate = syncData.updatedAt;
    state.collectionUpdatedAt = syncData.updatedAt;
    syncState.lastSyncTime = new Date(syncData.updatedAt);
    
    await saveCollectionToDB({ markLocalChange: false });
    
    showSyncNotification(successMessage, 'success');
}

// ============================================
// UI Helpers
// ============================================

export function showSyncNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `sync-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showImportDialog(data) {
    return new Promise((resolve) => {
        const dialog = document.createElement('div');
        dialog.className = 'import-dialog-overlay';
        dialog.innerHTML = `
            <div class="import-dialog">
                <h3>Import Collection</h3>
                <p>Found ${Object.keys(data.collection).length} unique cards.</p>
                <p>What would you like to do?</p>
                <div class="import-dialog-buttons">
                    <button class="btn btn-primary" data-action="replace">Replace Current</button>
                    <button class="btn btn-secondary" data-action="merge">Merge with Current</button>
                    <button class="btn btn-secondary" data-action="cancel">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
        
        dialog.querySelectorAll('button').forEach(btn => {
            btn.onclick = () => {
                dialog.remove();
                resolve(btn.dataset.action);
            };
        });
    });
}

export function updateSyncUI() {
    const userInfo = document.getElementById('firebase-user-info');
    const signInBtn = document.getElementById('firebase-signin');
    const signOutBtn = document.getElementById('firebase-signout');
    const syncBtn = document.getElementById('firebase-sync');
    
    if (!userInfo) return;
    
    if (syncState.firebaseUser) {
        userInfo.innerHTML = `
            <img src="${syncState.firebaseUser.photoURL}" alt="" class="user-avatar">
            <span>${syncState.firebaseUser.displayName}</span>
        `;
        userInfo.style.display = 'flex';
        signInBtn.style.display = 'none';
        signOutBtn.style.display = 'block';
        syncBtn.style.display = 'block';
    } else {
        userInfo.style.display = 'none';
        signInBtn.style.display = 'block';
        signOutBtn.style.display = 'none';
        syncBtn.style.display = 'none';
    }
}

// ============================================
// Initialize Sync Modal
// ============================================

export function setupSyncModal() {
    const modal = document.getElementById('sync-modal');
    if (!modal) return;
    
    const tabs = modal.querySelectorAll('.sync-tab');
    const panels = modal.querySelectorAll('.sync-panel');
    
    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            const panelId = `${tab.dataset.tab}-panel`;
            document.getElementById(panelId)?.classList.add('active');
        });
    });
    
    // Export button
    document.getElementById('export-btn')?.addEventListener('click', exportCollection);
    
    // Import button
    document.getElementById('import-file')?.addEventListener('change', async (e) => {
        if (e.target.files.length > 0) {
            await importCollection(e.target.files[0]);
            e.target.value = '';
        }
    });
    
    // Generate sync code
    document.getElementById('generate-code-btn')?.addEventListener('click', async () => {
        const codeDisplay = document.getElementById('sync-code-display');
        const qrContainer = document.getElementById('sync-qr-code');
        
        try {
            const code = await createSyncCode();
            codeDisplay.textContent = code;
            codeDisplay.classList.add('show');
            
            // Generate QR code
            const syncUrl = `${window.location.origin}${window.location.pathname}?sync=${code}`;
            generateQRCode(syncUrl, qrContainer);
            qrContainer.classList.add('show');
        } catch (error) {
            showSyncNotification('Failed to generate sync code', 'error');
        }
    });
    
    // Apply sync code
    document.getElementById('apply-code-btn')?.addEventListener('click', async () => {
        const input = document.getElementById('sync-code-input');
        const code = input.value.trim();
        
        if (!code) {
            showSyncNotification('Please enter a sync code', 'error');
            return;
        }
        
        try {
            await applySyncCode(code);
            input.value = '';
            closeSyncModal();
        } catch (error) {
            // Error already shown
        }
    });
    
    // Scan QR code
    document.getElementById('scan-qr-btn')?.addEventListener('click', async () => {
        try {
            const data = await scanQRCode();
            // Extract code from URL if it's a URL
            const url = new URL(data);
            const code = url.searchParams.get('sync');
            if (code) {
                await applySyncCode(code);
                closeSyncModal();
            }
        } catch (error) {
            if (error.message !== 'Scan cancelled') {
                showSyncNotification(error.message, 'error');
            }
        }
    });
    
    // Firebase sign in
    document.getElementById('firebase-signin')?.addEventListener('click', signInWithGoogle);
    document.getElementById('firebase-signout')?.addEventListener('click', signOut);
    document.getElementById('firebase-sync')?.addEventListener('click', async (e) => {
        const button = e.currentTarget;
        const originalText = button.textContent;
        
        button.disabled = true;
        button.textContent = 'Syncing...';
        
        try {
            await syncToFirebase();
        } catch (error) {
            console.error('Manual cloud sync failed:', error);
            showSyncNotification(`Cloud sync failed: ${error.message}`, 'error');
        } finally {
            button.disabled = false;
            button.textContent = originalText;
        }
    });
    
    // Close modal
    modal.querySelector('.modal-close')?.addEventListener('click', closeSyncModal);
    modal.querySelector('.modal-overlay')?.addEventListener('click', closeSyncModal);
    
    // Check URL for sync code
    const urlParams = new URLSearchParams(window.location.search);
    const syncCode = urlParams.get('sync');
    if (syncCode) {
        applySyncCode(syncCode).then(() => {
            // Remove sync param from URL
            window.history.replaceState({}, '', window.location.pathname);
        }).catch(() => {});
    }
}

export function openSyncModal() {
    document.getElementById('sync-modal')?.classList.add('active');
}

export function closeSyncModal() {
    document.getElementById('sync-modal')?.classList.remove('active');
}
