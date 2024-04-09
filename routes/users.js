const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

//middleware para comprobar perfil de usuario
const checkAdminRole = (req, res, next) => {
    const user = req.session.user;
    if (user && user.rol === 0) {
        res.status(403).send('No eres administrador');
    } else {
        next(); 
    }
};

router.get('/user/register', usersController.render);
router.post('/user/register', usersController.register);
router.get('/user/log', usersController.log);
router.post('/user/login/enter', usersController.login);

// Ruta para cerrar sesión
router.get('/user/logout', usersController.logout);
router.get('/user/admin',checkAdminRole, usersController.admin );
router.get('/user/espec', usersController.espec );
router.get('/user/list' , usersController.list );
router.get('/user/:id/editar' , usersController.renderedit);
router.post('/user/:id' , usersController.update)
router.post('/user/delete/:id', usersController.delete);

module.exports = router