const Promise = require('bluebird');
const Request = Promise.promisifyAll(require('superagent'));
const ical2json = require('ical2json');

module.exports.storeBirthdayFeed = () => {
	return Request.get(process.env.BAMBOO_FEEDS_URL)
		.query({
			id: process.env.BAMBOO_BIRTHDAY_FEED_ID
		})		
		.endAsync()
		.then((response) => {
			let calendarData = ical2json.convert(response.text);
			return calendarData;
		});
};