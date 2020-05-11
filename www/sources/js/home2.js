

var graphC=[], graphA=[], graphT=[];
var len = 50000;


function draw(maxy=42000) {
    document.getElementById('graph').innerHTML = "";


// 2. Use the margin convention practice
    var margin = {top: 50, right: 50, bottom: 50, left: 50}
        , width = 600 // Use the window's width
        , height = 400; // Use the window's height

// The number of datapoints
   // var n = 3;

// 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
        .domain([0, len-1]) // input
        .range([0, width]); // output

// 6. Y scale will use the randomly generate number
    var yScale = d3.scaleLinear()
        .domain([0, maxy]) // input
        .range([height, 0]); // output

// 7. d3's line generator
    var line = d3.line()
        .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
        .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
        .curve(d3.curveMonotoneX); // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    var datasetA = d3.range(len).map(function(d) { return {"y": graphA[d] } });
    var datasetC = d3.range(len).map(function(d) { return {"y": graphC[d] } });
    var datasetT = d3.range(len).map(function(d) { return {"y": graphT[d] } });

// 1. Add the SVG to the page and employ #2
    var svg = d3.select("div#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + parseInt(margin.left + margin.left) + "," + margin.top + ")");

    // legende :

    svg.append("circle").attr("cx",20).attr("cy",30).attr("r", 6).style("fill", "#a58d39");
    svg.append("circle").attr("cx",20).attr("cy",50).attr("r", 6).style("fill", "#C86A6A");
    svg.append("circle").attr("cx",20).attr("cy",70).attr("r", 6).style("fill", "#5C9FE7");
    svg.append("text").attr("x", 30).attr("y", 35).text("Capital des infrastrutures de pêche / 10").style("font-size", "12px").attr("alignment-baseline","middle");
    svg.append("text").attr("x", 30).attr("y", 55).text("Nombre de touristes").style("font-size", "12px").attr("alignment-baseline","middle");
    svg.append("text").attr("x", 30).attr("y", 75).text("Nombre de tortues").style("font-size", "12px").attr("alignment-baseline","middle");

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
        .datum(datasetA) // 10. Binds data to the line
        .attr("class", "lineA") // Assign a class for styling
        .attr("d", line); // 11. Calls the line generator

svg.append("path")
        .datum(datasetC) // 10. Binds data to the line
        .attr("class", "lineC") // Assign a class for styling
        .attr("d", line); // 11. Calls the line generator

svg.append("path")
        .datum(datasetT) // 10. Binds data to the line
        .attr("class", "lineT") // Assign a class for styling
        .attr("d", line); // 11. Calls the line generator


    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (-margin.left ) +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
        .text("Valeurs en moyenne sur l'année ");



    svg.append("text")
        .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
        .attr("transform", "translate("+ (width/2) +","+(height+ margin.bottom - 10)+")")  // centre below axis
        .text("Temps");
}
function ndsolve(f, x0, dt, tmax) {

    const n = f.size()[0];  // Number of variables
    const x = x0.clone();   // Current values of variables
    const dxdt = [];        // Temporary variable to hold time-derivatives
    const result = [];      // Contains entire solution

    const nsteps = math.divide(tmax, dt);
    console.log(nsteps)// Number of time steps
    for(let i=0; i<nsteps; i++) {
        // Compute derivatives
        for(let j=0; j<n; j++) {
            dxdt[j] = f.get([j]).apply(null, x.toArray())
        }
        // Euler method to compute next time step
        for(let j=0; j<n; j++) {
            x.set([j], math.add(x.get([j]), math.multiply(dxdt[j], dt)))
        }
        result.push(x.clone())
    }
    console.log(result);
    console.log(math.matrix(result));

    return math.matrix(result)
}

// Import the numerical ODE solver
math.import({ndsolve:ndsolve});

function calc() {

    // Create a math.js context for our simulation. Everything else occurs in the context of the expression parser!
    const sim = math.parser();

    let integrationStep = 0.001; // 0.01
    sim.evaluate(" dt = 0.001");
    let tfinal = len*integrationStep ;//0.05
    sim.evaluate(" tfinal = "+tfinal);

    sim.evaluate("zeta = 0.1");
    sim.evaluate("l = 0.00052");
//l = 0.00052
    sim.evaluate("g=0.5");
//g= (3.5 - 1.0)/12.0
    sim.evaluate("M= 15000");
//M= 36036

//p= 0.0004
    sim.evaluate("p= 300");
    sim.evaluate("a=1500");
//a= 10000.0
    sim.evaluate("eta = 0.00008");
//eta= 0.0008
    sim.evaluate("eps= 100");
    sim.evaluate("phi= 1833");
    sim.evaluate("phi2=1 ");
    sim.evaluate("del=0.1");
    sim.evaluate("mt=50");
    sim.evaluate("mp=0.1");
    sim.evaluate("alpha = 0.1");
    sim.evaluate("T2=5000");
    sim.evaluate("ip = 0.000001");
    sim.evaluate("it = 0.001");
    sim.evaluate("muE = 0.001");

    let del = parseInt(roomId = document.getElementById('valuePeche').value);
    sim.evaluate(`del = ${del}*0.002`);
    let a = parseInt(roomId = document.getElementById('valueTortue').value);
    sim.evaluate(`a = ${a}*0.01`);//*30`);
    let mp = parseInt(roomId = document.getElementById('valuePoisson').value);
    sim.evaluate(`mp = ${mp}*0.002`);
    let g = parseInt(roomId = document.getElementById('valueRepro').value);
    sim.evaluate(`g = ${g}*0.01`); // g=0.5

    let ip = parseInt(roomId = document.getElementById('valueIp').value);
    let ipval = ip*0.0000001;
    sim.evaluate(`ip = ${ipval}`);
    console.log("ipval");
    console.log(ipval);

    let zeta = parseInt(roomId = document.getElementById('valueZeta').value);
    let zetaval = 0.2-(zeta*0.002);
    sim.evaluate(`zeta = ${zetaval}`);
    console.log("zetaval");
    console.log(zetaval);

    let valueCap = parseInt(roomId = document.getElementById('valueCap').value);
    sim.evaluate(`C0 = ${valueCap}`);

    let valueAni = parseInt(roomId = document.getElementById('valueAni').value);
    sim.evaluate(`A0 = ${valueAni}`);

    let valueTour = parseInt(roomId = document.getElementById('valueTour').value);
    sim.evaluate(`T0 = ${valueTour}`);



     //   sim.evaluate(`C0 = 10000`);

     //   sim.evaluate(`A0 = 3000`);

    //    sim.evaluate(`T0 = 4000`);


    console.log("T0"+valueTour);

    sim.evaluate("dCdt(C, A, T) = (-del)*C + p*A*C*(mp)*ip + mt*T*it"); // p: nb poissons pour 1 tortues
    sim.evaluate("dAdt(C, A, T) = A*g*(1-(A/(1+M/(1+eta*T/(1+eps)))))-zeta*l*T*A - A*C*ip;");
    sim.evaluate("dTdt(C, A, T) = a*zeta*A -alpha*T + muE*C ");
    //sim.evaluate("dTdt(C, A, T) = T*(muE*C + a*zeta*A -alpha*T) ");
    //sim.evaluate("dTdt(C, A, T) = T*(muE*C/(C+phi) + a*zeta*A/(A+phi2)-alpha*T) ");
    sim.evaluate("result = ndsolve([dCdt, dAdt, dTdt], [C0, A0, T0], dt, tfinal)");


  /*  graphC[i] =  -del * graphC[i-1] + p * graphA[i-1] * mp + mt * graphT[i-1];

    graphA[i] =  graphA[i-1] * g * (1 -  graphA[i-1] / (1 + M / (1 + eta * graphT[i-1] / (eps + 1)))) - zeta * l *  graphA[i-1] * graphT[i-1] - p *  graphA[i-1];

    graphT[i] =  graphT[i-1] * (-c * graphT[i-1] / (graphT[i-1] + phi))  + a * zeta *  graphA[i-1];
    */

    //console.log(graphA);

    let data = sim.evaluate("transpose(result).toArray()");

    console.log(data);
    graphC=[];
    for(let i =0; i<data[0].length;i++){
        graphC.push(data[0][i]*0.1);
    }

   /* graphT=[];
    for(let i =0; i<data[2].length;i++){
        graphT.push(data[2][i]*0.1);
    }*/
    // graphC=data[0];
     graphA=data[1];
     graphT=data[2];

     console.log(graphC);
    let maxA = Math.max(...graphA);
    let maxT = Math.max(...graphT);
    let maxC = Math.max(...graphC);
    let maxY = Math.max(maxC,maxA,maxT);
    draw(maxY);
}

calc();

