let {Services} = require('../platform');
Services.updateEmployeeDirectory().then(() => {
	console.log('employee directory updated!');	
}).catch((error) => {
	console.log(error, 'error while updating employee directory');
});
