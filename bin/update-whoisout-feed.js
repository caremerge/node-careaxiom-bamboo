let {Services} = require('../platform');
Services.storeWhoIsOutFeed().then(() => {
	console.log('who-is-out feed updated!');	
}).catch((error) => {
	console.log(error, 'error while updating who-is-out feed');
});
