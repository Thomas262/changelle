const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/user/register', usersController.render);
router.post('/user/register', usersController.register);
router.get('/user/login', usersController.login);
router.get('/user/admin', usersController.admin );
router.get('/user/espec', usersController.espec );
router.get('/user/list' , usersController.list )
router.get('/user/:id/editar' , usersController.edit)

module.exports = router