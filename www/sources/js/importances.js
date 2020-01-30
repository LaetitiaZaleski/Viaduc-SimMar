
function letsFinish() {
        //setPref(gNumFiles[gFinalFiles[0]]);
    document.getElementById('patientezContainer').innerHTML="Enregistrement des préférences...";
        getImportances();
        setImportances();

        getXMLHttp('/api?fct=rename_file' +
        '&room_name=' + RoomName + '&class_id=' + ClassId +
        '&file_id=' + nbFile + '&last_id=' + nbFile, function (ret) {

        });
        sleep(1000);

        let url = window.location.href;
        let newParam = url.split("?")[1].replace("importances", "result");
        window.location.href = "?" + newParam;




}


function getImportances(){
    for (let i= 0; i < importances.length; i++) {
        let imp =importances[i];

        let checked = document.getElementById(imp).checked;

        if(checked){
            localStorage.setItem(imp,100); //$('#' + imp).val()
        }else {
            localStorage.setItem(imp,1);
        }
    }
    // window.location.href = "?" + newParam;
}


async function setImportances() {
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

        "value_ani_min": parseInt(localStorage.getItem("AniMin")),
        "value_ani_max": parseInt(localStorage.getItem("AniMax")),
        "value_tour_min": parseInt(localStorage.getItem("TourMin")),
        "value_tour_max": parseInt(localStorage.getItem("TourMax")),
        "value_cap_min": parseInt(localStorage.getItem("CapMin")),
        "value_cap_max": parseInt(localStorage.getItem("CapMax")),
        "value_env_min": parseInt(localStorage.getItem("EnvMin")),
        "value_env_max": parseInt(localStorage.getItem("EnvMax")),
        "value_ouv_min": parseInt(localStorage.getItem("OuvMin")),
        "value_ouv_max": parseInt(localStorage.getItem("OuvMax")),

        "value_ani_faux_min": parseInt(localStorage.getItem("AniFauxMin")),
        "value_ani_faux_max": parseInt(localStorage.getItem("AniFauxMax")),
        "value_tour_faux_min": parseInt(localStorage.getItem("TourFauxMin")),
        "value_tour_faux_max": parseInt(localStorage.getItem("TourFauxMax")),
        "value_cap_faux_min": parseInt(localStorage.getItem("CapFauxMin")),
        "value_cap_faux_max": parseInt(localStorage.getItem("CapFauxMax")),
        "value_env_faux_min": parseInt(localStorage.getItem("EnvFauxMin")),
        "value_env_faux_max": parseInt(localStorage.getItem("EnvFauxMax")),
        "value_ouv_faux_min": parseInt(localStorage.getItem("OuvFauxMin")),
        "value_ouv_faux_max": parseInt(localStorage.getItem("OuvFauxMax")),

        "imp_ani_min": parseInt(localStorage.getItem("ImportanceAniMax")),
        "imp_ani_max": parseInt(localStorage.getItem("ImportanceAniMin")),
        "imp_tour_min": parseInt(localStorage.getItem("ImportanceTourMax")),
        "imp_tour_max": parseInt(localStorage.getItem("ImportanceTourMin")),
        "imp_cap_min": parseInt(localStorage.getItem("ImportanceCapMax")),
        "imp_cap_max": parseInt(localStorage.getItem("ImportanceCapMin")),
        "imp_env_min": parseInt(localStorage.getItem("ImportanceEnvMax")),
        "imp_env_max": parseInt(localStorage.getItem("ImportanceEnvMin")),
        "imp_ouv_min": parseInt(localStorage.getItem("ImportanceOuvMax")),
        "imp_ouv_max": parseInt(localStorage.getItem("ImportanceOuvMin"))
    };

    data = JSON.stringify(jsonObj);

    console.log(data);
    neg = true;

    while (neg) {
        neg = false;
        postXMLHttp('/api?fct=lets_calc' +
            '&data=' + data, function (ret) {
            if (ret === "Ce noyau est negatif !") {
                // alert("LE CALCUL EST FINI : " + ret);
                //getFile();
                neg = true;
            }

        });
    }

    // on attend que le fichier soit créé :
    nbFile = nbFile -1;

    do {
        let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + nbFile + "-viab-0-bound.dat";
        http.open('HEAD', tmpPath, false);
        http.send();
        sleep(1000)
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