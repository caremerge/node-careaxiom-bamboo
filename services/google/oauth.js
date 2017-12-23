const _ = require('lodash');
const Promise = require('bluebird');
const GoogleAuth = require('google-auth-library');
const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(null);
const readClientSecret = async () => {
	const s3 = new AWS.S3();
	try {
		const params = {
			Bucket: process.env.AWS_BUCKET,
			Key: 'careaxiom-bamboo/client-secret.json'
		};
		const {Body} = await s3.getObject(params).promise();
		return JSON.parse(Body);
	} catch (error) {
		console.error(error.stack);
		throw error;
	}
};
const getRedirectURI = (redirectURIs) => {
	if (redirectURIs.length === 1) {
		return _.first(redirectURIs);
	}
	if (process.env.NODE_ENV === 'development') {
		return redirectURIs[0];
	}
	return redirectURIs[1];
};
const getClient = async (credentialFunction = async () => {}) => {
	const {web} = await readClientSecret();
	const redirectUri = getRedirectURI(web.redirect_uris);
	const auth = new GoogleAuth();
	const client = Promise.promisifyAll(new auth.OAuth2(web.client_id, web.client_secret, redirectUri));
	client.credentials = await credentialFunction();
	return client;
};
const getCredentials = async () => {
	const s3 = new AWS.S3();
	const objects = await s3.listObjects({Bucket: process.env.AWS_BUCKET, Prefix: 'credentials.json'}).promise();
	if (_.isEmpty(objects)) {
		throw new Error('you must authenticate the app first. no credentials are stored in the system.');
	}
	const {Body} = await s3.getObject({Bucket: process.env.AWS_BUCKET, Key: 'careaxiom-bamboo/credentials.json'}).promise();
	return JSON.parse(Body);
};

const getClientWithCredentials = () => getClient(getCredentials);
const storeToken = async (token) => {
	const s3 = new AWS.S3();
	await s3.putObject({
		Bucket: process.env.AWS_BUCKET,
		Key: 'careaxiom-bamboo/credentials.json',
		Body: JSON.stringify(token)
	}).promise();
};
const getToken = async ({code}) => {
	const client = await getClient();
	const token = await client.getTokenAsync(code);
	return token;
};
const authenticate = async () => {	
	const client = await getClient();
	const oauthUrl = client.generateAuthUrl({
		access_type: 'offline',
		scope: ['https://www.googleapis.com/auth/calendar']
	});
	return oauthUrl;
};
const redirect = async ({code}) => {
	const token = await getToken({code});
	console.log('storing token in S3');
	await storeToken(token);
};
module.exports = {authenticate, redirect, getClientWithCredentials};