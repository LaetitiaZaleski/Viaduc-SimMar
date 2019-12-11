



let precision = 10;

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
        console.log(document.getElementById(imp).checked);
        let checked = document.getElementById(imp).checked;

        if(checked){
            localStorage.setItem(imp,"très important"); //$('#' + imp).val()
        }else {
            localStorage.setItem(imp,"peu important");
        }
    }
   // window.location.href = "?" + newParam;
}




async function getPrefs() {
    getXMLHttp('/api?fct=get_preference' +
        '&room_name=' + localStorage.getItem("roomName"),  function (ret) {

        getImportances();

        // Valeurs de min et max absolu :
        const minMax = {
            AMax : 20000,
            AMin : 0,
            CMax : 20000,
            CMin : 0,
            TMax : 20000,
            TMin : 0,
            EnvMax : 100,
            EnvMin : 0,
            OuvMax : 50,
            OuvMin : 0
        };

        const fauxMinMax = {
            AMax : parseInt(localStorage.getItem("AniFauxMax")),
            AMin : parseInt(localStorage.getItem("AniFauxMin")),
            CMax : parseInt(localStorage.getItem("CapFauxMax")),
            CMin : parseInt(localStorage.getItem("CapFauxMin")),
            TMax : parseInt(localStorage.getItem("TourFauxMax")),
            TMin : parseInt(localStorage.getItem("TourFauxMin")),
            EnvMax : parseInt(localStorage.getItem("EnvFauxMax")),
            EnvMin : parseInt(localStorage.getItem("EnvFauxMin")),
            OuvMax : parseInt(localStorage.getItem("OuvFauxMax")),
            OuvMin : parseInt(localStorage.getItem("OuvFauxMin"))
        };


        const importancesVal = {
            tImp : 100.0,
            imp : 50.0,
            neutre : 10.0,
            pImp : 1.0
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
                        val: localStorage.getItem("AniMin"),
                        name: "Minimum sur le nombre d'animaux",
                        distVal: obj[i].preference.value_ani_min - minMax.AMin,
                        importance: localStorage.getItem("ImportanceAniMin"),
                        signe: 1,
                        pas: Math.ceil((Math.max(1,(minMax.AMin -fauxMinMax.AMin)))/precision),
                        table : [0]
                    };

                    const AniMax = {
                        val: localStorage.getItem("AniMax"),
                        name: "Maximum sur le nombre d'animaux",
                        distVal: minMax.AMax - obj[i].preference.value_ani_max,
                        importance: localStorage.getItem("ImportanceAniMax"),
                        signe: -1,
                        pas:  Math.ceil((Math.max(1,(fauxMinMax.AMax -minMax.AMax)))/precision),
                        table : [0]
                    };
                    const CapMin = {
                        val: localStorage.getItem("CapMin"),
                        name: "Minimum sur le capital des pêcheurs",
                        distVal: obj[i].preference.value_cap_min - minMax.CMin,
                        importance: localStorage.getItem("ImportanceCapMin"),
                        signe: 1,
                        pas: Math.ceil((Math.max(1,(minMax.CMin -fauxMinMax.CMin)))/precision),
                        table : [0]
                    };
                    const CapMax = {
                        val: localStorage.getItem("CapMax"),
                        name: "Maximum sur le capital des pêcheurs",
                        distVal: minMax.CMax - obj[i].preference.value_cap_max,
                        importance: localStorage.getItem("ImportanceCapMax"),
                        signe: -1,
                        pas: Math.ceil(Math.max(1,((fauxMinMax.CMax -minMax.CMax)))/precision),
                        table : [0]
                    };

                    const TourMin = {
                        val: localStorage.getItem("TourMin"),
                        name: "Minimum sur le nombre de touristes",
                        distVal: obj[i].preference.value_tour_min - minMax.TMin,
                        importance: localStorage.getItem("ImportanceTourMin"),
                        signe: 1,
                        pas: Math.ceil(Math.max(1,((minMax.TMin -fauxMinMax.TMin)))/precision),
                        table : [0]
                    };
                    const TourMax = {
                        val: localStorage.getItem("TourMax"),
                        name: "Maximum sur le nombre de touristes",
                        distVal: (minMax.TMax - obj[i].preference.value_tour_max),
                        importance: localStorage.getItem("ImportanceTourMax"),
                        signe: -1,
                        pas: Math.ceil(Math.max(1,((fauxMinMax.TMax -minMax.TMax)))/precision),
                        table : [0]
                    };

                    const EnvMin = {
                        val: localStorage.getItem("EnvMin"),
                        name: "Minimum sur la restauration de l'environement",
                        distVal: obj[i].preference.value_env_min - minMax.EnvMin,
                        importance: localStorage.getItem("ImportanceEnvMin"),
                        signe: 1,
                        pas: Math.ceil(Math.max(1,((minMax.EnvMin -fauxMinMax.EnvMin)))/precision),
                        table : [0]
                    };
                    const EnvMax = {
                        val: localStorage.getItem("EnvMax"),
                        name: "Maximum sur la restauration de l'environement",
                        distVal: (minMax.EnvMax - obj[i].preference.value_env_max),
                        importance: localStorage.getItem("ImportanceEnvMax"),
                        signe: -1,
                        pas:Math.ceil(Math.max(1,((fauxMinMax.EnvMax -minMax.EnvMax)))/precision),
                        table : [0]
                    };

                    const OuvMin = {
                        val: localStorage.getItem("OuvMin"),
                        name: "Minimum sur l'ouverture du parc",
                        distVal: obj[i].preference.value_ouv_min - minMax.OuvMin,
                        importance: localStorage.getItem("ImportanceOuvMin"),
                        signe: 1,
                        pas: Math.ceil(Math.max(1,((minMax.OuvMin -fauxMinMax.OuvMin)))/precision),
                        table : [0]
                    };
                    const OuvMax = {
                        val: localStorage.getItem("OuvMax"),
                        name: "Maximum sur l'ouverture du parc",
                        distVal: (minMax.OuvMax - obj[i].preference.value_ouv_max),
                        importance: localStorage.getItem("ImportanceOuvMax"),
                        signe: -1,
                        pas: Math.ceil(Math.max(1,((fauxMinMax.OuvMax -minMax.OuvMax)))/precision),
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
                    Prefs[i].pas = (Prefs[i].distVal / parseFloat(importancesVal.tImp));
                    Prefs[i].importance = parseInt(importancesVal.tImp);
                    Prefs[i].table = [0, 0, parseInt(importancesVal.tImp)];
                    console.log(Prefs[i].table);
                    break;
           /*     case 'important':
                case 'importante':
                    Prefs[i].pas = Prefs[i].distVal / parseFloat(importancesVal.imp);
                    Prefs[i].importance = parseInt(importancesVal.imp);
                    Prefs[i].table = [0, 0, parseInt(importancesVal.imp)];
                    break;

                case 'neutre':
                    Prefs[i].pas = Prefs[i].distVal / parseFloat(importancesVal.neutre);
                    Prefs[i].importance = parseInt(importancesVal.neutre);
                    Prefs[i].table = [0, 0, parseInt(importancesVal.neutre)];
                    break; */
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
        let r1 = rechercheDiagonale(PrefsInit0, minMax,fauxMinMax,[1.0,2.0,3.0,4.0],100); // OK tout seul

        console.log(Prefs);
        console.log(PrefsInit1);
        console.log(PrefsInit2);

        console.log("recherche 2");
        console.log("faux min max :");
        console.log(fauxMinMax);
        let r2 =rechercheUnParUn(PrefsInit1, minMax,fauxMinMax); // OK tout seul
        console.log(r2.data);
        console.log(r1.data);
        finalPrefs = [r1.data, r2.data];

        console.log("recherche 3");

        let priorite = recherchePriorite(PrefsInit2,minMax,fauxMinMax);

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

function removeDomine(data){ // enlève les éléments dominés d'un tableau de datas
    for( var i = 0; i<data.length; i++){
        d = JSON.parse(data[i]);
        for( var j = 0; j<data.length; j++){
            dcompare = JSON.parse(data[i]);
            if(d.value_ani_min <= dcompare.value_ani_min && d.value_tour_min){
                // TODO retirer la date
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
function rechercheDiagonale(Prefs, minMax,fauxMinMax, importab =[1.0,2.0,3.0,4.0], nbEtapes=100, ){

    prefsInit = JSON.parse(JSON.stringify(Prefs));
    res = dichotomie(Prefs, minMax,fauxMinMax,importab, nbEtapes);

    /* Rafinement */
 //   console.log(importab);

    finalPrefs = rafinement(res.pref,prefsInit, minMax,fauxMinMax,importab,nbEtapes);

    return finalPrefs

}

function rechercheUnParUn(Prefs,minMax,fauxMinMax,importab =[1.0,2.0,3.0,4.0], nbEtapes=100) { //on se rapproche d'abord des plus important plutot que de tout faire en même temps

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
        newPrefs = dichotomie(newPrefs.pref, minMax,fauxMinMax, importab, nbEtapes);

    for (i=0; i<newPrefs.pref.length; i++) {
        // newImportab = new Array(importab.length).fill(0.0);
        if (newPrefs.pref[i].importance < importab[importab.length - 1]) { // on remet les niveaux d'importances précédents
            newPrefs.pref[i].importance = Prefs[i].importance;
        }
    }

    console.log("debut rafinement :");
    console.log(newPrefs.pref);

    newPrefs = rafinement(newPrefs.pref,Prefs, minMax,fauxMinMax, -1, (importab[importab.length -2]+1));
    return newPrefs
}

function recherchePriorite(Prefs,minMax,fauxMinMax,importab =[1.0,2.0,3.0,4.0], nbEtapes=100) { // pour chacun des plus importants on se rapproche au maximum
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
    // TODO : pourquoi la c'est pas des newImporttab a la place des importab ?
    for(var i=0; i<Prefs.length; i++){
        if (Prefs[i].importance == importab[importab.length-2]){ // si c'etait un très important
            Prefs[i].importance = importab[importab.length-1]; // on met ce critere plus important que tous les autres
            var nonVide = rechercheUnParUn(Prefs,minMax,fauxMinMax,newImportTab, nbEtapes);
            console.log("non vide :");
            console.log(nonVide);
            resTab.push();
            Prefs[i].importance = importab[importab.length-2]// on lui rend son importance précédente
        }

    }
    return resTab
}


function rafinement(newPrefs,prefsInit, minMax,fauxMinMax,importMin=-1, importMax=1,importab =[1.0,2.0,3.0,4.0], nbEtapes = 100){
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
    return dichotomie(newPrefs,minMax,fauxMinMax,importab,nbEtapes,true); // non vide
}


// prend en entree le tableau des pref et le tableau des minMax et le nombres d'étapes max
// renvoie le tableau correspondant au dernier noyau non vide
function dichotomie(Prefs, minMax,fauxMinMax,importab =[1.0,2.0,3.0,4.0], nbEtapes = 100, rafinement = false,) {


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


    console.log("faux min max :");
    console.log(AniMax.table[1]);
    console.log(AniMax.signe);
    console.log(AniMax.pas);
    console.log(fauxMinMax.AMax);
    console.log(Math.floor(AniMax.table[1]*AniMax.signe*AniMax.pas));
    var nbFile = 0;
    var http = new XMLHttpRequest();
    let RoomName = localStorage.getItem("roomName");
    let ClassId = localStorage.getItem("classId");

    if (!rafinement) {
        for (var i = 0; i < Prefs.length; i++) {
            if (Prefs[i].importance >= 1) {
                Prefs[i].pas = Prefs[i].distVal / Prefs[i].importance;
            }
            Prefs[i].table = [0, 0, Prefs[i].importance];
            //  console.log(Prefs[i].name + Prefs[i].table);

        }

        // on test si avec les fauxMinMax ça marche :
        var jsonObj = {
            "room_name": localStorage.getItem("roomName"),
            "class_id": localStorage.getItem("classId"),
            "value_ani_min": Math.ceil(AniMin.table[1]*AniMin.signe*AniMin.pas + fauxMinMax.AMin),
            "value_ani_max":  Math.floor(AniMax.table[1]*AniMax.signe*AniMax.pas + fauxMinMax.AMax),
            "value_tour_min": Math.ceil(TourMin.table[1]*TourMin.signe*TourMin.pas + fauxMinMax.TMin),
            "value_tour_max": Math.floor(TourMax.table[1]*TourMax.signe*TourMax.pas + fauxMinMax.TMax),
            "value_cap_min": Math.ceil(CapMin.table[1]*CapMin.signe*CapMin.pas + fauxMinMax.CMin),
            "value_cap_max": Math.floor(CapMax.table[1]*CapMax.signe*CapMax.pas + fauxMinMax.CMax),
            "value_env_min": Math.ceil(EnvMin.table[1]*EnvMin.signe*EnvMin.pas + fauxMinMax.EnvMin),
            "value_env_max": Math.floor(EnvMax.table[1]*EnvMax.signe*EnvMax.pas + fauxMinMax.EnvMax),
            "value_ouv_min": Math.ceil(OuvMin.table[1]*OuvMin.signe*OuvMin.pas + fauxMinMax.OuvMin),
            "value_ouv_max":Math.floor(OuvMax.table[1]*OuvMax.signe*OuvMax.pas + fauxMinMax.OuvMax)
        };
        console.log("calcul faux mins et max");

        var data = JSON.stringify(jsonObj);
        console.log(data);
        do {
            let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0.dat";
            http.open('HEAD', tmpPath, false);
            http.send();
            nbFile = nbFile + 1
        } while (http.status !== 404);
        nbFile--;
        //si oui on remplace les minMax par les fauxMins max
        postXMLHttp('/api?fct=lets_calc' +
            '&data=' + data, function (ret) {
                if(ret !== "Ce noyau est vide !"){
                    console.log("non vide");
                    minMax = JSON.parse(JSON.stringify(fauxMinMax))
                }
            });

        do {
            let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0.dat";
            http.open('HEAD', tmpPath, false);
            http.send();
            sleep(1500)
        }
        while (http.status === 404);
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

        http = new XMLHttpRequest();
        nbFile = 0;

        do {
            let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0.dat";
            http.open('HEAD', tmpPath, false);
            http.send();
            nbFile = nbFile + 1
        } while (http.status !== 404);
       /* test = TourMin.table[1]*TourMin.signe*TourMin.pas + minMax.TMin;
        console.log("test");
        console.log(test);
        console.log(TourMin.table[1]);
        console.log(TourMin.signe);
        console.log(TourMin.pas);
        console.log(minMax.TMin);*/

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
                console.log("file num : "+nbFile);
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
            let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0.dat";
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


/************** Sliders :*******************/
/************** Sliders :*******************/
/************** Sliders :*******************/
/************** Sliders :*******************/


var sliderAni = document.getElementById('slider-ani');

var sliderAniValues1 = localStorage.getItem("AniFauxMin");
var sliderAniValues2 = localStorage.getItem("AniMin");
var sliderAniValues3 = localStorage.getItem("AniMax");
var sliderAniValues4 = localStorage.getItem("AniFauxMax");


noUiSlider.create(sliderAni, {
    start: [sliderAniValues1, sliderAniValues2,sliderAniValues3, sliderAniValues4],
    connect: [true, true, true, true, true],
    step: 20,
    range: {
        'min': [0],
        'max': [20000]
    }
});

var connect = sliderAni.querySelectorAll('.noUi-connect');
var classes = ['c-1-color', 'c-2-color', 'c-3-color', 'c-4-color', 'c-5-color'];

for (var i = 0; i < connect.length; i++) {
    connect[i].classList.add(classes[i]);
}



var sliderCap = document.getElementById('slider-cap');
var sliderCapValues1 = localStorage.getItem("CapFauxMin");
var sliderCapValues2 = localStorage.getItem("CapMin");
var sliderCapValues3 = localStorage.getItem("CapMax");
var sliderCapValues4 = localStorage.getItem("CapFauxMax");

noUiSlider.create(sliderCap, {
    start: [sliderCapValues1, sliderCapValues2,sliderCapValues3, sliderCapValues4],
    connect: [true, true, true, true, true],
    step: 20,
    range: {
        'min': [0],
        'max': [30000]
    }
});

connect = sliderCap.querySelectorAll('.noUi-connect');

for (var i = 0; i < connect.length; i++) {
    connect[i].classList.add(classes[i]);
}





var sliderTour = document.getElementById('slider-tour');


var sliderTourValues1 = localStorage.getItem("TourFauxMin");
var sliderTourValues2 = localStorage.getItem("TourMin");
var sliderTourValues3 = localStorage.getItem("TourMax");
var sliderTourValues4 = localStorage.getItem("TourFauxMax");

noUiSlider.create(sliderTour, {
    start: [sliderTourValues1, sliderTourValues2,sliderTourValues3, sliderTourValues4],
    connect: [true, true, true, true, true],
    step: 0,
    range: {
        'min': [0],
        'max': [20000]
    }
});

connect = sliderTour.querySelectorAll('.noUi-connect');

for (var i = 0; i < connect.length; i++) {
    connect[i].classList.add(classes[i]);
}



var sliderEnv = document.getElementById('slider-env');

var sliderEnvValues1 = localStorage.getItem("EnvFauxMin");
var sliderEnvValues2 = localStorage.getItem("EnvMin");
var sliderEnvValues3 = localStorage.getItem("EnvMax");
var sliderEnvValues4 = localStorage.getItem("EnvFauxMax");

noUiSlider.create(sliderEnv, {
    start: [sliderEnvValues1, sliderEnvValues2,sliderEnvValues3, sliderEnvValues4],
    connect: [true, true, true, true, true],
    step: 5,
    range: {
        'min': [0],
        'max': [100]
    }
});

connect = sliderEnv.querySelectorAll('.noUi-connect');

for (var i = 0; i < connect.length; i++) {
    connect[i].classList.add(classes[i]);
}




var sliderOuv = document.getElementById('slider-ouv');
var sliderOuvValues1 = localStorage.getItem("OuvFauxMin");
var sliderOuvValues2 = localStorage.getItem("OuvMin");
var sliderOuvValues3 = localStorage.getItem("OuvMax");
var sliderOuvValues4 = localStorage.getItem("OuvFauxMax");

noUiSlider.create(sliderOuv, {
    start: [sliderOuvValues1, sliderOuvValues2,sliderOuvValues3, sliderOuvValues4],
    connect: [true, true, true, true, true],
    step: 5,
    range: {
        'min': [0],
        'max': [100]
    }
});

connect = sliderOuv.querySelectorAll('.noUi-connect');

for (var i = 0; i < connect.length; i++) {
    connect[i].classList.add(classes[i]);
}



