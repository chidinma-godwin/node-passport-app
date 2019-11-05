const express = require('express');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const indexRoutes = require('./routes/index');
const usersRoutes = require('./routes/users');

const app = express();

require('./config/passport')(passport);

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: false}));

const uri = require('./config/keys').MongoURI;
mongoose.connect(uri, { useNewUrlParser: true })
.then(()=> console.log('Mongoose connected to database successfully'))
.catch(err=> console.log(err));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/',indexRoutes);
app.use('/users', usersRoutes);

const port = process.env.PORT || 3000;
app.listen(port, ()=> console.log(`Server listening on port ${port}`));