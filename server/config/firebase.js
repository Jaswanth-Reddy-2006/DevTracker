import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

dotenv.config();

let serviceAccount;

try {
    const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || './config/serviceAccountKey.json';
    serviceAccount = JSON.parse(readFileSync(resolve('server', keyPath), 'utf8'));
} catch (error) {
    console.warn('Firebase Service Account key not found or invalid. Using default credentials if available.');
}

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else if (process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID
    });
} else {
    // This will work if running in Google Cloud environment with default credentials
    admin.initializeApp();
}

const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth };
