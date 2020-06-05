const router = require('express').Router(); //Facilita la creacion de rutas

router.get('/', (req, res) => { //Manejo los request y response con router
    res.render('index'); //Si me piden el inicio mando esto
});

router.get('/about', (req, res) =>{
    res.render('about');
});

module.exports = router;