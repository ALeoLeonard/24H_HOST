'use strict';

const functions = require('firebase-functions');
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

var twitter = new Twitter({
  consumer_key: functions.config().twitter.consumer_key,
  consumer_secret: functions.config().twitter.consumer_secret,
  access_token_key: functions.config().twitter.access_token_key,
  access_token_secret: functions.config().twitter.access_token_secret
});

const APP_NAME = '24H HOST';


exports.databaseChanged = functions.database.ref('slots').onWrite(event => {
  const original = event.data.val();
  console.log(original);

  var res;
  for (var s in event.data.val()) {
    if (event.data.child(s).changed('name')) {
      res = event.data.val()[s];
      break;
    }
  }

  if (res) {
    var hour = parseInt(res.time.substring(0, 2));
    var date = hour >= 14 ? 'Saturday 28 October' : 'Sunday 29 October';
    var msg = 'You are confirmed to attend at '+res.time+' on '+date+'. You must be on time to enter. The 24H HOST awaits your arrival.';
    msg += ' You will receive one more reminder email the day of the event.';
    msg += ' To cancel your reservation <a href="http://24hour.host/public/cancel.html?email='+res.email+'&id='+res.id+'">click here</a>.';

    sendConfirmationEmail(res.email, res.name, msg);
  }
});

exports.twSignup = functions.https.onRequest((req, res) => {
  res.header('Content-Type','application/json');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');


  var user = req.query.user;
  console.log(user);


  var params = {screen_name: user};
  twitter.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      console.log(tweets);
      res.json(tweets);
    } else res.json({});
  });

});



// Sends a goodbye email to the given user.
function sendConfirmationEmail(email, displayName, msg) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email
  };

  // The user unsubscribed to the newsletter.
  mailOptions.subject = `Your 24H HOST reservation`;
  mailOptions.html = `Hi ${displayName || ''}, `+msg;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('Reservation confirmation email sent to:', email);
  });
}
