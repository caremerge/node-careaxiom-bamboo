let {Services} = require('../platform');

Services.storeBirthdayFeed().then(() => {
	console.log('birthay feed stored!');	
});
