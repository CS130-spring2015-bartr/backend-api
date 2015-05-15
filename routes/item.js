module.exports = function(db) {
	var express = require('express');
	var router = express.Router();

	//get a list of 25 items that the user hasn't seen yet in geographic order
	router.get('/geo', function(req, res, next) {
		var data = {}
		data.num = 15;
		db.getNItems(data, function(err, items) {
			res.send(items);
		});
		/*
		db.getGeolocatedItems(data, function(err, items) {
			if (err) next(err);
			res.send(items);
		});
		*/
	});

	//set an item as liked by a certain user
	router.post('/liked', function(req, res, next) {
		var data = {
			uid: req.body.userId
		};

		var likesRegistered = true;
		for (var x = 0; x < req.body.itemIds; x++) {
			data.iid = req.body.itemIds[x];
			db.addItemLiked(data, function(err, itemLikeRegistered) {
				if (err) next(err);
				if (!itemLikeRegistered)
					likesRegistered = false;
			});
		}

		if (!likesRegistered)
			res.sendStatus(500);
		else
			res.sendStatus(200);
	});

	//create a new item
	router.post('/', function(req, res, next) {

		var data = {
			uid: req.body.user_id,
			title: req.body.item_title,
			image: req.files.item_picture.buffer,
			description: req.body.item_description
		};

		db.createItem(data, function(err, itemCreated) {
			if (err) console.log(err);
			if (itemCreated)
				res.sendStatus(200);
			else
				res.sendStatus(500);
		});
	});

	//updates an existing item
	router.put('/:itemId', function(req, res, next) {
		req.body.id = req.params.itemId;
		db.updateItem(req.body, function(err, itemUpdated) {
			if (err) next(err);
			if (itemUpdated)
				res.sendStatus(200);
			else
				res.sendStatus(500);
		});
	});

	//delete a specified item
	router.delete('/:itemId', function(req, res, next) {
		var data = {};
		data.id = req.params.itemId;

		db.deleteItem(data, function(err, itemDeleted) {
			if (err) next(err);
			if (itemDeleted)
				res.sendStatus(200);
			else
				res.sendStatus(500);
		});
	});

	return router;
};
