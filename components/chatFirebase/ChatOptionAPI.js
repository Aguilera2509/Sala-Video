import { initializeApp } from "firebase/app"
import { getDatabase, ref } from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyC0guWtAuJU8u_-_Dspc6BbSp3cVStB1B8",
    authDomain: "chatsvideos.firebaseapp.com",
    databaseURL: "https://chatsvideos-default-rtdb.firebaseio.com",
    projectId: "chatsvideos",
    storageBucket: "chatsvideos.appspot.com",
    messagingSenderId: "633697998319",
    appId: "1:633697998319:web:1177cea4e6b399c220921a",
    measurementId: "G-BDJTMLG1PT"
}

const app = initializeApp(firebaseConfig)

//Acceder a la base de datos
const db = getDatabase()
const userdb = ref(db)

export { db, userdb }