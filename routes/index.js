var express = require('express');
var router = express.Router();
const Request = require('superagent')
/* GET home page. */
router.get('/', (req, res, next) => {
	res.render('index', { title: 'Careaxiom Bamboo HR integration Services' });
});
router.post('/birthdays', (req, res, next) => {
	return App.Services.storeBirthdayFeed().then((result) => {
		res.json(result);
	}).catch(next);
});
router.get('/test', (req, res) => {
	res.json({x:1});
});
router.post('/anniversaries', (req, res, next) => {
	res.render('index', {title: 'Building Anniversaries'});
});
router.post('/whos-out', (req, res, next) => {
	res.render('index', {title: 'Building Whos out'});
});
module.exports = router;
