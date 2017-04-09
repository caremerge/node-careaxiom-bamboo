process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if (process.env.NODE_ENV === 'development') {
	require('dotenv').config();
}
let Services = require('./services');
let Models = require('./models');

App = {Services, Models};
module.exports = App;