var { Router } = require('express');

var router = Router();

/* GET users listing. */
router.get('/', (_req, res) => {
  res.send('respond with a resource');
});

module.exports = router;
