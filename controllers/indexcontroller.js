const db = require('../database/models');
const { edit } = require('./moviesController');

const sequelize = db.sequelize;

// Otra forma de llamar a los modelos
const Movies = db.Movie;

const controllers = {
    index: (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('index', { movies });
            })
            .catch(error => {
                console.error('Error al buscar películas:', error);
                res.status(500).send('Error interno del servidor');
            });
    },
    detail: async (req, res) => {
        try {
            const movie = await db.Movie.findByPk(req.params.id);
            const genre = await db.Genre.findByPk(req.params.id);
            const actor = await db.Actor.findOne({
                where: { favorite_movie_id: req.params.id }
            });
            res.render('moviesDetail.ejs', { movie, genre, actor });
        } catch (error) {
            // Manejo de errores
            console.error(error);
            res.status(500).send('Error al obtener detalles de la película');
        }

    },
    add: (req, res) => {
        res.render("moviesAdd")
    },
    update: async (req, res) => {
        try {
            const movieId = req.params.id;
            const updatedMovieData = req.body; // Suponiendo que los datos actualizados de la película están en el cuerpo de la solicitud

            // Actualizar la película en la base de datos
            await db.Movie.update(updatedMovieData, {
                where: { id: movieId }
            });

            // Obtener la película actualizada para renderizar el formulario de edición
            const updatedMovie = await db.Movie.findByPk(movieId);

            // Renderizar el formulario de edición con los datos actualizados de la película
            res.render('moviesEdit.ejs', { Movie: updatedMovie });
        } catch (error) {
            // Manejo de errores
            console.error(error);
            res.status(500).send('Error al actualizar la película');
        }
    }
};


module.exports = controllers;
