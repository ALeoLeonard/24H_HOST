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
        if (!slots[s].identifiers || slots[s].identifiers.length == 0) c+=' review';
        $('#people').append('<div id="'+slots[s].id+'" class="'+c+'">'+slots[s].time+' '+slots[s].name+'</div>');

      }
    }
    $('.person').click(openPerson);
  });

  $('#saveIdentifiers').click(saveIdentifiers);

});

function openPerson() {
  var id = $(this).attr('id');
  curId = id;

  $('#personData').html('');
  for (var d in slots[id].data) {
    var m = '';
    if (slots[id].data[d].message) {
      m += slots[id].data[d].message;
    }
    if (slots[id].data[d].story) {
      m += ' ('+slots[id].data[d].story+')';
    }
    $('#personData').append('<div>'+m+'</div>');

    $('#personIdentifiers').html('');
    for (var i in slots[id].identifiers) {
      $('#personIdentifiers').append(slots[id].identifiers+'\n');
    }
  }
  console.log(slots[id]);
}

function closePerson() {
  $('#personData').html('');
  $('#personIdentifiers').val('');
  curId = null;
}

function saveIdentifiers() {
  slots[curId].identifiers = $('#personIdentifiers').val().split('\n');
  updateSlot(curId, slots[curId]);
  closePerson();
}
