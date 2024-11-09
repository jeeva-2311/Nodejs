const express = require('express');
const app = express();
const logger = require('morgan'); 
const productroutes = require('./api/routes/products');
const orderroutes = require('./api/routes/orders');
const userroutes = require('./api/routes/user');
const mongoose = require('mongoose');

//Connecting to database
const MONGO_ATLAS_PW = process.env.MONGO_ATLAS_PW || "2311";

mongoose.connect(`mongodb+srv://jeeva:${MONGO_ATLAS_PW}@cluster0.fce2x.mongodb.net/nodejs?retryWrites=true&w=majority&appName=Cluster0`);

mongoose.connection.on('connected', () => { // this is used to check if database is connected properly
    console.log('Mongoose connected to db');
});

app.use(logger('dev'));// for logging messages in console each time a request is received

app.use('/uploads', express.static('uploads')); // this will make upload available in public

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 

//Browser CORS error handling and basic header handling
app.use( (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //Allow specific headers

    if(req.method ==='OPTIONS'){
        res.header('Access-Control-Allow-Method', '*');
        res.status(200).json({});
    }
    next();
} );

//Using method over loading to route each catogory to correct API file
app.use('/user', userroutes);
app.use('/products', productroutes);
app.use('/orders', orderroutes);

// If no predined route is found express will route the product to below error handler
app.use((req, res, next) => {
    const err = new Error("Wrong URL");
    err.status = 404;
    next(err);
});

//basic error handler. 
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    });
});
module.exports = app;