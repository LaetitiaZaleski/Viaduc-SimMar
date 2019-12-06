function getVals(){
    // Get slider values
    var parent = this.parentNode;
    var slides = parent.getElementsByTagName("input");
    var slide1 = parseFloat( slides[0].value );
    var slide2 = parseFloat( slides[1].value );
    // Neither slider will clip the other, so make sure we determine which is larger
    if( slide1 > slide2 ){ var tmp = slide2; slide2 = slide1; slide1 = tmp; }

    var displayElement = parent.getElementsByClassName("rangeValues")[0];
    displayElement.innerHTML = slide1 + " - " + slide2;
}

/*window.onload = function(){
    // Initialize Sliders
    var sliderSections = document.getElementsByClassName("range-slider");
    for( var x = 0; x < sliderSections.length; x++ ){
        var sliders = sliderSections[x].getElementsByTagName("input");
        for( var y = 0; y < sliders.length; y++ ){
            if( sliders[y].type ==="range" ){
                sliders[y].oninput = getVals;
                // Manually trigger event first time to display values
                sliders[y].oninput();
            }
        }
    }
};*/

async function letsCalc() {

    var http = new XMLHttpRequest();
    nbFile = 0;

    RoomName = localStorage.getItem("roomName");
    ClassId = localStorage.getItem("classId");

    do {
        let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0-bound.dat";
        http.open('HEAD', tmpPath, false);
        http.send();
        nbFile= nbFile + 1
    }
    while (http.status != 404);
    // nb File = le nombre de fichier de cette partie pour ce joueur +1

    var TourMin = parseInt(document.getElementById('valueTourSliderVal').innerText.split(",")[0]);
    var TourMax = parseInt(document.getElementById('valueTourSliderVal').innerText.split(",")[1]);
    if (TourMin>TourMax){
        var aux = TourMin;
        TourMin = TourMax;
        TourMax = aux;
    }

    var jsonObj = {
        "room_name": localStorage.getItem("roomName"),
        "class_id": localStorage.getItem("classId"),
        "value_ani_min": parseInt(document.getElementById('valueAniSliderVal').innerText.split(",")[0]),
        "value_ani_max": parseInt(document.getElementById('valueAniSliderVal').innerText.split(",")[1]),
        "value_tour_min": TourMin,
        "value_tour_max": TourMax,
        "value_cap_min": parseInt(document.getElementById('valueCapSliderVal').innerText.split(",")[0]),
        "value_cap_max": parseInt(document.getElementById('valueCapSliderVal').innerText.split(",")[1]),
        "value_env_min": parseInt(document.getElementById('valueEnvSliderVal').innerText.split(",")[0]),
        "value_env_max": parseInt(document.getElementById('valueEnvSliderVal').innerText.split(",")[1]),
        "value_ouv_min": parseInt(document.getElementById('valueOuvSliderVal').innerText.split(",")[0]),
        "value_ouv_max": parseInt(document.getElementById('valueOuvSliderVal').innerText.split(",")[1])
    };
    data = JSON.stringify(jsonObj);

    console.log(data);

    postXMLHttp('/api?fct=lets_calc' +
        '&data=' + data,  function (ret) {
        alert("LE CALCUL EST FINI : " + ret);
        //getFile();
    });

    // on attend que le fichier soit créé :
    nbFile = nbFile -1;

    do {
        let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0-bound.dat";
        http.open('HEAD', tmpPath, false);
        http.send();
        sleep(1500)
    }
    while (http.status == 404);

    return 0;

}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}


async function getFile(calcul, ClassId = localStorage.getItem("classId")) {

    // recuperation des valeurs
    var RoomName = localStorage.getItem("roomName");
    var prefix = "v";

    if (calcul){ // on doit faire le calcul de noyau, on est dans preferences
        var f = await letsCalc();

    }
    else {
        if (ClassId == 1) {
            prefix = "MaireV";
        }
        if (ClassId == 2) {
            prefix = "IndustrielV";
        }
        if (ClassId == 3) {
            prefix = "EcologisteV";
        }
    }



    //var ClassId = localStorage.getItem("classId");

    var ValueAniMin = parseInt(document.getElementById(`${prefix}alueAniSliderVal`).innerText.split(",")[0]);
    var ValueAniMax = parseInt(document.getElementById(`${prefix}alueAniSliderVal`).innerText.split(",")[1]);
    var ValueTourMin = parseInt(document.getElementById(`${prefix}alueTourSliderVal`).innerText.split(",")[0]);
    var ValueTourMax = parseInt(document.getElementById(`${prefix}alueTourSliderVal`).innerText.split(",")[1]);
    var ValueCapMin = parseInt(document.getElementById(`${prefix}alueCapSliderVal`).innerText.split(",")[0]);
    var ValueCapMax = parseInt(document.getElementById(`${prefix}alueCapSliderVal`).innerText.split(",")[1]);
    var ValueEnvMin = parseInt(document.getElementById(`${prefix}alueEnvSliderVal`).innerText.split(",")[0]);
    var ValueEnvMax = parseInt(document.getElementById(`${prefix}alueEnvSliderVal`).innerText.split(",")[1]);
    var ValueOuvMin = parseInt(document.getElementById(`${prefix}alueOuvSliderVal`).innerText.split(",")[0]);
    var ValueOuvMax = parseInt(document.getElementById(`${prefix}alueOuvSliderVal`).innerText.split(",")[1]);



    // recuperer le dernier fichier créé :
    var i = -1;
    var http = new XMLHttpRequest();

    do {
        i++;
        let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + i + "-viab-0-bound.dat";

        http.open('HEAD', tmpPath, false);
        http.send();
    }
    while (http.status != 404);
    if (i > 0) {
        let numFile = i - 1;

        let path = "sources/output/" + RoomName + "_" + ClassId + "_" + numFile + "-viab-0-bound.dat";
        console.log("Path : " + path);

        var allData = {
            data1: [],
            data2: [],
            data3: [] // pas du virgule après le dernier
        };

        getXMLHttp(path, function (data) {
            // getXMLHttp("sources/output/SimMar_A0.000000_10.000000_C0.000000_10.000000_T0.000000_10.000000_eps0.000000_100.000000_zeta0.000000_20.000000_del0.100000_a100.000000_mp10.000000_g2.000000-viab-0-bound.dat", function (data) {
            let lineTab = data.split('\n');
            let aniTab = [];
            let capTab = [];
            let tourTab = [];


            for (i = 0; i < lineTab.length; i++) {
                let valueTab = lineTab[i].split('  ');
                if (valueTab.length >= 3) {
                    if (i % 10 == 0) { // on prend 1 point sur 10
                        aniTab.push(parseFloat(valueTab[0]));
                        capTab.push(parseFloat(valueTab[1]));
                        tourTab.push(parseFloat(valueTab[2]));

                    }
                }
            }
            ;

            console.log("longeur : " + aniTab.length);
            var role = "";
            var coulb = Math.floor(Math.random() * Math.floor(100)); //pour la variation de couleur
            var coulr = Math.floor(Math.random() * Math.floor(100));
            var coulg = Math.floor(Math.random() * Math.floor(100));
            var r = 6 + coulr;
            var g = 0 + coulg;
            var b = 165 + coulb;

            // points de contraintes :

            var p1 = [ValueAniMax, ValueCapMin, ValueTourMin];
            var p2 = [ValueAniMax, ValueCapMax, ValueTourMin];
            var p3 = [ValueAniMin, ValueCapMin, ValueTourMin];
            var p4 = [ValueAniMin, ValueCapMax, ValueTourMin];

            var p5 = [ValueAniMax, ValueCapMin, ValueTourMax];
            var p6 = [ValueAniMax, ValueCapMax, ValueTourMax];
            var p7 = [ValueAniMin, ValueCapMin, ValueTourMax];
            var p8 = [ValueAniMin, ValueCapMax, ValueTourMax];

            var contraintesAni = [p1[0], p2[0], p4[0], p3[0], p1[0], p5[0], p6[0], p2[0], p4[0], p8[0], p6[0], p8[0], p6[0], p8[0], p7[0], p5[0],p7[0], p3[0]];
            var contraintesCap = [p1[1], p2[1], p4[1], p3[1], p1[1], p5[1], p6[1], p2[1], p4[1], p8[1], p6[1], p8[1], p6[1], p8[1], p7[1], p5[1], p7[1], p3[1]];
            var contraintesTour = [p1[2], p2[2], p4[2], p3[2], p1[2], p5[2], p6[2], p2[2], p4[2], p8[2], p6[2], p8[2], p6[2], p8[2], p7[2], p5[2],p7[2], p3[2]];


            if (ClassId == 1) {
                col = 'rgb(' + r + ',' + g + ',' + b + ')';
                role = "Maire";
                console.log("b" + b)
            }
            if (ClassId == 2) {
                r = 204 + coulr;
                g = 121 + coulg;
                b = 184 + coulb;
                console.log("b" + b);
                col = 'rgb(' + r + ',' + g + ',' + b + ')';
                role = "Industriel"
            }
            if (ClassId == 3) {
                r = 28 + coulr;
                g = 108 + coulg;
                b = 6 + coulb;
                console.log("b" + b)
                col = 'rgb(' + r + ',' + g + ',' + b + ')';
                role = "Ecologiste"
            }

            var kerName = role + "_" + "A" + ValueAniMin + "-" + ValueAniMax + "C" + ValueCapMin + "-" + ValueCapMax + "T" + ValueTourMin + "-" + ValueTourMax + "Env" + ValueEnvMin + "-" + ValueEnvMax + "Fer" + ValueOuvMin + "-" + ValueOuvMax;
            var contraintesName = role + "_" + "contraintes" + "A" + ValueAniMin + "-" + ValueAniMax + "C" + ValueCapMin + "-" + ValueCapMax + "T" + ValueTourMin + "-" + ValueTourMax + "Env" + ValueEnvMin + "-" + ValueEnvMax + "Fer" + ValueOuvMin + "-" + ValueOuvMax;


            var contraintes = {
                x: contraintesAni,
                y: contraintesCap,
                z: contraintesTour,
                name: contraintesName,
                type: 'scatter3d',
                mode: 'lines+markers',
                marker: {
                    color: col,
                    size: 1,
                    symbol: 'circle',
                    line: {
                        color: col,
                        width: 1.0
                    },
                    opacity: 1.0
                },
            };

            var noyau = {
                x: aniTab,
                y: capTab,
                z: tourTab,
                name: kerName,
                mode: 'markers',
                marker: {
                    color: col,
                    size: 1,
                    symbol: 'circle',
                    line: {
                        color: col,
                        width: 0.01
                    },
                    opacity: 0.8
                },
                type: 'scatter3d'
            };


            var printData = [noyau, contraintes];

            var layout = {
                title: {
                    text: 'Noyau de viabilité'
                },
                scene: {
                    xaxis: {title: 'Animaux'},
                    yaxis: {title: 'Capital des infrastructures'},
                    zaxis: {title: 'Touristes'},
                },
            };
            Plotly.plot('kernelDiv', printData, layout);

        })
    }
}

function getAllFiles() {
    for(ClassId=1;ClassId<4; ClassId++){
        console.log("ClassID : "+ClassId);
        getFile(false, ClassId)
    }

}
