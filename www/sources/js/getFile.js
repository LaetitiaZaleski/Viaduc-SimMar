function getFile() {

    getXMLHttp("sources/output/SimMar2500.000000NumericalScheme4-viab-0.dat", function (data) {


        let lineTab = data.split('\n');
        for (i = 0; i < lineTab.length; i++) {
            let valueTab = lineTab[i].split(' ');
            if (valueTab.length >= 4 && valueTab[3] === "1.0") {
                console.log("---------------GOOD LINE !--------------" );
                console.log("LINE number : " + i);
                console.log("LINE value : " + lineTab[i]);
            }
        }
    })
}