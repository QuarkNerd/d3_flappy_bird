const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.filterScores = functions.database
  .ref("/scores/{scoreID}")
  .onCreate((snapshot, context) => {
    const ref = snapshot.ref;
  });
