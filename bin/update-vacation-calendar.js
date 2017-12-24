let {Services} = require('../platform');
Services.Google.Calendar.updateCalendar().then(() => {
	console.log('vacation calendar updated');	
}).catch((error) => {
	console.log(error, 'error while updating vacation calenar');
});
