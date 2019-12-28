// const {
//   doRectAndCircleCollide,
//   getRectAttributes,
//   getPlayerAttributes,
//   parseTransformString,
//   createTransformString
// } = require("./utilities");
const width = 1000;
const height = 600;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "game")
  .append("g");

const player = createPlayer(); //refactor or rename
const pipeInterval = setInterval(createAndTransitionPipePair, 800);
const cloudInterval = setInterval(createAndTransitionCloud, 800);
const collisionInterval = setInterval(detectCollisionOfPlayer, 25);

function createPlayer() {
  const player = svg
    .append("g")
    .attr("class", "player")
    .attr(
      "transform",
      createTransformString({ translate: [20, 300], rotate: [0] })
    );
  player
    .append("circle")
    .attr("class", "playerBody")
    .attr("r", 20);
  player
    .append("circle")
    .attr("class", "playerEye")
    .attr("r", 9)
    .attr("cx", 7)
    .attr("cy", -7);
  player
    .append("circle")
    .attr("class", "playerPupil")
    .attr("r", 2)
    .attr("cx", 7)
    .attr("cy", -7);
  makePlayerFall(player);

  let isMouseDown = false;
  document.body.onmousedown = function(e) {
    if (!isMouseDown) {
      isMouseDown = true;
      const transform = parseTransformString(player.attr("transform"));
      transform.translate[1] -= 50;
      player
        .transition()
        .duration(100)
        .attr("transform", createTransformString(transform));
      makePlayerFall(player, 101);
    }
  };

  document.body.onmouseup = function(e) {
    isMouseDown = false;
  };
  return player;
}

function detectCollisionOfPlayer() {
  svg.selectAll(".pipe").each(function() {
    if (
      doRectAndCircleCollide(
        getRectAttributes(this),
        getPlayerAttributes(player)
      )
    ) {
      endGame();
    }
  });
}

function endGame() {
  player.transition();
  document.body.onmousedown = null;
  [cloudInterval, pipeInterval, collisionInterval].forEach(interval =>
    clearInterval(interval)
  );
  svg.selectAll("rect").transition();
}

function raisePlayer() {
  d3.select(".player").raise();
}

function createAndTransitionPipePair() {
  const shift = d3.randomUniform(-150, 150)(); // TODO make it so that the tiles can consty more but stay close to most recent value
  [-400 + shift, 400 + shift].forEach(y => {
    svg
      .append("rect")
      .attr("class", "pipe")
      .attr("x", width)
      .attr("y", y)
      .attr("width", 40)
      .attr("height", 600)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("x", -30)
      .remove();
  });
}

function createAndTransitionCloud() {
  const shift = d3.randomUniform(-15, 15)();
  svg
    .append("rect")
    .attr("class", "cloud")
    .attr("x", width)
    .attr("y", 200 + shift)
    .attr("width", 32)
    .attr("height", 35)
    .transition()
    .duration(4000)
    .ease(d3.easeLinear)
    .attr("x", -30)
    .remove();

  raisePlayer();
}

function makePlayerFall(play, delay = 0) {
  const transform = parseTransformString(play.attr("transform"));
  const oldY = transform.translate[1];
  transform.translate[1] = 650;
  play
    .transition()
    .delay(delay)
    .duration(Math.sqrt(650 - oldY) * 50)
    .attr("transform", createTransformString(transform))
    .ease(d3.easeQuadIn);
}
