
window.onload = function(){
  /*  if (localStorage.getItem("nonvides")!=="-1"){
        gFinalFiles = [1,2];

        gFinalPref = JSON.parse(localStorage.getItem("finalPref"));
        finalPrefs = JSON.parse(localStorage.getItem("finalPref"));
        console.log("Final prefs :");
        console.log(finalPrefs.length);
        $("#finalPrefButtonContainer").html('');
        gNumFiles =JSON.parse(localStorage.getItem("nonvides"));
        console.log(gNumFiles);
        console.log(finalPrefs);
        console.log("finalPrefs");
        console.log(finalPrefs[0].value_ani_min);

        for(k = 0; k<finalPrefs.length; k++){

            console.log("k :");
            console.log(finalPrefs[k]);
            var name = "solution "+ (k+1);
            $("#finalPrefButtonContainer").append('<div class="btn btn-primary" onclick="showHide(\'' + k + '\')">'+name+'</div>');

            getFileBynum(gNumFiles[k],name)
        }

    }*/



};


var gFinalPref = null;
var gFinalFiles = []; // numero de la solution qu'on garde
var gNumFiles = []; // numero de fichier correspondant
var precision = 8;
var gdata;

function letsFinish(multi = false) {
    if (gFinalFiles.length !== 1){
        alert("Merci de choisir UNE solution");
        console.log("gFinalFiles");
        console.log(gFinalFiles);
        console.log("gNumFiles");
        console.log(gNumFiles);
    }else{
        let FileId = parseInt(gNumFiles[gFinalFiles[0]],10);
        console.log("FileId"+FileId);
        let LastId = FileId;
        let RoomName =localStorage.getItem("roomName");
        let ClassId = localStorage.getItem("classId");
        localStorage.setItem("fileId", FileId);

        postXMLHttp('/api?fct=lets_setPref' +
            '&fp=' + FileId +
            '&room_name=' + localStorage.getItem("roomName") +
            '&classId=' + localStorage.getItem("classId"), function (ret) {
            //getFile();
        });

        var http = new XMLHttpRequest();
        do {
            let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + LastId + "-viab-0.dat";
            http.open('HEAD', tmpPath, false);
            http.send();
            LastId = LastId + 1
        } while (http.status !== 404);
        LastId = LastId - 1;
        localStorage.setItem("lastId", LastId);

        console.log(LastId);
        console.log(FileId);
        // on supprime ceux en trop

            getXMLHttp('/api?fct=rename_file' +
                '&room_name=' + RoomName + '&class_id=' + ClassId +
                '&file_id=' + localStorage.getItem("fileId")+
                '&last_id=' + localStorage.getItem("lastId"),
                function (ret) {

            });

        //setPref(gNumFiles[gFinalFiles[0]]);
        document.getElementById('patientezContainer').innerHTML="Enregistrement des préférences...";
        sleep(1000);

        let url = window.location.href;
        if(!multi){
            let newParam = url.split("?")[1].replace("nonvide", "importances");
            window.location.href = "?" + newParam;
        }else{
            let newParam = url.split("?")[1].replace("result", "preference");
            window.location.href = "?" + newParam;
            //mettre son fp a -1 pour signaler que on est partit =
            setMyFP(-1);

            // delete final file :

            getXMLHttp('/api?fct=delete_finalFile' +
                '&room_name=' + RoomName + '&class_id=' + ClassId,
                function (ret) {
                });
        }

    }

}

function getImportances(){
    for (let i= 0; i < importances.length; i++) {
        let imp =importances[i];

        let checked = document.getElementById(imp).checked;

        if(checked){
            localStorage.setItem(imp,100); //$('#' + imp).val()
            localStorage.setItem("old"+imp,100); //$('#' + imp).val()
        }else {
            localStorage.setItem(imp,1);
            localStorage.setItem("old"+imp,1);
        }
    }
    // window.location.href = "?" + newParam;
}

function calcPas(faux,pref){

    let pas = Math.max(Math.ceil(Math.max((pref-faux),(faux-pref))/precision),1);
    return pas
}

function calcTable(abs, pref, faux){
    console.log("calc pas : "+abs+","+pref+","+faux);
    if(abs===pref){
        return 0
    }
    let dist = Math.max((pref-abs),(abs-pref));
    console.log("dist : "+dist);
    let pas = calcPas(faux,pref);
    console.log("dist : "+pas);

    //return Math.max(Math.floor(Math.max((abs-pref),(pref-abs))/ calcPas(faux,pref),1))
    return Math.max( Math.floor( dist/pas),  1)

}


 function getPrefs(mono=true) {

     gFinalFiles = []; // numero de la solution qu'on garde
     gNumFiles = []; // numero de fichier correspondant


    document.getElementById('patientezContainer').innerHTML="Calcul en cours, merci de patienter quelques minutes...";
    document.getElementById('finalPrefButtonContainer').innerHTML="";

    getXMLHttp('/api?fct=get_preference' +
        '&room_name=' + localStorage.getItem("roomName"),  function (ret) {

        if(mono){
            getImportances();
        }


        // Valeurs de min et max absolu :
        const minMax = {
            AMax : 5000,
            AMin : 0,
            CMax : 10000,
            CMin : 0,
            TMax : 5000,
            TMin : 0,
            EnvMax : 10,
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
            pImp : 0.0
        };


        let className = "";

        switch (localStorage.getItem("classId")) {
            case "1" :
                className = "Tourisme";
                break;
            case "2" :
                className = "Pecheur";
                break;
            default :
                className = "Ecologiste";

        }

        obj = JSON.parse(ret);

        if (obj !== null && obj.length > 0) {
            for (i = 0; i < obj.length; i++) {
                if (obj[i].class_name.toString() === className) {

                    // Pour les max : on regarde la distance à la borne min : il s'agit de la valeur normalisée, pour les mins,
                    // on regarde la valeur à la borne max : c'est 1- la valeur normalisée.

                    const AniMin = {
                        val: localStorage.getItem("AniMin"),
                        fauxMaxTable : calcTable(fauxMinMax.AMin,localStorage.getItem("AniMin"),fauxMinMax.AMin),
                        name: "Minimum sur le nombre d'animaux",
                        //    distVal: obj[i].preference.value_ani_min - minMax.AMin,
                        importance: localStorage.getItem("ImportanceAniMin"),
                        signe: 1,
                        pas: calcPas(fauxMinMax.AMin,localStorage.getItem("AniMin")),
                        maxTable : calcTable(minMax.AMin,localStorage.getItem("AniMin"),fauxMinMax.AMin),
                        table : [0,0,calcTable(minMax.AMin,localStorage.getItem("AniMin"),fauxMinMax.AMin)]
                    };

                    const AniMax = {
                        val: localStorage.getItem("AniMax"),
                        fauxMaxTable : calcTable(fauxMinMax.AMax,localStorage.getItem("AniMax"),fauxMinMax.AMax),
                        name: "Maximum sur le nombre d'animaux",
                        //    distVal: minMax.AMax - obj[i].preference.value_ani_max,
                        importance: localStorage.getItem("ImportanceAniMax"),
                        signe: -1,
                        pas:  calcPas(fauxMinMax.AMax,localStorage.getItem("AniMax")),
                        maxTable : calcTable(minMax.AMax,localStorage.getItem("AniMax"),fauxMinMax.AMax),
                        table : [0,0,calcTable(minMax.AMax,localStorage.getItem("AniMax"),fauxMinMax.AMax)]
                    };
                    const CapMin = {
                        val: localStorage.getItem("CapMin"),
                        fauxMaxTable : calcTable(fauxMinMax.CMin,localStorage.getItem("CapMin"),fauxMinMax.CMin),
                        name: "Minimum sur le capital des pêcheurs",
                        //    distVal: obj[i].preference.value_cap_min - minMax.CMin,
                        importance: localStorage.getItem("ImportanceCapMin"),
                        signe: 1,
                        pas: calcPas(fauxMinMax.CMin,localStorage.getItem("CapMin")),
                        maxTable : calcTable(minMax.CMin,localStorage.getItem("CapMin"),fauxMinMax.CMin),
                        table : [0,0,calcTable(minMax.CMin,localStorage.getItem("CapMin"),fauxMinMax.CMin)]
                    };
                    const CapMax = {
                        val: localStorage.getItem("CapMax"),
                        fauxMaxTable : calcTable(fauxMinMax.CMax,localStorage.getItem("CapMax"),fauxMinMax.CMax),
                        name: "Maximum sur le capital des pêcheurs",
                        //   distVal: minMax.CMax - obj[i].preference.value_cap_max,
                        importance: localStorage.getItem("ImportanceCapMax"),
                        signe: -1,
                        pas: calcPas(fauxMinMax.CMax,localStorage.getItem("CapMax")),
                        maxTable : calcTable(minMax.CMax,localStorage.getItem("CapMax"),fauxMinMax.CMax),
                        table : [0,0,calcTable(minMax.CMax,obj[i].preference.value_cap_max,fauxMinMax.CMax)]

                    };

                    const TourMin = {
                        val: localStorage.getItem("TourMin"),
                        fauxMaxTable : calcTable(fauxMinMax.TMin,localStorage.getItem("TourMin"),fauxMinMax.TMin),
                        name: "Minimum sur le nombre de touristes",
                        //    distVal: obj[i].preference.value_tour_min - minMax.TMin,
                        importance: localStorage.getItem("ImportanceTourMin"),
                        signe: 1,
                        pas: calcPas(fauxMinMax.TMin,localStorage.getItem("TourMin")),
                        maxTable : calcTable(minMax.TMin,localStorage.getItem("TourMin"),fauxMinMax.TMin),
                        table : [0,0,calcTable(minMax.TMin,localStorage.getItem("TourMin"),fauxMinMax.TMin)]
                    };

                    const TourMax = {
                        val: localStorage.getItem("TourMax"),
                        fauxMaxTable :calcTable(fauxMinMax.TMax,localStorage.getItem("TourMax"),fauxMinMax.TMax) ,
                        name: "Maximum sur le nombre de touristes",
                        //    distVal: (minMax.TMax - obj[i].preference.value_tour_max),
                        importance: localStorage.getItem("ImportanceTourMax"),
                        signe: -1,
                        pas: calcPas(fauxMinMax.TMax,localStorage.getItem("TourMax")),
                        maxTable : calcTable(minMax.TMax,localStorage.getItem("TourMax"),fauxMinMax.TMax),
                        table : [0,0,calcTable(minMax.TMax,localStorage.getItem("TourMax"),fauxMinMax.TMax)]

                    };

                    const EnvMin = {
                        val: localStorage.getItem("EnvMin"),
                        fauxMaxTable : calcTable(fauxMinMax.EnvMin,localStorage.getItem("EnvMin"),fauxMinMax.EnvMin),
                        name: "Minimum sur la prise accidentelle de tortues",
                        //    distVal: obj[i].preference.value_env_min - minMax.EnvMin,
                        importance: localStorage.getItem("ImportanceEnvMin"),
                        signe: 1,
                        pas: calcPas(fauxMinMax.EnvMin,localStorage.getItem("EnvMin")),
                        maxTable : calcTable(minMax.EnvMin,localStorage.getItem("EnvMin"),fauxMinMax.EnvMin),
                        table : [0,0,calcTable(minMax.EnvMin,localStorage.getItem("EnvMin"),fauxMinMax.EnvMin)]

                    };
                    const EnvMax = {
                        val: localStorage.getItem("EnvMax"),
                        fauxMaxTable :calcTable(fauxMinMax.EnvMax,localStorage.getItem("EnvMax"),fauxMinMax.EnvMax) ,
                        name: "Maximum sur la prise accidentelle de tortues",
                        //    distVal: (minMax.EnvMax - obj[i].preference.value_env_max),
                        importance: localStorage.getItem("ImportanceEnvMax"),
                        signe: -1,
                        pas: calcPas(fauxMinMax.EnvMax,localStorage.getItem("EnvMax")),
                        maxTable : calcTable(minMax.EnvMax,localStorage.getItem("EnvMax"),fauxMinMax.EnvMax),
                        table : [0,0,calcTable(minMax.EnvMax,localStorage.getItem("EnvMax"),fauxMinMax.EnvMax)]
                    };

                    const OuvMin = {
                        val: localStorage.getItem("OuvMin"),
                        fauxMaxTable :calcTable(fauxMinMax.OuvMin,localStorage.getItem("OuvMin"),fauxMinMax.OuvMin) ,
                        name: "Minimum sur l'ouverture du parc",
                        //   distVal: obj[i].preference.value_ouv_min - minMax.OuvMin,
                        importance: localStorage.getItem("ImportanceOuvMin"),
                        signe: 1,
                        pas: calcPas(fauxMinMax.OuvMin,localStorage.getItem("OuvMin")),
                        maxTable : calcTable(minMax.OuvMin,localStorage.getItem("OuvMin"),fauxMinMax.OuvMin),
                        table : [0,0,calcTable(minMax.OuvMin,localStorage.getItem("OuvMin"),fauxMinMax.OuvMin)]

                    };

                    const OuvMax = {
                        val: localStorage.getItem("OuvMax"),
                        fauxMaxTable : calcTable(fauxMinMax.OuvMax,localStorage.getItem("OuvMax"),fauxMinMax.OuvMax),
                        name: "Maximum sur l'ouverture du parc",
                        //  distVal: (minMax.OuvMax - obj[i].preference.value_ouv_max),
                        importance: localStorage.getItem("ImportanceOuvMax"),
                        signe: -1,
                        pas: calcPas(fauxMinMax.OuvMax,localStorage.getItem("OuvMax")),
                        maxTable :calcTable(minMax.OuvMax,localStorage.getItem("OuvMax"),fauxMinMax.OuvMax),
                        table : [0,0,calcTable(minMax.OuvMax,localStorage.getItem("OuvMax"),fauxMinMax.OuvMax)]
                    };

                    Prefs = [AniMin, AniMax, CapMin, CapMax, TourMin, TourMax, EnvMin, EnvMax, OuvMin, OuvMax]

                }
            }
        }


        let finalPrefs = [];
        PrefsInit0 = JSON.parse(JSON.stringify(Prefs));
        PrefsInit1 = JSON.parse(JSON.stringify(Prefs)); // copie du tableau
        PrefsInit2 = JSON.parse(JSON.stringify(Prefs));

        console.log(Prefs);
        console.log(PrefsInit1);
        console.log(PrefsInit2);

        console.log("*************************  recherche 1 **************************");
        console.log("*************************  mono A: **************************");
        console.log(mono);
        console.log(PrefsInit0);

        let r1 = rechercheDiagonale(PrefsInit0, minMax,fauxMinMax,[0.0,10.0,50.0,100.0],100,mono); // OK tout seul

        console.log("*************************  mono B: **************************");
        console.log(mono);
        finalPrefs = [r1.data];
        let finalFiles = [r1.numFile];

        console.log("finalFiles : "+finalFiles);

        console.log("*************************  mono C: **************************");
        console.log(mono);

        console.log("recherche 2");
        console.log("faux min max :");
        console.log(fauxMinMax);
        let r2 =rechercheUnParUn(PrefsInit1, minMax,fauxMinMax,[0.0,10.0,50.0,100.0],100,mono); // OK tout seul
        console.log(r2.data);
        console.log(r1.data);
        if (r1.data === r2.data){
            finalPrefs = [r1.data];
            finalFiles = [r1.numFile];
        } else {
            finalPrefs = [r1.data, r2.data];
            finalFiles = [r1.numFile,r2.numFile];
        }

        console.log("finalFiles : "+finalFiles);

        console.log("/******* recherche 3 ************/");

        console.log("*************************  mono D: **************************");
        console.log(mono);


        let priorite = recherchePriorite(PrefsInit2,minMax,fauxMinMax,[0.0,10.0,50.0,100.0],100,mono);

        console.log("priorité : ");
        console.log(priorite);

        for(k = 0; k<priorite.length; k++){
            if(!finalPrefs.includes(priorite[k].data)){
                finalPrefs.push(priorite[k].data);
                finalFiles.push(priorite[k].numFile);
            }
        }

        console.log("finalFiles : "+finalFiles);

        gNumFiles = finalFiles;
        gFinalPref = finalPrefs;
        console.log("Final prefs :");
        console.log(finalPrefs.length);
        $("#finalPrefButtonContainer").html('');


        localStorage.setItem("nonvides", JSON.stringify(gNumFiles));
        localStorage.setItem("finalPref", JSON.stringify(gFinalPref));
        document.getElementById('patientezContainer').innerHTML="";
        document.getElementById("solutions-container").hidden = false;



        for(k = 0; k<finalPrefs.length; k++){
            /*
            *  CREATION DES BOUTONS : 1er click = ca affiche / 2eme click = ca efface
            * */
            console.log("k :");
            console.log(k);
            console.log(finalPrefs[k]);
            var name = "solution "+ (k+1);
            $("#finalPrefButtonContainer").append('<div class="btn btn-primary" onclick="showHide(\'' + k + '\')">'+name+'</div>');
            getFileBynum(gNumFiles[k],name,localStorage.getItem("classId"), finalPrefs[k])



        }
        if(mono){
            $("#finishButtonContainer").append('<div class="btn btn-primary" onclick="letsFinish()">Continuer</div>');
        }else{
            console.log("******************************************");
            console.log("******************************************");
            console.log("******************************************");
            console.log("********************aa**********************");
            console.log("*********************bb*********************");
            /*
            getXMLHttp('/api?fct=create_end' +
                '&room_name=' + RoomName,
                function (ret) {
                });
            */

            var jsonObj2 = {
                "room_name": localStorage.getItem("roomName"),
                "num_file": gNumFiles
            };
            data2 = JSON.stringify(jsonObj2);
            console.log("******************************************");
            console.log("data2 : numfiles :");
            console.log(data2);
            console.log("******************************************");

            var jsonObj = {
                "room_name": localStorage.getItem("roomName"),
                "final_pref": finalPrefs
            };
            data = JSON.stringify(jsonObj);

            data = JSON.stringify(jsonObj);
            console.log("******************************************");
            console.log("data : final_pref :");
            console.log(data);
            console.log("******************************************");



            postXMLHttp('api?fct=set_num_file' +
                '&data2=' + data2,  function (json) {
            });


            postXMLHttp('api?fct=set_final_pref' +
                '&data=' + data,  function (json) {
            });

            $("#finishButtonContainer").append('<div class="btn btn-primary" onclick="letsFinish(true)">Enregistrer cette solution et revenir aux préférences</div>');


        }

        // showPreferences(JSON.parse(finalPrefs[0]))


    });
}

function showHide(k) {


    if($("#slider-ani-"+k).length === 0) {
        // CREATION DU SLIDER POUR K + CREATION DES VMIN ET VMAX POUR K
        let num = parseInt(k)+1
        $("#sliderAniContainer").append('<span id="text-'+ k+'"> Solution '+num+'</span>');
        $("#sliderAniContainer").append('<div id="value-min-max-ani-' + k + '"><span id="prefAniMin-'+k+'" class="purple"></span> - <span id="prefAniMax-'+k+'" class="purple"></span></div>');
        $("#sliderAniContainer").append('<div id="slider-ani-' + k + '" style="top: 0px; right: 1px; margin: 10px 25px;" disabled="true"></div>');

        $("#sliderCapContainer").append('<span id="text-'+ k+'"> Solution '+num+'</span>');
        $("#sliderCapContainer").append('<div id="value-min-max-cap-' + k + '"><span id="prefCapMin-'+k+'" class="purple"></span> - <span id="prefCapMax-'+k+'" class="purple"></span></div>');
        $("#sliderCapContainer").append('<div id="slider-cap-' + k + '" style="top: 0px; right: 1px; margin: 10px 25px;" disabled="true"></div>');

        $("#sliderTourContainer").append('<span id="text-'+ k+'"> Solution '+num+'</span>');
        $("#sliderTourContainer").append('<div id="value-min-max-tour-' + k + '"><span id="prefTourMin-'+k+'" class="purple"></span> - <span id="prefTourMax-'+k+'" class="purple"></span></div>');
        $("#sliderTourContainer").append('<div id="slider-tour-' + k + '" style="top: 0px; right: 1px; margin: 10px 25px;" disabled="true"></div>');

        $("#sliderOuvContainer").append('<span id="text-'+ k+'"> Solution '+num+'</span>');
        $("#sliderOuvContainer").append('<div id="value-min-max-ouv-' + k + '"><span id="prefOuvMin-'+k+'" class="purple"></span> - <span id="prefOuvMax-'+k+'" class="purple"></span></div>');
        $("#sliderOuvContainer").append('<div id="slider-ouv-' + k + '" style="top: 0px; right: 1px; margin: 10px 25px;" disabled="true" ></div>');

        $("#sliderEnvContainer").append('<span id="text-'+ k+'"> Solution '+num+'</span>');
        $("#sliderEnvContainer").append('<div id="value-min-max-env-' + k + '"><span id="prefEnvMin-'+k+'" class="purple"></span> - <span id="prefEnvMax-'+k+'" class="purple"></span></div>');
        $("#sliderEnvContainer").append('<div id="slider-env-' + k + '" style="top: 0px; right: 1px; margin: 10px 25px;" disabled="true"></div>');

        gFinalFiles.push(parseInt(k));
        console.log("gFinalFiles");
        console.log(gFinalFiles);
        if (gFinalPref == null) {
            gFinalPref = JSON.parse(localStorage.getItem("finalPref"))
        }
        console.log("final pref:");
        console.log(gFinalPref[parseInt(k)]);
        showPreferences(JSON.parse(gFinalPref[parseInt(k)]),k);
    } else {
        $("#slider-ani-"+k + ", #value-min-max-ani-" + k+", #text-"+ k).remove();
        $("#slider-cap-"+k + ", #value-min-max-cap-" + k+", #text-"+ k).remove();
        $("#slider-tour-"+k + ", #value-min-max-tour-" + k+", #text-"+ k).remove();
        $("#slider-env-"+k + ", #value-min-max-env-" + k+", #text-"+ k).remove();
        $("#slider-ouv-"+k + ", #value-min-max-ouv-" + k+", #text-"+ k).remove();
        gFinalFiles=removeFromArray(gFinalFiles,parseInt(k));
        console.log("gFinalFiles");
        console.log(gFinalFiles);
    }
}

function removeFromArray(arr, elem) {

    for( let i = 0; i < arr.length; i++){
        if ( arr[i] === elem) {
            arr.splice(i, 1); }
    }
    return arr
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


// renvoie un tableau de noyaux plus proches non vides
function rechercheDiagonale(Prefs, minMax,fauxMinMax, importab =[0.0,10.0,50.0,100.0], nbEtapes=100, mono = true){

    prefsInit = JSON.parse(JSON.stringify(Prefs));
    console.log(Prefs);
    if(mono){
        res = dichotomie(Prefs, minMax,fauxMinMax,importab, nbEtapes);
        /* Rafinement */
        console.log("fin dichotomie :");
        console.log(res.pref);
        console.log(res.data);
        console.log("mono = "+mono);

        finalPrefs = rafinement(res.pref,prefsInit, res.mM,fauxMinMax,importab,nbEtapes,mono);
    }else{
        console.log("coucou on est dans recherche digonale");
        res = dichotomieMulti(Prefs, minMax,fauxMinMax,importab, nbEtapes);
        /* Rafinement */
        console.log("fin dichotomie :");
        console.log(res.pref);
        console.log(res.data);
        console.log("mono = "+mono);
        finalPrefs = rafinement(res.pref,prefsInit, res.mM,fauxMinMax,-1, 15,importab,nbEtapes,false);
    }




    return finalPrefs

}

function rechercheUnParUn(Prefs,minMax,fauxMinMax,importab =[0.0,10.0,50.0,100.0], nbEtapes=100,mono=true) { //on se rapproche d'abord des plus important plutot que de tout faire en même temps

    var newPrefs = {
        pref : JSON.parse(JSON.stringify(Prefs)),
        data : []
    };

    console.log(newPrefs.pref);
    prefsInit = JSON.parse(JSON.stringify(Prefs));


    for (var i=0; i<newPrefs.pref.length; i++) {
        // newImportab = new Array(importab.length).fill(0.0);
        if (newPrefs.pref[i].importance < importab[importab.length - 1]) { // si on est moins important on s'en occupe pas pour l'instant
            newPrefs.pref[i].importance = 0;
        }
    }
    if(mono){
        newPrefs = dichotomie(newPrefs.pref, minMax,fauxMinMax, importab, nbEtapes);
    }else {
        console.log("rechercheUnParUn");
/*********************/

        let http = new XMLHttpRequest();
        let RoomName = localStorage.getItem("roomName");

        let nbFile =0;
        do {
            let tmpPath = "sources/output/" + RoomName + "_1_" + nbFile + "-viab-0.dat";
            console.log(tmpPath);
            http.open('HEAD', tmpPath, false);
            http.send();
            nbFile = nbFile + 1
        } while (http.status !== 404);

        nbFile =0;

        do {
            let tmpPath = "sources/output/" + RoomName + "_2_" + nbFile + "-viab-0.dat";
            console.log(tmpPath);
            http.open('HEAD', tmpPath, false);
            http.send();
            nbFile = nbFile + 1
        } while (http.status !== 404);
/*********************/

        newPrefs = dichotomieMulti(newPrefs.pref, minMax,fauxMinMax, importab, nbEtapes);
    }


    for (i=0; i<newPrefs.pref.length; i++) {
        // newImportab = new Array(importab.length).fill(0.0);
        if (newPrefs.pref[i].importance < importab[importab.length - 1]) { // on remet les niveaux d'importances précédents
            newPrefs.pref[i].importance = Prefs[i].importance;
        }
    }

    console.log("debut rafinement :");
    console.log(newPrefs.pref);
    console.log(newPrefs.mM);

    newPrefs = rafinement(newPrefs.pref,Prefs, newPrefs.mM,fauxMinMax, -1, (importab[importab.length -2]+1),importab,nbEtapes, mono);

    return newPrefs
}

function recherchePriorite(Prefs,minMax,fauxMinMax,importab =[0.0,10.0,50.0,100.0], nbEtapes=100,mono=true) { // pour chacun des importants on se rapproche au maximum

    let resTab = [];// tableau des noyaux non vide
    let modifImp = [];
    for(var i=0; i<Prefs.length; i++){
        console.log(Prefs[i]);
        if (parseInt(Prefs[i].importance) === 100){ // si c'etait un très important
            console.log(Prefs[i].name);
            for(var j=0; j<Prefs.length; j++) { // on met tout les autres critères à pas important
                if ((j !== i)&&(parseInt(Prefs[j].importance) !== 1)) {
                    Prefs[j].importance = "1";
                    modifImp.push(j) // on retient lesquels on a modifiés
                }
            }
            oldPref = Prefs.slice(0);
            if(mono){
                var nonVide = dichotomie(Prefs,minMax,fauxMinMax,importab, nbEtapes); // on calcule
            }else{
                console.log("Coucou on est dans recherche priorité 1");
                var nonVide = dichotomieMulti(Prefs,minMax,fauxMinMax,importab, nbEtapes); // on calcule
            }

            console.log("non vide :");
            console.log(nonVide);


                for (j = 0; j < nonVide.pref.length; j++){
                    // console.log("test : "+lastPrefsNonVide[j].name+" "+lastPrefsNonVide[j].importance);
                    if (i !== j){
                        // si c'etait pas des importants on les traite comme des importants :
                        nonVide.pref[j].importance = 100;
                        // var pasId = Prefs[i].name;
                        nonVide.pref[j].table =[0,0,nonVide.pref[j].maxTable];
                        //   newPrefs[j]=prefsInit[j];
                        console.log("new pref :");
                       console.log(nonVide.pref[j].table)
                    }
                 // si c'etait des importants on garde comme avant
                }
            console.log("newPrefs");
            console.log(nonVide.pref);
            if(mono){
                newNonVide = dichotomie(nonVide.pref,minMax,fauxMinMax,importab,nbEtapes,true); // non vide
            }else{
                console.log("Coucou on est dans recherche priorité 2");
                newNonVide = dichotomieMulti(nonVide.pref,minMax,fauxMinMax,importab,nbEtapes,true); // non vide
            }

            console.log("new non vide :");
            console.log(newNonVide);
            resTab.push(newNonVide);









            for(var k=0; k<modifImp.length; k++) { // on rend les importances précédentes
                    Prefs[modifImp[k]].importance = "100";
                }
            }
        }
    return resTab
}


function rafinement(newPrefs,prefsInit, minMax,fauxMinMax,importMin=-1, importMax=15,importab =[0.0,10.0,50.0,100.0], nbEtapes = 100, mono=true){
    console.log("Debut rafinement :");
    for (let j = 0; j < newPrefs.length; j++){
        // console.log("test : "+lastPrefsNonVide[j].name+" "+lastPrefsNonVide[j].importance);
        if (prefsInit[j].importance === 1){
            // si c'etait pas des importants on les traite comme des importants :
            newPrefs[j].importance = 100;
            // var pasId = Prefs[i].name;
            newPrefs[j].table =[0,0,newPrefs[j].maxTable];
            //   newPrefs[j]=prefsInit[j];
            console.log("new pref :");
            console.log(newPrefs[j].table)
        }
        // si c'etait des importants on garde comme avant
    }
    console.log("mono = "+mono);
    console.log("newPrefs");
    console.log(newPrefs);
    console.log("minMax");
    console.log(minMax);
    console.log("fauxMinMax");
    console.log(fauxMinMax);
    if(mono){
        return dichotomie(newPrefs,minMax,fauxMinMax,importab,nbEtapes,true); // non vide
    }else{
        console.log("Coucou on est dans rafinement");
        return dichotomieMulti(newPrefs,minMax,fauxMinMax,importab,nbEtapes,true); // non vide
    }

}


// prend en entree le tableau des pref et le tableau des minMax et le nombres d'étapes max
// renvoie le tableau correspondant au dernier noyau non vide
function dichotomie(Prefs, minMax,fauxMinMax,importab =[0.0,10.0,50.0,100.0], nbEtapes = 100, rafinement = false) {


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

    let imp_ani_min= parseInt(localStorage.getItem("ImportanceAniMin"));
    let imp_ani_max= parseInt(localStorage.getItem("ImportanceAniMax"));
    let imp_tour_min= parseInt(localStorage.getItem("ImportanceTourMin"));
    let imp_tour_max= parseInt(localStorage.getItem("ImportanceTourMax"));
    let imp_cap_min= parseInt(localStorage.getItem("ImportanceCapMin"));
    let imp_cap_max= parseInt(localStorage.getItem("ImportanceCapMax"));
    let imp_env_min= parseInt(localStorage.getItem("ImportanceEnvMin"));
    let imp_env_max= parseInt(localStorage.getItem("ImportanceEnvMax"));
    let imp_ouv_min= parseInt(localStorage.getItem("ImportanceOuvMin"));
    let imp_ouv_max= parseInt(localStorage.getItem("ImportanceOuvMax"));



    console.log(Math.floor(AniMax.table[1]*AniMax.signe*AniMax.pas));
    var nbFile = 0;
    var http = new XMLHttpRequest();
    let RoomName = localStorage.getItem("roomName");
    let ClassId = localStorage.getItem("classId");

    var faux = false; // est ce que ça marche avec les fauxminmax ?

    if (!rafinement) {
        for (var i = 0; i < Prefs.length; i++) {
            if (Prefs[i].importance === "1" || Prefs[i].importance === 1) { // si pas important on prend pas en compte
                Prefs[i].table = [0,0,0];
            }
            //  console.log(Prefs[i].name + Prefs[i].table);
        }
        value_ani_min = Math.ceil(AniMin.table[1]*AniMin.signe*AniMin.pas + fauxMinMax.AMin) ;
        value_ani_max =  Math.floor(AniMax.table[1]*AniMax.signe*AniMax.pas + fauxMinMax.AMax) ;
        value_tour_min = Math.ceil(TourMin.table[1]*TourMin.signe*TourMin.pas + fauxMinMax.TMin) ;
        value_tour_max = Math.floor(TourMax.table[1]*TourMax.signe*TourMax.pas + fauxMinMax.TMax) ;
        value_cap_min = Math.ceil(CapMin.table[1]*CapMin.signe*CapMin.pas + fauxMinMax.CMin) ;
        value_cap_max = Math.floor(CapMax.table[1]*CapMax.signe*CapMax.pas + fauxMinMax.CMax) ;
        value_env_min = Math.ceil(EnvMin.table[1]*EnvMin.signe*EnvMin.pas + fauxMinMax.EnvMin) ;
        value_env_max = Math.floor(EnvMax.table[1]*EnvMax.signe*EnvMax.pas + fauxMinMax.EnvMax) ;
        value_ouv_min = Math.ceil(OuvMin.table[1]*OuvMin.signe*OuvMin.pas + fauxMinMax.OuvMin) ;
        value_ouv_max = Math.floor(OuvMax.table[1]*OuvMax.signe*OuvMax.pas + fauxMinMax.OuvMax);


        // on test si avec les fauxMinMax ça marche :
        var jsonObj = {
            "room_name": localStorage.getItem("roomName"),
            "class_id": localStorage.getItem("classId"),
            "value_ani_min":value_ani_min,
            "value_ani_max": value_ani_max,
            "value_tour_min":value_tour_min,
            "value_tour_max":value_tour_max,
            "value_cap_min":value_cap_min,
            "value_cap_max":value_cap_max,
            "value_env_min":value_env_min,
            "value_env_max":value_env_max,
            "value_ouv_min":value_ouv_min,
            "value_ouv_max":value_ouv_max,
            "value_ani_faux_min":Math.max(0,value_ani_min - (localStorage.getItem("AniMin") - fauxMinMax.AMin)),
            "value_ani_faux_max":value_ani_max + (fauxMinMax.AMax - localStorage.getItem("AniMax")),
            "value_tour_faux_min":Math.max(0,value_tour_min - (localStorage.getItem("TourMin") - fauxMinMax.TMin)),
            "value_tour_faux_max":value_tour_max + (fauxMinMax.TMax - localStorage.getItem("TourMax")),
            "value_cap_faux_min":Math.max(0,value_cap_min - (localStorage.getItem("CapMin") - fauxMinMax.CMin)),
            "value_cap_faux_max":value_cap_max + (fauxMinMax.CMax - localStorage.getItem("CapMax")),
            "value_env_faux_min":Math.max(0,value_env_min - (localStorage.getItem("EnvMin") - fauxMinMax.EnvMin)),
            "value_env_faux_max":value_env_max + (fauxMinMax.EnvMax - localStorage.getItem("EnvMax")),
            "value_ouv_faux_min":Math.max(0,value_ouv_min - (localStorage.getItem("OuvMin") - fauxMinMax.OuvMin)),
            "value_ouv_faux_max":value_ouv_max + (fauxMinMax.OuvMax - localStorage.getItem("OuvMax")),
            "imp_ani_min":imp_ani_min,
            "imp_ani_max":imp_ani_max ,
            "imp_tour_min":imp_tour_min,
            "imp_tour_max":imp_tour_max,
            "imp_cap_min":imp_cap_min,
            "imp_cap_max":imp_cap_max,
            "imp_env_min":imp_env_min,
            "imp_env_max":imp_env_max,
            "imp_ouv_min":imp_ouv_min,
            "imp_ouv_max":imp_ouv_max
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
                minMax = JSON.parse(JSON.stringify(fauxMinMax));
                faux = true;
                for(var f=0; f<Prefs.length; f++){
                    Prefs[f].maxTable = Prefs[f].fauxMaxTable;
                    Prefs[f].table[2] = Prefs[f].fauxMaxTable;
                }
            }
        });

        do {
            console.log(nbFile);
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
    let lastNonVide = 0;
    let newPrefs = [];
    let newData = [];
    let dontstop = false;
    let prefsInit = JSON.parse(JSON.stringify(Prefs));

    while (i<nbEtapes){
        console.log("******** etape numero: "+i+" ******** "+ "rafinement : "+rafinement);

        http = new XMLHttpRequest();
        nbFile = 0;

        do {
            let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0.dat";
            //    console.log(tmpPath);
            http.open('HEAD', tmpPath, false);
            http.send();
            nbFile = nbFile + 1;
        } while (http.status !== 404);
        nbFile = nbFile-1;

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


        if (faux){
            value_ani_min = Math.ceil(AniMin.table[1]*AniMin.signe*AniMin.pas + fauxMinMax.AMin) ;
            value_ani_max =  Math.floor(AniMax.table[1]*AniMax.signe*AniMax.pas + fauxMinMax.AMax) ;
            value_tour_min = Math.ceil(TourMin.table[1]*TourMin.signe*TourMin.pas + fauxMinMax.TMin) ;
            value_tour_max = Math.floor(TourMax.table[1]*TourMax.signe*TourMax.pas + fauxMinMax.TMax) ;
            value_cap_min = Math.ceil(CapMin.table[1]*CapMin.signe*CapMin.pas + fauxMinMax.CMin) ;
            value_cap_max = Math.floor(CapMax.table[1]*CapMax.signe*CapMax.pas + fauxMinMax.CMax) ;
            value_env_min = Math.ceil(EnvMin.table[1]*EnvMin.signe*EnvMin.pas + fauxMinMax.EnvMin) ;
            value_env_max = Math.floor(EnvMax.table[1]*EnvMax.signe*EnvMax.pas + fauxMinMax.EnvMax) ;
            value_ouv_min = Math.ceil(OuvMin.table[1]*OuvMin.signe*OuvMin.pas + fauxMinMax.OuvMin) ;
            value_ouv_max = Math.floor(OuvMax.table[1]*OuvMax.signe*OuvMax.pas + fauxMinMax.OuvMax);


            // on test si avec les fauxMinMax ça marche :
            var jsonObj = {
                "room_name": localStorage.getItem("roomName"),
                "class_id": localStorage.getItem("classId"),
                "value_ani_min":value_ani_min,
                "value_ani_max": value_ani_max,
                "value_tour_min":value_tour_min,
                "value_tour_max":value_tour_max,
                "value_cap_min":value_cap_min,
                "value_cap_max":value_cap_max,
                "value_env_min":value_env_min,
                "value_env_max":value_env_max,
                "value_ouv_min":value_ouv_min,
                "value_ouv_max":value_ouv_max,
                "value_ani_faux_min":Math.max(0,value_ani_min - (localStorage.getItem("AniMin") - fauxMinMax.AMin)),
                "value_ani_faux_max":value_ani_max + (fauxMinMax.AMax - localStorage.getItem("AniMax")),
                "value_tour_faux_min":Math.max(0,value_tour_min - (localStorage.getItem("TourMin") - fauxMinMax.TMin)),
                "value_tour_faux_max":value_tour_max + (fauxMinMax.TMax - localStorage.getItem("TourMax")),
                "value_cap_faux_min":Math.max(0,value_cap_min - (localStorage.getItem("CapMin") - fauxMinMax.CMin)),
                "value_cap_faux_max":value_cap_max + (fauxMinMax.CMax - localStorage.getItem("CapMax")),
                "value_env_faux_min":Math.max(0,value_env_min - (localStorage.getItem("EnvMin") - fauxMinMax.EnvMin)),
                "value_env_faux_max":value_env_max + (fauxMinMax.EnvMax - localStorage.getItem("EnvMax")),
                "value_ouv_faux_min":Math.max(0,value_ouv_min - (localStorage.getItem("OuvMin") - fauxMinMax.OuvMin)),
                "value_ouv_faux_max":value_ouv_max + (fauxMinMax.OuvMax - localStorage.getItem("OuvMax")),
                "imp_ani_min":imp_ani_min,
                "imp_ani_max":imp_ani_max ,
                "imp_tour_min":imp_tour_min,
                "imp_tour_max":imp_tour_max,
                "imp_cap_min":imp_cap_min,
                "imp_cap_max":imp_cap_max,
                "imp_env_min":imp_env_min,
                "imp_env_max":imp_env_max,
                "imp_ouv_min":imp_ouv_min,
                "imp_ouv_max":imp_ouv_max

            };
        }
        else {
            value_ani_min = Math.ceil(AniMin.table[1]*AniMin.signe*AniMin.pas + minMax.AMin) ;
            value_ani_max =  Math.floor(AniMax.table[1]*AniMax.signe*AniMax.pas + minMax.AMax) ;
            value_tour_min = Math.ceil(TourMin.table[1]*TourMin.signe*TourMin.pas + minMax.TMin) ;
            value_tour_max = Math.floor(TourMax.table[1]*TourMax.signe*TourMax.pas + minMax.TMax) ;
            value_cap_min = Math.ceil(CapMin.table[1]*CapMin.signe*CapMin.pas + minMax.CMin) ;
            value_cap_max = Math.floor(CapMax.table[1]*CapMax.signe*CapMax.pas + minMax.CMax) ;
            value_env_min = Math.ceil(EnvMin.table[1]*EnvMin.signe*EnvMin.pas + minMax.EnvMin) ;
            value_env_max = Math.floor(EnvMax.table[1]*EnvMax.signe*EnvMax.pas + minMax.EnvMax) ;
            value_ouv_min = Math.ceil(OuvMin.table[1]*OuvMin.signe*OuvMin.pas + minMax.OuvMin) ;
            value_ouv_max = Math.floor(OuvMax.table[1]*OuvMax.signe*OuvMax.pas + minMax.OuvMax);

            // on test si avec les fauxMinMax ça marche :
            var jsonObj = {
                "room_name": localStorage.getItem("roomName"),
                "class_id": localStorage.getItem("classId"),
                "value_ani_min":value_ani_min,
                "value_ani_max": value_ani_max,
                "value_tour_min":value_tour_min,
                "value_tour_max":value_tour_max,
                "value_cap_min":value_cap_min,
                "value_cap_max":value_cap_max,
                "value_env_min":value_env_min,
                "value_env_max":value_env_max,
                "value_ouv_min":value_ouv_min,
                "value_ouv_max":value_ouv_max,
                "value_ani_faux_min":Math.max(0,value_ani_min - (localStorage.getItem("AniMin") - fauxMinMax.AMin)),
                "value_ani_faux_max":value_ani_max + (fauxMinMax.AMax - localStorage.getItem("AniMax")),
                "value_tour_faux_min":Math.max(0,value_tour_min - (localStorage.getItem("TourMin") - fauxMinMax.TMin)),
                "value_tour_faux_max":value_tour_max + (fauxMinMax.TMax - localStorage.getItem("TourMax")),
                "value_cap_faux_min":Math.max(0,value_cap_min - (localStorage.getItem("CapMin") - fauxMinMax.CMin)),
                "value_cap_faux_max":value_cap_max + (fauxMinMax.CMax - localStorage.getItem("CapMax")),
                "value_env_faux_min":Math.max(0,value_env_min - (localStorage.getItem("EnvMin") - fauxMinMax.EnvMin)),
                "value_env_faux_max":value_env_max + (fauxMinMax.EnvMax - localStorage.getItem("EnvMax")),
                "value_ouv_faux_min":Math.max(0,value_ouv_min - (localStorage.getItem("OuvMin") - fauxMinMax.OuvMin)),
                "value_ouv_faux_max":value_ouv_max + (fauxMinMax.OuvMax - localStorage.getItem("OuvMax")),
                "imp_ani_min":imp_ani_min,
                "imp_ani_max":imp_ani_max ,
                "imp_tour_min":imp_tour_min,
                "imp_tour_max":imp_tour_max,
                "imp_cap_min":imp_cap_min,
                "imp_cap_max":imp_cap_max,
                "imp_env_min":imp_env_min,
                "imp_env_max":imp_env_max,
                "imp_ouv_min":imp_ouv_min,
                "imp_ouv_max":imp_ouv_max
            };
        }

        var data = JSON.stringify(jsonObj);

        console.log(data);

        // Dichotomie :
        postXMLHttp('/api?fct=lets_calc' +
            '&data=' + data, function (ret) {
            if (ret === "Ce noyau est vide !"){
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

                    dontstop = false;
                    console.log("non vide");
                    lastNonVide = nbFile;
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

            nbFile = nbFile - 1;
        });


        do {

            let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0.dat";
          //  console.log(tmpPath);
          //  let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0-boundy.dat";
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
        data : newData,
        numFile : lastNonVide,
        mM : minMax
    };

    console.log("dernier non vide : ");
    console.log(result.data);
    return result ;// non vide
}




function dichotomieMulti(Prefs, minMax,fauxMinMax,importab =[0.0,10.0,50.0,100.0], nbEtapes = 100, rafinement = false) {
    console.log("*************************MULTI************************************");

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

    let imp_ani_min= parseInt(localStorage.getItem("ImportanceAniMin"));
    let imp_ani_max= parseInt(localStorage.getItem("ImportanceAniMax"));
    let imp_tour_min= parseInt(localStorage.getItem("ImportanceTourMin"));
    let imp_tour_max= parseInt(localStorage.getItem("ImportanceTourMax"));
    let imp_cap_min= parseInt(localStorage.getItem("ImportanceCapMin"));
    let imp_cap_max= parseInt(localStorage.getItem("ImportanceCapMax"));
    let imp_env_min= parseInt(localStorage.getItem("ImportanceEnvMin"));
    let imp_env_max= parseInt(localStorage.getItem("ImportanceEnvMax"));
    let imp_ouv_min= parseInt(localStorage.getItem("ImportanceOuvMin"));
    let imp_ouv_max= parseInt(localStorage.getItem("ImportanceOuvMax"));


    console.log(Math.floor(AniMax.table[1]*AniMax.signe*AniMax.pas));
    var nbFile = 0;
    var http = new XMLHttpRequest();
    let RoomName = localStorage.getItem("roomName");
    let ClassId = localStorage.getItem("classId");

    let faux = false; // est ce que ça marche avec les fauxminmax ?

    if (!rafinement) {
        for (var i = 0; i < Prefs.length; i++) {
            if (Prefs[i].importance === "1" || Prefs[i].importance === 1) { // si pas important on prend pas en compte
                Prefs[i].table = [0,0,0];
            }
            //  console.log(Prefs[i].name + Prefs[i].table);
        }
        value_ani_min = Math.ceil(AniMin.table[1]*AniMin.signe*AniMin.pas + fauxMinMax.AMin) ;
        value_ani_max =  Math.floor(AniMax.table[1]*AniMax.signe*AniMax.pas + fauxMinMax.AMax) ;
        value_tour_min = Math.ceil(TourMin.table[1]*TourMin.signe*TourMin.pas + fauxMinMax.TMin) ;
        value_tour_max = Math.floor(TourMax.table[1]*TourMax.signe*TourMax.pas + fauxMinMax.TMax) ;
        value_cap_min = Math.ceil(CapMin.table[1]*CapMin.signe*CapMin.pas + fauxMinMax.CMin) ;
        value_cap_max = Math.floor(CapMax.table[1]*CapMax.signe*CapMax.pas + fauxMinMax.CMax) ;
        value_env_min = Math.ceil(EnvMin.table[1]*EnvMin.signe*EnvMin.pas + fauxMinMax.EnvMin) ;
        value_env_max = Math.floor(EnvMax.table[1]*EnvMax.signe*EnvMax.pas + fauxMinMax.EnvMax) ;
        value_ouv_min = Math.ceil(OuvMin.table[1]*OuvMin.signe*OuvMin.pas + fauxMinMax.OuvMin) ;
        value_ouv_max = Math.floor(OuvMax.table[1]*OuvMax.signe*OuvMax.pas + fauxMinMax.OuvMax);


        // on test si avec les fauxMinMax ça marche :


        var classIds = [];

        for (id = 1; id < 4; id++) {
            var httpf = new XMLHttpRequest();
            var finalPath = "sources/output/" + localStorage.getItem("roomName") + "_" + id + "_" + "finalfile.dat";
            console.log(finalPath);
            httpf.open('HEAD', finalPath, false);
            httpf.send();
            if (httpf.status !== 404) { // on regarde si le fichier a été créer
                classIds.push(id);
                console.log(id)
            }
        }


        //si oui on remplace les minMax par les fauxMins max
        //Pour chaque class ID et si au moins un est vide on stoppe

        classIds.forEach(function (ids) {
            let nbFile = 0;

            do {
                let tmpPath = "sources/output/" + RoomName + "_" + ids + "_" + nbFile + "-viab-0.dat";
                http.open('HEAD', tmpPath, false);
                http.send();
                console.log(tmpPath);
                nbFile = nbFile + 1
            } while (http.status !== 404);

            nbFile = nbFile - 1;

            let class_id_ = "";
            switch (ids) {
                case 1:
                    class_id_ = "1";
                    break;
                case 2 :
                    class_id_ = "2";
                    break;
                default:
                    class_id_ = "3";
                    break;
            }


            //Un jsonObj par classID
            var jsonObj = {
                "room_name": localStorage.getItem("roomName"),
                "class_id": class_id_,
                "value_ani_min":value_ani_min,
                "value_ani_max": value_ani_max,
                "value_tour_min":value_tour_min,
                "value_tour_max":value_tour_max,
                "value_cap_min":value_cap_min,
                "value_cap_max":value_cap_max,
                "value_env_min":value_env_min,
                "value_env_max":value_env_max,
                "value_ouv_min":value_ouv_min,
                "value_ouv_max":value_ouv_max,
                "value_ani_faux_min":Math.max(0,value_ani_min - (localStorage.getItem("AniMin") - fauxMinMax.AMin)),
                "value_ani_faux_max":value_ani_max + (fauxMinMax.AMax - localStorage.getItem("AniMax")),
                "value_tour_faux_min":Math.max(0,value_tour_min - (localStorage.getItem("TourMin") - fauxMinMax.TMin)),
                "value_tour_faux_max":value_tour_max + (fauxMinMax.TMax - localStorage.getItem("TourMax")),
                "value_cap_faux_min":Math.max(0,value_cap_min - (localStorage.getItem("CapMin") - fauxMinMax.CMin)),
                "value_cap_faux_max":value_cap_max + (fauxMinMax.CMax - localStorage.getItem("CapMax")),
                "value_env_faux_min":Math.max(0,value_env_min - (localStorage.getItem("EnvMin") - fauxMinMax.EnvMin)),
                "value_env_faux_max":value_env_max + (fauxMinMax.EnvMax - localStorage.getItem("EnvMax")),
                "value_ouv_faux_min":Math.max(0,value_ouv_min - (localStorage.getItem("OuvMin") - fauxMinMax.OuvMin)),
                "value_ouv_faux_max":value_ouv_max + (fauxMinMax.OuvMax - localStorage.getItem("OuvMax")),
                "imp_ani_min":imp_ani_min,
                "imp_ani_max":imp_ani_max ,
                "imp_tour_min":imp_tour_min,
                "imp_tour_max":imp_tour_max,
                "imp_cap_min":imp_cap_min,
                "imp_cap_max":imp_cap_max,
                "imp_env_min":imp_env_min,
                "imp_env_max":imp_env_max,
                "imp_ouv_min":imp_ouv_min,
                "imp_ouv_max":imp_ouv_max
            };
            console.log("calcul faux mins et max");

            gdata = JSON.stringify(jsonObj);
            console.log(gdata);


            postXMLHttp('/api?fct=lets_calc' +
                '&data=' + gdata, function (ret) {
                if(ret !== "Ce noyau est vide !"){
                    console.log("non vide");
                    minMax = JSON.parse(JSON.stringify(fauxMinMax));
                    faux = true;
                }
            });


            do {
                console.log("id"+ids);
                console.log(nbFile);
                let tmpPath = "sources/output/" + RoomName + "_" + ids + "_" + nbFile + "-viab-0.dat";
                console.log(tmpPath);
                http.open('HEAD', tmpPath, false);
                http.send();
                sleep(1500);
            }
            while (http.status === 404);

        });
        if (faux){
            console.log("faux = "+faux);
            for(var f=0; f<Prefs.length; f++){
                Prefs[f].maxTable = Prefs[f].fauxMaxTable;
                Prefs[f].table[2] = Prefs[f].fauxMaxTable;
            }
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

        http = new XMLHttpRequest();

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

        var classIds = [];

        for (id = 1; id < 4; id++) {
            var httpf = new XMLHttpRequest();
            var finalPath = "sources/output/" + localStorage.getItem("roomName") + "_" + id + "_" + "finalfile.dat";
            console.log(finalPath);
            httpf.open('HEAD', finalPath, false);
            httpf.send();
            if (httpf.status !== 404) { // on regarde si le fichier a été créer
                classIds.push(id);
                console.log(id)
            }
        }

        let auMoinsUnvide = false;
        dontstop = false;
        console.log("classIds");
        console.log(classIds);


        classIds.forEach(function (ids) {

            let nbFile = 0;

            do {
                let tmpPath = "sources/output/" + RoomName + "_" + ids + "_" + nbFile + "-viab-0.dat";
                http.open('HEAD', tmpPath, false);
                http.send();
                console.log(tmpPath);
                nbFile = nbFile + 1
            } while (http.status !== 404);
            nbFile = nbFile - 1;

        if (faux){
            value_ani_min = Math.ceil(AniMin.table[1]*AniMin.signe*AniMin.pas + fauxMinMax.AMin) ;
            value_ani_max =  Math.floor(AniMax.table[1]*AniMax.signe*AniMax.pas + fauxMinMax.AMax) ;
            value_tour_min = Math.ceil(TourMin.table[1]*TourMin.signe*TourMin.pas + fauxMinMax.TMin) ;
            value_tour_max = Math.floor(TourMax.table[1]*TourMax.signe*TourMax.pas + fauxMinMax.TMax) ;
            value_cap_min = Math.ceil(CapMin.table[1]*CapMin.signe*CapMin.pas + fauxMinMax.CMin) ;
            value_cap_max = Math.floor(CapMax.table[1]*CapMax.signe*CapMax.pas + fauxMinMax.CMax) ;
            value_env_min = Math.ceil(EnvMin.table[1]*EnvMin.signe*EnvMin.pas + fauxMinMax.EnvMin) ;
            value_env_max = Math.floor(EnvMax.table[1]*EnvMax.signe*EnvMax.pas + fauxMinMax.EnvMax) ;
            value_ouv_min = Math.ceil(OuvMin.table[1]*OuvMin.signe*OuvMin.pas + fauxMinMax.OuvMin) ;
            value_ouv_max = Math.floor(OuvMax.table[1]*OuvMax.signe*OuvMax.pas + fauxMinMax.OuvMax);

            let class_id_ = "";
            switch (ids) {
                case 1:
                    class_id_ = "1";
                    break;
                case 2 :
                    class_id_ = "2";
                    break;
                default:
                    class_id_ = "3";
                    break;
            }

            // on test si avec les fauxMinMax ça marche :
            var jsonObj = {
                "room_name": localStorage.getItem("roomName"),
                "class_id": class_id_,
                "value_ani_min":value_ani_min,
                "value_ani_max": value_ani_max,
                "value_tour_min":value_tour_min,
                "value_tour_max":value_tour_max,
                "value_cap_min":value_cap_min,
                "value_cap_max":value_cap_max,
                "value_env_min":value_env_min,
                "value_env_max":value_env_max,
                "value_ouv_min":value_ouv_min,
                "value_ouv_max":value_ouv_max,
                "value_ani_faux_min":Math.max(0,value_ani_min - (localStorage.getItem("AniMin") - fauxMinMax.AMin)),
                "value_ani_faux_max":value_ani_max + (fauxMinMax.AMax - localStorage.getItem("AniMax")),
                "value_tour_faux_min":Math.max(0,value_tour_min - (localStorage.getItem("TourMin") - fauxMinMax.TMin)),
                "value_tour_faux_max":value_tour_max + (fauxMinMax.TMax - localStorage.getItem("TourMax")),
                "value_cap_faux_min":Math.max(0,value_cap_min - (localStorage.getItem("CapMin") - fauxMinMax.CMin)),
                "value_cap_faux_max":value_cap_max + (fauxMinMax.CMax - localStorage.getItem("CapMax")),
                "value_env_faux_min":Math.max(0,value_env_min - (localStorage.getItem("EnvMin") - fauxMinMax.EnvMin)),
                "value_env_faux_max":value_env_max + (fauxMinMax.EnvMax - localStorage.getItem("EnvMax")),
                "value_ouv_faux_min":Math.max(0,value_ouv_min - (localStorage.getItem("OuvMin") - fauxMinMax.OuvMin)),
                "value_ouv_faux_max":value_ouv_max + (fauxMinMax.OuvMax - localStorage.getItem("OuvMax")),
                "imp_ani_min":imp_ani_min,
                "imp_ani_max":imp_ani_max ,
                "imp_tour_min":imp_tour_min,
                "imp_tour_max":imp_tour_max,
                "imp_cap_min":imp_cap_min,
                "imp_cap_max":imp_cap_max,
                "imp_env_min":imp_env_min,
                "imp_env_max":imp_env_max,
                "imp_ouv_min":imp_ouv_min,
                "imp_ouv_max":imp_ouv_max

            };
        }
        else {
            value_ani_min = Math.ceil(AniMin.table[1]*AniMin.signe*AniMin.pas + minMax.AMin) ;
            value_ani_max =  Math.floor(AniMax.table[1]*AniMax.signe*AniMax.pas + minMax.AMax) ;
            value_tour_min = Math.ceil(TourMin.table[1]*TourMin.signe*TourMin.pas + minMax.TMin) ;
            value_tour_max = Math.floor(TourMax.table[1]*TourMax.signe*TourMax.pas + minMax.TMax) ;
            value_cap_min = Math.ceil(CapMin.table[1]*CapMin.signe*CapMin.pas + minMax.CMin) ;
            value_cap_max = Math.floor(CapMax.table[1]*CapMax.signe*CapMax.pas + minMax.CMax) ;
            value_env_min = Math.ceil(EnvMin.table[1]*EnvMin.signe*EnvMin.pas + minMax.EnvMin) ;
            value_env_max = Math.floor(EnvMax.table[1]*EnvMax.signe*EnvMax.pas + minMax.EnvMax) ;
            value_ouv_min = Math.ceil(OuvMin.table[1]*OuvMin.signe*OuvMin.pas + minMax.OuvMin) ;
            value_ouv_max = Math.floor(OuvMax.table[1]*OuvMax.signe*OuvMax.pas + minMax.OuvMax);

            let class_id_ = "";
            switch (ids) {
                case 1:
                    class_id_ = "1";
                    break;
                case 2 :
                    class_id_ = "2";
                    break;
                default:
                    class_id_ = "3";
                    break;
            }
            // on test si avec les fauxMinMax ça marche :
            var jsonObj = {
                "room_name": localStorage.getItem("roomName"),
                "class_id": class_id_,
                "value_ani_min":value_ani_min,
                "value_ani_max": value_ani_max,
                "value_tour_min":value_tour_min,
                "value_tour_max":value_tour_max,
                "value_cap_min":value_cap_min,
                "value_cap_max":value_cap_max,
                "value_env_min":value_env_min,
                "value_env_max":value_env_max,
                "value_ouv_min":value_ouv_min,
                "value_ouv_max":value_ouv_max,
                "value_ani_faux_min":Math.max(0,value_ani_min - (localStorage.getItem("AniMin") - fauxMinMax.AMin)),
                "value_ani_faux_max":value_ani_max + (fauxMinMax.AMax - localStorage.getItem("AniMax")),
                "value_tour_faux_min":Math.max(0,value_tour_min - (localStorage.getItem("TourMin") - fauxMinMax.TMin)),
                "value_tour_faux_max":value_tour_max + (fauxMinMax.TMax - localStorage.getItem("TourMax")),
                "value_cap_faux_min":Math.max(0,value_cap_min - (localStorage.getItem("CapMin") - fauxMinMax.CMin)),
                "value_cap_faux_max":value_cap_max + (fauxMinMax.CMax - localStorage.getItem("CapMax")),
                "value_env_faux_min":Math.max(0,value_env_min - (localStorage.getItem("EnvMin") - fauxMinMax.EnvMin)),
                "value_env_faux_max":value_env_max + (fauxMinMax.EnvMax - localStorage.getItem("EnvMax")),
                "value_ouv_faux_min":Math.max(0,value_ouv_min - (localStorage.getItem("OuvMin") - fauxMinMax.OuvMin)),
                "value_ouv_faux_max":value_ouv_max + (fauxMinMax.OuvMax - localStorage.getItem("OuvMax")),
                "imp_ani_min":imp_ani_min,
                "imp_ani_max":imp_ani_max ,
                "imp_tour_min":imp_tour_min,
                "imp_tour_max":imp_tour_max,
                "imp_cap_min":imp_cap_min,
                "imp_cap_max":imp_cap_max,
                "imp_env_min":imp_env_min,
                "imp_env_max":imp_env_max,
                "imp_ouv_min":imp_ouv_min,
                "imp_ouv_max":imp_ouv_max
            };
        }

        gdata = JSON.stringify(jsonObj);
        console.log("*********************************** data ***********************************");
        console.log(gdata);

        // Dichotomie :
        postXMLHttp('/api?fct=lets_calc' +
            '&data=' + gdata, function (ret) {
            if (ret === "Ce noyau est vide !"){
                console.log("vide");
                console.log("file num : "+nbFile);
                console.log(Prefs);
                auMoinsUnvide = true;

            } else {
                    console.log("non vide ");
                    console.log("file num : "+nbFile);
                    console.log(ids)
            }

            nbFile = nbFile - 1;
        });


        do {
            let tmpPath = "sources/output/" + RoomName + "_" + ids + "_" + nbFile + "-viab-0.dat";
            http.open('HEAD', tmpPath, false);
            http.send();
            sleep(1000)
        }
        while (http.status === 404);
        });

        if(auMoinsUnvide){
            console.log("au moins un vide");
            for (let j = 0; j < Prefs.length; j++) {
                console.log(Prefs[j].name + Prefs[j].table);
                Prefs[j].table[2] = Prefs[j].table[1];
                Prefs[j].table[1] = Math.floor((Prefs[j].table[0] + Prefs[j].table[1]) / 2.0);
                console.log(Prefs[j].name +Prefs[j].table);
            }

        }else{
            let nbFile = 0;

            do {
                let tmpPath = "sources/output/" + RoomName + "_1_" + nbFile + "-viab-0.dat";
                http.open('HEAD', tmpPath, false);
                http.send();
                console.log(tmpPath);
                nbFile = nbFile + 1
            } while (http.status !== 404);
            nbFile = nbFile - 2;

            lastNonVide = nbFile;
            console.log("tous non vides "+lastNonVide);
            newPrefs = JSON.parse(JSON.stringify(Prefs));
            newData = gdata;
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

    const result = {
        pref : newPrefs,
        data : newData,
        numFile : lastNonVide,
        mM : minMax
    };

    console.log("dernier non vide : ");
    console.log(result.data);
    console.log(lastNonVide);
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

function sortPref(sliderValues1,sliderValues2,sliderValues3,sliderValues4, prefMin, prefMax) {

    let Prefs = [prefMin, sliderValues1,sliderValues2, sliderValues3, sliderValues4, prefMax];
    let sortedPref = Prefs.sort(function(a, b){return a - b});

    let indexmin = Prefs.indexOf(prefMin);
    let indexmax = Prefs.indexOf(prefMax);

    if(indexmin === indexmax){
        indexmax = indexmax +1;
    }

    let colors = [];
    let col_i = "";



    for (let i = 1; i<6; i++){
        col_i = 'c-'+i+'-color';
        colors.push(col_i);
        if((indexmin === i-1)|| (indexmax === i)){
            colors.push(col_i);
        }
    }

    let classmin = "p"+indexmin.toString() ;
    let classmax = "p"+indexmax.toString() ;
    let handleClass = [classmin, classmax];

    let res = [sortedPref,colors,handleClass];
    console.log(res);
    return res;

}






function showPreferences(finalprefs,k){

    prefAmin = finalprefs.value_ani_min;
    prefAmax = finalprefs.value_ani_max;

    prefCmin = finalprefs.value_cap_min;
    prefCmax = finalprefs.value_cap_max;

    prefTmin = finalprefs.value_tour_min;
    prefTmax = finalprefs.value_tour_max;

    prefEnvmin = finalprefs.value_env_min;
    prefEnvmax = finalprefs.value_env_max;

    prefOuvmin = finalprefs.value_ouv_min;
    prefOuvmax = finalprefs.value_ouv_max;

    var sliderAni = document.getElementById('slider-ani-'+k);

    var sliderAniValues1 = localStorage.getItem("oldAniFauxMin");
    var sliderAniValues2 = localStorage.getItem("oldAniMin");
    var sliderAniValues3 = localStorage.getItem("oldAniMax");
    var sliderAniValues4 = localStorage.getItem("oldAniFauxMax");
    let sprefsA = sortPref(sliderAniValues1,sliderAniValues2,sliderAniValues3,sliderAniValues4, prefAmin, prefAmax);


    noUiSlider.create(sliderAni, {
        start: sprefsA[0],
        connect: [true, true,true,true, true, true, true],
        step: 20,
        range: {
            'min': [0],
            'max': [5000]
        },
    });

    var connect = sliderAni.querySelectorAll('.noUi-connect');
    var classes = sprefsA[1];

    for (var i = 0; i < connect.length; i++) {
        connect[i].classList.add(classes[i]);
    }

    sliderAni.classList.add(sprefsA[2][0]); // on met les handle des nouvelles prefs en violet
    sliderAni.classList.add(sprefsA[2][1]);

    $("#slider-ani-"+k+" > .noUi-base > .noUi-origin").each(function () {
        if ($(this).children(".noUi-handle").css("color")!=="rgb(111, 66, 193)"){
            $(this).remove();
        }
    });

    document.getElementById('prefAniMin-'+k).innerHTML=prefAmin;
    document.getElementById('prefAniMax-'+k).innerHTML=prefAmax;


    var sliderCap = document.getElementById('slider-cap-'+k);
    var sliderCapValues1 = localStorage.getItem("oldCapFauxMin");
    var sliderCapValues2 = localStorage.getItem("oldCapMin");
    var sliderCapValues3 = localStorage.getItem("oldCapMax");
    var sliderCapValues4 = localStorage.getItem("oldCapFauxMax");
    sprefsC = sortPref(sliderCapValues1,sliderCapValues2,sliderCapValues3,sliderCapValues4, prefCmin, prefCmax);


    noUiSlider.create(sliderCap, {
        start: sprefsC[0],
        connect: [true, true, true, true, true,true,true],
        step: 20,
        range: {
            'min': [0],
            'max': [10000]
        }
    });


    connect = sliderCap.querySelectorAll('.noUi-connect');
    classes = sprefsC[1];

    for (var i = 0; i < connect.length; i++) {
        connect[i].classList.add(classes[i]);
    }

    sliderCap.classList.add(sprefsC[2][0]);
    sliderCap.classList.add(sprefsC[2][1]);

    $("#slider-cap-"+k+" > .noUi-base > .noUi-origin").each(function () {
        if ($(this).children(".noUi-handle").css("color")!=="rgb(111, 66, 193)"){
            $(this).remove();
        }
    });

    document.getElementById('prefCapMin-' + k).innerHTML=prefCmin;
    document.getElementById('prefCapMax-' + k).innerHTML=prefCmax;


    var sliderTour = document.getElementById('slider-tour-'+k);

    var sliderTourValues1 = localStorage.getItem("oldTourFauxMin");
    var sliderTourValues2 = localStorage.getItem("oldTourMin");
    var sliderTourValues3 = localStorage.getItem("oldTourMax");
    var sliderTourValues4 = localStorage.getItem("oldTourFauxMax");
    sprefsT = sortPref(sliderTourValues1,sliderTourValues2,sliderTourValues3,sliderTourValues4, prefTmin, prefTmax);


    noUiSlider.create(sliderTour, {
        start: sprefsT[0],
        connect: [true, true, true, true, true,true,true],
        step: 0,
        range: {
            'min': [0],
            'max': [5000]
        }
    });

    classes = sprefsT[1];
    connect = sliderTour.querySelectorAll('.noUi-connect');

    for (var i = 0; i < connect.length; i++) {
        connect[i].classList.add(classes[i]);
    }

    sliderTour.classList.add(sprefsT[2][0]); // on met les handle des nouvelles prefs en violet
    sliderTour.classList.add(sprefsT[2][1]);

    $("#slider-tour-"+k+" > .noUi-base > .noUi-origin").each(function () {

        if ($(this).children(".noUi-handle").css("color")!=="rgb(111, 66, 193)"){
            $(this).remove();
        }
    });

    document.getElementById('prefTourMin-' + k).innerHTML=prefTmin;
    document.getElementById('prefTourMax-' + k).innerHTML=prefTmax;


    var sliderEnv = document.getElementById('slider-env-'+k);

    var sliderEnvValues1 = localStorage.getItem("oldEnvFauxMin");
    var sliderEnvValues2 = localStorage.getItem("oldEnvMin");
    var sliderEnvValues3 = localStorage.getItem("oldEnvMax");
    var sliderEnvValues4 = localStorage.getItem("oldEnvFauxMax");
    sprefsEnv = sortPref(sliderEnvValues1,sliderEnvValues2,sliderEnvValues3,sliderEnvValues4, prefEnvmin, prefEnvmax);


    noUiSlider.create(sliderEnv, {
        start: sprefsEnv[0],
        connect: [true, true, true, true, true,true,true],
        step: 1,
        range: {
            'min': [1],
            'max': [10]
        }
    });

    connect = sliderEnv.querySelectorAll('.noUi-connect');

    for ( i = 0; i < connect.length; i++) {
        connect[i].classList.add(classes[i]);
    }

    classes = sprefsEnv[1];
    sliderEnv.classList.add(sprefsEnv[2][0]); // on met les handle des nouvelles prefs en violet
    sliderEnv.classList.add(sprefsEnv[2][1]);

    $("#slider-env-"+k+" > .noUi-base > .noUi-origin").each(function () {

        if ($(this).children(".noUi-handle").css("color")!=="rgb(111, 66, 193)"){
            $(this).remove();
        }
    });

    document.getElementById('prefEnvMin-' + k).innerHTML=prefEnvmin;
    document.getElementById('prefEnvMax-' + k).innerHTML=prefEnvmax;



    var sliderOuv = document.getElementById('slider-ouv-'+k);
    var sliderOuvValues1 = localStorage.getItem("oldOuvFauxMin");
    var sliderOuvValues2 = localStorage.getItem("oldOuvMin");
    var sliderOuvValues3 = localStorage.getItem("oldOuvMax");
    var sliderOuvValues4 = localStorage.getItem("oldOuvFauxMax");
    sprefsOuv = sortPref(sliderOuvValues1,sliderOuvValues2,sliderOuvValues3,sliderOuvValues4, prefOuvmin, prefOuvmax);


    noUiSlider.create(sliderOuv, {
        start: sprefsOuv[0],
        connect: [true, true, true, true, true,true,true],
        step: 5,
        range: {
            'min': [0],
            'max': [50]
        }
    });

    connect = sliderOuv.querySelectorAll('.noUi-connect');

    for (var i = 0; i < connect.length; i++) {
        connect[i].classList.add(classes[i]);
    }

    classes = sprefsOuv[1];
    sliderOuv.classList.add(sprefsOuv[2][0]); // on met les handle des nouvelles prefs en violet
    sliderOuv.classList.add(sprefsOuv[2][1]);

    $("#slider-ouv-"+k+" > .noUi-base > .noUi-origin").each(function () {
        if ($(this).children(".noUi-handle").css("color")!=="rgb(111, 66, 193)"){
            $(this).remove();
        }
    });

    document.getElementById('prefOuvMin-' + k).innerHTML=prefOuvmin;
    document.getElementById('prefOuvMax-' + k).innerHTML=prefOuvmax;

}




