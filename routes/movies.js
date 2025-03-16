const express = require('express');
const router = express.Router();
const Movie = require('../models/movies.js');  // Import the Movie model
const authMiddleware = require('../middleware/auth.js');

// Check if a movie exists
const checkExistance = async (id) => {
    const movie = await Movie.findById(id);
    return !!movie;  // Returns true if the movie exists
};

// Check if a user is the owner of the movie
const checkOwnership = async (id, userId) => {
    const movie = await Movie.findOne({ _id: id, user_id: userId });
    return !!movie;  // Returns true if the user is the owner
};

router.get('/', authMiddleware, async (request, response) => {
    try {
        const userId = request.userId;
        const movies = await Movie.find({ user_id: userId });
        response.json({ 'movies': movies });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

router.post('/create', authMiddleware, async (request, response) => {
    try {
        const userId = request.userId;
        const { title, description } = request.body;

        const movie = new Movie({
            user_id: userId,
            title,
            description
        });

        await movie.save();
        response.status(201).json({ 'movie': movie });
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

router.post('/watched', authMiddleware, async (request, response) => {
    try {
        const userId = request.userId;
        const { movie_id, watched } = request.body;

        const movieExists = await checkExistance(movie_id);
        if (!movieExists) {
            return response.json("Movie doesn't exist");
        }

        const isOwner = await checkOwnership(movie_id, userId);
        if (!isOwner) {
            return response.json("Not authorized");
        }

        const movie = await Movie.findByIdAndUpdate(movie_id, { watched: watched === null || watched === '' ? false : true }, { new: true });
        response.json("Watch status updated");
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

router.post('/delete', authMiddleware, async (request, response) => {
    try {
        const userId = request.userId;
        const { movie_id } = request.body;

        const movieExists = await checkExistance(movie_id);
        if (!movieExists) {
            return response.json("Doesn't exist");
        }

        const isOwner = await checkOwnership(movie_id, userId);
        if (!isOwner) {
            return response.json("Not authorized");
        }

        await Movie.findByIdAndDelete(movie_id);
        response.json("The deletion was successful");
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
});

module.exports = router;
