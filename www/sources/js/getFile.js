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


    var jsonObj = {
        "room_name": localStorage.getItem("roomName"),
        "class_id": localStorage.getItem("classId"),
        "value_ani_min": parseInt(document.getElementById('valueAniSliderVal2').innerText),
        "value_ani_max": parseInt(document.getElementById('valueAniSliderVal3').innerText),
        "value_tour_min": parseInt(document.getElementById('valueTourSliderVal2').innerText),
        "value_tour_max": parseInt(document.getElementById('valueTourSliderVal3').innerText),
        "value_cap_min": parseInt(document.getElementById(`valueCapSliderVal2`).innerText),
        "value_cap_max": parseInt(document.getElementById(`valueCapSliderVal3`).innerText),
        "value_env_min": parseInt(document.getElementById('valueEnvSliderVal2').innerText),
        "value_env_max": parseInt(document.getElementById('valueEnvSliderVal3').innerText),
        "value_ouv_min": parseInt(document.getElementById('valueOuvSliderVal2').innerText),
        "value_ouv_max": parseInt(document.getElementById('valueOuvSliderVal3').innerText),

        "value_ani_faux_min": parseInt(document.getElementById('valueAniSliderVal1').innerText),
        "value_ani_faux_max": parseInt(document.getElementById('valueAniSliderVal4').innerText),
        "value_tour_faux_min": parseInt(document.getElementById('valueTourSliderVal1').innerText),
        "value_tour_faux_max": parseInt(document.getElementById('valueTourSliderVal4').innerText),
        "value_cap_faux_min": parseInt(document.getElementById(`valueCapSliderVal1`).innerText),
        "value_cap_faux_max": parseInt(document.getElementById(`valueCapSliderVal4`).innerText),
        "value_env_faux_min": parseInt(document.getElementById('valueEnvSliderVal1').innerText),
        "value_env_faux_max": parseInt(document.getElementById('valueEnvSliderVal4').innerText),
        "value_ouv_faux_min": parseInt(document.getElementById('valueOuvSliderVal1').innerText),
        "value_ouv_faux_max": parseInt(document.getElementById('valueOuvSliderVal4').innerText)
    };

    data = JSON.stringify(jsonObj);

    console.log(data);
    neg = true;
    //nbFile = nbFile-1;
    postXMLHttp('/api?fct=lets_calc' +
        '&data=' + data, function (ret) {
        console.log(ret);
        if (ret !== "Ce noyau est negatif !"){
            alert("LE CALCUL EST FINI : " + ret);
            //getFile();
            neg = false;
        }
        if (ret === "Votre noyau n'est pas vide !"){
            document.getElementById('continue').hidden = false;
        }
        if (ret === "Ce noyau est vide !"){
            document.getElementById('continue').hidden = true;
        }

    });
    nbFile = nbFile -1;

    let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0-bound.dat";
    do {
        //  console.log(tmpPath);
        //  let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0-boundy.dat";
        http.open('HEAD', tmpPath, false);
        http.send();
        sleep(1000)
    }
    while (http.status === 404);


    while (neg) {
            neg = false;
            postXMLHttp('/api?fct=lets_calc' +
                '&data=' + data, function (ret) {
                if (ret === "Ce noyau est negatif !"){
                   // alert("LE CALCUL EST FINI : " + ret);
                    //getFile();
                    neg = true;
                }
                if (ret === "Votre noyau n'est pas vide !"){
                    document.getElementById('continue').hidden = false;
                }
                if (ret === "Ce noyau est vide !"){
                    document.getElementById('continue').hidden = true;
                }


            });
            nbFile = nbFile+1;
        do {
            let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0-bound.dat";
            //  console.log(tmpPath);
            //  let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0-boundy.dat";
            http.open('HEAD', tmpPath, false);
            http.send();
            console.log("wait");
            console.log(nbFile);
            sleep(1500)
        }
        while (http.status === 404);

        }

    document.getElementById('help').hidden = false;



    // on attend que le fichier soit créé :


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


async function getFile(calcul, commun = false, ClassId = localStorage.getItem("classId")) {

    // recuperation des valeurs
    var RoomName = localStorage.getItem("roomName");
    var prefix = "v";

    if (calcul){ // on doit faire le calcul de noyau, on est dans preferences
        var f = await letsCalc();

        var ValueAniMin = parseInt(document.getElementById(`${prefix}alueAniSliderVal2`).innerText);
        var ValueAniMax = parseInt(document.getElementById(`${prefix}alueAniSliderVal3`).innerText);
        var ValueTourMin = parseInt(document.getElementById(`${prefix}alueTourSliderVal2`).innerText);
        var ValueTourMax = parseInt(document.getElementById(`${prefix}alueTourSliderVal3`).innerText);
        var ValueCapMin = parseInt(document.getElementById(`${prefix}alueCapSliderVal2`).innerText);
        var ValueCapMax = parseInt(document.getElementById(`${prefix}alueCapSliderVal3`).innerText);
        var ValueEnvMin = parseInt(document.getElementById(`${prefix}alueEnvSliderVal2`).innerText);
        var ValueEnvMax = parseInt(document.getElementById(`${prefix}alueEnvSliderVal3`).innerText);
        var ValueOuvMin = parseInt(document.getElementById(`${prefix}alueOuvSliderVal2`).innerText);
        var ValueOuvMax = parseInt(document.getElementById(`${prefix}alueOuvSliderVal3`).innerText);


    }
    else {
        if (ClassId == 1) {
            prefix = "Maire";
        }
        if (ClassId == 2) {
            prefix = "Pecheur";
        }
        if (ClassId == 3) {
            prefix = "Ecologiste";
        }

        var ValueAniMin = parseInt(document.getElementById(`valueAni${prefix}SliderVal2`).innerText);
        var ValueAniMax = parseInt(document.getElementById(`valueAni${prefix}SliderVal3`).innerText);
        var ValueTourMin = parseInt(document.getElementById(`valueTour${prefix}SliderVal2`).innerText);
        var ValueTourMax = parseInt(document.getElementById(`valueTour${prefix}SliderVal3`).innerText);
        var ValueCapMin = parseInt(document.getElementById(`valueCap${prefix}SliderVal2`).innerText);
        var ValueCapMax = parseInt(document.getElementById(`valueCap${prefix}SliderVal3`).innerText);
        var ValueEnvMin = parseInt(document.getElementById(`valueEnv${prefix}SliderVal2`).innerText);
        var ValueEnvMax = parseInt(document.getElementById(`valueEnv${prefix}SliderVal3`).innerText);
        var ValueOuvMin = parseInt(document.getElementById(`valueOuv${prefix}SliderVal2`).innerText);
        var ValueOuvMax = parseInt(document.getElementById(`valueOuv${prefix}SliderVal3`).innerText);

    }

    //var ClassId = localStorage.getItem("classId");





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
                    if (i % 3 === 0) { // on prend 1 point sur 10
                        aniTab.push(parseFloat(valueTab[0]));
                        capTab.push(parseFloat(valueTab[1]));
                        tourTab.push(parseFloat(valueTab[2]));

                    }
                }
            }

            console.log("longeur : " + aniTab.length);
            var role = "";
            var coulb = Math.floor(Math.random() * Math.floor(100)); //pour la variation de couleur
            var coulr = Math.floor(Math.random() * Math.floor(100));
            var coulg = Math.floor(Math.random() * Math.floor(100));
            var r = 6 + coulr;
            var g = coulg;
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

            let name_commun ='';
            if(commun){
                name_commun ='_commun';
            }

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
                role = "Pecheur"
            }
            if (ClassId == 3) {
                r = 28 + coulr;
                g = 108 + coulg;
                b = 6 + coulb;
                console.log("b" + b);
                col = 'rgb(' + r + ',' + g + ',' + b + ')';
                role = "Ecologiste"
            }

            var kerName = role +name_commun+ "_" + "A" + ValueAniMin + "-" + ValueAniMax + "C" + ValueCapMin + "-" + ValueCapMax + "T" + ValueTourMin + "-" + ValueTourMax + "Env" + ValueEnvMin + "-" + ValueEnvMax + "Fer" + ValueOuvMin + "-" + ValueOuvMax;
            var contraintesName = role +name_commun+ "_" + "contraintes" + "A" + ValueAniMin + "-" + ValueAniMax + "C" + ValueCapMin + "-" + ValueCapMax + "T" + ValueTourMin + "-" + ValueTourMax + "Env" + ValueEnvMin + "-" + ValueEnvMax + "Fer" + ValueOuvMin + "-" + ValueOuvMax;


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

function getAllFiles(commun = true) {
    for(ClassId=1;ClassId<4; ClassId++){
        console.log("ClassID : "+ClassId);
        getFile(false,commun, ClassId)
    }
    if(!commun){
        document.getElementById("calcul").hidden = false
    }
}





async function getFileBynum(numFile,name, ClassId = localStorage.getItem("classId")) { //affiche une noyau

    // recuperation des valeurs
    var RoomName = localStorage.getItem("roomName");

    // recuperer le dernier fichier créé :
    var http = new XMLHttpRequest();

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
                    if (i % 3 === 0) { // on prend 1 point sur 10
                        aniTab.push(parseFloat(valueTab[0]));
                        capTab.push(parseFloat(valueTab[1]));
                        tourTab.push(parseFloat(valueTab[2]));

                    }
                }
            }

            console.log("longeur : " + aniTab.length);
            var role = "";
             //pour la variation de couleur
            var coulr = Math.floor(Math.random() * Math.floor(255));
            var r = coulr ;
            var g = 0;
            var b = 0;

            // points de contraintes :

            if (ClassId == 1) {
                col = 'rgb(' + r + ',' + g + ',' + b + ')';
                role = "Maire";
                console.log("b" + b)
            }
            if (ClassId == 2) {
                r =  coulr;
                g =  coulg;
                b =  coulb;
                console.log("b" + b);
                col = 'rgb(' + r + ',' + g + ',' + b + ')';
                role = "Pecheur"
            }
            if (ClassId == 3) {
                r =  coulr;
                g =  coulg;
                b =  coulb;
                console.log("b" + b);
                col = 'rgb(' + r + ',' + g + ',' + b + ')';
                role = "Ecologiste"
            }

            var kerName = name;


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


            var printData = [noyau];

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

        });
}
