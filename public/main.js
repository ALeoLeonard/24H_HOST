$(document).ready(function() { 

  $('#twSignup').click(twSignup);
  $('#fbSignup').click(fbSignup);
  $('#findSlots').click(function() { 
    $('#timeslots').html('<p>Choose one:</p>');
    findSlots($('#desiredSlot').val()).then(function(slots) {    
      for (var s in slots) {
        var h = parseInt(slots[s].time.substring(0, 2));
        var date = h >= startHour ? 'Saturday 28 October' : 'Sunday 29 October';
        $('#timeslots').append('<span class="slot button" data-slotid="'+slots[s].id+'">'+slots[s].time+' '+date+'</span><br>');
      }
      $('.slot').click(function() {
        $('.slot').removeClass('selectedSlot');
        $(this).addClass('selectedSlot');
        $('#register').show();
      });
    });
  });

  $('#register').click(function() {
    var name = $('#name').val();
    var email = $('#email').val();
    if ($('.slot.selectedSlot').length === 0) {
      alert('Please select a slot');
    } else if (!name) {
      alert('Please enter your name');
    } else if (!email) {
      alert('Please enter your email');
    } else {
      var id = $('.slot.selectedSlot')[0].getAttribute('data-slotid');
      selectSlot(id, name, email, data);
    }
  })

});

var data = {};

// Initialize Firebase
firebase.initializeApp(config);
firebase.auth().languageCode = 'en_EN';
firebase.auth().signInAnonymously().catch(function(error) {
  console.log(error);
});


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


    $.getJSON('https://us-central1-host-24hour.cloudfunctions.net/twSignup?user='+user, function(data) {
      data = data;
      $('#signup').hide();
      $('#form').show();
    });

  }).catch(function(error) { console.log(error); });
}

function fbSignup() {
  FB.login(function(){
    FB.api('/me/posts', function(posts) {
      data = posts;
    });
    FB.api('/me', {fields: ['name', 'email']}, function(data) {
      $('#name').val(data.name);
      $('#email').val(data.email);
    });
    $('#signup').hide();
    $('#form').show();
  });
}

function tryAgain() {
  alert('Oh no! That slot was just taken! Please select a new one.');
  $('#findSlots').click();
}

function completeRegistration(email, id) {
  $('#form').hide();

  var time = $('.slot.selectedSlot')[0].innerHTML;
  var h = parseInt(time.substring(0, 2));
  var date = h >= startHour ? 'Saturday 28 October' : 'Sunday 29 October';
  $('#regTime').text(time);
  $('#regDate').text(date);
  $('#regCancel').attr('href', 'http://24hour.host/public/cancel.html?email='+email+'&id='+id);
  $('#thankyou').show();

  // send email
}