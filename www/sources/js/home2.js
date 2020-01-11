

var graphC=[], graphA=[], graphT=[];
var len = 100;


function draw() {
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
        .domain([0, 20000]) // input
        .range([height, 0]); // output

// 7. d3's line generator
    var line = d3.line()
        .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
        .y(function(d) { return yScale(d.y); }) // set the y values for the line generator
        .curve(d3.curveMonotoneX) // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    var datasetA = d3.range(len).map(function(d) { return {"y": graphA[d] } })
    var datasetC = d3.range(len).map(function(d) { return {"y": graphC[d] } })
    var datasetT = d3.range(len).map(function(d) { return {"y": graphT[d] } })

// 1. Add the SVG to the page and employ #2
    var svg = d3.select("div#graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + parseInt(margin.left + margin.left) + "," + margin.top + ")");


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
        .text("Années");
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
console.log("1")



    // Create a math.js context for our simulation. Everything else occurs in the context of the expression parser!
    const sim = math.parser();

    let integrationStep = 0.001; // 0.01
    sim.evaluate(" dt = 0.001");
    let tfinal = 0.1 ;//0.05
    sim.evaluate(" tfinal = "+tfinal);
    let l = 0.01;
    sim.evaluate("l = 0.01");
    //let g = 1.0;
    let M = 5000;
    sim.evaluate("M = 5000");
    let c = 0.01;
    sim.evaluate("c = 0.01");
    let p = 0.3;
    sim.evaluate("p = 0.3");
    //let a = 100.0;
    let e = 0.001;
    sim.evaluate("e = 0.001");
    let eta = 0.0005;
    sim.evaluate("eta = 0.0005");
    let phi = 1.0;
    sim.evaluate("phi = 1.0");
    let phi2 = 1.0;
    sim.evaluate("phi2 = 1.0");
    let d = 1.0;
    sim.evaluate("d = 1.0");
    let h = 12000.0;
    sim.evaluate("h = 12000.0");
    //let mp = 20.0;
    let mt = 0.5;
    sim.evaluate("mt = 0.5");

    let eps = 100;
    sim.evaluate("eps = 100");
    let zeta= 0.02;
    sim.evaluate("zeta= 0.02");

    let del = parseInt(roomId = document.getElementById('valuePeche').value);
    sim.evaluate(`del = ${del}`);
    let a = parseInt(roomId = document.getElementById('valueTortue').value);
    sim.evaluate(`a = ${a}*2`);
    let mp = parseInt(roomId = document.getElementById('valuePoisson').value);
    sim.evaluate(`mp = ${mp}*10`);
    let g = parseInt(roomId = document.getElementById('valueRepro').value);
    sim.evaluate(`g = ${g}`);

    sim.evaluate(" C0 =  10000");
    sim.evaluate(" A0 =  2000");
    let T0 = sim.evaluate(" T0 =  3000");
    //console.log(T0);

    sim.evaluate("dCdt(C, A, T) =  -del * C + p * A * mp + mt * T");
    sim.evaluate("dAdt(C, A, T) = A * g * (1 -  A / (1 + M / (1 + eta * T / (eps + 1)))) - zeta * l *  A * T - p *  A;");
    sim.evaluate("dTdt(C, A, T) = T * (-c * T / (T + phi))  + a * zeta * A");
    sim.evaluate("result = ndsolve([dCdt, dAdt, dTdt], [C0, A0, T0], dt, tfinal)");


  /*  graphC[i] =  -del * graphC[i-1] + p * graphA[i-1] * mp + mt * graphT[i-1];

    graphA[i] =  graphA[i-1] * g * (1 -  graphA[i-1] / (1 + M / (1 + eta * graphT[i-1] / (eps + 1)))) - zeta * l *  graphA[i-1] * graphT[i-1] - p *  graphA[i-1];

    graphT[i] =  graphT[i-1] * (-c * graphT[i-1] / (graphT[i-1] + phi))  + a * zeta *  graphA[i-1];
    */

    //console.log(graphA);

    let data = sim.evaluate("transpose(result).toArray()");

    console.log(data);
     graphC=data[0];
     graphA=data[1];
     graphT=data[2];
     console.log(graphC);
     draw();
}

calc();

/*
var integrationStep = 0.001 // 0.01
var timeStep = 0.01 //0.05
var l = 0.01
var g = 1.0
var M = 5000
var c = 0.01
var p = 0.3
var a = 100.0
var e = 0.001
var eta = 0.0005
var phi = 1.0
var phi2 = 1.0
var d = 1.0
var del = 0.1
var h = 12000.0
var mp = 20.0
var mt = 0.5


  integrationStep: Double = 0.01,
                   timeStep: Double = 0.05,
                   //zeta: Double = 0.01,
                   l: Double = 0.01,
                   g: Double = 1.0,
                   M: Double = 5000.0,
                   c: Double = 0.01,
                   p: Double = 0.3,
                   a: Double = 100.0,
                   e: Double = 0.001,
                   eta: Double = 0.0005,
                   //eps: Double = 10.0,
                   phi: Double = 1.0,
                   phi2: Double = 1.0,
                   d: Double = 1.0,
                   del: Double = 0.1,
                   h: Double = 12000.0,
                   mp: Double = 20.0,
                   mt: Double = 0.5

// valeurs de controle: eps control(1) et zeta control(0)



def dynamic(state: Vector[Double], control: Vector[Double]) = {
    // A: state(0), T: state(1), E: state(2)
    def CDot(state: Vector[Double], t: Double) =  -del * state(0) + p * state(1) * mp + mt * state(2)

def ADot(state: Vector[Double], t: Double) =  state(1) * g * (1 - state(1) / (1 + M / (1 + eta * state(2) / (control(1) + 1)))) - control(0) * l * state(1) * state(2) - p * state(1)

def TDot(state: Vector[Double], t: Double) =  state(2) * (-c * state(2) / (state(2) + phi))  + a * control(0) * state(1)


val dynamic = Dynamic(ADot, TDot, CDot)
dynamic.integrate(state.toArray, integrationStep, timeStep)
}
*/
