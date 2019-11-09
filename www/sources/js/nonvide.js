
window.onload = function(){
    getMinMaxPref()
};



function getMinMaxPref() {

    getXMLHttp('/api?fct=get_preference' +
        '&room_name=' + localStorage.getItem("roomName"),  function (ret) {
        //console.log(ret);

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
        console.log(localStorage.getItem("classId"));
        switch (localStorage.getItem("classId")) {
            case "1" :
                className = "Maire";
                break;
            case "2" :
                className = "Ecologiste";
                break ;
            default :
                className = "Industriel";
        }
        console.log(className);
        obj = JSON.parse(ret);
        if (obj !== null && obj.length > 0) {
            for (i = 0; i < obj.length; i++) {
                console.log(obj[i].class_name.toString());
                if (obj[i].class_name.toString() == className) {

                    // Pour les max : on regarde la distance à la borne min : il s'agit de la veleur normalisée, pour les mins,
                    // on regarde la valeur à la borne max : c'est 1- la valeur normalisée.

                    const AniMin = {
                        val: obj[i].preference.value_ani_min,
                        name: "Minimum sur le nombre d'animaux",
                        distVal: 1 - (obj[i].preference.value_ani_min - AbsAMin) / (AbsAMax - AbsAMin)
                    };

                    const AniMax = {
                        val: obj[i].preference.value_ani_max,
                        name: "Maximum sur le nombre d'animaux",
                        distVal: (obj[i].preference.value_ani_max - AbsAMin) / (AbsAMax - AbsAMin)
                    };
                    const CapMin = {
                        val: obj[i].preference.value_cap_min,
                        name: "Minimum sur le capital des pêcheurs",
                        distVal: 1 - (obj[i].preference.value_cap_min - AbsCMin) / (AbsCMax - AbsCMin)
                    };
                    const CapMax = {
                        val: obj[i].preference.value_cap_min,
                        name: "Maximum sur le capital des pêcheurs",
                        distVal: (obj[i].preference.value_cap_max - AbsCMin) / (AbsCMax - AbsCMin)
                    };

                    const TourMin = {
                        val: obj[i].preference.value_tour_min,
                        name: "Minimum sur le nombre de touristes",
                        distVal: 1 - (obj[i].preference.value_tour_min - AbsTMin) / (AbsTMax - AbsTMin)
                    };
                    const TourMax = {
                        val: obj[i].preference.value_tour_max,
                        name: "Maximum sur le nombre de touristes",
                        distVal: (obj[i].preference.value_tour_max - AbsTMin) / (AbsTMax - AbsTMin)
                    };

                    const EnvMin = {
                        val: obj[i].preference.value_env_min,
                        name: "Minimum sur la restauration de l'environement",
                        distVal: 1 - (obj[i].preference.value_env_min - AbsEnvMin) / (AbsEnvMax - AbsEnvMin)
                    };
                    const EnvMax = {
                        val: obj[i].preference.value_env_max,
                        name: "Maximum sur la restauration de l'environement",
                        distVal: (obj[i].preference.value_env_max - AbsEnvMin) / (AbsEnvMax - AbsEnvMin)
                    };

                    const OuvMin = {
                        val: obj[i].preference.value_ouv_min,
                        name: "Minimum sur l'ouverture du parc",
                        distVal: 1 - (obj[i].preference.value_ouv_min - AbsOuvMin) / (AbsOuvMax - AbsOuvMin)
                    };
                    const OuvMax = {
                        val: obj[i].preference.value_ouv_max,
                        name: "Maximum sur l'ouverture du parc",
                        distVal:  (obj[i].preference.value_ouv_max - AbsOuvMin) / (AbsOuvMax - AbsOuvMin)
                    };

                    Criteres = [AniMin, AniMax, CapMin, CapMax, TourMin, TourMax, EnvMin, EnvMax, OuvMin, OuvMax]

                }
            }
        }

        // obtenir les 5 Criteres avec les plus petites vals distVal

        console.log(Criteres);
        Criteres.sort(function (a,b) {
            return a.distVal - b.distVal;

        });
        console.log(Criteres);

        // on prend les 5 premiers  :
        var worstCrit = Criteres.slice(0,5);
        console.log(worstCrit);

        // affichage des pires critères :

        // document.getElementById(obj.class_name+"ValueAniMin").value = obj.preference.value_ani_min;




        //getFile();
    });



}

