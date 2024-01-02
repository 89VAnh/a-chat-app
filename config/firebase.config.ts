import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Have to do ts-ignore as getReactNativePersistence is not detected by ts compiler with firebase 10.3.0
// @ts-ignore
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyAvL--DKAxDbftEJP7enVNOgWALe7efH58",
  authDomain: "react-native-chat-app-fd4fb.firebaseapp.com",
  projectId: "react-native-chat-app-fd4fb",
  storageBucket: "react-native-chat-app-fd4fb.appspot.com",
  messagingSenderId: "495207627719",
  appId: "1:495207627719:web:b6be039a9ea074e05df7e2",
  measurementId: "G-ZWJXRF83M9",
};

const app = !getApps().length ? initializeApp(config) : getApp();

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };
