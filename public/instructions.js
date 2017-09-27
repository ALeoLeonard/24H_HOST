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
  if (p.status === 'here') {
    p.intros = [];
    people.push(p);
  }
  p.class = p.id.substr(4, 7);
  var htmlOutput = $.templates('#personTmpl').render(p);
  delete p.class;
  $("#people").append(htmlOutput);
}

function startPerson() {
  var id = $(this).parent().attr('id');
  $(this).parent().find('.button').removeClass('selected');
  $(this).addClass('selected');

  slots[id].intros = [];

  // add hello line
  var msg = 'hello '+slots[id].name+'! thanks for coming';
  addLine({a: slots[id].name, msg: msg});

  // add drink line
  var drinkMsg = 'would you like a drink? you look like a '+slots[id].drink+' type of person';
  setTimeout(function() { addLine({a: slots[id].name, msg: drinkMsg}); }, 2000);

  // schedule intros
  slots[id].timeouts = [];
  for (var i=0; i<4; i++) { // every 5 minutes
    slots[id].timeouts.push(setTimeout(function() { introPerson(slots[id]); }, 3000 + i * 1 * 60 * 1000));
  }

  // schedule exit
  setTimeout(function() { endPerson(slots[id]); }, 20 * 60 * 1000);

  // add person to array of people in room
  people.push(slots[id]);

  // update data
  updatePersonStatus(id, 'here', new Date().addMinutes(20));

}

function endPerson(val) {
  var elt;

  if (typeof val === 'string') { // timer
    elt = $('#'+val).find('left');
  } else { // mouse click
    elt = $(this);
  }

  // update interface
  var id = elt.parent().attr('id');
  elt.parent().find('.button').removeClass('selected');
  elt.addClass('selected');

  // remove person from array of people in room
  people = people.filter(function(el) { return el.id !== id; });

  // clear remaining intros
  for (var t in slots[id].timeouts) {
    clearTimeout(slots[id].timeouts[t]);
  }

  // print receipt
  // @TODO

  // add goodbye line
  var msg = 'goodbye '+slots[id].name;
  addLine({a: slots[id].name, msg: msg});

  // update data
  updatePersonStatus(id, 'left', new Date());
}

function noshowPerson() {
  var id = $(this).parent().attr('id');
  $(this).parent().find('.button').removeClass('selected');
  $(this).addClass('selected');
  updatePersonStatus(id, 'noshow');
}

function introPerson(personA) {
  if (!personA) {
    personA = pickPerson();
  }
  personB = pickPerson(personA);

  if (personA && personB) {
    personA.intros.push(personB.id);
    personB.intros.push(personA.id);

    console.log(people);

    // craft message
    var introMsg = personA.name+' I would like to introduce you to '+personB.name;
    addLine({intro: true, a: personA.name, b: personB.name});
    setTimeout(function() {
      addLine({a: personA.name, b: personB.name, msg: introMsg});
    }, 3000);
  }
}

function pickPerson(firstPerson) {
  people = shuffle(people);
  for (p in people) {
    if (!firstPerson && people[p].id !== firstPerson.id) return people[p];
    if (!alreadyIntroduced(firstPerson, people[p])) {
      return people[p];
    }
  }
  return false;
}

function updatePersonStatus(id, status, leaveTime) {
  slots[id].status=status;
  slots[id].leaveTime = leaveTime;
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
  data.time = new Date().toString('HH:mm');
  var htmlOutput = $.templates('#lineTmpl').render(data);
  $('#lines').prepend(htmlOutput);
  if ($('.line').length > 10) {
    $('.line').last().remove();
  }
}


function alreadyIntroduced(personA, personB) {
  if (!personA.intros || !personB.intros) return false;
  return $.inArray(personB.id, personA.intros) !== -1;
}


function shuffle(arr) {
  var collection = arr,
      len = arr.length,
      random,
      temp;

  while (len) {
    random = Math.floor(Math.random() * len);
    len -= 1;
    temp = collection[len];
    collection[len] = collection[random];
    collection[random] = temp;
  }
  return collection;
};


// every 5 minutes move them to someone else
// after 5 moves, escort them out

// receipt print on exit

// how many people there at a time?


// pers