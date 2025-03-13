const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');
const request = require('request');

const app = express();
app.use(express.json());

// Example of an insecure API endpoint using lodash
app.get('/unsafe', (req, res) => {
    let arr = [1, 2, 3, 4];
    let result = _.shuffle(arr); // Vulnerable code (older lodash)
    res.json(result);
});

// Example of an insecure API endpoint using moment
app.get('/date', (req, res) => {
    let date = moment().add(2, 'days'); // Vulnerable code (older moment)
    res.json({ date: date.format('YYYY-MM-DD') });
});

// Example of a vulnerable mongoose connection
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

// Example of an insecure request to an external server
app.get('/external', (req, res) => {
    request('http://example.com', (error, response, body) => {
        if (error) {
            res.status(500).send('External request failed');
            return;
        }
        res.send(body);
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
