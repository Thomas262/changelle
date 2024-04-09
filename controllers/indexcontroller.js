const db = require('../database/models');
const session = require('express-session');
const sequelize = db.sequelize;

const Movies = db.Movie;
const ActorMovie = db.ActorMovie;

const controllers = {
    index: async (req, res) => {
        try {

            const movies = await db.Movie.findAll();


            if (req.session.user) {

                res.render('index', { movies, user: req.session.user });
            } else {

                res.render('index', { movies, user: null });
            }
        } catch (error) {
            console.error('Error al buscar películas:', error);
            res.status(500).send('Error interno del servidor');
        }
    },
    detail: async (req, res) => {
        try {
            const movie = await db.Movie.findByPk(req.params.id, {
                include: db.Genre // Incluye la información del género asociado a la película
            });
    
            const actors = await db.Actor.findAll({
                where: { favorite_movie_id: req.params.id }
            });
    
            if (!movie) {
                return res.status(404).send('Película no encontrada');
            }
    
            res.render('moviesDetail.ejs', { movie, actors, user: req.user });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener detalles de la película');
        }
    },
    
    
    
    add: (req, res) => {
        res.render("moviesAdd", { user: req.user }); 
    },
    create : async (req, res) => {
        try {
            const { title, rating, awards, release_date, length, genre_id, actorIds } = req.body;
    
            // Crea la película en la tabla movies
            const newMovie = await Movies.create({
                title: title,
                rating: rating,
                awards: awards,
                release_date: release_date,
                length: length,
                genre_id: genre_id
            });
    
            // Verifica si se proporcionaron IDs de actores y los agrega a la película
            if (actorIds && actorIds.length > 0) {
                // Crea un nuevo registro en la tabla actor_movie para cada actor seleccionado
                await Promise.all(actorIds.map(async (actorId) => {
                    await ActorMovie.create({
                        actor_id: actorId,
                        movie_id: newMovie.id // Utiliza el ID de la nueva película creada
                    });
                }));
            }
    
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
            const updatedMovieData = req.body; 

            await db.Movie.update(updatedMovieData, {
                where: { id: movieId }
            });

            const updatedMovie = await db.Movie.findByPk(movieId);
       
            res.render('moviesEdit.ejs', { Movie: updatedMovie, user: req.user }); 
        } catch (error) {
          
            console.error(error);
            res.status(500).send('Error al actualizar la película');
        }
    },
    update: async (req, res) => {
        try {
            const movieId = req.params.id;
            const updatedMovieData = req.body;

            await db.Movie.update(updatedMovieData, {
                where: { id: movieId }
            });

            res.redirect('/user/admin');
        } catch (error) {
            console.error('Error al actualizar la película:', error);
            res.status(500).send('Error interno del servidor');
        }
    },
    renderdelete: (req, res) => {
        db.Movie.findByPk(req.params.id) 
            .then(movie => {
                res.render('moviesDelete', { movie, user: req.user }); 
            })
            .catch(error => {
                console.error('Error al buscar la película:', error);
                res.status(500).send('Error interno del servidor');
            });
    },
    delete: async (req, res) => {
        try {
            const movieId = req.params.id;
       
            await db.Movie.destroy({
                where: { id: movieId },
                paranoid: true 
            });
            res.redirect('/user/admin');
        } catch (error) {
            console.error('Error al eliminar la película:', error);
            res.status(500).send('Error interno del servidor');
        }
    }

}

module.exports = controllers;
