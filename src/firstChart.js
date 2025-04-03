import * as d3 from "d3";
import allProductsString from "./testdata/allProductsString";
import binanceAllProductsString from "./testdata/BINANCE_AllProducts-string";




// const allProductsData = d3.csvParse(allProductsString)
const allProductsData = d3.csvParse(binanceAllProductsString)

export function renderChart(containerElement) {

  // Declare the chart dimensions and margins.
  const width = 640;
  const height = 400;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;

  // const to use to define the property we are charting (could be passed into function)
  const PROPERTY = "notional"
  // const PROPERTY = "contractSize"

  // property to group by
  // const GROUPING_PROPERTY = "symbol"
  const GROUPING_PROPERTY = "sub_type"

  // Create a mapped version of the data with a new property holding the running sum - this way it can be used for both the line and the dots
  // const summedPropertyData = allProductsData.map((obj,i,arr) => ({...obj, summed_property: d3.cumsum(arr, d => d[PROPERTY])[i]}))

  // we want to split the data and then create a line for each, and have the summed value available on each group for both lines and dots
  const rollupSumReducer = (groupArray) => {
    return groupArray.map((obj,i,arr) => ({...obj, summed_property: d3.cumsum(arr, d => d[PROPERTY])[i]}))
  }

  const mappedData = d3.rollup(allProductsData.sort((a,b) => d3.ascending(a.date_time, b.date_time)), rollupSumReducer, d => d[GROUPING_PROPERTY])

  // Declare the x (horizontal position) scale.
  const x = d3.scaleUtc()
      //? original date domain example
      // .domain([new Date("2023-01-01"), new Date("2024-01-01")])
      //? date domain from data
      .domain(d3.extent(allProductsData, d => d.date_time))
      .range([marginLeft, width - marginRight]);

  // Declare the y (vertical position) scale.
  const y = d3.scaleLinear()
      // .domain([0, 100])
      //? using the notional, without summing
      // .domain([0, d3.max(allProductsData, d => d[PROPERTY])])
      //? using the notional summed
      // .domain([0, d3.sum(allProductsData, d => d[PROPERTY])])
      //? using max summed value of each group 
      .domain([0, d3.max([...mappedData.values()], d => d3.max(d, trade => trade.summed_property))])
      .range([height - marginBottom, marginTop]);

  // Create a colour scale to assign different paths to
  // const colourSelect = d3.scaleLinear()
  //   .domain([0,2])
  //   .range(["red", "yellow"])

  // using Rainbow preset
  const colourSelect = d3.scaleSequential(d3.interpolateRainbow).domain([0, mappedData.size])


  // create a line
  const line = d3.line()
    .x(d => x(d.date_time))
    // .y(d => y(d[PROPERTY])) 
    .y(d => y(d.summed_property)) 
    // .y((_d,i,arr) => y(d3.cumsum(arr, d => d[PROPERTY])[i])) 


  // create a brush and connect to callbacks, to later attach to the SVG
  const brush = d3.brushX()
    .extent([[marginLeft, marginTop], [width -marginRight, height - marginBottom]])
    // .on("brush", brushed)
    .on("end", (e) => {
      console.log("brush end arg:",e);
    });


  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)

  // Add the x-axis.
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x));

  // Add the y-axis.
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickFormat(d3.format(".2s")));

  

  
  // add brush to SVG
  svg.append("g")
    .call(brush)

  // Testing adding circles on each point
  const dots = svg.append("g")
    .selectAll("g")
    .data([...mappedData.values()])
    .join("g")
    .attr("fill", (_d, i) => colourSelect(i))
    .selectAll("circle")
    // .data(summedPropertyData)
    .data((d,i) => {
      // console.log("d:",Object.assign(d, {groupNumber: i}))
      return Object.assign(d, {groupNumber: i})
    }) //! USE flatRollup or similar, to do this?
    .join("circle")
      .attr("r", 2)
      .attr("stroke-width", 1)
      .attr("cx", d => x(d.date_time))
      .attr("cy", d => y(d.summed_property))
      // .style("opacity", 0)
      .on("mouseover", (d) => {
        d3.select(d.target)
          .transition()
          .duration('200')
          // .style("opacity", 1)
          .attr("r", 7)
      })
      .on("mouseout", (d) => {
        d3.select(d.target)
          .transition()
          .duration('200')
          // .style("opacity", 0)
          .attr("r", 2)
      })


    const labels = svg.append("g")
      .selectAll("text")
      .data([...mappedData.values()])
      .join("text")
        .attr("x", (d) => x(d[d.length-1].date_time))
        .attr("y", (d) => y(d[d.length-1].summed_property))
        .attr("text", "TEST")

    // Test adding text at the same points  
    // svg.append("g")
    // .selectAll("text")
    // .data(summedPropertyData)
    // .join("text")
    //   .attr("x", d => x(d.date_time))
    //   .attr("y", d => y(d.summed_property))
    //   .style("font", d => d.symbol === "BTCUSDT" ? "bold 10px sans-serif" : "bold 15px serif")
    //   .style("fill", "gold")
    //   .text(d => d.exchange)    

  // Add the line
  // svg.append("path")
  //   .attr("fill", "none")
  //   .attr("stroke", "chartreuse")
  //   .attr("stroke-width", 1.5)
  //   .attr("d", line(summedPropertyData))

  const logger = (value) => console.log(value);

  svg.append("g")
    .selectAll("path")
    .data([...mappedData.values()])
    .join("path")
      .attr("fill", "none")
      .attr("stroke", (_d,i) => colourSelect(i))
      .attr("stroke-width", 1.5)
      .attr("d", line)



  // 
  // svg
    // .on("pointerenter", pointerentered)
    // .on("pointermove", pointermoved)
    // .on("pointerleave", pointerleft)
    // .on("touchstart", event => event.preventDefault());

  function pointermoved(event) {
    console.log("event: ",d3.pointer(event));
    const [xm, ym] = d3.pointer(event);
    const i = d3.leastIndex(points, ([x, y]) => Math.hypot(x - xm, y - ym));
    // const [x, y, k] = points[i];
    // path.style("stroke", ({z}) => z === k ? null : "#ddd").filter(({z}) => z === k).raise();
    // dot.attr("transform", `translate(${x},${y})`);
    // dot.select("text").text(k);
    // svg.property("value", unemployment[i]).dispatch("input", {bubbles: true});
  }

  // Append the SVG element.
  containerElement.append(svg.node());
  
}


// FOR QUOKKA DEBUGGING & TESTING

const y = d3.scaleUtc()
.domain([new Date("2023-01-01"), new Date("2024-01-01")])
.range([400 - 30, 30]);

console.log(y(new Date("2024-01-01")));

const colorScale = d3.scaleLinear([0, 100], ["red", "blue"])

console.log(colorScale(32));


// // const csv = d3.csv('../testdata/all_products.csv')
// const csvUrl = new URL('./testdata/all_products.csv', import.meta.url)
// console.log(csvUrl);
// const csv = d3.csv(csvUrl)

console.log(d3.csvParse(allProductsString));


console.log(d3.line() );

const mappedData = d3.rollup(allProductsData, v => v, d => d.symbol)

console.log(mappedData);

// console.log(d3.flatRollup(allProductsData, v => v, d => d.symbol));





