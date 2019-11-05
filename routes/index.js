const router = require('express').Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req,res)=> res.render('home'));

router.get('/dashboard', ensureAuthenticated, (req,res)=> res.render('dashboard', {
    name: req.user.username
}));

module.exports = router;