const Google = require('googleapis');
const Promise = require('bluebird');
const moment = require('moment');
const crypto = require('crypto');
const url = require('url');
const redis = require('redis');
const OAuth = require('./oauth');
const EventsAPI = Promise.promisifyAll(Google.calendar('v3').events);
const getRedisConnection = (redisURL) => {
	const urlObj = url.parse(redisURL);
	const host = urlObj.hostname;
	const port = urlObj.port;
	const password = urlObj.auth.split(':')[1];
	return {host, port, password};
};
const getRedisClient = async ({host, password, port}) => {
	const client = Promise.promisifyAll(redis.createClient(port, host, {
		no_ready_check: true,
		password: password
	}));
	client.auth(password);
	return client;
};
const redisOps = async (operations, client) => {
	await operations();
	client.quit();
};
const updateCalendar = async () => {
	const getDate = (src = moment()) => moment(src, 'YYYYMMDD');
	const format = (src = moment()) => src.format('YYYY-MM-DDTHH:mm:ssZ');
	const createCalendarEntry = async({startDate, endDate, summary}, auth) => {
		const start = {dateTime: format(getDate(startDate)), timeZone: 'Asia/Karachi'};
		const end = {dateTime: format(getDate(endDate)), timeZone: 'Asia/Karachi'};
		const calendarId = process.env.VACATION_CALENDAR_ID;
		const resource = {summary: summary, start, end};
		return await EventsAPI.insertAsync({calendarId, auth, resource});
	};
	const getKey = ({startDate, endDate, summary}) => {
		return crypto
		.createHash('md5')
		.update(`${startDate}:${endDate}:${summary}`)
		.digest('hex');
	};
	const existsKey = async (client, key) => {
		const result = await client.getAsync(key);
		return result;
	};
	const setKey = async (client, key) => {
		await client.setAsync(key, '1');
	};
	const feed = await App.Models.Feed.find({
		where: {feedType: 'whoisout'}
	});
	const auth = await OAuth.getClientWithCredentials();
	const redisClient = await getRedisClient(getRedisConnection(process.env.REDIS_URL));
	await redisOps(async () => {
		await Promise.map(feed.feedData, async (feedData) => {
			const exists = await existsKey(redisClient, getKey(feedData));
			if (exists) {
				console.log('calendar entry already exists with data: ', feedData);
				return;
			}
			await createCalendarEntry(feedData, auth);
			console.log('calendar entry created with data: ', feedData);
			await setKey(redisClient, getKey(feedData));
			console.log(`key ${getKey(feedData)} created for data: `, feedData);
		});
	}, redisClient);
};
module.exports = {updateCalendar};
