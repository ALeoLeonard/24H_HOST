// Initialize Firebase
firebase.initializeApp(config);
firebase.auth().languageCode = 'en_EN';
firebase.auth().signInAnonymously().catch(function(error) {
  console.log(error);
});

var slots;
var curId;
var curSongWindow, lastSongWindow;

$(document).ready(function() {

  getAllSlots().then(function(s) {
    slots = s;
    for (var p in slots) {
      slots[p].class = slots[p].id.substr(4, 7);
      addToSchedule(slots[p]);
    }
    $('.personHere').click(startPerson);
    // $('.personLeft').click(personLeft);
    // $('.personNoshow').click(personNoshow);

    scrollToNow();
    setInterval(scrollToNow, 60*1000);
  });

});

function addToSchedule(p) {
  console.log(p);

  var htmlOutput = $.templates('#personTmpl').render(p);
  $("#people").append(htmlOutput);
}

function startPerson() {
  var id = $(this).parent().attr('id');
  $(this).addClass('selected');

  // start song
  if (slots[id].song) {
    if (curSongWindow) curSongWindow.location = slots[id].song;
    else curSongWindow = window.open(slots[id].song);
  }

  // add hello line

  // add drink line

  // add intro line
}

function scrollToNow() {
  $('.person').removeClass('nowPerson');
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var m = (parseInt((minutes + 7.5)/15) * 15) % 60;
  var h = minutes > 52 ? (hours === 23 ? 0 : ++hours) : hours;
  var str = '.'+h.toString().padStart(2, '0') + '_' + m.toString().padStart(2, '0');
  $(document).scrollTop( $(str).offset().top );
  $(str).addClass('nowPerson');
}


// when someone arrives, welcome
// introduction to someone else
// offer drink
// every 5 minutes move them to someone else
// after 5 moves, escort them out

// some way to confirm person arrived
// receipt print on exit

// how many people there at a time?


// pers