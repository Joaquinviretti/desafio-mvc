const express = require('express');
const Api = require('./api');
const path = require('path');

const { engine } = require('express-handlebars');

let api = new Api()

const {Router} = express;
const PORT = 8080;

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, '..', './public')))

const router = Router();
app.use('/api/productos', router)

//HBS

app.engine(
    'hbs', engine({
        extname:"hbs",
        defaultLayout:"main.hbs",
        layoutsDir: path.join(__dirname, "..", "./views/layouts"),
        partialsDir: path.join(__dirname, "..", "./views/partials")
    }) 
)

app.use(express.static('../public'))

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, '..', 'views'))

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
    res.render('productos', {productos: api.getAll()})
})

//GET Form Carga
router.get('/add', (req, res) => {
    res.render('carga')
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
    res.redirect('/api/productos/')
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