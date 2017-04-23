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
router.post('/who-is-out', (req, res, next) => {
	return App.Services.storeWhoIsOutFeed()
	.then(() => {res.status(201).end();})
	.catch(next);
});
router.get('/who-is-out/employees', (req, res, next) => {
	let date = req.query.date;
	if (!date) {
		throw new Error('date not specified');
	}
	return App.Services.getWhoIsOutEmployees({date})
	.then((result) => {res.json(result);})
	.catch(next);
});
router.post('/employees', (req, res, next) => {
	return App.Services.updateEmployeeDirectory()
	.then(() => {res.status(201).end();})
	.catch(next);
});
module.exports = router;
