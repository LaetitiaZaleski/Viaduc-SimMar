$("#valueCap").slider({});
$("#valueCap").on("slide", function(slideEvt) {
    $("#valueCapSliderVal").text(slideEvt.value);
});
/*window.onload = function(){
    getImportances()
};*/


function getImportances(){
    var importances = ["ImportanceAniMin", "ImportanceAniMax", "ImportanceTourMin", "ImportanceTourMax",
        "ImportanceCapMin", "ImportanceCapMax", "ImportanceEnvMin", "ImportanceEnvMax", "ImportanceOuvMin",
        "ImportanceOuvMax"];

    for (var i= 0; i < importances.length; i++) {
        var imp =importances[i];
       // console.log(imp);
        var e = document.getElementById(imp);
        localStorage.setItem(imp,e.options[e.selectedIndex].text);
    }
   // window.location.href = "?" + newParam;
}


async function getPrefs() {
    getImportances();

    getXMLHttp('/api?fct=get_preference' +
        '&room_name=' + localStorage.getItem("roomName"),  function (ret) {

        // Valeurs de min et max absolu :
        const minMax = {
            AMax : 20000,
            AMin : 500,
            CMax : 20000,
            CMin : 500,
            TMax : 20000,
            TMin : 500,
            EnvMax : 100,
            EnvMin : 0,
            OuvMax : 50,
            OuvMin : 0
    };


        let className = "";
        // console.log(localStorage.getItem("classId"));
        switch (localStorage.getItem("classId")) {
            case "1" :
                className = "Maire";
                break;
            case "2" :
                className = "Industriel";
                break;
            default :
                className = "Ecologiste";

        }
       // console.log(className);
        obj = JSON.parse(ret);
       // console.log(obj);
        if (obj !== null && obj.length > 0) {
            for (i = 0; i < obj.length; i++) {
                if (obj[i].class_name.toString() == className) {
                 // console.log("hello");
                    // Pour les max : on regarde la distance à la borne min : il s'agit de la veleur normalisée, pour les mins,
                    // on regarde la valeur à la borne max : c'est 1- la valeur normalisée.

                    const AniMin = {
                        val: obj[i].preference.value_ani_min,
                        name: "Minimum sur le nombre d'animaux",
                        distVal: obj[i].preference.value_ani_min - minMax.AMin,
                        importance: localStorage.getItem("ImportanceAniMin"),
                        signe: 1,
                        pas: 0.0,
                        table : [0]
                    };

                    const AniMax = {
                        val: obj[i].preference.value_ani_max,
                        name: "Maximum sur le nombre d'animaux",
                        distVal: minMax.AMax - obj[i].preference.value_ani_max,
                        importance: localStorage.getItem("ImportanceAniMax"),
                        signe: -1,
                        pas: 0.0,
                        table : [0]
                    };
                    const CapMin = {
                        val: obj[i].preference.value_cap_min,
                        name: "Minimum sur le capital des pêcheurs",
                        distVal: obj[i].preference.value_cap_min - minMax.CMin,
                        importance: localStorage.getItem("ImportanceCapMin"),
                        signe: 1,
                        pas: 0.0,
                        table : [0]
                    };
                    const CapMax = {
                        val: obj[i].preference.value_cap_max,
                        name: "Maximum sur le capital des pêcheurs",
                        distVal: minMax.CMax - obj[i].preference.value_cap_max,
                        importance: localStorage.getItem("ImportanceCapMax"),
                        signe: -1,
                        pas: 0.0,
                        table : [0]
                    };

                    const TourMin = {
                        val: obj[i].preference.value_tour_min,
                        name: "Minimum sur le nombre de touristes",
                        distVal: obj[i].preference.value_tour_min - minMax.TMin,
                        importance: localStorage.getItem("ImportanceTourMin"),
                        signe: 1,
                        pas: obj[i].preference.value_tour_min - minMax.TMin,
                        table : [0]
                    };
                    const TourMax = {
                        val: obj[i].preference.value_tour_max,
                        name: "Maximum sur le nombre de touristes",
                        distVal: (minMax.TMax - obj[i].preference.value_tour_max),
                        importance: localStorage.getItem("ImportanceTourMax"),
                        signe: -1,
                        pas: 0.0,
                        table : [0]
                    };

                    const EnvMin = {
                        val: obj[i].preference.value_env_min,
                        name: "Minimum sur la restauration de l'environement",
                        distVal: obj[i].preference.value_env_min - minMax.EnvMin,
                        importance: localStorage.getItem("ImportanceEnvMin"),
                        signe: 1,
                        pas: 0.0,
                        table : [0]
                    };
                    const EnvMax = {
                        val: obj[i].preference.value_env_max,
                        name: "Maximum sur la restauration de l'environement",
                        distVal: (minMax.EnvMax - obj[i].preference.value_env_max),
                        importance: localStorage.getItem("ImportanceEnvMax"),
                        signe: -1,
                        pas: 0.0,
                        table : [0]
                    };

                    const OuvMin = {
                        val: obj[i].preference.value_ouv_min,
                        name: "Minimum sur l'ouverture du parc",
                        distVal: obj[i].preference.value_ouv_min - minMax.OuvMin,
                        importance: localStorage.getItem("ImportanceOuvMin"),
                        signe: 1,
                        pas: 0.0,
                        table : [0]
                    };
                    const OuvMax = {
                        val: obj[i].preference.value_ouv_max,
                        name: "Maximum sur l'ouverture du parc",
                        distVal: (minMax.OuvMax - obj[i].preference.value_ouv_max),
                        importance: localStorage.getItem("ImportanceOuvMax"),
                        signe: -1,
                        pas: 0.0,
                        table : [0]
                    };

                    Prefs = [AniMin, AniMax, CapMin, CapMax, TourMin, TourMax, EnvMin, EnvMax, OuvMin, OuvMax]

                }
            }
        }

        finalPrefs = rechercheNonVide(Prefs, minMax)

    });

}

function rechercheNonVide(Prefs, minMax, importab =[0.0,10.0,100.0,1000.0], nbEtapes=100){

    prefsInit = [...Prefs];
    newPrefs = dichotomie(Prefs, minMax,importab, nbEtapes);
    console.log(newPrefs);

    /* Rafinement */
    console.log(importab)
    finalPrefs = rafinement(newPrefs,prefsInit, minMax,importab,nbEtapes);

    return finalPrefs

}



// prend en entree le tableau des pref et le tableau des minMax et le nombres d'étapes max
// renvoie le tableau correspondant au dernier noyau non vide
function dichotomie(Prefs, minMax,importab =[0,10,100,1000], nbEtapes = 100, rafinement = false) {

    if (!rafinement){
        for (var i = 0; i < Prefs.length; i++) {

            switch (Prefs[i].importance) {
                case 'très important':
                case 'très importante':
                    //    console.log(Prefs[i].distVal / 1000.0);
                    Prefs[i].pas = Prefs[i].distVal / parseFloat(importab[3]);
                    // console.log("pas :" + Prefs[i].pas);
                    Prefs[i].importance = parseInt(importab[3]);
                    Prefs[i].table = [0,0,parseInt(importab[3])];
                    break;

                    //        var pasId = Prefs[i].name;
                    //       var pas = document.getElementById(pasId);
                    //       pas.innerHTML = "Augmenter le " + Prefs[i].name + " de " + Prefs[i].pas.toString();
                    break;
                case 'important':
                case 'importante':
                    Prefs[i].pas = Prefs[i].distVal / parseFloat(importab[2]);
                    Prefs[i].importance = parseInt(importab[2]);
                    Prefs[i].table = [0,0,parseInt(importab[2])];
                    break;

                //         var pasId = Prefs[i].name;
                //       var pas = document.getElementById(pasId);
                //     pas.innerHTML = "Augmenter le " + Prefs[i].name + " de " + Prefs[i].pas.toString();
                case 'neutre':
                    Prefs[i].pas = Prefs[i].distVal / parseFloat(importab[1]);
                    // var pasId = Prefs[i].name;
                    Prefs[i].importance = parseInt(importab[1]);
                    Prefs[i].table = [0,0,parseInt(importab[1])];
                    //     var pas = document.getElementById(pasId);
                    //    pas.innerHTML = "Augmenter le " + Prefs[i].name + " de " + Prefs[i].pas.toString();
                    break;
                default :
                    Prefs[i].importance = parseFloat(importab[0]);
                    Prefs[i].table = [0,0,parseInt(importab[0])];
                    break;
            }

            //  console.log(Prefs[i].name + Prefs[i].table);

        }
    }


    // console.log(Prefs);
    //   debut de l'exploration :
    i=0;
    var lastNonVide = 0;
    var newPrefs = [];
    var prefsInit = Prefs;
    while (i<nbEtapes){
        console.log("******** etape numero: "+i+" ******** "+ "rafinement : "+rafinement);

        var http = new XMLHttpRequest();
        var nbFile = 0;

        let RoomName = localStorage.getItem("roomName");
        let ClassId = localStorage.getItem("classId");

        do {
            let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0-bound.dat";
            http.open('HEAD', tmpPath, false);
            http.send();
            nbFile = nbFile + 1
        } while (http.status !== 404);

        let AniMin = Prefs[0];
        let AniMax = Prefs[1];
        let TourMin = Prefs[2];
        let TourMax = Prefs[3];
        let CapMin = Prefs[4];
        let CapMax = Prefs[5];
        let EnvMin = Prefs[6];
        let EnvMax = Prefs[7];
        let OuvMin = Prefs[8];
        let OuvMax = Prefs[9];
        var jsonObj = {
            "room_name": localStorage.getItem("roomName"),
            "class_id": localStorage.getItem("classId"),
            "value_ani_min": Math.ceil(AniMin.table[1]*AniMin.signe*AniMin.pas + minMax.AMin),
            "value_ani_max":  Math.floor(AniMax.table[1]*AniMax.signe*AniMax.pas + minMax.AMax),
            "value_tour_min": Math.ceil(TourMin.table[1]*TourMin.signe*TourMin.pas + minMax.TMin),
            "value_tour_max": Math.floor(TourMax.table[1]*TourMax.signe*TourMax.pas + minMax.TMax),
            "value_cap_min": Math.ceil(CapMin.table[1]*CapMin.signe*CapMin.pas + minMax.CMin),
            "value_cap_max": Math.floor(CapMax.table[1]*CapMax.signe*CapMax.pas + minMax.CMax),
            "value_env_min": Math.ceil(EnvMin.table[1]*EnvMin.signe*EnvMin.pas + minMax.EnvMin),
            "value_env_max": Math.floor(EnvMax.table[1]*EnvMax.signe*EnvMax.pas + minMax.EnvMax),
            "value_ouv_min": Math.ceil(OuvMin.table[1]*OuvMin.signe*OuvMin.pas + minMax.OuvMin),
            "value_ouv_max":Math.floor(OuvMax.table[1]*OuvMax.signe*OuvMax.pas + minMax.OuvMax)
        };
        var data = JSON.stringify(jsonObj);


        console.log(data);

        // Dichotomie :
         postXMLHttp('/api?fct=lets_calc' +
            '&data=' + data, function (ret) {
            if (ret == "Ce noyau est vide !"){
                console.log("vide");
                // si la première iteration est vide c'est une erreur : on ne fait rien et on recommence
                console.log(Prefs);
                for (var j = 0; j < Prefs.length; j++) {
                    if(parseInt(Prefs[j].table[1]) === parseInt(Prefs[j].table[0])) {
                    }else{
                        console.log(Prefs[j].name + Prefs[j].table);
                        Prefs[j].table[2] = Prefs[j].table[1];
                        Prefs[j].table[1] = Math.floor((Prefs[j].table[0] + Prefs[j].table[1]) / 2.0);
                        console.log(Prefs[j].name +Prefs[j].table);
                    }
                }
            }
            else {
                console.log("non vide");
                lastNonVide = nbFile-1;
                newPrefs = [...Prefs];
                for (j = 0; j < Prefs.length; j++) {

                    Prefs[j].table[0] = Prefs[j].table[1];
                    if (Prefs[j].table[1] === Prefs[j].table[0]){ // première iteration
                        Prefs[j].table[1] = Math.ceil((Prefs[j].table[0] + Prefs[j].table[2]) / 2.0);

                    }else{
                        Prefs[j].table[1] = Math.ceil((Prefs[j].table[0] + Prefs[j].table[1]) / 2.0);
                    }

                    // console.log(Prefs[j].name +Prefs[j].table);
                }
            }

            nbFile = nbFile - 1;
        });
        do {
            let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0-bound.dat";
            http.open('HEAD', tmpPath, false);
            http.send();
            sleep(1500)
        }
        while (http.status === 404);
        // pour toutes les pref si tab[1] == tab[2] on stoppe
        var stop = 0;
        for (var j = 0; j < Prefs.length; j++) {
            //   console.log(Prefs[j].name + Prefs[j].table);
            if ((Prefs[j].table[1] === Prefs[j].table[2])||((Prefs[j].table[1]+1) === Prefs[j].table[2])){
                stop++
            }
        }

        if(stop === Prefs.length){
            i=100;
        }
        i++;
    }

    return newPrefs // non vide

}

function rafinement(newPrefs,prefsInit, minMax,importab =[0,10,100,1000], nbEtapes = 100){
    i=0;
    for (j = 0; j < newPrefs.length; j++){
        // console.log("test : "+lastPrefsNonVide[j].name+" "+lastPrefsNonVide[j].importance);
        if (newPrefs[j].importance < importab[1]){
            // si c'etait pas des importants on les traite comme des neutres
            prefsInit[j].importance = importab[2];
            prefsInit[j].pas = prefsInit[j].distVal / prefsInit[j].importance;
            // var pasId = Prefs[i].name;
            prefsInit[j].table =[0,0,importab[2]];
            newPrefs[j]=prefsInit[j]
        }
        else{ // si c'etait des importants on garde comme avant

        }
    }
    return dichotomie(newPrefs,minMax,importab,nbEtapes,true); // non vide
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
