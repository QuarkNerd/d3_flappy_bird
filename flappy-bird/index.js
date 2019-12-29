const WIDTH = 1000;
const HEIGHT = 600;

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT)
  .attr("class", "game")
  .append("g");

const player = createPlayer(); //refactor or rename
const pipeInterval = setInterval(createAndTransitionPipePair, 800);
const cloudInterval = setInterval(createAndTransitionCloud, 800);
const collisionInterval = setInterval(detectCollisionOfPlayer, 5);
let fallTimeout = null;

function createPlayer() {
  const player = svg
    .append("g")
    .attr("class", "player")
    .attr(
      "transform",
      createTransformString({ translate: [20, 300], rotate: [0] })
    );

  d3.xml("bird.svg").then(data => {
    d3.select(".player")
      .node()
      .append(data.documentElement);
  });
  makePlayerFall(player);

  let isMouseDown = false;
  document.body.onmousedown = function() {
    if (!isMouseDown) {
      isMouseDown = true;
      const transform = parseTransformString(player.attr("transform"));
      transform.translate[1] -= 50;
      player
        .transition()
        .duration(100)
        .attr("transform", createTransformString(transform));
      makePlayerFall(player, 100);
    }
  };

  document.body.onmouseup = function() {
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
  player.interrupt();
  document.body.onmousedown = null;
  [cloudInterval, pipeInterval, collisionInterval].forEach(interval =>
    clearInterval(interval)
  );
  svg.selectAll("rect").interrupt();
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
      .attr("x", WIDTH)
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
    .attr("x", WIDTH)
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
