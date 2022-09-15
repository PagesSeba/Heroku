const socket = io.connect();
function addMessage(e) {
    const message = {
        author: {
            id: document.getElementById("id").value,
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            edad: document.getElementById("edad").value,
            alias: document.getElementById("alias").value,
            avatar: document.getElementById("avatar").value,
            date: new Date()
        },
        text: document.getElementById("text").value,

    }
    socket.emit("new-message", message);
    return false;
}

function render(data) {
    const author = new normalizr.schema.Entity('author');
    const text = new normalizr.schema.Entity('author', {
        author: author
    })

    const chat = new normalizr.schema.Entity('chat', {
        message: [text]
    })
    const denormalizarMensajes = normalizr.denormalize(data.result, chat, data.entities)
    let data2;
    if(denormalizarMensajes == undefined){
        data2 = data
    } else {
        data2 = denormalizarMensajes.mensajes
    }

    const html = data2.map((elem, index) => {
        return (`
            <div>
                <img class="avatar" src="${elem.author.avatar}" alt="${elem.author.id}"></img>
                <p class="correo">${elem.author.id}</p>
                <em class="mensaje"> ${elem.text}</em>
            </div>
        `)
    }).join(" ")

    document.getElementById("messages").innerHTML = html
}

socket.on("messages", function (data) { render(data) })

//Productos

function addProduct() {
    const product = {
        title: document.getElementById("title").value,
        price: document.getElementById("price").value,
        thumbnail: document.getElementById("thumbnail").value,
    }

    socket.emit("new-product", product);
    return false;
}

function renderProduct(data) {
    const html = data.map((elem, index) => {
        return (`<tr role="row">
                        <td>${elem.title}</td>
                        <td>${elem.price}</td>
                        <td><img src="${elem.thumbnail}" alt="${elem.title}"></td>
                    </tr>
                `)
    })

    document.getElementById("products").innerHTML = html
}

socket.on("productos", function (data) { renderProduct(data) })



