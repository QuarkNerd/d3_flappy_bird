var firebaseConfig = {
  apiKey: "AIzaSyDMwQV8T27XcJ0G7DR43b9UcGX4apI2FiA",
  authDomain: "d3-exp-4577d.firebaseapp.com",
  databaseURL: "https://d3-exp-4577d.firebaseio.com",
  storageBucket: "d3-exp-4577d.appspot.com"
};

firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

const scores = database.ref("scores/");

function sendScore(name, score) {
  const ID = scores.push();
  ID.set({ name, score });
}

function getScores() {
  scores.once("value").then(a => console.log(a.val()));
}
