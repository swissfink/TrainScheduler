// Display and update the current time
//=================================
function updateClock() {
  $("#currentTime").text(moment().format('LTS'));
}
setInterval(updateClock, 1000);
//=================================


// Initialize Firebase
//=================================
var config = {
  apiKey: "AIzaSyBBc5CoFAk-E2KUw6u9jXtYVU1F2g47Uw4",
  authDomain: "timesheet-90fac.firebaseapp.com",
  databaseURL: "https://timesheet-90fac.firebaseio.com",
  projectId: "timesheet-90fac",
  storageBucket: "timesheet-90fac.appspot.com",
  messagingSenderId: "13751656654"
};

firebase.initializeApp(config);

var database = firebase.database();

//=================================


// Adding new train data to the database
//=================================
$("#add-train-button").on("click", function (event) {
  event.preventDefault();

  // Grab the input values
  var trainName = $("#input-train-name").val().trim();
  var trainDest = $("#input-train-dest").val().trim();
  var firstTrain = moment($("#input-first-train").val().trim(), "HH:mm").format("X");
  var trainFreq = $("#input-train-freq").val().trim();

  // Creates a local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    destination: trainDest,
    firstGo: firstTrain,
    frequency: trainFreq
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstGo);
  console.log(newTrain.frequency);

  // Clear the text-boxes
  $("#input-train-name").val("");
  $("#input-train-dest").val("");
  $("#input-first-train").val("");
  $("#input-train-freq").val("");

});
//=================================


// Create Firebase event for adding train to the database 
// and adding a row in the html when a user adds an entry
//=================================
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().firstGo;
  var trainFreq = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(trainDest);
  console.log(firstTrain);
  console.log(trainFreq);

  // Prettify the train Start Time
  var trainStartPretty = moment.unix(firstTrain).format("HH:mm");

  // Calculating the "minutes away"
  //=================================

  // Assumptions
  var tFrequency = trainFreq;

  // The "firstTime" is the first time the train starts
  var firstTime = firstTrain;

  // Push back firstTime 1 year to make sure it comes before current time
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Get the current time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  // Get the difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  // Caluculate the minutes remaining until the next train
  var tMinutesTillTrain = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Determine what time it will be when the next train arrives
  var nextArrival = moment().add(tMinutesTillTrain, "minutes");
  console.log("NEXT ARRIVAL TIME: " + moment(nextArrival).format("HH:mm"));

  // var nextArrival = {

  //   if (nextTrain > firstTrain) {
  //     nextArrival == firstTrain
  //   }
    
  //   else {
  //     nextArrival == nextTrain
  //   }

  // });


  // Create the new table row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDest),
    $("<td>").text(trainStartPretty),
    $("<td>").text(trainFreq),
    $("<td>").text(moment(nextArrival).format("HH:mm")),
    $("<td>").text(tMinutesTillTrain).addClass("minutesAway"),
    $("<td>").append("<button type='button' class='refresh btn btn-secondary'>Refresh</button>"),
    $("<td>").append("<button type='button' class='remove btn btn-secondary'>Remove</button>")
  );
      
  // Append the new row to the table
  $("#train-table > tbody").append(newRow);


  // Update the minutes remaining until the next trains
  //=================================

  // function updateTimes() {
  //   $("#nextArrival").replaceWith(moment(nextArrival).format("HH:mm"));  
  //   $("#minutesAway").replaceWith(moment(tMinutesTillTrain).format("HH:mm"));
  // }
  // setInterval (updateTimes, 2000);


  // Removing a train from the schedule
  //=================================
  // $(".remove").on("click", function () {
  //   $(".another-row").empty();
  // });

});
