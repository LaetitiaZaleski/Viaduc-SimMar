$("#valueCap").slider({});
$("#valueCap").on("slide", function(slideEvt) {
    $("#valueCapSliderVal").text(slideEvt.value);
});
/*window.onload = function(){
    getImportances()
};*/

// TODO : changer tres important en 1,2,3,4 ...

function letsNotEmpty2(){
    getImportances();
    let url = window.location.href;
    let newParam = url.split("?")[1].replace("nonvide", "nonvidep2");
    window.location.href = "?" + newParam;
}

function getImportances(){
    for (let i= 0; i < importances.length; i++) {
        let imp =importances[i];
       // console.log(imp);
        let e = document.getElementById(imp);
        localStorage.setItem(imp,e.options[e.selectedIndex].text); //$('#' + imp).val()
    }
   // window.location.href = "?" + newParam;
}


async function getPrefs() {
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

        const importancesVal = {
            tImp : 1000.0,
            imp : 100.0,
            neutre : 10.0,
            pImp : 0.0
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
                        pas: 0.0,
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
        for (var i = 0; i < Prefs.length; i++) {
            switch (Prefs[i].importance) {
                case 'très important':
                case 'très importante':
                    Prefs[i].pas = Prefs[i].distVal / parseFloat(importancesVal.tImp);
                    Prefs[i].importance = parseInt(importancesVal.tImp);
                    Prefs[i].table = [0, 0, parseInt(importancesVal.tImp)];
                    console.log(Prefs[i].table);
                    break;
                case 'important':
                case 'importante':
                    Prefs[i].pas = Prefs[i].distVal / parseFloat(importancesVal.imp);
                    Prefs[i].importance = parseInt(importancesVal.imp);
                    Prefs[i].table = [0, 0, parseInt(importancesVal.imp)];
                    break;

                case 'neutre':
                    Prefs[i].pas = Prefs[i].distVal / parseFloat(importancesVal.neutre);
                    Prefs[i].importance = parseInt(importancesVal.neutre);
                    Prefs[i].table = [0, 0, parseInt(importancesVal.neutre)];
                    break;
                default :
                    Prefs[i].importance = parseFloat(importancesVal.pImp);
                    Prefs[i].table = [0, 0, parseInt(importancesVal.pImp)];
                    Prefs[i].pas = 0;
                    break;
            }
        }


        finalPrefs = [];
        PrefsInit0 = JSON.parse(JSON.stringify(Prefs));
        PrefsInit1 = JSON.parse(JSON.stringify(Prefs)); // copie du tableau
        PrefsInit2 = JSON.parse(JSON.stringify(Prefs));

        console.log(Prefs);
        console.log(PrefsInit1);
        console.log(PrefsInit2);

        console.log("recherche 1");
        let r1 = rechercheDiagonale(PrefsInit0, minMax); // OK tout seul

        console.log(Prefs);
        console.log(PrefsInit1);
        console.log(PrefsInit2);

        console.log("recherche 2");
        let r2 =rechercheUnParUn(PrefsInit1, minMax); // OK tout seul
        console.log(r2.data);
        console.log(r1.data);
        finalPrefs = [r1.data, r2.data];

        console.log("recherche 3");

        let priorite = recherchePriorite(PrefsInit2,minMax);

        for(k = 0; k<priorite.length; k++){
            finalPrefs.push(priorite[k]);
        }

        console.log("Final prefs :");
        for(k = 0; k<finalPrefs.length; k++){
            console.log("k :");
            console.log(k);
            console.log(finalPrefs[k]);
        }

    });

}
function removeDomine(data){ // enlève les éléments dominés d'un ptableau de datas
    for( var i = 0; i<data.length; i++){
        d = JSON.parse(data[i]);
        for( var j = 0; j<data.length; j++){
            dcompare = JSON.parse(data[i]);
            if(d.value_ani_min <= dcompare.value_ani_min && d.value_tour_min){

            }
        }

    }

}

/*
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
*/


// renvoie un tableau de noyaux plus proches non vides e
function rechercheDiagonale(Prefs, minMax, importab =[0.0,10.0,100.0,1000.0], nbEtapes=100){

    prefsInit = JSON.parse(JSON.stringify(Prefs));
    res = dichotomie(Prefs, minMax,importab, nbEtapes);

    /* Rafinement */
 //   console.log(importab);

    finalPrefs = rafinement(res.pref,prefsInit, minMax,importab,nbEtapes);

    return finalPrefs

}

function rechercheUnParUn(Prefs,minMax,importab =[0.0,10.0,100.0,1000.0], nbEtapes=100) { //on se rapproche d'abord des plus important plutot que de tout faire en même temps

    var newPrefs = {
        pref : JSON.parse(JSON.stringify(Prefs)),
        data : []
    };

    console.log(newPrefs.pref);
    console.log("importab");
    console.log(importab);
    prefsInit = JSON.parse(JSON.stringify(Prefs));


    for (var i=0; i<newPrefs.pref.length; i++) {
        // newImportab = new Array(importab.length).fill(0.0);
        if (newPrefs.pref[i].importance < importab[importab.length - 1]) { // si on est moins important on s'en occupe pas pour l'instant
            newPrefs.pref[i].importance = 0;
        }
    }
        newPrefs = dichotomie(newPrefs.pref, minMax, importab, nbEtapes);

    for (i=0; i<newPrefs.pref.length; i++) {
        // newImportab = new Array(importab.length).fill(0.0);
        if (newPrefs.pref[i].importance < importab[importab.length - 1]) { // on remet les niveaux d'importances précédents
            newPrefs.pref[i].importance = Prefs[i].importance;
        }
    }

    console.log("debut rafinement :");
    console.log(newPrefs.pref);

    newPrefs = rafinement(newPrefs.pref,Prefs, minMax, -1, (importab[importab.length -2]+1));
    return newPrefs
}

function recherchePriorite(Prefs,minMax,importab =[0.0,10.0,100.0,1000.0], nbEtapes=100) { // pour chacun des plus importants on se rapproche au maximum
 // on est pas obligé de faire par dichotomie, on pourrait essayer en diminuant progressivement le critère plus important ça va peut etre plus vite
    console.log("importab");
    console.log(importab);
    console.log("Newimportab");
    let res = 2*importab[importab.length-1];
    console.log("res");
    console.log(res);
    var newImportTab = importab;
    newImportTab.push(res); // on rajoute un degres d'importance
    console.log(newImportTab);
    let resTab = [];// tableau des noyaux non vide

    for(var i=0; i<Prefs.length; i++){
        if (Prefs[i].importance == importab[importab.length-2]){ // si c'etait un très important
            Prefs[i].importance = importab[importab.length-1]; // on met ce critere plus important que tous les autres
            var nonVide = rechercheUnParUn(Prefs,minMax,newImportTab, nbEtapes);
            console.log("non vide :");
            console.log(nonVide);
            resTab.push();
            Prefs[i].importance = importab[importab.length-2]// on lui rend son importance précédente
        }

    }
    return resTab
}


function rafinement(newPrefs,prefsInit, minMax,importMin=-1, importMax=5,importab =[0,10,100,1000], nbEtapes = 100){
    i=0;
    console.log("Debut rafinement :");
    for (j = 0; j < newPrefs.length; j++){
        // console.log("test : "+lastPrefsNonVide[j].name+" "+lastPrefsNonVide[j].importance);
        if ((importMin < prefsInit[j].importance) && (prefsInit[j].importance < importMax)){
            // si c'etait pas des importants on les traite comme des neutres :
            newPrefs[j].importance = importab[2];
            newPrefs[j].pas = prefsInit[j].distVal / newPrefs[j].importance;
            // var pasId = Prefs[i].name;
            newPrefs[j].table =[0,0,importab[2]];
         //   newPrefs[j]=prefsInit[j];
            console.log(newPrefs[j].table)
        }
        console.log("Pref init:");
        console.log(newPrefs)
        // si c'etait des importants on garde comme avant
    }
    return dichotomie(newPrefs,minMax,importab,nbEtapes,true); // non vide
}


// prend en entree le tableau des pref et le tableau des minMax et le nombres d'étapes max
// renvoie le tableau correspondant au dernier noyau non vide
function dichotomie(Prefs, minMax,importab =[0,10,100,1000], nbEtapes = 100, rafinement = false) {

    if (!rafinement) {
        for (var i = 0; i < Prefs.length; i++) {
            if (Prefs[i].importance >= 1) {
                Prefs[i].pas = Prefs[i].distVal / Prefs[i].importance;
            }
            Prefs[i].table = [0, 0, Prefs[i].importance];
            //  console.log(Prefs[i].name + Prefs[i].table);

        }
    }

        console.log(Prefs);

    //   debut de l'exploration :
    i=0;
    var lastNonVide = 0;
    var newPrefs = [];
    var newData = [];
    var dontstop = false;
    var prefsInit = JSON.parse(JSON.stringify(Prefs));
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
        let CapMin = Prefs[2];
        let CapMax = Prefs[3];
        let TourMin = Prefs[4];
        let TourMax = Prefs[5];
        let EnvMin = Prefs[6];
        let EnvMax = Prefs[7];
        let OuvMin = Prefs[8];
        let OuvMax = Prefs[9];


        test = TourMin.table[1]*TourMin.signe*TourMin.pas + minMax.TMin;
        console.log("test");
        console.log(test);
        console.log(TourMin.table[1]);
        console.log(TourMin.signe);
        console.log(TourMin.pas);
        console.log(minMax.TMin);

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
                dontstop = false;
                console.log("vide");
                console.log(Prefs);
                for (var j = 0; j < Prefs.length; j++) {

                     //   console.log(Prefs[j].name + Prefs[j].table);
                        Prefs[j].table[2] = Prefs[j].table[1];
                        Prefs[j].table[1] = Math.floor((Prefs[j].table[0] + Prefs[j].table[1]) / 2.0);
                     //   console.log(Prefs[j].name +Prefs[j].table);

                }
            }
            else {
                if (ret == "Ce noyau est negatif !") {
                    // si une iteration est vide c'est une erreur : on ne fait rien et on recommence
                    console.log("negatif");
                    dontstop = true;

                } else {
                    dontstop = false;
                    console.log("non vide");
                    lastNonVide = nbFile - 1;
                    newPrefs = JSON.parse(JSON.stringify(Prefs));
                    newData = data;
                    console.log(newPrefs);
                    console.log(Prefs);

                    for (j = 0; j < Prefs.length; j++) {
                        Prefs[j].table[0] = Prefs[j].table[1];
                        if (Prefs[j].table[1] === Prefs[j].table[0]) { // première iteration
                            Prefs[j].table[1] = Math.ceil((Prefs[j].table[0] + Prefs[j].table[2]) / 2.0);

                        } else {
                            Prefs[j].table[1] = Math.ceil((Prefs[j].table[0] + Prefs[j].table[1]) / 2.0);
                        }

                        // console.log(Prefs[j].name +Prefs[j].table);
                    }

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

        if(stop === Prefs.length && (dontstop === false)){
            i=100;
        }
        i++;
    }

    const result = {
      pref : newPrefs,
      data : newData
    };

    console.log("dernier non vide : ");
    console.log(result.data);
    return result ;// non vide
}



function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
