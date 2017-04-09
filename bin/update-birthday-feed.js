let {Services} = require('../platform');
Services.storeBirthdayFeed().then(() => {
	console.log('birthay feed updated!');	
}).catch((error) => {
	console.log(error, 'error while updating birthday feed');
});
