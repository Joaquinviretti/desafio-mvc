const express = require('express');
const Api = require('./api')
const path = require('path')

let api = new Api()

const {Router} = express;
const PORT = 8080;

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, '..', './public')))

const router = Router();
app.use('/api/productos', router)


//MIDDLEWARE para validad ID
let validarId = (req, res, next) => {
    let id = req.params.id;
    if (id < 0 || id > api.getAll().length) {
        res.status(400).send({
            error: "El ID no corresponde a ningún producto."
        })
    } else {
        next()
    }
}

//GET
router.get('/', (req, res) => {
    res.json(api.getAll());
})

//GET params
router.get('/:id', validarId, (req, res) => {
    let { id } = req.params;
    res.json(api.getById(id));
})

//POST
router.post('/', (req, res) => {
    let producto = {
        ...req.body
    };
    api.add(producto)
    res.json(producto);
})

//PUT
router.put('/:id', validarId, (req, res) => {
    let id = parseInt(req.params.id);
    let productoNuevo = {
        title: req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail,
    }
    api.update(id, productoNuevo)
    res.json(api.getById(id))
})

//DELETE
router.delete('/:id', validarId, (req, res) => {
    productos = productos.filter(p => p.id != req.params.id);
    res.sendStatus(200)
})

const server = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${server.address().port}`)
})

app.on("error", () => {
    console.log("error del servidor")
})