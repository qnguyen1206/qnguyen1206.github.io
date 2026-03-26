// Firebase initialization for Pokemon TCG Tracker Sync Code
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { FIREBASE_CONFIG } from './config.js';

let app = null;
let db = null;

export function getFirebaseApp() {
  if (!app) {
    app = initializeApp(FIREBASE_CONFIG);
  }
  return app;
}

export function getFirebaseDB() {
  if (!db) {
    app = getFirebaseApp();
    db = getDatabase(app);
  }
  return db;
}
