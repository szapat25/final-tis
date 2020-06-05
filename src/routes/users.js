const router = require('express').Router(); //Facilita la creacion de rutas
const User = require('../models/User'); //Importo el esquema de User.js
const nodemailer = require('nodemailer'); //Modulo para enviar correos
const passport = require('passport');

var smtransport = nodemailer.createTransport({ 
    service: 'Gmail', 
    auth:{
        user: 'micarpeta321@gmail.com',
        pass: 'micarpeta2345'
    }
});

router.get('/usuarios/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/usuarios/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/usuarios/signin',
    failureFlash: true
}));

router.get('/usuarios/registrarse', (req, res) => {
    res.render('users/signup');
});

// ===========================================================================================
//Registro de un usuario al operador
router.post('/usuarios/registrarse', async(req, res) =>{
    const {name, apellido, cedula, emailreg, password, confirm_password} = req.body;
    const errors = [];

    if(name.lenght <= 0){
        errors.push({text: 'Ingresa un nombre'});
    }
    if(password != confirm_password){
        errors.push({text: 'Las contraseñas no coinciden'});
    }
    if(password.length < 4){
        errors.push({text: 'La contraseña debe ser mayor a 4 caracteres'});
    }
    //Reviso si la cedula ya esta registrada
    const usCedula = await User.findOne({cedula: cedula});
    if(usCedula){
        errors.push({text: 'Esa cedula ya esta registrada'});
    }
    if(errors.length > 0){
        res.render('users/signup', {errors, name, apellido, cedula, password, confirm_password});
    }else{
        //Codigo para enviar correo
        const email = name + name.length + apellido.length + cedula + password.length + apellido +'@carpetacolombia.co';
        var correo = '<strong>Hola tu correo es: </strong>' + email;
        var mailOptions = {
            from: 'Carpeta Ciudadana',
            to: emailreg,
            subject: 'Asunto',
            text: 'Registro Operador Mi Carpeta',
            html: correo
        };
        smtransport.sendMail(mailOptions);

        //Codigo para crear un nuevo usuario
        const newUser = new User({name, apellido, email, cedula, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Estas registrado tu email es: ' + email);
        res.redirect('/usuarios/signin');
    }
});

// ===========================================================================================

router.get('/usuarios/logout', (req, res)=>{
    req.logOut();
    res.redirect('/');
});

module.exports = router;