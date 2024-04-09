const { render } = require('ejs');
const db = require('../database/models');
const session = require('express-session');
const sequelize = db.sequelize;
const User = db.User;

const controllers = { 
    render: (req, res) => {
        console.log(req.body);
        
        res.render("register");
    },
    register: async (req, res) => {
        try {
         
            const { name, password, email, role } = req.body;

          
            const newUser = await User.create({
                name: name,
                password: password,
                email: email,
                rol: role 
            });

            console.log('Usuario registrado:', newUser);

           
            if (role === '0') {
          
                res.redirect('/user/espec');
            } else if (role === '1') {
               
                res.redirect('/user/admin');
            } else {
              
                res.status(400).send('Rol de usuario no válido');
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            res.status(500).send('Error interno del servidor');
        }
    },

    log: (req, res) => {
      
        res.render("login");

    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email: email } });

            if (user && user.password === password) {
                req.session.user = user; 
                res.redirect('/user/espec');
            } else {
                res.redirect('/');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.status(500).send('Error interno del servidor');
        }
    },
    logout :(req, res) => {
        req.session.destroy(err => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
                res.status(500).send('Error interno del servidor');
            } else {
                res.redirect('/user/espec'); 
            }
        });
    },

    admin: async (req, res) => {
        try {
            const user = req.session.user; 
            const movies = await db.Movie.findAll(); 
            const users = await db.User.findAll(); 

            if (user) {
               
                res.render('admin', { user, movies, users });
            } else {
                
                res.redirect('/');
            }
        } catch (error) {
            console.error('Error al buscar películas y usuarios:', error);
            res.status(500).send('Error interno del servidor');
        }
    },
    list: async (req, res) => {
        try {
            const users = await db.User.findAll();
            
            res.render('listUsers', {  users });
        } catch (error) {
            console.error('Error al buscar películas y usuarios:', error);
            res.status(500).send('Error interno del servidor');
        }
    },
    renderedit: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await db.User.findByPk(userId); 
            
            if (!user) {
            
                return res.status(404).send('Usuario no encontrado');
            }
            
            res.render('editUser', { user }); 
        } catch (error) {
            console.error('Error al buscar el usuario:', error);
            res.status(500).send('Error interno del servidor');
        }
    },
    update: async (req, res) => {
        try {
            const userId = req.params.id; 
            const { name, email, role } = req.body; 

            const updatedUser = await db.User.update(
                {
                    name: name,
                    email: email,
                    rol: role
                },
                {
                    where: { id: userId }
                }
            );

           
            if (updatedUser[0] === 1) {
                res.redirect('/user/list'); 
            } else {
                res.status(404).send('Usuario no encontrado');
            }
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).send('Error interno del servidor');
        }
    },
    espec: (req, res) => {
      
        const user = req.session.user;

        if (user) {
            res.render('espec', { user });
        } else {
            res.redirect('/');
        }
    },
  
    delete: async (req, res) => {
        try {
            const userId = req.params.id; 

            const deletedUser = await User.destroy({
                where: {
                    id: userId
                }
            });
     
            if (deletedUser) {
                res.send('Usuario eliminado exitosamente');
            } else {
                res.status(404).send('Usuario no encontrado');
            }
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).send('Error interno del servidor');
        }
    }
};

module.exports = controllers;
