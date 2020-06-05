const passport = require('passport'); //Autenticar el usuario, para no tener que logearse en cada ventana
const localStrategy = require('passport-local').Strategy;

const User = require('../models/User');

//Autenticación del usuario
passport.use(new localStrategy({
    usernameField: 'email'
    }, async (email, password, done) => {
        const user = await User.findOne({email: email});
        if(!user){
            return done(null, false, {message: 'Usuario no encontrado'});
        }else{  
            const match = await user.matchPassword(password);
            if(match){
                return done(null, user);
            }else{
                return done(null, false, { message: 'contraseña incorrecta.'});
            }
        }
}));

//Para evitar pedir de nuevo el login
passport.serializeUser((user, done) =>{
    done(null, user.id);
});

//Proceso inverso al anterior
passport.deserializeUser((id, done) =>{
    User.findById(id, (err, user) =>{
        done(err, user);
    });
});