const firebaseConfig = {
  apiKey: "AIzaSyB5e1yI_YBs-reQrBG8HLYqy7lPgsQuNko",
  authDomain: "d3-flappy-bird.firebaseapp.com",
  databaseURL: "https://d3-flappy-bird.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

const scores = database.ref("scores");

function sendScore() {
  const name = document.getElementById("name").value.toUpperCase();
  document.getElementById("sendScore").setAttribute("disabled", true);
  const score = parseInt(svg.select(".score").text());
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
