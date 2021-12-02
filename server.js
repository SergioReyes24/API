//Empezar servidor con "npm run dev"
const { urlencoded } = require('express');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const ObjetosLeerJSON = fs.readFileSync('datos.json', 'utf-8');
let Objetos = JSON.parse(ObjetosLeerJSON);
let random = Math.random();
let IdEdit = 0;

//  Middlewares
app.use(urlencoded({extended: false}));
app.set('view engine', 'ejs');

// Rutas
//  Página principal con el registro de los productos
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

//  Nuevo registro renderizando la página del formulario
app.get('/new', (req, res) => {
    res.render('formulario.ejs');
});

//  Nuevo registro guardando los datos del formulario y enviandolos
app.post('/new', (req, res) => {
    const {Producto, Precio} = req.body;
    let NuevoProducto = {id:random, Producto, Precio};  	//  Declaración del producto agregado

    Objetos.push(NuevoProducto);

    const ObjetosEscribirJSON = JSON.stringify(Objetos);    // Conversión de arreglo javascript a texto
    fs.writeFile('datos.json', ObjetosEscribirJSON, 'utf-8', function(err){ // Escritura del arreglo con los objetos en el archivo de la base de datos
        if(!err){
        }
    });

    res.redirect('/');
});

//  Ver registro
app.get('/view', (req, res) => {
    res.render('registro', {Objetos});
});

//  Eliminar producto
app.get('/delete/:id', (req, res) => {
    //  Recorre el arreglo con filter y agrega los datos excepto el que cumple con el id y actualiza el arreglo
    Objetos = Objetos.filter(objeto => objeto.id != req.params.id);
    
    const ObjetosEscribirJSON = JSON.stringify(Objetos);    
    fs.writeFile('datos.json', ObjetosEscribirJSON, 'utf-8', function(err){ //  Se vuelven a escribir los datos en la base de datos
        if(!err){
        }
    });

    res.redirect('/view');
});

//  Editar el producto
app.get('/edit/:id', (req, res) => {
    res.render('nuevo');
    IdEdit = req.params.id;
});

app.post('/edit', (req, res) => {
    const {Producto, Precio} = req.body;

    let ProductoEditado = {id:IdEdit, Producto, Precio};

    Objetos = Objetos.filter(objeto => objeto.id != IdEdit);

    Objetos.push(ProductoEditado);

    const ObjetosEscribirJSON = JSON.stringify(Objetos);
    fs.writeFile('datos.json', ObjetosEscribirJSON, 'utf-8', function(err){
    if(!err){
    }});
       
    res.redirect('/view');
});

//  Inicio del server
app.listen(3000, () => {
    console.log('Server abierto en el puerto 3000');
});