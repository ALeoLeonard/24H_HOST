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
    console.log(slots)
    for (var s in slots) {
      if (slots[s].name) {
        console.log(slots[s]);
        var c = 'person';
        if (!slots[s].identifiers || slots[s].identifiers.length == 0) c+=' review';
        $('#people').append('<div id="'+slots[s].id+'" class="'+c+'">'+slots[s].time+' '+slots[s].name+'</div>');
        $('body').append('<a href="'+slots[s].song+'" id="'+slots[s].song+'">'+slots[s].song+'</a>');

      }
    }
    $('.person').click(startPerson);
  });


});

function startPerson() {
  var id = $(this).attr('id');
  if (slots[id].song) {
    if (curSongWindow) curSongWindow.location = slots[id].song;
    else curSongWindow = window.open(slots[id].song);
  }
}

// when someone arrives, welcome
// introduction to someone else
// offer drink
// every 5 minutes move them to someone else
// after 5 moves, escort them out

// some way to confirm person arrived
// receipt print on exit

// how many people there at a time?