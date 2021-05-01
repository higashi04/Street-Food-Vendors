if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const session = require('express-session');
const AppError = require('./AppError');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


//////routes////
const puestos = require('./Routes/puestos');
const reviews = require('./Routes/reviews');
const tacos = require('./Routes/tacos');
const userRoutes = require('./Routes/users');
////////////
//////connectMongoDB////////
mongoose.connect('mongodb://localhost:27017/puestosdetacos', {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useUnifiedTopology: true,
    useFindAndModify: false

});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected, bro')
});
////////
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', engine)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'ithinkilikeden',
    resave: false,
    saveUninitialized: true, 
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes);
app.use('/puestos', puestos);
app.use('/puestos/:id/reviews', reviews);
app.use('/puestos/:id/newTacos', tacos);

app.all('*', (req, res, next) => {
    next(new AppError('Sitio No Existe', 404))
});

app.use((err, req, res, next) => {
    const { status = 500} = err;
    if (!err.message) err.message = 'vos la habeis cajeteado'
    res.status(status).render('error', { err })
   
});


app.listen(3000, ()=> {
    console.log("they listening to us!! on port three thousand minus seven!!!!")
});