// file index tổng của app
const path = require('path');
const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const morgan = require('morgan');
const Handlebars = require('handlebars');
const handlebars = require('express-handlebars').engine;
const methodOverride = require('method-override')
const app = express();
const port = 3000;

const route = require('./routes/index');
const db = require('./config/db');


// connect to db
db.connect()

app.use(express.static(path.join(__dirname, 'public')));
// override lại phương thức 
app.use(methodOverride('_method'))

app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());
// Configure session
app.use(session({
    secret: 'bimatdo',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
  
  // Configure flash messages
app.use(flash());

// http logger
app.get(morgan('combined'));
// Template engine
app.engine(
    'hbs',
    handlebars({
        extname: 'hbs',
        helpers: {
            getUsername(username) {
                global.username = username;
                console.log(username)
                return ''; 
            },
            getRole(role) {
                global.role = role;
                console.log(role)
                return ''; 
            },
            isAdmin(role) {
                return role === 'admin';
            },
            isStaff(role) {
                return role === 'staff';
            },
            isVerified(change) {
                return change === 0;
            },
            equals(arg1, arg2, options) {
                return arg1 === arg2 ? options.fn(this) : options.inverse(this);
            },
            multiply(arg1, arg2) {
                return arg1 * arg2;
            },
            isSent(permission) {
                return permission === 1;
            },
            isBlocked(blocked) {
                console.log('isBlocked helper called with:', blocked);
                return blocked === 1;
            },
        }
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//routes
route(app);
//listen the port
app.listen(port, () => {
    console.log(`Example app listening on port https://localhost:${port}`);
});