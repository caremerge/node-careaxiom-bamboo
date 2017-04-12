let {Services} = require('../platform');
Services.storeAnniversaryFeed().then(() => {
	console.log('anniversary feed updated!');	
}).catch((error) => {
	console.log(error, 'error while updating anniversary feed');
});
