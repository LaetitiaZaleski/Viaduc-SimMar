function getFile() {

    getXMLHttp("sources/output/SimMar_A0.000000_10.000000_C0.000000_10.000000_T0.000000_10.000000_eps0.000000_100.000000_zeta0.000000_20.000000_del0.100000_a100.000000_mp10.000000_g2.000000-viab-0-bound.dat", function (data) {
        // getXMLHttp("sources/output/SimMar_A0.000000_10.000000_C0.000000_10.000000_T0.000000_10.000000_eps0.000000_100.000000_zeta0.000000_20.000000_del0.100000_a100.000000_mp10.000000_g2.000000-viab-0-bound.dat", function (data) {
        let lineTab = data.split('\n');
        let aniTab = [];
        let capTab = [];
        let tourTab = [];


        for (i = 0; i < lineTab.length; i++) {
            let valueTab = lineTab[i].split('  ');
            if (valueTab.length >= 3 ) {
                if(i%15 == 0){ // on prend 1 point sur 10
                    aniTab.push(parseFloat(valueTab[0]));
                    capTab.push(parseFloat(valueTab[1]));
                    tourTab.push(parseFloat(valueTab[2]));
                    //  console.log("---------------GOOD LINE !--------------" );
                    // console.log("LINE number : " + i);
                    // console.log("LINE value : " + lineTab[i]);
                }

            }
        };
      //  let last = aniTab.length-1;
       // console.log("la : " + last);
        console.log("longeur : " + aniTab.length);
      /*  console.log("ani last: " + aniTab[last]);
      //  console.log(" " + aniTab[0]);
       // console.log(" " + aniTab[1]);

        console.log("cap " + capTab[last]);
       // console.log(" " + capTab[0]);
       // console.log(" " + capTab[1]);

        console.log("tour " + tourTab[last]);
       // console.log(" " + tourTab[0]);
       // console.log(" " + tourTab[1]);*/

        var trace1 = {
            x: aniTab.slice(0, 250000),
            y: capTab.slice(0, 250000),
            z: tourTab.slice(0, 250000),
            mode: 'markers',
            marker: {
                color: 'rgb(21,22,127)',
                size: 1,
                symbol: 'circle',
                line: {
                    color: 'rgb(140,204,46)',
                    width: 0.01},
                opacity: 0.8},
            type: 'scatter3d'};

       // console.log("trace ok");
      /*  var trace2 = {
            x: aniTab[0],
            y: capTab[0],
            z: tourTab[0],
            mode: 'markers',
            marker: {
                size: 12,
                line: {
                    color: 'rgba(217, 217, 217, 0.14)',
                    width: 0.5},
                opacity: 0.8},
            type: 'scatter3d'

        }*/

        var data = [trace1];
      //  console.log("data ok");
        var layout = {margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 0
            }};
     //   console.log("layout ok");
        Plotly.newPlot('kernelDiv', data, layout);

    })
}