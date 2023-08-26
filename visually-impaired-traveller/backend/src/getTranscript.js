
const keys = require('../key.json')
const speech = require('@google-cloud/speech');
const fs = require('fs');

const client = new speech.SpeechClient(keys);

module.exports = async function (url) {
    const filePath = url;
    const audio = {
        content: fs.readFileSync(filePath).toString('base64'),
    };
    const config = {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 16000,
        languageCode: 'en-IN',
    };
    const request = {
        audio: audio,
        config: config,
    };

    const [response] = await client.recognize(request);

    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('');
    console.log(`Transcription: ${transcription}`);
    return transcription;
};