require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');



const nocache = require('nocache');//estou testando para o caheee
const connectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');


const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

app.use(nocache());//estou testando para o caheee

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));


//inicio do teste



//fim do teste



app.use(express.static('public'));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});



