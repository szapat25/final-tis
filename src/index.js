const express = require('express'); //Nodulo para conectar con la base de datos.
const path = require('path'); //Modulo para configurar rutas, donde estan views,config... etc
const exphbs = require('express-handlebars'); 
const methodOverride = require('method-override'); //Usar otros metodos ademas de post y get
const session = require('express-session'); //Guardar la sesion del usuario
const flash = require('connect-flash'); //enviar mensajes entre paginas
const passport = require('passport'); //Autenticacion
const bodyParser = require('body-parser');
const multer = require('multer');
const uuid = require('uuid');

//Inicializacion
const app = express();
require('./database');
require('./config/passport');

//Configuración 
//process.env.PORT si existe un puerto en mi pc uselo si no use el 3000
app.set('port',process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({  //Como default todas las paginas tendran esto
    defaultLayout: 'main',   //<-- esto
    layoutsDir: path.join(app.get('views'), 'layouts'), //Directorio de layout
    partialsDir: path.join(app.get('views'), 'partial'), //Partes que podemos reutilizar de html en carpeta partial
    extname: '.hbs'
}));
app.set('view engine', '.hbs');
// path.join Permite unir directorios, __dirname me devuelve la carpeta src, donde se ejecuta el archivo

//Middleware
app.use(express.urlencoded({ extended: false})); //Recibir contraseñas usuario etc y no mas datos
app.use(methodOverride('_method')); //para usar put y delete
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/archivos'),
    filename: (req, file, cb, filename) => {
        console.log(file);
        cb(null, file.originalname);
    }
}); 
app.use(multer({storage}).single('image'));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Variables globales

app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;

    next();
});


//Rutas
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));


//Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));


//Server is listening - Inicio el servidor

app.listen(app.get('port'), () => {
    console.log("Servidor en puerto: ", app.get('port'));
});