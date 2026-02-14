import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCgyGoLek4KAemjnvAtsYbz2HsSl9gSKJU",
  authDomain: "socio-websites.firebaseapp.com",
  projectId: "socio-websites",
  storageBucket: "socio-websites.firebasestorage.app",
  messagingSenderId: "130715459925",
  appId: "1:130715459925:web:20610da8d359500d23cfdc",
  measurementId: "G-1NF55NX268",
};

const app = initializeApp(firebaseConfig);

let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };
