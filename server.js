const express = require('express');
const app = express();
const router = express.Router();
const port = process.env.PORT || 8080;
const mongoose = require('mongoose');
const Pet = require('./models/pet.js')
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/updog') //Connecting to our db

app.use(express.static('public')); // Tell our app to use the public folder for out static files

app.use(bodyParser.json()); // converts all objects back to json from a string

router.route('/')
	.get((req, res) => {
		res.send({
			message: "Whats cookin"
		});
	});

router.route('/pets')
	.get((req, res) => {
		const query = req.query;

		const pet = Pet.find(); // By using the exec method below, allows the function to wait

		if(query.order_by === 'score') {
			pet.sort({
				score: -1
			})
		}

		pet.exec((err, docs) => { // Goes and get all the pet data from the DB, stores them in docs
			if (err !== null) {
				res.status(400) // If a bad status, return the error
					.send({
						error: err
					});
				return;
			}
			res.status(200)
				.send(docs);
		});
	})
	.post((req, res) => {
		const  body = req.body;
		const pet = new Pet(body);

		pet.save((err, doc) => { // Writes are new pet to the DB
			if(err !== null) {
				res.stats(400)
					.send({
						error: err
					});
				return;
			}
			res.status(200)
				.send(doc);
		});
	});

router.route('/pets/:pet_id') // Using the param :pet_id to dynamically identify each pet from the URL
	.get((req, res) => {
		const params = req.params;
		Pet.findOne({ _id : params.pet_id }, (err, doc) => {
			if(err !== null) {
				res.stats(400) 
					.send({
						error: err
					});
				return;
			}
		res.status(200)
			.send(doc);
		});
	})
	.put((req, res) => {
		Pet.findById(req.params.pet_id, (err, doc) => {
			if(err !== null) {
				res.status(400)
					.send({
						error: err
					})
				return;
			}

			Object.assign(doc, req.body, {score: doc.score += 1}); // Allows to update objects with assign method

			doc.save((err, savedDoc) => {
				if(err !== null) {
					res.status(400)
						.send({
							error: err
						});
					return;
				}
				res.status(200)
					.send(savedDoc);
			})
		});
	})
	.delete((req, res) => {
		Pet.findByIdAndRemove(req.params.pet_id, (err, doc) => {
			if(err !== null) {
				res.status(400)
					.send({
						error: err
					});
				return;
			}
			res.status(200)
				.send({
					success: "Item deleted"
				});
		})
	})

app.use('/api', router);

app.listen(port);