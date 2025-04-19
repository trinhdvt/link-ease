import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from "firebase-admin/firestore";


const base64ServiceAccount = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_KEY;

if (!base64ServiceAccount) {
    throw new Error('Missing Firebase Admin env');
}

const serviceAccount = base64ServiceAccount
    ? JSON.parse(Buffer.from(base64ServiceAccount, 'base64').toString('utf8'))
    : {};


if (getApps().length == 0) {
    initializeApp({
        credential: cert(serviceAccount),
    });
}


const db = getFirestore();
const urlsCollection = db.collection("urls");
export { db, urlsCollection }
