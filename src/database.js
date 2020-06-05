const mongoose = require('mongoose'); //Mongoose me permite conectarme mas facil a la base de datos

mongoose.connect('mongodb+srv://juanvx:juan123@cluster0-nxohq.mongodb.net/Usuarios?retryWrites=true&w=majority', { //Conecto a la base de datos
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useFindAndModify: false
})
    .then(db => console.log("Base de datos conectada"))  //Si me conecto avisarme
    .catch(err => console.log(err));  //Si no mostrar el error
