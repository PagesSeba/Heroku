const admin = require('firebase-admin');
const fs = require ('fs');
const serviceAccount = JSON.parse(fs.readFileSync('./db/credential-firebase.json'));

class FirebaseContenedor {
    constructor(){
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        
        console.log("Conectado a Firebase correctamente");
    }

    async guardarMensaje(mensaje){
        const db = admin.firestore();
        const query = db.collection("mensajes").add(mensaje);
    }

    async obtenerMensajes(){
        const db = admin.firestore();
        const query = await db.collection("mensajes").get();
        let mensajes = [];
        query.forEach(mensaje => {
           mensajes.push(mensaje.data());
        })
        return mensajes
    }
}

module.exports = new FirebaseContenedor;