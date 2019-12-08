const MARGIN = { top: 20, right: 20, bottom: 30, left: 50 };
const WIDTH = 960 - MARGIN.left - MARGIN.right;
const HEIGHT = 500 - MARGIN.top - MARGIN.bottom;
const FALLINGROOM = 400;
const PADDING = 0.1;

const TIMING = { exitDuration: 1000, xAxisDuration: 1000, yAxisDuration: 1000 };

create();
setInterval(update, 3000);

function create() {
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", WIDTH + MARGIN.left + MARGIN.right)
    .attr("height", HEIGHT + MARGIN.top + MARGIN.bottom + FALLINGROOM)
    .append("g")
    .attr("class", "graph")
    .attr("transform", "translate(" + MARGIN.top + "," + MARGIN.top + ")");

  const xScale = d3
    .scaleBand()
    .domain(0)
    .range([0, WIDTH]);

  const yScale = d3
    .scaleLinear()
    .range([0, HEIGHT])
    .domain(0);

  svg
    .append("g")
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + MARGIN.top + ")")
    .call(d3.axisTop(xScale));
  svg
    .append("g")
    .call(d3.axisLeft(yScale))
    .attr("class", "yAxis")
    .attr("transform", "translate(0," + MARGIN.top + ")");
}

function update() {
  const dataSize = Math.ceil(Math.random() * 6) + 3;
  const data = [...Array(dataSize)].map(() => Math.ceil(Math.random() * 9));

  const svg = d3.select(".graph");

  const xScale = d3
    .scaleBand()
    .domain(d3.range(dataSize))
    .range([0, WIDTH])
    .paddingOuter(PADDING)
    .paddingInner(PADDING);
  const yScale = d3
    .scaleLinear()
    .range([0, HEIGHT])
    .domain([0, Math.max(...data)]);

  svg
    .select(".xAxis")
    .transition()
    .duration(TIMING.xAxisDuration)
    .delay(TIMING.exitDuration)
    .call(d3.axisTop(xScale));
  svg
    .select(".yAxis")
    .transition()
    .duration(TIMING.yAxisDuration)
    .delay(TIMING.exitDuration + TIMING.xAxisDuration)
    .call(d3.axisLeft(yScale).ticks(Math.max(...data)));
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (_, i) => xScale(i))
    .attr("width", xScale.bandwidth())
    .attr("y", MARGIN.top)
    .transition()
    .delay(TIMING.exitDurations + TIMING.xAxisDuration)
    .duration(TIMING.yAxisDuration)
    .attr("height", d => yScale(d))
    .attr("fill", "black");

  svg
    .selectAll("rect")
    .data(data)
    .exit()
    .transition()
    .duration(TIMING.exitDuration)
    .ease(d3.easeQuadIn)
    .attr("y", HEIGHT * 2)
    .attr("height", 0)
    .remove();

  svg
    .selectAll("rect")
    .data(data)
    .transition()
    .duration(TIMING.xAxisDuration)
    .delay(TIMING.exitDuration)
    .attr("x", (_, i) => xScale(i))
    .attr("width", xScale.bandwidth())
    .transition()
    .duration(750)
    .attr("height", d => yScale(d))
    .attr("fill", "black");
}
