const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/login',(req,res)=> res.render('login'));

router.get('/register', (req,res)=> res.render('register'));

router.post('/register', (req,res)=> {
    const { username,email,password,password2} = req.body;
    let errors = [];
    if(!username || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields'});
    }
    if(password.length < 6){
        errors.push({msg: 'Password must be at least six characters'});
    }
    if(password !== password2) {
        errors.push({msg: 'Passwords must match'});
    }
    
    if (errors.length > 0) {
        res.render('register', {
            errors, username,email,password,password2
        });
    } else{
        User.findOne({email: email})
        .then(user=> {
            if(user){
                errors.push({msg: 'This email is already registered'});
            } else{
                const newUser = new User({username, email, password});
                bcrypt.genSalt(10, (err,salt)=> {
                    bcrypt.hash(newUser.password, salt, (err,hash)=> {
                        if(err) throw err;
                        newUser.password = hash;
                        
                        newUser.save()
                        .then(()=> {
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('./login');
                        })
                        .catch(err=> console.log(err));
                    });
                });
            }
        });
    }

});

router.post('/login', (req,res,next)=> {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

router.get('/logout', (req,res)=> {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router;