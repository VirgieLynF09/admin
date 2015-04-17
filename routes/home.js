// dependencies
var express = require('express');
var router = express.Router();

// add db & model dependencies
var mongoose = require('mongoose');
var Car = require('../models/car');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/message');
}


//GET /home - show data listing */
router.get('/home', isAuthenticated, function (req, res, next) {

    // retrieve all data using the car model
    Car.find(function (err, home) {
        // if there is an error
        if (err) {
            res.render('error', { error: err });
        }
        else {
            //if there is no error, show the views/home.jade and pass the query results to that view
            res.render('home', { home: home });
            console.log(home);
        }
    });
});

// GET /home/edit/:id - show single car edit form 
router.get('/home/edit/:id', function (req, res, next) {
    //store the id from the url in a variable
    var id = req.params.id;

    //use the car model to look up the car with this id    
    Car.findById(id, function (err, car) {
        if (err) {
            res.send('Car' + id + ' not found');
        }
        else {
            res.render('edit', { car: car });
        }
    });
});

// POST /home/edit/:id - update selected car */
router.post('/home/edit/:id', function (req, res, next) {
    var id = req.body.id;

    var car = {
        _id: req.body.id,
        plateNumber: req.body.plateNumber,
		manufacture: req.body.manufacture,
		model: req.body.model,
		year: req.body.year,
		category: req.body.category,
		postalCode: req.body.postalCode,
		approximateKm: req.body.approximateKm,
		chargerStation: req.body.chargerStation,
		duration: req.body.duration
		
    };

    Car.update({ _id: id}, car, function(err) {
        if (err) {
            res.send('Car' + req.body.id + ' not updated. Error: ' + err);
        }
        else {
            res.statusCode = 302;
            res.setHeader('Location', 'http://' + req.headers['host'] + '/home');
            res.end();
        }
    });
});

// GET /home/add - show home input form
router.get('/home/add', isAuthenticated, function (req, res, next) {
    res.render('add');
});

// POST /home/add - save new car
router.post('/home/add', function (req, res, next) {

    // use the Car model to insert a new car
    Car.create({
        plateNumber: req.body.plateNumber,
		manufacture: req.body.manufacture,
		model: req.body.model,
		year: req.body.year,
		category: req.body.category,
		postalCode: req.body.postalCode,
		approximateKm: req.body.approximateKm,
		chargerStation: req.body.chargerStation,
		duration: req.body.duration
		
    }, function (err, Car) {
        if (err) {
            console.log(err);
            res.render('error', { error: err }) ;
        }
        else {
            console.log('Car saved ' + Car);
            res.render('added', { car: Car.plateNumber });
        }
    });
});
  
// GET car delete request    
router.get('/home/delete/:id', function (req, res, next) {
    //store the id from the url into a variable
    var id = req.params.id;

    //use our car model to delete
    Car.remove({ _id: id }, function (err, car) {
        if (err) {
            res.send('Car' + id + ' not found');
        }
        else {
            res.statusCode = 302;
            res.setHeader('Location', 'http://' + req.headers['host'] + '/home');
            res.end();
        }
    });
});

// API GET all the data from the database
router.get('/api/home', function (req, res, next) {
    Car.find(function (err, home) {
        if (err) {
            res.send(err);
        } 
        else {
            res.send(home);
        }
    });
});


//API GET a data request by car id
router.get('/api/home/:id', function (req, res, next) {
    //store the id from the url in a variable
    var id = req.params.id;

    //use the car model to look up the car with this id    
    Car.findById(id, function (err, car) {
        if (err) {
            res.send('Car' + id + ' not found');
        }
        else {
            res.send({ car: car });
        }
    });
});


// make controller public
module.exports = router;
