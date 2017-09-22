// Initialize Firebase
firebase.initializeApp(config);
firebase.auth().languageCode = 'en_EN';
firebase.auth().signInAnonymously().catch(function(error) {
  console.log(error);
});

var slots;
var curId;

$(document).ready(function() {

  getAllSlots().then(function(s) {
    slots = s;
    console.log(slots)
    for (var s in slots) {
      if (slots[s].name) {
        console.log(slots[s]);
        var c = 'person';
        if (!slots[s].identifiers || slots[s].identifiers.length == 0) c+=' needsIdentifiers';
        if (!slots[s].song) c+=' needsSong';
        $('#people').append('<div id="'+slots[s].id+'" class="'+c+'">'+slots[s].time+' '+slots[s].name+'</div>');

      }
    }
    $('.person').click(openPerson);
  });

  $('#saveIdentifiers').click(saveIdentifiers);

});

function openPerson() {
  var id = $(this).attr('id');
  if (curId === id) {
    closePerson()
  } else {
    curId = id;

    $('#personData').html('');
    for (var d in slots[id].data) {
      var m = '';
      if (slots[id].dataType === 'fb') {
        if (slots[id].data[d].message) {
          m += slots[id].data[d].message;
        }
        if (slots[id].data[d].story) {
          m += ' ('+slots[id].data[d].story+')';
        }
      } else {
        if (slots[id].data[d].text) {
          m += slots[id].data[d].text;
        }
        if (slots[id].data[d].favorite_count) {
          m += ' (fav: '+slots[id].data[d].favorite_count+')';
        }
      }
      if (m) $('#personData').append('<div>'+m+'</div>');

      $('#personIdentifiers').html('');
      for (var i in slots[id].identifiers) {
        $('#personIdentifiers').append(slots[id].identifiers[i]+'\n');
      }
      $('#personSong').html(slots[id].song);
    }
  }
}

function closePerson() {
  $('#personData').html('');
  $('#personIdentifiers').val('');
  curId = null;
}

function saveIdentifiers() {
  var identifiers = $('#personIdentifiers').val();
  slots[curId].identifiers = identifiers ? identifiers.split('\n') : null;
  var song = $('#personSong').val();
  slots[curId].song = song ? song : null;
  updateSlot(curId, slots[curId]);
  if (identifiers) {
    $('#'+curId).removeClass('needsIdentifiers');
    console.log('remove needsIdentifiers');
  }
  console.log(song, '#'+curId);
  if (song) {
    console.log('remove needsSong');
    $('#'+curId).removeClass('needsSong');
  }
  closePerson();
}
