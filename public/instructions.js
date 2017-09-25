// Initialize Firebase
firebase.initializeApp(config);
firebase.auth().languageCode = 'en_EN';
firebase.auth().signInAnonymously().catch(function(error) {
  console.log(error);
});

var slots;
var people;
var curSongWindow;

$(document).ready(function() {

  getAllSlots().then(function(s) {
    slots = s;
    for (var p in slots) {
      addToSchedule(slots[p]);
    }
    $('.personHere').click(startPerson);
    $('.personLeft').click(endPerson);
    $('.personNoshow').click(noshowPerson);

    scrollToNow();
    setInterval(scrollToNow, 60*1000);
  });

  getRoomPeople().then(function(p) {
    people = p || [];
  });

});

function addToSchedule(p) {
  p.class = p.id.substr(4, 7);
  var htmlOutput = $.templates('#personTmpl').render(p);
  delete p.class;
  $("#people").append(htmlOutput);
}

function startPerson() {
  var id = $(this).parent().attr('id');
  $(this).addClass('selected');
  $(this).parent().find('.personNoshow').removeClass('selected');

  // start song
  if (slots[id].song) {
    if (curSongWindow) curSongWindow.location = slots[id].song;
    else curSongWindow = window.open(slots[id].song);
  }

  // add hello line

  // add drink line

  // add intro line

  // update data
  updatePersonStatus(id, 'here');
  
  // add person to array of people in room
  people.push(slots[id]);
  updateRoomPeople(people);

}

function endPerson() {
  var id = $(this).parent().attr('id');
  $(this).addClass('selected');
  $(this).parent().find('.personHere').removeClass('selected');

  // print receipt

  // add goodbye line

  // remove person from array of people in room
  people = people.filter(function(el) { return el.id !== id; });
  updateRoomPeople(people);

  // update data
  updatePersonStatus(id, 'left');
}

function noshowPerson() {
  var id = $(this).parent().attr('id');
  $(this).addClass('selected');
  updatePersonStatus(id, 'noshow');
}

function updatePersonStatus(id, status) {
  slots[id].status=status;
  updateSlot(id, slots[id]);
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