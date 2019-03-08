// Display and update the current time in the jumbotron
//=================================
function updateClock() {
  $("#currentTime").text(moment().format('HH:mm:ss'));
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
  //=================================
  var trainName = $("#input-train-name").val().trim();
  var trainDest = $("#input-train-dest").val().trim();
  var firstTrain = moment($("#input-first-train").val().trim(), "HH:mm").format("X");
  var trainFreq = $("#input-train-freq").val().trim();
  //=================================

  // Create a local "temporary" object for holding train data
  //=================================
  var newTrain = {
    name: trainName,
    destination: trainDest,
    firstGo: firstTrain,
    frequency: trainFreq
  };
  //=================================

  // Uploadstrain data to the database
  //=================================
  database.ref().push(newTrain);
  //=================================

  // Logs everything to console
  //=================================
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstGo);
  console.log(newTrain.frequency);
  //=================================

  // Clear the text-boxes
  //=================================
  $("#input-train-name").val("");
  $("#input-train-dest").val("");
  $("#input-first-train").val("");
  $("#input-train-freq").val("");
  //=================================

});
//=================================


// Create Firebase event for adding train to the database 
// and for adding a row in the html when a user adds an entry
//=================================
 function loadTrainData() {

  database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    //=================================
    var rowId = childSnapshot.key;
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().firstGo;
    var trainFreq = childSnapshot.val().frequency;
    //=================================


    // Console Log the Train Info
    //=================================
    console.log("DATABASE ROW ID #: " + rowId);
    console.log("NAME OF TRAIN: " + trainName);
    console.log("DESTINATION: " + trainDest);
    console.log("TRAIN'S START TIME: " + firstTrain);
    console.log("TRAIN FREQUENCY: " + trainFreq);
    console.log("/------------------------------------------/");
    //=================================


    // Prettify the train Start Time
    //=================================
    var firstTrainPretty = moment.unix(firstTrain).format("HH:mm");
    console.log("TRAIN START TIME PRETTY: " + firstTrainPretty);
    //=================================


    // Calculating the "minutes away"
    //=================================

    // Push back firstTime 1 year to make sure it comes before current time
    var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    console.log("TRAIN'S START TIME CONVERTED: " + firstTrainConverted);

    // Prettify the Converted Train Start Time
    //=================================
    var firstTrainConvertedPretty = moment.unix(firstTrainConverted).format("HH:mm");
    console.log("TRAIN START TIME CONVERTED PRETTY: " + firstTrainConvertedPretty);
    //=================================

    // Get the current time
    var currentTime = moment().format("HH:mm");
    console.log("CURRENT TIME: " + (currentTime));

    // Get the difference between the times
    var diffTime = moment().diff(moment(firstTrainConverted));
    console.log("DIFFERENCE IN TIME: " + moment(diffTime).format("mm"));

    // Time apart (remainder)
    var tRemainder = diffTime % trainFreq;
    console.log("REMAINDER: " + tRemainder);
    
    // Caluculate the minutes remaining until the next train
    var tMinutesTillTrain = trainFreq - tRemainder;
    console.log("MINUTES AWAY: " + tMinutesTillTrain);
    
    // Determine what time it will be when the next train arrives
    // var nextArrival = moment([2007, 0, 29]).fromNow();
    var nextArrival = moment().add(tMinutesTillTrain, "minutes");
    console.log("NEXT ARRIVAL TIME: " + moment(nextArrival).format("HH:mm"));
    //=================================


    // Create the new table row
    //=================================
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDest),
      $("<td>").text(firstTrainPretty),
      $("<td>").text(trainFreq),
      $("<td>").text(moment(nextArrival, "HH:mm").format("HH:mm")),
      $("<td>").text(tMinutesTillTrain),
      $("<td>").append("<button type='button' data-name='"+rowId+"' class='remove btn btn-secondary'>Remove</button>"),
    );
    console.log("/------------------------------------------/");
    //=================================
        

    // Append the new row to the table
    //=================================
    $("#train-table > tbody").append(newRow);
    //=================================

  });
  
}
//=================================


// Call the Load Train Data Function
//=================================
loadTrainData();
//=================================


// Removing a train from the schedule
//=================================
$(document).on("click", ".remove", function () {
  
  var rowId = $(this).attr("data-name");
  var firebaseRef = firebase.database().ref();

  firebaseRef.child(rowId).remove();

  $("#train-table > tbody").empty();

  loadTrainData();

});
//=================================


// Refreshing the train timetable 
//=================================
function updateTimes() {
  console.clear();
  $("#train-table > tbody").empty();
  loadTrainData();
  
}

setInterval (updateTimes, 5000);
//=================================
