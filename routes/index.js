var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', (req, res) => {
	res.render('index', { title: 'Careaxiom Bamboo HR integration Services' });
});
router.post('/birthdays', (req, res, next) => {
	return App.Services.storeBirthdayFeed()
		.then(() => {res.status(201).end();})
		.catch(next);
});
router.get('/birthdays/employees', (req, res, next) => {
	let date = req.query.date;
	if (!date) {
		throw new Error('date not specified');
	}
	return App.Services.getBirthdayEmployees({date})
		.then((result) => {res.json(result);})
		.catch(next);
});
router.post('/anniversaries', (req, res, next) => {
	return App.Services.storeAnniversaryFeed()
	.then(() => {res.status(201).end();})
	.catch(next);
});
router.get('/anniversaries/employees', (req, res, next) => {
	let date = req.query.date;
	if (!date) {
		throw new Error('date not specified');
	}
	return App.Services.getAnniversaryEmployees({date})
	.then((result) => {res.json(result);})
	.catch(next);
});
router.post('/whos-out', (req, res, next) => {
	res.render('index', {title: 'Building Whos out'});
});
module.exports = router;
