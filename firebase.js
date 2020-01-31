var firebaseConfig = {
  apiKey: "AIzaSyDSWt7dJ3B0YsmqZUrdsY2SS1uaPW9-jIM",
  authDomain: "d3flappybird.firebaseapp.com",
  databaseURL: "https://d3flappybird.firebaseio.com",
  projectId: "d3flappybird",
  storageBucket: "d3flappybird.appspot.com"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

const scores = database.ref("scores");

function sendScore() {
  const name = document.getElementById("name").value.toUpperCase();
  document.getElementById("sendScore").setAttribute("disabled", true);
  const score = parseInt(svg.select(".score").text());
  console.log(name, score);
  const ID = scores.push();
  ID.set({ name, score });
}

async function getScores() {
  const result = await scores
    .orderByChild("score")
    .limitToLast(10)
    .once("value");
  return Object.values(result.val()).sort((a, b) => -a.score + b.score);
}
