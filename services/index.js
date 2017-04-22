const Promise = require('bluebird');
const Request = Promise.promisifyAll(require('superagent'));
const ical2json = require('ical2json');
const _ = require('lodash');
const moment = require('moment');
const urlJoin = require('url-join');
let _getEvents = (feed) => {
	return _.map(feed.VCALENDAR[0].VEVENT, (event) => {
		return {
			summary: event.SUMMARY,
			startDate: event['DTSTART;VALUE=DATE'],
			endDate: event['DTEND;VALUE=DATE']
		};
	});
};
let _storeFeed = ({feedType, feedId}) => {
	let Feed = App.Models.Feed;
	let transaction = null;
	return Feed.getTransaction()
	.then((t) => {
		transaction = t;
		return Feed.destroy({where: {feedType}, transaction});
	})
	.then(() => {
		let id = feedId; 
		return Request.get(process.env.BAMBOO_FEEDS_URL)
			.query({id})		
			.endAsync();
	})
	.then((response) => {
		let feed = ical2json.convert(response.text);
		let feedData = _getEvents(feed);
		return Feed.create({feedType, feedData}, {transaction});
	})
	.then((result) => {
		transaction.commit();
		return result;
	})
	.catch((error) => {
		transaction.rollback();		
		throw error;
	});
};
module.exports.storeBirthdayFeed = () => {
	let feedType = 'birthdays';
	let feedId = process.env.BAMBOO_BIRTHDAY_FEED_ID;
	return _storeFeed({feedType, feedId});
};
module.exports.storeAnniversaryFeed = () => {
	let feedType = 'anniversaries';
	let feedId = process.env.BAMBOO_ANNIVERSARY_FEED_ID;
	return _storeFeed({feedType, feedId});
};
module.exports.getBirthdayEmployees = ({date = '20/08/2017'}) => {
	if (!date) {
		throw new Error('date not specified');
	}
	date = moment(date, 'DD/MM/YYYY').format('YYYYMMDD');
	let Feed = App.Models.Feed;
	let Employee = App.Models.employee;
	let feedType = 'birthdays';
	let where = {feedType};
	return Feed.find({where})
	.then(({feedData = {}}) => {
		let employeeNames = _.chain(feedData)
						.filter((birthday) => birthday.startDate === date)
						.map((birthday) => birthday.summary.split('-')[0].trim());
		return Employee.findAllByName({employeeNames});
	});
};
module.exports.getAnniversaryEmployees = ({date='01/01/2017'}) => {
	let format = 'YYYYMMDD';
	let Feed = App.Models.Feed;
	let Employee = App.Models.employee;
	let feedType = 'anniversaries';
	let where = {feedType};
	let employeeData = [];

	date = moment(date, 'DD/MM/YYYY').format(format);	
	return Feed.find({where})
	.then(({feedData = {}}) => {
		employeeData =  _.chain(feedData)
				.filter((anniversary) => anniversary.startDate === date)
				.map((anniversary) => {
					return {
						name: anniversary.summary.split('(')[0].trim(),
						count: anniversary.summary.split('(')[1][0]
					};
				})
				.value();
		let employeeNames = _.map(employeeData, 'name');
		if (_.isEmpty(employeeNames)) {
			return [];
		}
		return Employee.findAllByName({employeeNames});
	})
	.then((employees) => {
		_.each(employees, (employee) => {
			employee.anniversaryCount = _.find(employeeData, (arg) => arg.name === employee.name).count;
		});
		return employees;
	});
};
module.exports.updateEmployeeDirectory = () => {
	let Employee = App.Models.employee;
	return Promise.try(() => {
		return Request.get(urlJoin(process.env.BAMBOO_API_URL, 'employees', 'directory'))
		.set('Accept', 'application/json')
		.auth(process.env.BAMBOO_API_KEY, 'x')
		.endAsync();
	}).then((response) => {
		let employees = _.map(response.body.employees, (employee) => {
			return {data: employee, employeeId: employee.id};
		});
		return App.Models.sequelize.transaction(function(transaction) {
			return Employee.destroy({truncate: true, transaction})
			.then(() => {
				return Employee.bulkCreate(employees, {transaction});
			});
		});
	});
};
