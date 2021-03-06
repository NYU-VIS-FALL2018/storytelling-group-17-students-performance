var margin = { top: 30, right: 50, bottom: 40, left: 50 };
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var svgScat = d3.select("body")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xscale = d3.scaleLinear()
  .domain([0,20])
  .range([0,width]);

var yscale = d3.scaleLinear()
  .domain([-1,2])
  .range([height,0]);

var radius = d3.scaleSqrt()
  .range([2,8]);

var xAxis = d3.axisBottom()
  .tickSize(-height)
  .scale(xscale);

var yAxis = d3.axisLeft()
  .tickSize(-width)
  .scale(yscale)

var color = d3.scaleCategory20();

d3.csv("fedu.csv", function(error, data) {
  console.log(data);
  // data pre-processing
  data.forEach(function(d) {
    d.y = +d["Fedu"];
    d.x = +d["G31"];
    d.r = +d["Number of Records"];
    d.y = +d["runs86"];
    d.x = +d["atbat86"];
    d.r = +d["homer86"];
  });

  data.sort(function(a,b) { return b.r - a.r; });

  yscale.domain(d3.extent(data, function(d) {
    return d.y;
  })).nice();

  radius.domain(d3.extent(data, function(d) {
    return d.r;
  })).nice();

  svgScat.append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "x axis")
    .call(xAxis);

  svgScat.append("g")
    .attr("transform", "translate(0,0)")
    .attr("class", "y axis")
    .call(yAxis);

  var group = svgScat.selectAll("g.bubble")
    .data(data)
    .enter().append("g")
    .attr("class", "bubble")
    .attr("transform", function(d) {
      return "translate(" + xscale(d.x) + "," + yscale(d.y) + ")"
    });

  group
    .append("circle")
    .attr("r", function(d) { return radius(d.r);  })
    .style("fill", function(d) {
      return color(d["Fedu"]);
    })

  group
    .append("text")
    .attr("x", function(d) { return radius(d.r); })
    .attr("alignment-baseline", "middle")
    .text(function(d) {
      return d["name1"] + " " + d["name2"];  
    });

  svgScat.append("text")
    .attr("x", 6)
    .attr("y", -2)
    .attr("class", "label")
    .text("Runs (86)");

  svgScat.append("text")
    .attr("x", width-2)
    .attr("y", height-6)
    .attr("text-anchor", "end")
    .attr("class", "label")
    .text("At Bats (86)");

  var legend = svgScat.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(2," + i * 14 + ")"; });

  legend.append("rect")
      .attr("x", width)
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", color);

  legend.append("text")
      .attr("x", width + 16)
      .attr("y", 6)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { return d; });

  legend.on("mouseover", function(type) {
      d3.selectAll(".legend")
        .style("opacity", 0.1);
      d3.select(this)
        .style("opacity", 1);
      d3.selectAll(".bubble")
        .style("opacity", 0.1)
        .filter(function(d) { return d["team86"] == type; })
        .style("opacity", 1);
    })
    .on("mouseout", function(type) {
      d3.selectAll(".legend")
        .style("opacity", 1);
      d3.selectAll(".bubble")
        .style("opacity", 1);
    });
});