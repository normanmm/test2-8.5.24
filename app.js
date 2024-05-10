require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const fs= require('fs');

const routing = require('./routes/routing');

const PORT = process.env.PORT;
const logFile=process.env.LOG_FILE;

const app = express();
app.use('/client', express.static(path.join(__dirname, '../client')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./images')); // this statement for serving static files in express  needs to be defined here!; it doesn't work if defined at the beginning of routing.js. Images' src values in html pages are **relative to this folder**. See :	https://expressjs.com/en/starter/static-files.html

app.set('view engine','ejs');

//Use routing.js for all endpoints
app.use(routing);

// Routing for all other enpoints different than those explicitely defined in routing.js (not clear yet why it doesn't work when defined at the end of the routing file using the router object). Nottce that the next line is executed only if there is some endpoint different from those defined in routing.js
app.use((req,res)=>{
    res.send('This page does not exist!');
  });


mongoose
	.connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('MongoDB connection is established successfully! 🎉')
	})	

app.listen(PORT, function () {
	console.log(`🚀 Listening on port ${PORT}`);
	fs.writeFileSync(logFile,`${new Date().toLocaleString()}: Listening on port ${PORT}`+"\n",{flag: 'a+'});
})
