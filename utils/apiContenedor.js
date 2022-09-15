const { faker } = require("@faker-js/faker");
const FirebaseContenedor = require('../contenedor/firebase.js');
const { normalize, denormalize, schema } = require('normalizr');
faker.locale = 'es';
const productos = []
const mensajes = []
class ApiContenedor {

    generarProducto() {
        for (let i = 1; i <= 5; i++) {
            productos.push({
                title: faker.commerce.productName(),
                price: faker.commerce.price(),
                thumbnail: faker.image.abstract(),
            })
        }
        return productos

    }

    insertarProducto(data) {
        productos.push({
            title: data.title,
            price: data.price,
            thumbnail: data.thumbnail,
        })
        return productos
    }

    generarMensajes() {
        for (let i = 1; i <= 5; i++) {
            mensajes.push({
                author: {
                    id: faker.internet.email(),
                    nombre: faker.name.findName(),
                    apellido: faker.name.firstName(),
                    edad: faker.random.numeric(2),
                    alias: faker.random.word(),
                    date: faker.date.recent(),
                    avatar: faker.image.avatar(),

                },
                text: faker.git.commitMessage(),
            })
        }
        return mensajes
    }

    insertarMensajes(data) {
        mensajes.push({
            correo: data.correo,
            date: faker.date.recent(),
            message: data.message,
        })
        return mensajes
    }

    async guardarMensaje(mensaje) {
        await FirebaseContenedor.guardarMensaje(mensaje)
    }

    async obtenerMensajes() {
        const mensajes = await FirebaseContenedor.obtenerMensajes();
        // console.log(mensajes);
        const author = new schema.Entity('author');
        const text = new schema.Entity('author',{
            author: author
        })

        const chat = new schema.Entity('chat',{
            message: [text]
        })
        const util = require('util')
        function print(objeto){
            console.log(util.inspect(objeto,false,12,true))
        }
        const normalizedAutores = normalize({id:"mensajes", mensajes}, chat)
        return normalizedAutores
    }


}

module.exports = new ApiContenedor 
