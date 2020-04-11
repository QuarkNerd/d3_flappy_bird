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

function doRectsCollide(attrOne, attrTwo) {
  const distBetweenCentresX = Math.abs(
    (attrOne.x + attrOne.width / 2) - (attrTwo.x + attrTwo.width / 2)
  );
  const distBetweenCentresY = Math.abs(
    (attrOne.y + attrOne.height / 2) - (attrTwo.y + attrTwo.height / 2)
  );

  return (distBetweenCentresX < (attrOne.width + attrTwo.width ) /2 &&
    distBetweenCentresY < (attrOne.height / 2 + attrTwo.height) / 2)
}

function getRectAttributes(rect) {
  return ["x", "y", "width", "height"].reduce((acc, property) => {
    acc[property] = parseFloat(rect.getAttribute(property));
    return acc;
  }, {});
}

function getBunnyFaceAttributes() {
  const bunnyFace = svg.select(".bunny_face")._groups[0][0];
  const attr = ["cx", "cy", "r"].reduce((acc, property) => {
    acc[property] = parseFloat(bunnyFace.getAttribute(property));
    return acc;
  }, {});
  const translateProperty = parseTransformString(player.attr("transform")).translate;
  const [x, y] = translateProperty;
  return { ...attr, x: x + attr.cx, y: y + attr.cy };
}

function getBunnyEarAttributesArray() {
  const bunnyEars = Array.from(svg.selectAll(".bunny_ears")._groups[0]);
  const attrArray = bunnyEars.map(ear => (
    ["x", "y", "width", "height"].reduce((acc, property) => {
      acc[property] = parseFloat(ear.getAttribute(property));
      return acc;
    }, {})
  ))
  const translateProperty = parseTransformString(player.attr("transform")).translate;
  const [x, y] = translateProperty;
  return attrArray.map((attr) => ({ ...attr, x: x + attr.x, y: y + attr.y }));
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

function getRandomColourString() {
  const genFrom0To255 = d3.randomUniform(256);
  const intGen = () => Math.floor(genFrom0To255())
  return `rgb(${intGen()},${intGen()},${intGen()})`;
}