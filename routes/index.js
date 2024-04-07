var express = require('express');
var router = express.Router();
var indexController = require("../controllers/indexController");

router.get('/', indexController.index);
router.get('/detail/:id', indexController.detail);
router.get('/add', indexController.add);
router.post('/Add', indexController.create)
router.get('/update/:id', indexController.renderupdate);
router.post('/update/:id', indexController.update);
router.get('/delete/:id', indexController.renderdelete)
router.post('/delete/:id', indexController.delete)

module.exports = router;
