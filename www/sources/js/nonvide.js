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
        printhello();

        // Valeurs de min et max absolu :

        AbsAMax = 20000;
        AbsAMin = 500;

        AbsCMax = 20000;
        AbsCMin = 500;

        AbsTMax = 20000;
        AbsTMin = 500;

        AbsEnvMax = 100;
        AbsEnvMin = 0;

        AbsOuvMax = 50;
        AbsOuvMin = 0;

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
                 //   console.log("hello");
                    // Pour les max : on regarde la distance à la borne min : il s'agit de la veleur normalisée, pour les mins,
                    // on regarde la valeur à la borne max : c'est 1- la valeur normalisée.

                    const AniMin = {
                        val: obj[i].preference.value_ani_min,
                        name: "Minimum sur le nombre d'animaux",
                        distVal: obj[i].preference.value_ani_min - AbsAMin,
                        importance: localStorage.getItem("ImportanceAniMin"),
                        signe: 1,
                        pas: 0.0,
                        table : [0]
                    };

                    const AniMax = {
                        val: obj[i].preference.value_ani_max,
                        name: "Maximum sur le nombre d'animaux",
                        distVal: AbsAMax - obj[i].preference.value_ani_max,
                        importance: localStorage.getItem("ImportanceAniMax"),
                        signe: -1,
                        pas: 0.0,
                        table : [0]
                    };
                    const CapMin = {
                        val: obj[i].preference.value_cap_min,
                        name: "Minimum sur le capital des pêcheurs",
                        distVal: obj[i].preference.value_cap_min - AbsCMin,
                        importance: localStorage.getItem("ImportanceCapMin"),
                        signe: 1,
                        pas: 0.0,
                        table : [0]
                    };
                    const CapMax = {
                        val: obj[i].preference.value_cap_max,
                        name: "Maximum sur le capital des pêcheurs",
                        distVal: AbsCMax - obj[i].preference.value_cap_max,
                        importance: localStorage.getItem("ImportanceCapMax"),
                        signe: -1,
                        pas: 0.0,
                        table : [0]
                    };

                    const TourMin = {
                        val: obj[i].preference.value_tour_min,
                        name: "Minimum sur le nombre de touristes",
                        distVal: obj[i].preference.value_tour_min - AbsTMin,
                        importance: localStorage.getItem("ImportanceTourMin"),
                        signe: 1,
                        pas: obj[i].preference.value_tour_min - AbsTMin,
                        table : [0]
                    };
                    const TourMax = {
                        val: obj[i].preference.value_tour_max,
                        name: "Maximum sur le nombre de touristes",
                        distVal: (AbsTMax - obj[i].preference.value_tour_max),
                        importance: localStorage.getItem("ImportanceTourMax"),
                        signe: -1,
                        pas: 0.0,
                        table : [0]
                    };

                    const EnvMin = {
                        val: obj[i].preference.value_env_min,
                        name: "Minimum sur la restauration de l'environement",
                        distVal: obj[i].preference.value_env_min - AbsEnvMin,
                        importance: localStorage.getItem("ImportanceEnvMin"),
                        signe: 1,
                        pas: 0.0,
                        table : [0]
                    };
                    const EnvMax = {
                        val: obj[i].preference.value_env_max,
                        name: "Maximum sur la restauration de l'environement",
                        distVal: (AbsEnvMax - obj[i].preference.value_env_max),
                        importance: localStorage.getItem("ImportanceEnvMax"),
                        signe: -1,
                        pas: 0.0,
                        table : [0]
                    };

                    const OuvMin = {
                        val: obj[i].preference.value_ouv_min,
                        name: "Minimum sur l'ouverture du parc",
                        distVal: obj[i].preference.value_ouv_min - AbsOuvMin,
                        importance: localStorage.getItem("ImportanceOuvMin"),
                        signe: 1,
                        pas: 0.0,
                        table : [0]
                    };
                    const OuvMax = {
                        val: obj[i].preference.value_ouv_max,
                        name: "Maximum sur l'ouverture du parc",
                        distVal: (AbsOuvMax - obj[i].preference.value_ouv_max),
                        importance: localStorage.getItem("ImportanceOuvMax"),
                        signe: -1,
                        pas: 0.0,
                        table : [0]
                    };

                    Prefs = [AniMin, AniMax, CapMin, CapMax, TourMin, TourMax, EnvMin, EnvMax, OuvMin, OuvMax]

                }
            }
        }

        //  calcule leur pas :

        //console.log(Prefs);
        for (var i = 0; i < Prefs.length; i++) {
           // console.log(Prefs[i].name + Prefs[i].table);

            switch (Prefs[i].importance) {
                case 'très important':
                case 'très importante':
                //    console.log(Prefs[i].distVal / 1000.0);
                    Prefs[i].pas = Prefs[i].distVal / 1000.0;
                   // console.log("pas :" + Prefs[i].pas);
                    Prefs[i].importance = 1000.0;
                    Prefs[i].table.push(0);
                    Prefs[i].table.push(1000);
                    break;

            //        var pasId = Prefs[i].name;
             //       var pas = document.getElementById(pasId);
             //       pas.innerHTML = "Augmenter le " + Prefs[i].name + " de " + Prefs[i].pas.toString();
                    break;
                case 'important':
                case 'importante':
                    Prefs[i].pas = Prefs[i].distVal / 100.0;
                    Prefs[i].importance = 100.0;
                    Prefs[i].table.push(0);
                    Prefs[i].table.push(100);
                    break;

                        //         var pasId = Prefs[i].name;
             //       var pas = document.getElementById(pasId);
               //     pas.innerHTML = "Augmenter le " + Prefs[i].name + " de " + Prefs[i].pas.toString();
                case 'neutre':
                    Prefs[i].pas = Prefs[i].distVal / 10.0;
                   // var pasId = Prefs[i].name;
                    Prefs[i].importance = 10.0;
                    Prefs[i].table.push(0);
                    Prefs[i].table.push(10);
               //     var pas = document.getElementById(pasId);
                //    pas.innerHTML = "Augmenter le " + Prefs[i].name + " de " + Prefs[i].pas.toString();
                    break;
                default :
                    Prefs[i].importance = 0.0;
                    Prefs[i].table.push(0);
                    Prefs[i].table.push(0);
                    break;
            }

          //  console.log(Prefs[i].name + Prefs[i].table);

        }

       // console.log(Prefs);
      //   debut de l'exploration :
        i=0;
        var lastNonVide = 0;
        newPrefs = [];
        prefsInit = Prefs;
        while (i<100){
            console.log("******** etape numero: "+i+" ********");

            var http = new XMLHttpRequest();
            nbFile = 0;

            RoomName = localStorage.getItem("roomName");
            ClassId = localStorage.getItem("classId");

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
                "value_ani_min": Math.ceil(AniMin.table[1]*AniMin.signe*AniMin.pas + AbsAMin),
                "value_ani_max":  Math.floor(AniMax.table[1]*AniMax.signe*AniMax.pas + AbsAMax),
                "value_tour_min": Math.ceil(TourMin.table[1]*TourMin.signe*TourMin.pas + AbsTMin),
                "value_tour_max": Math.floor(TourMax.table[1]*TourMax.signe*TourMax.pas + AbsTMax),
                "value_cap_min": Math.ceil(CapMin.table[1]*CapMin.signe*CapMin.pas + AbsCMin),
                "value_cap_max": Math.floor(CapMax.table[1]*CapMax.signe*CapMax.pas + AbsCMax),
                "value_env_min": Math.ceil(EnvMin.table[1]*EnvMin.signe*EnvMin.pas + AbsEnvMin),
                "value_env_max": Math.floor(EnvMax.table[1]*EnvMax.signe*EnvMax.pas + AbsEnvMax),
                "value_ouv_min": Math.ceil(OuvMin.table[1]*OuvMin.signe*OuvMin.pas + AbsOuvMin),
                "value_ouv_max":Math.floor(OuvMax.table[1]*OuvMax.signe*OuvMax.pas + AbsOuvMax)
            };
            data = JSON.stringify(jsonObj);


            console.log(data);

            // Dichotomie :
            res = postXMLHttp('/api?fct=lets_calc' +
                '&data=' + data, function (ret) {
                if (ret == "Ce noyau est vide !"){
                    console.log("vide");
                    // si la première iteration est vide c'est une erreur : on ne fait rien et on recommence
                        for (var j = 0; j < Prefs.length; j++) {
                            if(Prefs[j].table[1] ==! Prefs[j].table[0]) {
                              //  console.log(Prefs[j].name + Prefs[j].table);
                            Prefs[j].table[2] = Prefs[j].table[1];
                            Prefs[j].table[1] = Math.floor((Prefs[j].table[0] + Prefs[j].table[1]) / 2.0);
                            //console.log(Prefs[j].name +Prefs[j].table);
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
            // pour toutes les pref si tab[0] == tab[2] on stoppe
            var stop = 0;
            for (var j = 0; j < Prefs.length; j++) {
             //   console.log(Prefs[j].name + Prefs[j].table);
                if ((Prefs[j].table[1] === Prefs[j].table[2])||((Prefs[j].table[1]+1) === Prefs[j].table[2])){
                    stop++
                }
            }

           // console.log("stop : "+stop);
            if(stop === Prefs.length){
                i=100;
            }
            i++;
        }

        /******************************** Rafinement **********************************/

      //  console.log(prefsInit);
      //  console.log(newPrefs);
        i=0;

        for (j = 0; j < newPrefs.length; j++){
           // console.log("test : "+lastPrefsNonVide[j].name+" "+lastPrefsNonVide[j].importance);
            if (newPrefs[j].importance < 5){ // si c'etait des importants on garde comme avant
                // sinon on les traite comme des neutres
            //    console.log("pas important");
                prefsInit[j].importance = 100.0;
                prefsInit[j].pas = prefsInit[j].distVal / prefsInit[j].importance;
                // var pasId = Prefs[i].name;
                prefsInit[j].table =[0,0,100];
                newPrefs[j]=prefsInit[j]
            }
        }
     //   console.log("New prefs :");
     //   console.log(newPrefs);

        while (i<100){


            console.log("******** Rafinement : "+i+" ********");
       //     console.log("New prefs 1:");
      //      console.log(newPrefs);

             http = new XMLHttpRequest();
            nbFile = 0;

            RoomName = localStorage.getItem("roomName");
            ClassId = localStorage.getItem("classId");

            do {
                let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0-bound.dat";
                http.open('HEAD', tmpPath, false);
                http.send();
                nbFile = nbFile + 1
            } while (http.status !== 404);


            let AniMin = newPrefs[0];
            let AniMax = newPrefs[1];
            let TourMin = newPrefs[2];
            let TourMax = newPrefs[3];
            let CapMin = newPrefs[4];
            let CapMax = newPrefs[5];
            let EnvMin = newPrefs[6];
            let EnvMax = newPrefs[7];
            let OuvMin = newPrefs[8];
            let OuvMax = newPrefs[9];

             jsonObj = {
                "room_name": localStorage.getItem("roomName"),
                "class_id": localStorage.getItem("classId"),
                "value_ani_min": Math.ceil(AniMin.table[1]*AniMin.signe*AniMin.pas + AbsAMin),
                "value_ani_max":  Math.floor(AniMax.table[1]*AniMax.signe*AniMax.pas + AbsAMax),
                "value_tour_min": Math.ceil(TourMin.table[1]*TourMin.signe*TourMin.pas + AbsTMin),
                "value_tour_max": Math.floor(TourMax.table[1]*TourMax.signe*TourMax.pas + AbsTMax),
                "value_cap_min": Math.ceil(CapMin.table[1]*CapMin.signe*CapMin.pas + AbsCMin),
                "value_cap_max": Math.floor(CapMax.table[1]*CapMax.signe*CapMax.pas + AbsCMax),
                "value_env_min": Math.ceil(EnvMin.table[1]*EnvMin.signe*EnvMin.pas + AbsEnvMin),
                "value_env_max": Math.floor(EnvMax.table[1]*EnvMax.signe*EnvMax.pas + AbsEnvMax),
                "value_ouv_min": Math.ceil(OuvMin.table[1]*OuvMin.signe*OuvMin.pas + AbsOuvMin),
                "value_ouv_max":Math.floor(OuvMax.table[1]*OuvMax.signe*OuvMax.pas + AbsOuvMax)
            };
            data = JSON.stringify(jsonObj);

              console.log(data);
         //   console.log("New prefs 2:");
          //  console.log(newPrefs);

            // Dichotomie :
            res = postXMLHttp('/api?fct=lets_calc' +
                '&data=' + data, function (ret) {
                if (ret === "Ce noyau est vide !"){
                    console.log(" vide");
                    for (var j = 0; j < newPrefs.length; j++) {
                        //console.log("c'est pareil ?")
                        //console.log(newPrefs[j].table[1]);
                        //console.log(newPrefs[j].table[0]);
                        //console.log(newPrefs[j].table[1] ==! newPrefs[j].table[0])
                        for (var j = 0; j < newPrefs.length; j++) {
                    //            console.log(newPrefs[j].name + Prefs[j].table);
                                newPrefs[j].table[2] = newPrefs[j].table[1];
                                newPrefs[j].table[1] = Math.floor((newPrefs[j].table[0] + newPrefs[j].table[1]) / 2.0);
                     //           console.log(newPrefs[j].name +newPrefs[j].table);
                        }


                    }
                }
                else {
                    console.log("non vide");
                    for ( j = 0; j < newPrefs.length; j++) {
                 //       console.log(Prefs[j].name +Prefs[j].table);
                        newPrefs[j].table[0] = newPrefs[j].table[1];
                 //       console.log(newPrefs[j].table[2]);
                 //       console.log(newPrefs[j].table[1]);
                        if (newPrefs[j].table[1] === newPrefs[j].table[0]){ // première iteration
                            newPrefs[j].table[1] = Math.ceil((newPrefs[j].table[0] + newPrefs[j].table[2]) / 2.0);
                        }else{
                            newPrefs[j].table[1] = Math.ceil((newPrefs[j].table[0] + newPrefs[j].table[1]) / 2.0);
                        }
                  //      console.log(newPrefs[j].table[1]);
                  //      console.log(Prefs[j].name +Prefs[j].table);
                    }
                }
            //    console.log("New prefs 3 :");
            //    console.log(newPrefs);

                nbFile = nbFile - 1;
            });

            do {
                let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0-bound.dat";
                http.open('HEAD', tmpPath, false);
                http.send();
                sleep(2500)
            }
            while (http.status === 404);

            // condition d'arret : pour toutes les pref si tab[0] == tab[2] on stoppe
            stop = 0;
            for (j = 0; j < newPrefs.length; j++) {
          //      console.log(newPrefs[j].name + newPrefs[j].table);
                if ((newPrefs[j].table[1] === newPrefs[j].table[2])||((newPrefs[j].table[1]+1) === newPrefs[j].table[2])){
                    stop++
                }
            }

            console.log("stop : "+stop);
            if(stop === newPrefs.length){
                i=100;
            }
            i++;
        }

    });

}

function printhello() {
    console.log("Hello")
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}