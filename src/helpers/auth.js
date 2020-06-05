const helper = {}; //constante con varias responsabilidades

helper.isAuthenticated = (req, res, next) =>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg', 'No autorizado');
    res.redirect('/usuarios/signin');
};

module.exports = helper;