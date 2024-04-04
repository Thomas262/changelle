const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/user/register',usersController.register );
router.get('/user/login', usersController.login);
router.get('/user/admin', usersController.admin );

module.exports = router