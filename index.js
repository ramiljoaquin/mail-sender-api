const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const path = require('path');
const dotenv = require('dotenv');
const mailer = require('./Mailer');

const app = express();

dotenv.config();

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin");
  res.header("Access-Control-Allow-Origin", "*");
  next();
}

app.use(allowCrossDomain);

const port = process.env.PORT || 8080;

app.post('/api/form', (req, res) => {

  var name = req.body.name;
  var email = req.body.email;
  var html = req.body.html || '<b>Hello world?</b>'; // html body;

  res.setHeader('Content-Type', 'application/json');

  mailer({
    name: name,
    email: email,
    html: html // html body
  }).catch(err => {
      console.log(err);
      res.end(JSON.stringify({ success: false, status: 'failed' }))
  });

  res.end(JSON.stringify(({ name: name, email: email, success: true, status: 'success' })));
  
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});