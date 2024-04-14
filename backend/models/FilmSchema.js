const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  id: Number,
  titre: String,
  titreOriginal: String,
  realisateurs: String, 
  anneeDeProduction: Number,
  nationalite: String, 
  duree: String, 
  genre: String, 
  synopsis: String,
}, { strict: false });

const Film = mongoose.model('Film', filmSchema);
module.exports = Film; 
