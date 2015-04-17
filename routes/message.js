var express = require('express');
var router = express.Router();

/* GET message page. */
router.get('/message', function(req, res, next) {
  res.render('message', { info: 'You need to Login or Register to access this page' });
});

module.exports = router;