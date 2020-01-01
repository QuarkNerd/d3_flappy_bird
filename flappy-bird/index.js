const WIDTH = 1000;
const HEIGHT = 600;
const playerX = 20;
const svg = d3
  .select("#game")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT)
  .attr("class", "game")
  .append("g");
let gameActive;
let player;
let pipeInterval;
let endInterval;
let cloudInterval;

function startGame() {
  svg.selectAll("*").remove();
  gameActive = true;

  player = createPlayer(); //refactor or rename
  pipeInterval = setInterval(createAndTransitionPipePair, 1200);
  endInterval = setInterval(detectLoss, 10);
  cloudInterval = setInterval(createAndTransitionCloud, 650);
  document.getElementById("startGame").setAttribute("disabled", true);
  createAndInitialiseScore();
  createPipeGradient();
}

function incScoreIfPlaying() {
  if (gameActive) {
    const scoreHolder = svg.select(".score");
    const oldScore = parseInt(scoreHolder.text());
    scoreHolder.text(oldScore + 1);
    scoreHolder.raise();
  }
}

function detectLoss() {
  const playerAttr = getPlayerAttributes(player);
  if (playerAttr.y < -playerAttr.r || playerAttr.y > HEIGHT) endGame();
  svg.selectAll(".pipe").each(function() {
    if (doRectAndCircleCollide(getRectAttributes(this), playerAttr)) {
      endGame();
    }
  });
}

function endGame() {
  gameActive = false;
  document.getElementById("startGame").removeAttribute("disabled");
  document.body.onmousedown = null;
  [pipeInterval, endInterval, cloudInterval].forEach(interval =>
    clearInterval(interval)
  );
  player.interrupt();
  svg.selectAll(".pipe").interrupt();
  svg.selectAll(".cloud").interrupt();
}

function createPlayer() {
  const player = svg
    .append("g")
    .attr("class", "player")
    .attr("transform-origin", "20px 20px")
    .attr(
      "transform",
      createTransformString({ translate: [playerX, 300], rotate: [-20] })
    );

  d3.xml("bird.svg").then(data => {
    d3.select(".player")
      .node()
      .append(data.documentElement);
  });
  makePlayerFall(player);

  document.body.onmousedown = function() {
    const transform = parseTransformString(player.attr("transform"));
    const jumpTime = 100;
    transform.translate[1] -= 110;
    transform.rotate[0] = -20;
    player
      .transition()
      .duration(jumpTime)
      .attr("transform", createTransformString(transform));
    makePlayerFall(player, jumpTime, transform.translate[1]);
  };

  return player;
}

function createAndTransitionPipePair() {
  const pipeWidth = 80;
  const pipeHeadWidth = 96;
  const pipeHeadHeight = 30;
  const speed = 0.5;
  const distanceToEdge = WIDTH + pipeHeadWidth;
  const distanceToPassPlayer = WIDTH - (playerX - pipeHeadWidth);
  const timeToEdge = distanceToEdge / speed;
  const timeToPassPlayer = distanceToPassPlayer / speed;
  const pipeXSep = (pipeHeadWidth - pipeWidth) / 2;
  const pipeYGap = 200;

  const pipeGenY = d3.randomUniform(80, HEIGHT - 201)(); // TODO make it so that the tiles can consty more but stay close to most recent value

  [
    {
      x: WIDTH + pipeXSep,
      y: -5,
      height: pipeGenY + 5,
      width: pipeWidth
    },
    {
      x: WIDTH + pipeXSep,
      y: pipeGenY + pipeYGap,
      height: 600 - pipeYGap - pipeGenY + 5,
      width: pipeWidth
    },
    {
      x: WIDTH,
      y: pipeGenY + pipeYGap,
      height: pipeHeadHeight,
      width: pipeHeadWidth
    },
    {
      x: WIDTH,
      y: pipeGenY - pipeHeadHeight,
      height: pipeHeadHeight,
      width: pipeHeadWidth
    }
  ].forEach(({ x, y, width, height }) => {
    svg
      .append("rect")
      .attr("class", "pipe")
      .attr("x", x)
      .attr("y", y)
      .attr("width", width)
      .attr("height", height)
      .transition()
      .duration(timeToEdge)
      .ease(d3.easeLinear)
      .attr("x", x - distanceToEdge)
      .remove();
  });

  setTimeout(incScoreIfPlaying, timeToPassPlayer);
  makeScoreVisible();
}

function createAndTransitionCloud() {
  const shift = d3.randomUniform(-25, 25)();
  const enlarge = d3.randomUniform(0.8, 2)();
  const opacity = d3.randomUniform(0.2, 1)();
  const delay = d3.randomUniform(-300, 300)();
  const speed = 0.25;
  const minX = 80;
  const distanceToEdge = WIDTH + minX;
  const timeToEdge = distanceToEdge / speed;

  svg
    .append("path")
    .attr("class", "cloud")
    .attr(
      "d",
      "M18 48 L40 48 C48 48 48 40 40 40 L38 40 C38 28 24 28 24 36 L20 36 L16 36 C8 36 8 48 20 48 Z"
    )
    .attr("opacity", opacity)
    .attr(
      "transform",
      createTransformString({
        translate: [WIDTH, 200 + shift],
        scale: [enlarge]
      })
    )
    .lower()
    .transition()
    .delay(delay)
    .duration(timeToEdge)
    .ease(d3.easeLinear)
    .attr(
      "transform",
      createTransformString({
        translate: [-minX, 200 + shift],
        scale: [enlarge]
      })
    )
    .remove();
}

function createAndInitialiseScore() {
  svg
    .append("text")
    .attr("class", "score")
    .attr("x", WIDTH / 2)
    .attr("y", 30)
    .text(0);
}

function createPipeGradient() {
  const defs = svg.append("defs");
  pipeGradient = defs.append("linearGradient").attr("id", "pipeGradient");
  pipeGradient
    .append("stop")
    .attr("stop-color", "#73be2e")
    .attr("offset", "0%");
  pipeGradient
    .append("stop")
    .attr("stop-color", "#b2ec67")
    .attr("offset", "20%");
  pipeGradient
    .append("stop")
    .attr("stop-color", "#73be2e")
    .attr("offset", "40%");
  pipeGradient
    .append("stop")
    .attr("stop-color", "#73be2e")
    .attr("offset", "70%");
  pipeGradient
    .append("stop")
    .attr("stop-color", "#558121")
    .attr("offset", "100%");
}

function makeScoreVisible() {
  svg.select(".score").raise();
}

function makePlayerFall(play, delay = 0, startPos = null) {
  const transform = parseTransformString(play.attr("transform"));
  const oldY = startPos == null ? transform.translate[1] : startPos;
  const endY = HEIGHT + 50;
  transform.translate[1] = endY;
  transform.rotate[0] = 90;
  play
    .transition()
    .delay(delay)
    .duration(Math.sqrt(endY - oldY) * 40)
    .attr("transform", createTransformString(transform))
    .ease(d3.easeQuadIn);
}
