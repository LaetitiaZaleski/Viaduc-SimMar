

var graph1=[];
var graph2=[];
var len = 10;


function draw() {
    document.getElementById('graph').innerHTML = "";


// 2. Use the margin convention practice
    var margin = {top: 50, right: 50, bottom: 50, left: 50}
        , width = 400 // Use the window's width
        , height = 200; // Use the window's height

// The number of datapoints
   // var n = 3;

// 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
        .domain([0, len-1]) // input
        .range([0, width]); // output

// 6. Y scale will use the randomly generate number
    var yScale = d3.scaleLinear()
        .domain([0, 100]) // input
        .range([height, 0]); // output

// 7. d3's line generator
    var line = d3.line()
        .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
        .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
        .curve(d3.curveMonotoneX) // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    var dataset1 = d3.range(len).map(function(d) { return {"y": graph1[d] } })
    var dataset2 = d3.range(len).map(function(d) { return {"y": graph2[d] } })

// 1. Add the SVG to the page and employ #2
    var svg = d3.select("div#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// 3. Call the x axis in a group tag
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

// 9. Append the path, bind the data, and call the line generator
    svg.append("path")
        .datum(dataset1) // 10. Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .attr("d", line); // 11. Calls the line generator
     svg.append("path")
        .datum(dataset2) // 10. Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .attr("d", line); // 11. Calls the line generator
// 12. Appends a circle for each datapoint
    /*svg.selectAll(".dot")
        .data(dataset)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d, i) { return xScale(i) })
        .attr("cy", function(d) { return yScale(d.y) })
        .attr("r", 5)
        .on("mouseover", function(a, b, c) {
            console.log(a);
            console.log(this);
            // this.setAttribute('class', 'focus');
        })
        .on("mouseout", function() {  //this.setAttribute('class', 'dot');
        });*/

    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (-margin.left + 18) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Nombre");

    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(height+ margin.bottom - 10)+")")  // centre below axis
        .text("Temps");
}


function calc() {
    a = parseInt(roomId = document.getElementById('a').value);
    b = parseInt(roomId = document.getElementById('b').value);
    c = parseInt(roomId = document.getElementById('c').value);

    for (i = 0; i < len; i++) {
        graph1[i] = ((a + i) * (a + i)) / b * c;
        graph2[i] = ((a + i) * (a + i)) / b * c;
    }

    draw() ;
}

calc();