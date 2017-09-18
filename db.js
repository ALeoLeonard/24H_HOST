//deleteSlots();
//updateSlots();

var startHour = 14;

function updateSlots() {
  var slotMins = 15;
  var numSlots = 24 * 60 / slotMins;
  var slotId = 0;

  var slotDate = Date.parse('2017-10-28T14:00:00');

  while (slotId < numSlots) {
    firebase.database().ref('slots/' + pad(slotId, 3)+'_'+slotDate.toString('HH:mm')).set({
      time: slotDate.toString('HH:mm'),
      minOffset: slotMins * slotId,
      name: null,
      email: null,
      photo : null
    });
    slotDate.add({ minutes: slotMins});
    slotId++;
  }
}

function deleteSlots() {
  firebase.database().ref('slots').remove();
}

function getAllSlots() {
  return new Promise(function(resolve, reject) {
    firebase.database().ref('slots').once('value').then(function(snapshot) {
      var array = $.map(snapshot.val(), function(value, index) { return value; });
      resolve(array);
    });
  });
}

function findSlots(time) {
  var parsedTime = Date.parse(time);
  if (!parsedTime && time.length > 0) {
    alert('Please enter a desired time in the format HH:mm');
  } else {
    getAllSlots().then(function(slots) {
      var options = [];
      if (!parsedTime) {
        var opts = findSlotsNear(slots, 0);
        options = options.concat(opts);
        options = options.concat(findSlotsNear(slots, opts[0].minOffset + 120));
      } else {
        var mins = (parsedTime.getHours() - startHour) * 60 + parsedTime.getMinutes();
        if (parsedTime.getHours() < startHour) {
          mins += 24 * 60;
          console.log('next day');
        }
        options = findSlotsNear(slots, mins);
      }
      while (options.length > 3) {
        options.splice(Math.floor(Math.random()*options.length), 1);
        console.log(options);
      }
      console.log(options);
    });
  }
}

function findSlotsNear(slots, offset) {

  var nearOptions = [];
  var target = 0;
  var sortedSlots = [];
  for (var i=0; i<slots.length; i++) {
    if (!slots[i].name) {
      slots[i].dist = Math.abs(offset - slots[i].minOffset);
      sortedSlots.push(slots[i]);
    }
  }

  sortedSlots = sortedSlots.sort(function(a, b) {
    return ((a.dist < b.dist) ? -1 : ((a.dist > b.dist) ? 1 : 0));
  });

  sortedSlots.length = 3;

  return sortedSlots;
}


function pad(n, width) {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}