// Sync Module - Export/Import, Sync Code, and Firebase sync

import { state } from './state.js';
import { saveCollectionToDB } from './db.js';
import { renderCollection } from './ui.js';
import { updateStats } from './stats.js';
import { FIREBASE_CONFIG } from './config.js';

// Check if Firebase is configured
const isFirebaseConfigured = () => FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId;

// State for sync
export const syncState = {
    firebaseUser: null,
    firebaseDb: null,
    isFirebaseInitialized: false,
    lastSyncTime: null
};

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
                    state.collection = data.collection;
                } else if (action === 'merge') {
                    // Merge collections
                    for (const [cardId, cardData] of Object.entries(data.collection)) {
                        if (!state.collection[cardId]) {
                            state.collection[cardId] = cardData;
                        } else {
                            // Merge variants
                            if (typeof cardData === 'object' && typeof state.collection[cardId] === 'object') {
                                for (const [variant, qty] of Object.entries(cardData)) {
                                    state.collection[cardId][variant] = Math.max(
                                        state.collection[cardId][variant] || 0,
                                        qty
                                    );
                                }
                            }
                        }
                    }
                }
                
                await saveCollectionToDB();
                renderCollection();
                updateStats();
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
            state.collection = collection;
        } else {
            // Merge
            for (const [cardId, cardData] of Object.entries(collection)) {
                if (!state.collection[cardId]) {
                    state.collection[cardId] = cardData;
                } else if (typeof cardData === 'object' && typeof state.collection[cardId] === 'object') {
                    for (const [variant, qty] of Object.entries(cardData)) {
                        state.collection[cardId][variant] = Math.max(
                            state.collection[cardId][variant] || 0,
                            qty
                        );
                    }
                }
            }
        }
        
        await saveCollectionToDB();
        renderCollection();
        updateStats();
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
            
            if (user) {
                // Start syncing
                setupRealtimeSync(user.uid);
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
        showSyncNotification('Firebase not configured. Add your Firebase config to .env file.', 'error');
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
        await firebase.auth().signOut();
        syncState.firebaseUser = null;
        showSyncNotification('Signed out successfully', 'success');
        updateSyncUI();
    } catch (error) {
        console.error('Sign-out failed:', error);
    }
}

function setupRealtimeSync(userId) {
    const collectionRef = syncState.firebaseDb.ref(`users/${userId}/collection`);
    
    // Listen for changes from server
    collectionRef.on('value', (snapshot) => {
        const serverData = snapshot.val();
        if (serverData && serverData.updatedAt > (state.lastServerUpdate || 0)) {
            // Server has newer data
            state.collection = serverData.collection || {};
            state.lastServerUpdate = serverData.updatedAt;
            saveCollectionToDB();
            renderCollection();
            updateStats();
            console.log('Synced from server');
        }
    });
}

export async function syncToFirebase() {
    if (!syncState.firebaseUser) {
        throw new Error('Not signed in');
    }
    
    const userId = syncState.firebaseUser.uid;
    const collectionRef = syncState.firebaseDb.ref(`users/${userId}/collection`);
    
    const syncData = {
        collection: state.collection,
        updatedAt: Date.now()
    };
    
    await collectionRef.set(syncData);
    state.lastServerUpdate = syncData.updatedAt;
    syncState.lastSyncTime = new Date();
    
    showSyncNotification('Synced to cloud!', 'success');
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
    document.getElementById('firebase-sync')?.addEventListener('click', syncToFirebase);
    
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
