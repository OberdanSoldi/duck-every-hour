const { TwitterApi, EUploadMimeType } = require('twitter-api-v2');
const axios = require('axios');
require('dotenv').config();

function getDuckBuffer() {
	const imageUrl = "https://random-d.uk/api/v2/random";
	return axios.get(imageUrl).then(response => {
		const url = response.data.url;
		return axios.get(url, { responseType: 'arraybuffer' }).then(response => {
			return Buffer.from(response.data, 'binary');	
		});
	})
}

const userClient = new TwitterApi({
	appKey: process.env.APPKEY,
	appSecret: process.env.APPSECRET,
	accessToken: process.env.ACCESSTOKEN,
	accessSecret: process.env.ACCESSSECRET
});

const tweet = async () => {
	const imageData = await getDuckBuffer();
	const mediaID = await userClient.v1.uploadMedia(imageData, { mimeType: EUploadMimeType.Jpeg });
	userClient.v1.tweet('', { media_ids: [mediaID] }).then(response => {
		process.abort();
	});
};

module.exports = tweet;
