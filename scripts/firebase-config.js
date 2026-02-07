// Firebase Configuration
// 請將以下設定替換為您的 Firebase 專案設定

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

// TODO: 完成 Phase 1 Task T008 後，將此處替換為您的 Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyDndiJTrMIeli_hK1YItjvEeFF5hH8ZhbM",
  authDomain: "lantern-festival-longxingtang.firebaseapp.com",
  databaseURL: "https://lantern-festival-longxingtang-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lantern-festival-longxingtang",
  storageBucket: "lantern-festival-longxingtang.firebasestorage.app",
  messagingSenderId: "961044603245",
  appId: "1:961044603245:web:80592ed093d78b9ddd3a64"
};

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

let app = null;
let database = null;
let auth = null;

// Initialize Firebase only if configured
if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    auth = getAuth(app);
    console.log('Firebase initialized successfully');
    console.log('Database URL:', firebaseConfig.databaseURL);
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
} else {
  console.warn('⚠️ Firebase not configured. Using demo mode.');
  console.warn('📖 To enable Firebase features, follow: docs/firebase-setup-guide.md');
  
  // Create mock objects for development
  database = { _isDemoMode: true };
  auth = { _isDemoMode: true };
}

// Export for use in other modules
export { app, database, auth, isFirebaseConfigured };
