const Promise = require('bluebird');
const Request = Promise.promisifyAll(require('superagent'));
const ical2json = require('ical2json');
const _ = require('lodash');
const moment = require('moment');

let _getEvents = (feed) => {
	return _.map(feed.VCALENDAR[0].VEVENT, (event) => {
		return {
			summary: event.SUMMARY,
			startDate: event['DTSTART;VALUE=DATE'],
			endDate: event['DTEND;VALUE=DATE']
		};
	});
};
module.exports.storeBirthdayFeed = () => {
	let Feed = App.Models.Feed;
	let feedType = 'birthdays';
	let transaction = null;
	return Feed.getTransaction()
	.then((t) => {
		transaction = t;
		return Feed.destroy({where: {feedType}, transaction});
	})
	.then(() => {
		let id = process.env.BAMBOO_BIRTHDAY_FEED_ID; 
		return Request.get(process.env.BAMBOO_FEEDS_URL)
			.query({id})		
			.endAsync();
	})
	.then((response) => {
		let birthdayFeed = ical2json.convert(response.text);
		let feedData = _getEvents(birthdayFeed);
		return Feed.create({feedType, feedData}, {transaction});
	})
	.then(() => {transaction.commit();})
	.catch(() => {transaction.rollback();});
};

module.exports.getBirthdayEmployees = ({date = '20/08/2017'}) => {
	if (!date) {
		throw new Error('date not specified');
	}
	date = moment(date, 'DD/MM/YYYY').format('YYYYMMDD');
	let Feed = App.Models.Feed;
	let feedType = 'birthdays';
	let where = {feedType};
	return Feed.find({where})
	.then(({feedData = {}} = {}) => {
		return _.chain(feedData)
						.filter((birthday) => birthday.startDate === date)
						.map((birthday) => birthday.summary.split('-')[0].trim());
	});
};