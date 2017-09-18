$(document).ready(function() { 

  $('#twSignup').click(twSignup);
  $('#fbSignup').click(fbSignup);
  $('#findSlots').click(function() { findSlots($('#desiredSlot').val()); });

});

var data = {};

// Initialize Firebase
firebase.initializeApp(config);
firebase.auth().languageCode = 'en_EN';


var database = firebase.database();

window.fbAsyncInit = function() {
  FB.init({
    appId            : config.fb_appId,
    autoLogAppEvents : true,
    xfbml            : true,
    version          : 'v2.10'
  });
  FB.AppEvents.logPageView();
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));



function twSignup() {

  var twProvider = new firebase.auth.TwitterAuthProvider();
  twProvider.setCustomParameters({
    'lang': 'en'
  });

  firebase.auth().signInWithPopup(twProvider).then(function(result) {
    // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
    // You can use these server side with your app's credentials to access the Twitter API.
    var token = result.credential.accessToken;
    var secret = result.credential.secret;
    // The signed-in user info.
    var user = result.user;


    var Twitter = require('twitter');

    var client = new Twitter({
      consumer_key: '',
      consumer_secret: '',
      access_token_key: '',
      access_token_secret: ''
    });

    var params = {screen_name: 'nodejs'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        console.log(tweets);
      }
    });

    $('#twSignup').hide();
  }).catch(function(error) { console.log(error); });
}

function fbSignup() {
  FB.login(function(){
    FB.api('/me/posts', function(posts) {
      data.fb = posts;
    });
    FB.api('/me', {fields: ['name', 'email']}, function(data) {
      $('#name').val(data.name);
      $('#email').val(data.email);
    });
    $('#fbSignup').hide();
  });
}