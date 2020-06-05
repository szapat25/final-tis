const mongoose = require('mongoose');
const { Schema } = mongoose;

const DocsSchema = new Schema({
    name: {type: String},
    path: {type: String},
    date: {type: Date, default: Date.now},
    user: {type: String}
});

module.exports = mongoose.model('Note', DocsSchema);