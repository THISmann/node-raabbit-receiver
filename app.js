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

const express = require('express');
const lodash = require('lodash');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const qs = require('qs');

const app = express();
const port = 3000;

// Example of a vulnerable lodash usage (CVE-2021-23337)
const userInput = { prototype: { isAdmin: true } };
const merged = lodash.merge({}, userInput);
console.log('Merged object:', merged);

// Example of a vulnerable moment usage (CVE-2022-24785)
const date = moment().format('YYYY-MM-DD');
console.log('Current date:', date);

// Example of a vulnerable jsonwebtoken usage (CVE-2022-23529)
const token = jwt.sign({ user: 'admin' }, 'secret', { algorithm: 'none' });
console.log('JWT Token:', token);

// Example of a vulnerable axios usage (CVE-2021-3749)
axios.get('http://example.com', {
  params: {
    q: qs.parse('foo=bar&baz=qux')
  }
}).then(response => {
  console.log('Axios response:', response.data);
}).catch(error => {
  console.error('Axios error:', error);
});

// Example of a vulnerable express usage (CVE-2022-24999)
app.get('/', (req, res) => {
  res.send('Hello, this is a vulnerable app!');
});

app.listen(port, () => {
  console.log(`Vulnerable app listening at http://localhost:${port}`);
});