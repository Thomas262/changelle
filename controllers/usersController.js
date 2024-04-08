const { render } = require('ejs');
const db = require('../database/models');
const session = require('express-session');
const sequelize = db.sequelize;
const User = db.User;

const controllers = { 
    render: (req, res) => {
        console.log(req.body);
        /* req.body is a special property that lets us access the data we sent in our POST request */
        res.render("register");
    },
    register: async (req, res) => {
        try {
            // Extraer los datos del cuerpo de la solicitud
            const { name, password, email, role } = req.body;

            // Crear un nuevo usuario en la base de datos
            const newUser = await User.create({
                name: name,
                password: password,
                email: email,
                rol: role // Guardar el rol del usuario en la base de datos
            });

            console.log('Usuario registrado:', newUser);

            // Redireccionar a la vista adecuada según el rol del usuario
            if (role === '0') {
                // Si el usuario es regular, redirigir a la vista 'espec'
                res.redirect('/user/espec');
            } else if (role === '1') {
                // Si el usuario es administrador, redirigir a la vista 'admin'
                res.redirect('/user/admin');
            } else {
                // Si el rol no es reconocido, redirigir a una página de error
                res.status(400).send('Rol de usuario no válido');
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            res.status(500).send('Error interno del servidor');
        }
    },

    log: (req, res) => {
        //if no name or password was    
        res.render("login");

    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email: email } });

            if (user && user.password === password) {
                req.session.user = user; // Almacenar el usuario en la sesión
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
                res.redirect('/user/espec'); // Redirigir al usuario a la página de inicio de sesión después del cierre de sesión
            }
        });
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
            const userId = req.params.id; // Obtener el ID del usuario de la solicitud
            const user = await db.User.findByPk(userId); // Buscar el usuario por su ID
            
            if (!user) {
                // Si no se encuentra el usuario, devolver un error 404
                return res.status(404).send('Usuario no encontrado');
            }
            
            res.render('editUser', { user }); // Renderizar el formulario de edición con el usuario encontrado
        } catch (error) {
            console.error('Error al buscar el usuario:', error);
            res.status(500).send('Error interno del servidor');
        }
    },
    update: async (req, res) => {
        try {
            const userId = req.params.id; // Obtener el ID del usuario de la solicitud
            const { name, email, role } = req.body; // Extraer los datos del cuerpo de la solicitud

            // Buscar y actualizar al usuario en la base de datos
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

            // Verificar si se actualizó correctamente
            if (updatedUser[0] === 1) {
                res.redirect('/user/list'); // Redirigir al usuario a la lista de usuarios
            } else {
                res.status(404).send('Usuario no encontrado');
            }
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).send('Error interno del servidor');
        }
    },
    espec: (req, res) => {
        // Obtener el usuario de la sesión
        const user = req.session.user;

        // Verificar si el usuario está autenticado
        if (user) {
            // Renderizar la vista de perfil del usuario con los datos del usuario
            res.render('espec', { user });
        } else {
            // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
            res.redirect('/');
        }
    },
    // Eliminar un usuario
    delete: async (req, res) => {
        try {
            const userId = req.params.id; // Obtener el ID del usuario de la solicitud

            // Buscar y eliminar al usuario
            const deletedUser = await User.destroy({
                where: {
                    id: userId
                }
            });

            // Verificar si se eliminó correctamente
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
