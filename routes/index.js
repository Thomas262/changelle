var express = require('express');
var router = express.Router();
var indexController = require("../controllers/indexController");

router.get('/', indexController.index);
router.get('/detail/:id', indexController.detail);
router.get('/add', indexController.add);
router.get('/update/:id', indexController.update);
router.get('/delete/:id', indexController.clean)
/* router.post('/create', indexController.create);
router.post('/update/:id', indexController.update);
router.post('/delete/:id', indexController.delete); */

module.exports = router;
