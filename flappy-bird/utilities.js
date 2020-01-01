function doRectAndCircleCollide(rectAttr, circleAttr) {
  const distBetweenCentresX = Math.abs(
    circleAttr.x - (rectAttr.x + rectAttr.width / 2)
  );
  const distBetweenCentresY = Math.abs(
    circleAttr.y - (rectAttr.y + rectAttr.height / 2)
  );

  // If distance between centres is too small or to large, collsion must happen or cant happen
  if (
    distBetweenCentresX > rectAttr.width / 2 + circleAttr.r ||
    distBetweenCentresY > rectAttr.height / 2 + circleAttr.r
  ) {
    return false;
  }
  if (
    distBetweenCentresX <= rectAttr.width / 2 ||
    distBetweenCentresY <= rectAttr.height / 2
  ) {
    return true;
  }
  //pythagoras
  const dx = distBetweenCentresX - rectAttr.width / 2;
  const dy = distBetweenCentresY - rectAttr.height / 2;
  return dx * dx + dy * dy <= circleAttr.r * circleAttr.r;
}

function getRectAttributes(rect) {
  return ["x", "y", "width", "height"].reduce((acc, property) => {
    acc[property] = parseFloat(rect.getAttribute(property));
    return acc;
  }, {});
}
function getPlayerAttributes(player) {
  const translateProperty = parseTransformString(player.attr("transform"))
    .translate;
  const [x, y] = translateProperty;
  const r = parseFloat(player.select(".bird_Body").attr("r"));
  return { x: x + 20, y: y + 20, r };
}
function parseTransformString(string) {
  const transforms = string.split(") ");
  return transforms.reduce((acc, transform) => {
    const [property, values] = transform.replace(")", "").split("(");
    const valueArray = values.split(",").map(val => parseFloat(val));
    acc[property] = valueArray;
    return acc;
  }, {});
}
function createTransformString(transformObject) {
  const transforms = Object.entries(transformObject);
  const transformStrings = transforms.map(
    ([property, values]) => `${property}(${values.join(",")})`
  );
  return transformStrings.join(" ");
}
