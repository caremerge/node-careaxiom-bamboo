const express = require('express');
const router = express.Router();

router.get('/authenticate', async (req, res) => {
	try {
		const oauthUrl = await App.Services.Google.OAuth.authenticate();
		res.redirect(oauthUrl);
	} catch(error) {
		res.status(500).json(error.stack);
	}
});
router.get('/authenticate/redirect', async (req, res) => {
	try {
		await App.Services.Google.OAuth.redirect({code: req.query.code});
		res.status(200).end();
	} catch(error) {
		res.status(500).json(error.stack);
	}
});
module.exports = router;