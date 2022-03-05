const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('index.hbs');
});

module.exports = router;


// const router = require('express').Router();

// router.get('/', (req, res) => {
//   console.log('res.locals:', res.locals)
//   res.redirect('/entries');
// });

// module.exports = router;
