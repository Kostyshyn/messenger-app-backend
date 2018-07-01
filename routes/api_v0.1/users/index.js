var express = require('express');
var router = express.Router();
var helper = require('../../../helpers/');

router.get('/', (req, res, next) => {
	res.status(200).json({
		'title': 'Hello from users route!'
	});
});
router.get('/protected', helper.protected, (req, res, next) => {
	res.status(200).json({
		'title': 'Hello from protected route!'
	});
});

module.exports = router;