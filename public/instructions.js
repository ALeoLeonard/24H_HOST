// Initialize Firebase
firebase.initializeApp(config);
firebase.auth().languageCode = 'en_EN';
firebase.auth().signInAnonymously().catch(function(error) {
  console.log(error);
});

var slots;
var people = [];
var curSongWindow;

$(document).ready(function() {

  getAllSlots().then(function(data) {
    slots = data;
    for (var p in slots) {
      addToSchedule(slots[p]);
    }
    $('.personHere').click(startPerson);
    $('.personLeft').click(endPerson);
    $('.personNoshow').click(noshowPerson);

    scrollToNow();
    setInterval(scrollToNow, 60*1000);
    console.log(people.length + ' people in the room')
  });

});

function addToSchedule(p) {
  if (p.status === 'here') people.push(p);
  p.class = p.id.substr(4, 7);
  var htmlOutput = $.templates('#personTmpl').render(p);
  delete p.class;
  $("#people").append(htmlOutput);
}

function startPerson() {
  var id = $(this).parent().attr('id');
  $(this).parent().find('.button').removeClass('selected');
  $(this).addClass('selected');

  // start song
  if (slots[id].song) {
    if (curSongWindow) curSongWindow.location = slots[id].song;
    else curSongWindow = window.open(slots[id].song);
  }

  // add hello line
  var msg = 'hello '+slots[id].name+'! thanks for coming';
  addLine({to: slots[id].name, msg: msg});

  // add drink line
  var drinkMsg = 'would you like a drink? you look like a '+slots[id].drink+' type of person';
  setTimeout(function() { addLine({to: slots[id].name, msg: drinkMsg}); }, 2000);

  // add intro line
  setTimeout(function() { introPerson(id); }, 3000);

  // add person to array of people in room
  people.push(slots[id]);

  // update data
  updatePersonStatus(id, 'here');

}

function endPerson() {
  var id = $(this).parent().attr('id');
  $(this).parent().find('.button').removeClass('selected');
  $(this).addClass('selected');

  // print receipt

  // add goodbye line

  // remove person from array of people in room
  people = people.filter(function(el) { return el.id !== id; });

  // update data
  updatePersonStatus(id, 'left');
}

function noshowPerson() {
  var id = $(this).parent().attr('id');
  $(this).parent().find('.button').removeClass('selected');
  $(this).addClass('selected');
  updatePersonStatus(id, 'noshow');
}

function introPerson(personA) {
  // pick person b

  // craft message
  var introMsg = 'I would like to introduce you to ';
  addLine({intro: true, to: slots[id].name, next: 'blah'});
  addLine({to: slots[id].name, msg: introMsg});
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
  $('#people').scrollTop( $(str).offset().top - $('#people').offset().top - 10 );
  $(str).addClass('nowPerson');
}

function addLine(data) {
  var htmlOutput = $.templates('#lineTmpl').render(data);
  $('#lines').prepend(htmlOutput);
  if ($('.line').length > 10) {
    $('.line').last().remove();
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


// pers