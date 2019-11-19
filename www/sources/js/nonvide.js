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
        console.log(imp);
        var e = document.getElementById(imp);
        localStorage.setItem(imp,e.options[e.selectedIndex].text);
    }



    window.location.href = "?" + newParam;
}


async function getPrefs() {
    getImportances();

    getXMLHttp('/api?fct=get_preference' +
        '&room_name=' + localStorage.getItem("roomName"),  function (ret) {
        //  console.log(ret);

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
                    console.log("hello");
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
        // TODO : Augmenter/Diminuer selon si c'est un min ou un max
        // TODO : si c'est ACT : maths.ceil sinon float

      //
        //
        //console.log(Prefs);
        for (var i = 0; i < Prefs.length; i++) {
           // console.log(Prefs[i].name + Prefs[i].table);

            switch (Prefs[i].importance) {
                case 'très important':
                case 'très importante':
                //    console.log(Prefs[i].distVal / 1000.0);
                    Prefs[i].pas = Math.ceil(Prefs[i].distVal / 1000.0);
                 //   console.log("pas :" + Prefs[i].pas);
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
                    Prefs[i].pas = Math.ceil(Prefs[i].distVal / 100.0);
                    Prefs[i].importance = 100.0;
                    Prefs[i].table.push(0);
                    Prefs[i].table.push(100);
                    break;

                        //         var pasId = Prefs[i].name;
             //       var pas = document.getElementById(pasId);
               //     pas.innerHTML = "Augmenter le " + Prefs[i].name + " de " + Prefs[i].pas.toString();
                case 'neutre':
                    Prefs[i].pas = Math.ceil(Prefs[i].distVal / 10.0);
                    var pasId = Prefs[i].name;
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

        while (i<10){
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
            } while (http.status != 404);

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
                "value_ani_min": AniMin.table[1]*AniMin.signe*AniMin.pas + AbsAMin,
                "value_ani_max":  AniMax.table[1]*AniMax.signe*AniMax.pas + AbsAMax,
                "value_tour_min": TourMin.table[1]*TourMin.signe*TourMin.pas + AbsTMin,
                "value_tour_max": TourMax.table[1]*TourMax.signe*TourMax.pas + AbsTMax,
                "value_cap_min": CapMin.table[1]*CapMin.signe*CapMin.pas + AbsCMin,
                "value_cap_max": CapMax.table[1]*CapMax.signe*CapMax.pas + AbsCMax,
                "value_env_min": EnvMin.table[1]*EnvMin.signe*EnvMin.pas + AbsEnvMin,
                "value_env_max": EnvMax.table[1]*EnvMax.signe*EnvMax.pas + AbsEnvMax,
                "value_ouv_min": OuvMin.table[1]*OuvMin.signe*OuvMin.pas + AbsOuvMin,
                "value_ouv_max":OuvMax.table[1]*OuvMax.signe*OuvMax.pas + AbsOuvMax
            };
            data = JSON.stringify(jsonObj);


            console.log(data);

            // Dichotomie :
            res = postXMLHttp('/api?fct=lets_calc' +
                '&data=' + data, function (ret) {
                if (ret == "Ce noyau est vide !"){
                    console.log("noyau vide");
                    for (var j = 0; j < Prefs.length; j++) {
                        console.log(Prefs[j].name +Prefs[j].table);
                        Prefs[j].table[2] = Prefs[j].table[1];
                        Prefs[j].table[1] = Math.floor((Prefs[j].table[0] + Prefs[j].table[1]) / 2.0);
                        console.log(Prefs[j].name +Prefs[j].table);
                    }
                }
                else {
                    console.log("noyau pas vide");
                    for (var j = 0; j < Prefs.length; j++) {
                       // console.log(Prefs[j].name +Prefs[j].table);
                        Prefs[j].table[0] = Prefs[j].table[1];
                        if (Prefs[j].table[1] == Prefs[j].table[0]){ // première iteration
                            Prefs[j].table[1] = Math.ceil((Prefs[j].table[0] + Prefs[j].table[2]) / 2.0);
                        }else{
                            Prefs[j].table[1] = Math.ceil((Prefs[j].table[0] + Prefs[j].table[1]) / 2.0);
                        }

                       // console.log(Prefs[j].name +Prefs[j].table);
                    }
                }

                nbFile = nbFile - 1;
                //alert("LE CALCUL EST FINI : " + ret);
                //getFile();
            });
            do {
                let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0-bound.dat";
                http.open('HEAD', tmpPath, false);
                http.send();
                sleep(1500)
            }
            while (http.status == 404);
            i++;


/*
            // on attend que le fichier soit créé :
                 nbFile = nbFile - 1

        do {
            let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0-bound.dat";
            http.open('HEAD', tmpPath, false);
            http.send();
            sleep(1500)
        }
        while (http.status == 404);

        */
        }



        // document.getElementById(obj.class_name+"ValueAniMin").value = obj.preference.value_ani_min;

        //getFile();
    });

}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}