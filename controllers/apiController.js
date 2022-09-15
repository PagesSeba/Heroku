const apiContenedor = require('../utils/apiContenedor.js')

class ApiController {
    listar(req, res){
        const prod = apiContenedor.generarProducto()
        res.json(prod)
    }
}

module.exports = new ApiController;