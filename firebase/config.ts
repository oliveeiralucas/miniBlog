import { initializeApp } from 'firebase/app'
import { getFireStore } from 'firebase/firebase-database'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyANYkhavwi-hZMv9rQNiEcfMECAczOeIDA',
  authDomain: 'miniblog-6f086.firebaseapp.com',
  projectId: 'miniblog-6f086',
  storageBucket: 'miniblog-6f086.appspot.com',
  messagingSenderId: '732990095515',
  appId: '1:732990095515:web:d32993641ddab34392463e'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const db = getFireStore(app)

export { db }
