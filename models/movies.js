// models/movie.js

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    watched: { type: Boolean, default: false }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
