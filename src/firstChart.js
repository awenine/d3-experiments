import * as d3 from "d3";
import allProductsString from "./testdata/allProductsString";


const allProductsData = d3.csvParse(allProductsString)

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
      .domain([0, d3.max(allProductsData, d => d[PROPERTY])])
      //? using the notional summed
      // .domain([0, d3.sum(allProductsData, d => d[PROPERTY])])
      .range([height - marginBottom, marginTop]);

  // Create a colour scale to assign different paths to
  const colourSelect = d3.scaleLinear()
    .domain([0,2])
    .range(["red", "yellow"])

  // Create a mapped version of the data with a new property holding the running sum - this way it can be used for both the line and the dots
  const summedPropertyData = allProductsData.map((obj,i,arr) => ({...obj, summed_property: d3.cumsum(arr, d => d[PROPERTY])[i]}))

  // we want to split the data and then create a line for each, and have the summed value available on each group for both lines and dots
  const mappedData = d3.rollup(allProductsData, v => v, d => d.symbol)


  // create a line
  const line = d3.line()
    .x(d => x(d.date_time))
    .y(d => y(d[PROPERTY])) 
    // .y(d => y(d.summed_property)) 
    // .y((_d,i,arr) => y(d3.cumsum(arr, d => d[PROPERTY])[i])) 


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
      .call(d3.axisLeft(y));

  // Testing adding circles on each point
  svg.append("g")
    .selectAll("circle")
    // .data(summedPropertyData)
    .data(mappedData.get('BTCUSDT'))
    .join("circle")
      .attr("fill", "none")
      .attr("stroke", "yellow")
      .attr("r", 3)
      .attr("stroke-width", 1)
      .attr("cx", d => x(d.date_time))
      .attr("cy", d => y(d[PROPERTY]))

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





