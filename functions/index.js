'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const nodemailer = require('nodemailer');
const Twitter = require('twitter');

// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

const APP_NAME = '24H HOST';



exports.complete = functions.https.onRequest((req, res) => {

  res.header('Content-Type','application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  console.log(req.query)
  var name = req.query.name;
  var email = req.query.email;
  var time = req.query.time;
  var id = req.query.id;

  var hour = parseInt(time.substring(0, 2));
  var date = hour >= 14 ? 'Saturday 28 October' : 'Sunday 29 October';
  var msg = 'Hi '+name+',<br><br>You are confirmed to attend at '+time+' on '+date+'. You must be on time to enter.';
  msg += ' The 24H HOST awaits your arrival.';
  msg += ' You will receive one more reminder email the day of the event.';
  msg += ' To cancel your reservation <a href="http://24hour.host/public/cancel.html?email='+email+'&id='+id+'">click here</a>.';

  sendReminderEmail(email, msg);
  res.status(200).send('');
});

exports.twSignup = functions.https.onRequest((req, res) => {
  res.header('Content-Type','application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');


  var user = req.query.user;
  var token = req.query.token;
  var secret = req.query.secret;
  console.log(user);

  var twitter = new Twitter({
    consumer_key: functions.config().twitter.consumer_key,
    consumer_secret: functions.config().twitter.consumer_secret,
    access_token_key: token,
    access_token_secret: secret
  });

  var params = {screen_name: user};
  twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      res.json(tweets);
    } else res.json({});
  });

});

exports.reminder = functions.https.onRequest((req, res) => {
  res.header('Content-Type','application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  admin.database().ref('slots').once('value').then(function(snapshot) {
    for (var s in snapshot.val()) {
      var result = snapshot.val()[s];
      if (result.email) {
        var hour = parseInt(result.time.substring(0, 2));
        var date = hour >= 14 ? 'Saturday 28 October' : 'Sunday 29 October';
        var msg = 'Hi '+result.name+',<br><br>This is a reminder that you are confirmed to attend at '+result.time+' on '+date+'. You must be on time to enter.';
        msg += ' The 24H HOST awaits your arrival.';
        msg += ' You will receive one more reminder email the day of the event.';
        msg += ' To cancel your reservation <a href="http://24hour.host/public/cancel.html?email='+result.email+'&id='+result.id+'">click here</a>.';

        sendReminderEmail(result.email, msg);
      }
    }
    res.status(200).send('');
  });
});

// Sends a goodbye email to the given user.
function sendReminderEmail(email, msg) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email
  };

  // The user unsubscribed to the newsletter.
  mailOptions.subject = `Your 24H HOST reservation`;
  mailOptions.html = msg;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('Reservation confirmation email sent to:', email);
  });
}
