$(document).ready(function() {

 var config = {
    apiKey: "AIzaSyAW4M88EVOuogxhh-2MW3NVkqhRGb1RQW0",
    authDomain: "train-scheduler-60858.firebaseapp.com",
    databaseURL: "https://train-scheduler-60858.firebaseio.com",
    projectId: "train-scheduler-60858",
    storageBucket: "train-scheduler-60858.appspot.com",
    messagingSenderId: "712278560678"
  };
  firebase.initializeApp(config);

  var db = firebase.database();

  var trainName = "";
  var trainDestination = "";
  var trainTime = 0;
  var trainFrequency = 0;
  var minAway = 0;
  var key;
  var nextTrainCoverted = 0;
  var tMinutesTillTrain = 0;

  $('#submit').on('click', function(){
    event.preventDefault();

    trainName = $('#train-name').val().trim();
    trainDestination = $('#train-destination').val().trim();
    trainTime = $('#train-time').val().trim();
    trainFrequency = $('#train-frequency').val().trim();

    var firstTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % trainFrequency;
    var tMinutesTillTrain = trainFrequency - tRemainder;
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    var nextTrainCoverted = moment(nextTrain).format("hh:mm");
    db.ref().push({
        trainName: trainName,
        trainDestination: trainDestination,
        trainTime: trainTime,
        trainFrequency: trainFrequency,
        nextTrainCoverted: nextTrainCoverted,
        tMinutesTillTrain: tMinutesTillTrain,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

  });


  function writeTrains() {
    $('#train-write').empty();
    
    db.ref().on("child_added", function(childSnapshot) {

      var key = childSnapshot.key;
      var childData = childSnapshot.val();
      var newTrain = $('<tr>');
      var childName = $("<td>").text(childData.trainName);
      var childDestination = $("<td>").text(childData.trainDestination);
      var childFrequency = $("<td>").text(childData.trainFrequency + " min");
      var childTime = $("<td>").text(childData.nextTrainCoverted);
      var minAway = $("<td>").text(childData.tMinutesTillTrain);
      var close = $("<td>").html('<i class="fa fa-window-close" aria-hidden="true"></i>');
      close.addClass('close-btn');
      close.attr('data-train', key);
      newTrain.append(childName).append(childDestination).append(childFrequency).append(childTime).append(minAway).append(close);
      $('#train-write').append(newTrain);
    });
  };

  writeTrains();

});