const db = require('../database/models');
const { edit } = require('./moviesController');

const sequelize = db.sequelize;

// Otra forma de llamar a los modelos
const Movies = db.Movie;
/*const Movie = db.Movie;
Movie.init({
    // Definición de campos de Movie
}, {
    sequelize,
    modelName: 'Movie',
    paranoid: true // Habilitar eliminación lógica
});*/


const controllers = {
    index: (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('index', { movies, user: req.user }); // Añadiendo 'user' al objeto pasado a la vista
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
            res.render('moviesDetail.ejs', { movie, genre, actor, user: req.user }); // Añadiendo 'user' al objeto pasado a la vista
        } catch (error) {
            // Manejo de errores
            console.error(error);
            res.status(500).send('Error al obtener detalles de la película');
        }
    },
    add: (req, res) => {
        res.render("moviesAdd", { user: req.user }); // Añadiendo 'user' al objeto pasado a la vista
    },
    create: async (req, res) => {
        try {
            const { title, rating, awards, release_date, length } = req.body;

            // Crear una nueva película en la base de datos
            const newMovie = await Movies.create({
                title: title,
                rating: rating,
                awards: awards,
                release_date: release_date,
                length: length
            });

            console.log('Película creada:', newMovie);

            res.send('¡Película creada exitosamente!');
        } catch (error) {
            console.error('Error al crear película:', error);
            res.status(500).send('Error interno del servidor');
        }
    },

    renderupdate: async (req, res) => {
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
            res.render('moviesEdit.ejs', { Movie: updatedMovie, user: req.user }); // Añadiendo 'user' al objeto pasado a la vista
        } catch (error) {
            // Manejo de errores
            console.error(error);
            res.status(500).send('Error al actualizar la película');
        }
    },
    update: async (req, res) => {
        try {
            const movieId = req.params.id;
            const updatedMovieData = req.body;

            // Actualizar la película en la base de datos
            await db.Movie.update(updatedMovieData, {
                where: { id: movieId }
            });

            // Redireccionar al listado de películas después de la actualización
            res.redirect('/user/admin');
        } catch (error) {
            console.error('Error al actualizar la película:', error);
            res.status(500).send('Error interno del servidor');
        }
    },
    renderdelete: (req, res) => {
        db.Movie.findByPk(req.params.id) // Buscar la película por su ID
            .then(movie => {
                res.render('moviesDelete', { movie, user: req.user }); // Añadiendo 'user' al objeto pasado a la vista
            })
            .catch(error => {
                console.error('Error al buscar la película:', error);
                res.status(500).send('Error interno del servidor');
            });
    },
    delete: async (req, res) => {
        try {
            const movieId = req.params.id;
            // Hacer un borrado suave (soft delete) utilizando paranoid
            await db.Movie.destroy({
                where: { id: movieId },
                paranoid: true // Activar borrado suave (soft delete)
            });
            res.redirect('/user/admin');
        } catch (error) {
            console.error('Error al eliminar la película:', error);
            res.status(500).send('Error interno del servidor');
        }
    }

}

module.exports = controllers;
