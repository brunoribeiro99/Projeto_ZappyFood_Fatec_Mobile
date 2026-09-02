//Inicialização da conexão com Firebase
import { initializeApp } from "firebase/app";
//Inicializa a conexão com o banco de dados em tempo real do Firebase
import { getDatabase } from "firebase/database";
//Inicializa com a autenticação do Firebase
import { initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0xElXomsvRmhZ5rr1NIAlYSK_WSgrdLo",
  authDomain: "zappyfood-b0671.firebaseapp.com",
  projectId: "zappyfood-b0671",
  storageBucket: "zappyfood-b0671.firebasestorage.app",
  messagingSenderId: "526213495204",
  appId: "1:526213495204:web:98a9f9c3f65c3081ece931",
  baseURL: "https://zappyfood-b0671-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = initializeAuth(app);

// Realtime Database
export const database = getDatabase(app);

export default app;
