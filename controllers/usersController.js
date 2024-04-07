const { render } = require('ejs');
const db = require('../database/models');

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

    login: (req, res) => {
        //if no name or password was    
        res.render("login");
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
        const user = req.user; // Obtener el usuario autenticado de req.user
    
        if (user) {
            // Si el usuario está autenticado, renderizar la vista con la información del usuario
            res.render('espec', { user });
        } else {
            // Si el usuario no está autenticado, renderizar la vista con user como null o enviar un mensaje de error
            res.status(401).send('Usuario no autenticado');
            // Opción alternativa: res.render('espec', { user: null });
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
