$("#valueCap").slider({});
$("#valueCap").on("slide", function(slideEvt) {
    $("#valueCapSliderVal").text(slideEvt.value);
});
window.onload = function(){
    getPrefs()
};




function getPrefs() {

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
                break ;
            default :
                className = "Ecologiste";

        }
        console.log(className);
        obj = JSON.parse(ret);
        console.log(obj)
        if (obj !== null && obj.length > 0) {
            for (i = 0; i < obj.length; i++) {
                if (obj[i].class_name.toString() == className) {
                    console.log("hello")
                    // Pour les max : on regarde la distance à la borne min : il s'agit de la veleur normalisée, pour les mins,
                    // on regarde la valeur à la borne max : c'est 1- la valeur normalisée.

                    const AniMin = {
                        val: obj[i].preference.value_ani_min,
                        name: "Minimum sur le nombre d'animaux",
                        distVal: obj[i].preference.value_ani_min - AbsAMin,
                        importance : localStorage.getItem("ImportanceAniMin"),
                        pas : Math.ceil(obj[i].preference.value_ani_min - AbsAMin +1)
                    };

                    const AniMax = {
                        val: obj[i].preference.value_ani_max,
                        name: "Maximum sur le nombre d'animaux",
                        distVal:  AbsAMax - obj[i].preference.value_ani_max,
                        importance : localStorage.getItem("ImportanceAniMax"),
                        pas : Math.ceil(AbsAMax - obj[i].preference.value_ani_max +1)
                    };
                    const CapMin = {
                        val: obj[i].preference.value_cap_min,
                        name: "Minimum sur le capital des pêcheurs",
                        distVal: obj[i].preference.value_cap_min - AbsCMin,
                        importance : localStorage.getItem("ImportanceCapMin"),
                        pas : obj[i].preference.value_cap_min - AbsCMin
                    };
                    const CapMax = {
                        val: obj[i].preference.value_cap_max,
                        name: "Maximum sur le capital des pêcheurs",
                        distVal: AbsCMax - obj[i].preference.value_cap_max,
                        importance :localStorage.getItem("ImportanceCapMax"),
                        pas : AbsCMax - obj[i].preference.value_cap_max
                    };

                    const TourMin = {
                        val: obj[i].preference.value_tour_min,
                        name: "Minimum sur le nombre de touristes",
                        distVal:obj[i].preference.value_tour_min - AbsTMin,
                        importance : localStorage.getItem("ImportanceTourMin"),
                        pas : obj[i].preference.value_tour_min - AbsTMin
                    };
                    const TourMax = {
                        val: obj[i].preference.value_tour_max,
                        name: "Maximum sur le nombre de touristes",
                        distVal: (AbsTMax - obj[i].preference.value_tour_max),
                        importance : localStorage.getItem("ImportanceTourMax"),
                        pas : AbsTMax - obj[i].preference.value_tour_max
                    };

                    const EnvMin = {
                        val: obj[i].preference.value_env_min,
                        name: "Minimum sur la restauration de l'environement",
                        distVal: obj[i].preference.value_env_min - AbsEnvMin,
                        importance : localStorage.getItem("ImportanceEnvMin"),
                        pas : obj[i].preference.value_env_min - AbsEnvMin
                    };
                    const EnvMax = {
                        val: obj[i].preference.value_env_max,
                        name: "Maximum sur la restauration de l'environement",
                        distVal: (AbsEnvMax - obj[i].preference.value_env_max),
                        importance : localStorage.getItem("ImportanceEnvMax"),
                        pas : AbsEnvMax - obj[i].preference.value_env_max
                    };

                    const OuvMin = {
                        val: obj[i].preference.value_ouv_min,
                        name: "Minimum sur l'ouverture du parc",
                        distVal: obj[i].preference.value_ouv_min - AbsOuvMin,
                        importance : localStorage.getItem("ImportanceOuvMin"),
                        pas : obj[i].preference.value_ouv_min - AbsOuvMin
                    };
                    const OuvMax = {
                        val: obj[i].preference.value_ouv_max,
                        name: "Maximum sur l'ouverture du parc",
                        distVal:  (AbsOuvMax - obj[i].preference.value_ouv_max),
                        importance : localStorage.getItem("ImportanceOuvMax"),
                        pas : (AbsOuvMax - obj[i].preference.value_ouv_max)
                    };

                    Prefs = [AniMin, AniMax, CapMin, CapMax, TourMin, TourMax, EnvMin, EnvMax, OuvMin, OuvMax]

                }
            }
        }

        //  calcule leur pas TODO :

        console.log(Prefs);
        for (var i =0; i<Prefs.length; i++){
            switch (Prefs[i].importance) {
                case 'très important':
                case 'très importante':
                    Prefs[i].pas = Prefs[i].distVal / 1000;
                    console.log("pas :"+Prefs[i].pas);
                    var pasId =Prefs[i].name;
                    var pas = document.getElementById(pasId);
                    pas.innerHTML = "Augmenter le " + Prefs[i].name + " de " + Prefs[i].pas.toString();
                    break;
                case 'important':
                case 'importante':
                    Prefs[i].pas = Prefs[i].distVal / 100;
                    var pasId =Prefs[i].name;
                    var pas = document.getElementById(pasId);
                    pas.innerHTML = "Augmenter le " + Prefs[i].name + " de " + Prefs[i].pas.toString();
                case 'neutre':
                    Prefs[i].pas = Prefs[i].distVal / 10;
                    var pasId =Prefs[i].name;
                    var pas = document.getElementById(pasId);
                    pas.innerHTML = "Augmenter le " + Prefs[i].name + " de " + Prefs[i].pas.toString();
                    break;
                default :
                    break;
            }


        }

        console.log(Prefs);


        // affichage des pas :
       /* for(i=0; i<5; i++){
            var pasId = i.toString();
            var pire = document.getElementById(pireId);
            pire.innerHTML = worstCrit[i].name + " : " + worstCrit[i].val.toString();
        }
*/



        // document.getElementById(obj.class_name+"ValueAniMin").value = obj.preference.value_ani_min;

        //getFile();
    });



}

