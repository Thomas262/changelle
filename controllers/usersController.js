const { render } = require('ejs');
const db = require('../database/models');

const sequelize = db.sequelize;

const controllers = {
    register: (req, res) => {
        console.log(req.body);
        /* req.body is a special property that lets us access the data we sent in our         POST request */
        res.render("register")}
        ,

        login:   (req, res) => {
            //if no name or password was    
            res.render("login")
        },
        admin: async (req, res) => {
            try {
                const movies = await db.Movie.findAll();
                const users = await db.User.findAll();
                
                res.render('admin', { movies, users });
            } catch (error) {
                console.error('Error al buscar películas y usuarios:', error);
                res.status(500).send('Error interno del servidor');
            }
        }
        
        
}

module.exports = controllers