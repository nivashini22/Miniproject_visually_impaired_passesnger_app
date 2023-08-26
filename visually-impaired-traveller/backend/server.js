process.env.GOOGLE_APPLICATION_CREDENTIALS = `${__dirname}\\key.json`;
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();

app.use(bodyParser.json({ limit: "100mb" }));

const getTranscript = require("./src/getTranscript");

let latestResult = "";

app.get("/", (req, res) => {
	res.json({ success: true, latestResult });
});

// Voice to text
app.post("/", async (req, res) => {
	let file = req.body.data;
	const directory = "./storage/";
	const filename = new Date().getTime();
	const fileurl = directory + filename + ".mp3";
	fs.writeFileSync(
		fileurl,
		Buffer.from(file.replace("data:audio/mpeg;base64,", ""), "base64")
	);
	const transcript = await getTranscript(
		`${__dirname}\\storage\\${filename}.mp3`
	);
	// const transcript = '10'
	latestResult = transcript;
	res.json({ success: true, transcript, filename });
});

// Booking ticket
app.post('/book', async (req, res) => {
	console.log(req.body);
	const directory = "./db/";
	const filename = 'db.json';
	const fileurl = directory + filename;
	const jsonData = fs.readFileSync(fileurl);
	const existingData = JSON.parse(jsonData);
	req.body.data.id = existingData.length + 1;
	existingData.push(req.body.data);
	fs.writeFileSync(
		fileurl,
		JSON.stringify(existingData)
	);
	res.json({ success: true })
})


// Get all bookings
app.get('/bookings', async (req, res) => {
	const directory = "./db/";
	const filename = 'db.json';
	const fileurl = directory + filename;
	const jsonData = fs.readFileSync(fileurl);
	const existingData = JSON.parse(jsonData);
	existingData.sort(function (a, b) {	
		const aParts = a.date.split('/');
		const bParts = b.date.split('/');
		a = aParts[1] + '/' + aParts[0] + '/' + aParts[2];
		b = bParts[1] + '/' + bParts[0] + '/' + bParts[2];
		return new Date(a).getTime() - new Date(b).getTime();
	});
	existingData.map(val => {
		const valParts = val.date.split('/');
		const newDate = valParts[1] + '/' + valParts[0] + '/' + valParts[2];
		if (new Date(newDate) < new Date()) {
			val.status = 'PASSED';
		}
	})
	res.json({ success: true, data: existingData })
})

// Cancel a ticket
app.post('/bookings/cancel', async (req, res) => {
	console.log(req.body);
	const directory = "./db/";
	const filename = 'db.json';
	const fileurl = directory + filename;
	const jsonData = fs.readFileSync(fileurl);
	const existingData = JSON.parse(jsonData);
	const id = req.body.data.id - 1;
	console.log('existingData[id] ', existingData[id])
	existingData[id].status = 'CANCELLED';
	fs.writeFileSync(
		fileurl,
		JSON.stringify(existingData)
	);
	res.json({ success: true })
})

app.listen(9000, () => {
	console.log(`Example app listening on port 9000`);
});
