idList = []; //liste des id des joueurs sur la derniere page
nbPlayers=-1;
players = []; //liste des id des joueurs dans le jeu

window.onload = function(){

    let reload = firstTime(); // regarde si c'est la premiere fois qu'on arrive sur cette page en checkan le localhost de finalParameters des roles

    let qlqEstPartit = false;
    IdPartit = [];

/*
    setInterval(function () {
        let lastId = "0";
        if (document.getElementById('messageList').lastElementChild)
        {
            lastElemId = document.getElementById('messageList').lastElementChild.id;
            lastId =lastElemId.split("-")[2];
        }
        getNewMessage(lastId);

    }, 1000);

*/

    setInterval(function () {
            if(reload){
           //     console.log("******CAS 1********");
                getPreference();

                if(idList.length === nbPlayers){
                    reload = false;
                    getAllFiles(false);
                    // mettre les roles FP à leur bon num :
                    setFPRole()
                }

                //getFile();
            }else {
            //    console.log("******PAS CAS 1********");
                if (getMyFP() === "-1") { // on a tous les final files mais nous on est à -1 : c'est nous qui etions partit
                    setFPRole_i(localStorage.getItem("classId")); //on met notre bon FP
                    let idPresent = setIdPresents();
                    let role = "";
                    let rolefp = "";
                    let id = 0;

                    for (let i = 0; i < idPresent.length; i++) { // si il a un final file,
                        switch (idPresent[i]) {
                            case 1 :
                            case "1" :
                                rolefp = "TourismeFP";
                                role = "Tourisme";
                                id = "1";
                                break;
                            case 2 :
                            case "2" :
                                rolefp = "PecheurFP";
                                role = "Pecheur";
                                id = "2";
                                break;
                            default :
                                rolefp = "EcologisteFP";
                                role = "Ecologiste";
                                id = "3";

                        }
                        let fp = localStorage.getItem(rolefp);
                        if (fp !== "-1") {
                            console.log("FP : ");
                            console.log(fp);
                            console.log("id : ");
                            console.log(id);

                            //remettre les anciennes prefs :
                            postXMLHttp('/api?fct=lets_setPref' +
                                '&fp=' + fp +
                                '&room_name=' + localStorage.getItem("roomName") +
                                '&classId=' + id, function (ret) {
                                //getFile();
                            });
                            getPreference();
                            //afficher les anciens noyaux :
                            console.log("role :" + role);
                            getFileBynum(fp, role, id);
                        }

                    }
                    if(isEveryoneStillHere()){
                        document.getElementById("calcul").hidden = false
                    }

                } else {
             //       console.log("******On attend le retour ********");
                    setNbPlayers();
                    isEveryoneStillHere(); //regarde si tout le monde est là vis a vis des final files
                    // si non mettre ceux qui sont partit à -1
                    let revenu = qlqEstRevenu();
                    // si il est revenu : final file et tt le monde n'est pas à -1
                    if (revenu.length !== 0) {
                        for (let i = 0; i < revenu.length; i++) {
                            // get preference de cet utilisateur :
                            getXMLHttp('/api?fct=get_preference' +
                                '&room_name=' + localStorage.getItem("roomName"), function (ret) {
                                obj = JSON.parse(ret);
                                if (obj.length > 0) {
                                    for (indice = 0; indice < obj.length; indice++) {
                                        switch (obj[indice].class_name) {
                                            case "Tourisme" :
                                                cid = 1;
                                                break;
                                            case "Pecheur" :
                                                cid = 2;
                                                break;
                                            default :
                                                cid = 3;
                                        }
                                        if (cid === revenu[i]) {
                                            console.log(revenu[i]);
                                            console.log(obj[indice]);
                                            setAllPreference(obj[indice],false);
                                        }
                                    }
                                }
                            });
                            //get file de cet utilisateur :
                            getFile(false, false, revenu[i]);
                            //remettre son FP au bon numero :
                            setFPRole_i(revenu[i]);
                        }
                    }
                }

            }
            },3000);

 /*   setInterval(function () {
        if(qlqEstPartit){
            let revenu = qlqEstRevenu();
            if(revenu.length !== 0){ // si qlq est revenu sur la page:
                for(let i=0; i<revenu.length; i++){
                    // get preference de cet utilisateur :
                    setAllPreference(revenu[i]);
                    //get file de cet utilisateur :
                    getFile(false,false, revenu[i]);
                    //remettre son FP au bon numero :
                    setFPRole_i(revenu[i]);
                }
            }
        }
    },3000);

*/

    };

function setNbPlayers() {
    getXMLHttp('/api?fct=get_preference' +
        '&room_name=' + localStorage.getItem("roomName"), function (ret) {
        //console.log(ret);

        obj = JSON.parse(ret);
   //     console.log(obj);
    //    console.log(obj.length);
        if (obj.length > 0) {
            nbPlayers = obj.length;
        }
    });
}

function qlqEstRevenu(){
    let listRevenu = [];
    let idPresent = setIdPresents();
 //   console.log("id present : ");
 //   console.log(idPresent);
    let role ="";
    for (let i = 0; i<idPresent.length; i++) { // si il a un final file,
        switch (idPresent[i]) {
                case 1 :
                case "1" :
                    role = "TourismeFP";
                    break;
                case 2 :
                case "2" :
                    role = "PecheurFP";
                    break;
                default :
                    role = "EcologisteFP";
            }
  //      console.log("role");
   //     console.log(role);
    //    console.log(localStorage.getItem(role));
        if(localStorage.getItem(role)==="-1"||localStorage.getItem(role)===-1){ //mais que son FP est -1 :
            console.log("pousser");
            console.log(idPresent[i]);
            listRevenu.push(idPresent[i]); // alors il est revenu
        }
    }
    return listRevenu
}

function getMyFP(){
    let role ="";

    switch (localStorage.getItem("classId")) {
        case "1" :
            role = "TourismeFP";
            break;
        case "2" :
            role = "PecheurFP";
            break;
        default :
            role = "EcologisteFP";
    }

    return localStorage.getItem(role)

}

function setMyFP(fp="-1"){
    let role ="";
    switch (localStorage.getItem("classId")) {
        case "1" :
            role = "TourismeFP";
            break;
        case "2" :
            role = "PecheurFP";
            break;
        default :
            role = "EcologisteFP";
    }
    return localStorage.setItem(role,-1)

}

function backToPref(){
    let url = window.location.href;
    let newParam = url.split("?")[1].replace("result", "preference");
    window.location.href = "?" + newParam;
    //mettre son fp a -1 pour signaler que on est partit =
    setMyFP(-1);
    let RoomName = localStorage.getItem("roomName");
    let ClassId = localStorage.getItem("classId");

    // delete final file :

    getXMLHttp('/api?fct=delete_finalFile' +
        '&room_name=' + RoomName + '&class_id=' + ClassId,
        function (ret) {
        });

}

function isEveryoneStillHere() {
    let idPresent = setIdPresents();
/*
    console.log("idpresent:");
    console.log(idPresent);
    console.log("nbPlayers");
    console.log(nbPlayers);
*/
    let everyoneHere = (idPresent.length===nbPlayers);
    let role ="";
    if(!everyoneHere){ // on met ceux qui sont partit à -1
        for (let i = 1; i<4; i++)
            if(!idPresent.includes(i)) {
                switch (i) {
                    case 1 :
                    case "1" :
                        role = "TourismeFP";
                        break;
                    case 2 :
                    case "2" :
                        role = "PecheurFP";
                        break;
                    default :
                        role = "EcologisteFP";
                }
                IdPartit.push(i);
                localStorage.setItem(role, -1)
            }
    }
    return everyoneHere
}





function setIdPresents(){
    let idPresent = []; //liste des id qui sont présent dans la dernière phase jeu
    for (let id = 1; id < 4; id++) {
        let httpf = new XMLHttpRequest();
        let finalPath = "sources/output/" + localStorage.getItem("roomName") + "_" + id + "_" + "finalfile.dat";
        httpf.open('HEAD', finalPath, false);
        httpf.send();
        if (httpf.status !== 404) {
            idPresent.push(id);
        }
    }
    return idPresent
}

function setFPRole() {
    let idPresent = setIdPresents();
    for (let i = 0; i < idPresent.length; i++) {
        setFPRole_i(idPresent[i]);
    }
}

function setFPRole_i(i) {
        let nbFile = 0;
        let http = new XMLHttpRequest();
        let http2 = new XMLHttpRequest();
        do {
            console.log(nbFile);
            let tmpPath = "sources/output/" + localStorage.getItem("roomName") + "_" + i + "_" + nbFile + "-viab-0.dat";
            http.open('HEAD', tmpPath, false);
            http.send();
            nbFile++;
            let tmpPath2 = "sources/output/" + localStorage.getItem("roomName") + "_" + i + "_" + nbFile + "-viab-0.dat";
            http2.open('HEAD', tmpPath, false);
            http2.send();
        }
        while (http.status !== 404 || http2.status !== 404);

        let FP = nbFile - 2;
        let role = "";

        switch (i) {
            case 1 :
            case "1" :
                role = "TourismeFP";
                break;
            case 2 :
            case "2" :
                role = "PecheurFP";
                break;
            case 3 :
            case "3" :
                role = "EcologisteFP";
                break;
            default :
                role = "";
                console.log("problème role nul")
        }
        localStorage.setItem(role, FP)
    }

    function getNewMessage(id) {

        getXMLHttp('/api?fct=get_message' +
            '&room_name=' + localStorage.getItem("roomName") +
            '&class_id=' + localStorage.getItem("classId") +
            '&last_message_id=' + id, function (ret) {
            //console.log(ret);

            obj = JSON.parse(ret);
            if (obj !== null && obj.length > 0) {
                for (i = 0; i < obj.length; i++) {
                    newMessage(obj[i].Id, obj[i].ClassName, obj[i].Message, obj[i].Date)

                }
            }


            //getFile();
        });
    }

    function sendMessage() {
        var jsonObj = {
            "room_name": localStorage.getItem("roomName"),
            "class_id": localStorage.getItem("classId"),
            "message": document.getElementById('send-message').value
        };
        data = JSON.stringify(jsonObj);

        console.log(data);

        postXMLHttp('/api?fct=send_message' +
            '&data=' + data, function (ret) {
            //Append le nouveau message
            //getFile();
        });

    }

    function newMessage(id, name, message, date) {
        let newLi = document.createElement("li");
        newLi.id = "message-id-" + id;
        let textLi = document.createTextNode("(" + date + ") " + name + " : " + message);
        newLi.appendChild(textLi);
        document.getElementById("messageList").appendChild(newLi);
    }

    function firstTime() {
        res = true;
        roles = ["Tourisme", "Ecologiste", "Pecheur"];
        for (var i = 0; i < roles.length; i++) {
            console.log(res);
            res = res && (localStorage.getItem(roles[i] + "FP") === "-1");
        }
        return res;

    }


    function getPreference() {
        let onAttendQlq = false;


        getXMLHttp('/api?fct=get_preference' +
            '&room_name=' + localStorage.getItem("roomName"), function (ret) {
            //console.log(ret);

            obj = JSON.parse(ret);
            console.log(obj);
            console.log(obj.length);
            if (obj.length > 0) {
                nbPlayers = obj.length;
                for (indice = 0; indice < obj.length; indice++) {
                    switch (obj[indice].class_name) {
                        case "Tourisme" :
                            cid = "1";
                            break;
                        case "Pecheur" :
                            cid = "2";
                            break;
                        default :
                            cid = "3";
                    }
                    players.push[cid];

                    var httpf = new XMLHttpRequest();
                    var finalPath = "sources/output/" + localStorage.getItem("roomName") + "_" + cid + "_" + "finalfile.dat";
                    console.log(finalPath);
                    httpf.open('HEAD', finalPath, false);
                    httpf.send();

                    if (httpf.status !== 404 && (idList.indexOf(indice) === -1)) {
                        console.log(obj[indice]);
                        //  if(obj[indice].class_name+"oldAniMax"==="-1"){
                        setAllPreference(obj[indice]);
                        idList.push(indice);
                        // }

                    } else {
                        onAttendQlq = true
                    }

                }
            }
            //document.getElementById("affiche").hidden = onAttendQlq
            //getFile();
        });
    }

    function setAllPreference(obj,create = true) {

        let Val1 = [obj.preference.value_ani_faux_min, obj.preference.value_ani_min, obj.preference.value_ani_max, obj.preference.value_ani_faux_max];
        let Id1 = "slider-Ani" + "-" + obj.class_name;
        let spanId1 = "valueAni" + obj.class_name + "SliderVal";

        console.log(Id1);
        setValues(spanId1, Val1);
        setSlider(Id1, Val1,create);
        setImp("impAniMin" + obj.class_name, obj.preference.imp_ani_min);
        setImp("impAniMax" + obj.class_name, obj.preference.imp_ani_max);

        let Val2 = [obj.preference.value_cap_faux_min, obj.preference.value_cap_min, obj.preference.value_cap_max, obj.preference.value_cap_faux_max];
        let Id2 = "slider-Cap" + "-" + obj.class_name;
        let spanId2 = "valueCap" + obj.class_name + "SliderVal";
        setValues(spanId2, Val2);
        setSlider(Id2, Val2,create,100000);
        setImp("impCapMin" + obj.class_name, obj.preference.imp_cap_min);
        setImp("impCapMax" + obj.class_name, obj.preference.imp_cap_max);


        let Val3 = [obj.preference.value_tour_faux_min, obj.preference.value_tour_min, obj.preference.value_tour_max, obj.preference.value_tour_faux_max];
        let Id3 = "slider-Tour" + "-" + obj.class_name;
        let spanId3 = "valueTour" + obj.class_name + "SliderVal";
        setValues(spanId3, Val3);
        setSlider(Id3, Val3,create);
        setImp("impTourMin" + obj.class_name, obj.preference.imp_tour_min);
        setImp("impTourMax" + obj.class_name, obj.preference.imp_tour_max);


        let Val4 = [obj.preference.value_env_faux_min, obj.preference.value_env_min, obj.preference.value_env_max, obj.preference.value_env_faux_max];
        console.log(Val4);
        let Id4 = "slider-Env" + "-" + obj.class_name;
        let spanId4 = "valueEnv" + obj.class_name + "SliderVal";
        setValues(spanId4, Val4);
        console.log(Val4);
        setSlider(Id4, Val4,create, 10);
        console.log(Val4);
        setImp("impEnvMin" + obj.class_name, obj.preference.imp_env_min);
        setImp("impEnvMax" + obj.class_name, obj.preference.imp_env_max);


        let Val5 = [obj.preference.value_ouv_faux_min, obj.preference.value_ouv_min, obj.preference.value_ouv_max, obj.preference.value_ouv_faux_max];
        let Id5 = "slider-Ouv" + "-" + obj.class_name;
        let spanId5 = "valueOuv" + obj.class_name + "SliderVal";
        setValues(spanId5, Val5);
        setSlider(Id5, Val5,create, 50);
        setImp("impOuvMin" + obj.class_name, obj.preference.imp_ouv_min);
        setImp("impOuvMax" + obj.class_name, obj.preference.imp_ouv_max);
    }


    function setSlider(sliderId, sliderVals,create = true, max = 10000) {
        // console.log(sliderVals);
        var sliderAni = document.getElementById(sliderId);
        if (sliderVals[sliderVals.length - 1] < 110) {
        }
        if(create){

            noUiSlider.create(sliderAni, {
                start: sliderVals,
                connect: [true, true, true, true, true],
                step: 1,
                range: {
                    'min': [0],
                    'max': [max]
                }
            });

            var connect = sliderAni.querySelectorAll('.noUi-connect');
            var classes = ['c-1-color', 'c-2-color', 'c-3-color', 'c-4-color', 'c-5-color'];

            for (var i = 0; i < connect.length; i++) {
                connect[i].classList.add(classes[i]);
            }
        }else{
            sliderAni.noUiSlider.set(sliderVals)
        }


    }


    function setValues(spanId, sliderVals) {
        for (i = 1; i <= sliderVals.length; i++) {
            id_i = spanId + i.toString();
            //   console.log(id_i);
            document.getElementById(id_i).innerHTML = sliderVals[(i - 1)].toString()
        }
    }

    function setImp(idImp, imp) {
        if (imp === 1) {
            document.getElementById(idImp).innerHTML = " peu important ";
        } else {
            document.getElementById(idImp).innerHTML = " important ";
        }
    }

    function letsCalc2() {
        var jsonObj = {
            "room_name": localStorage.getItem("roomName"),
            "class_id": localStorage.getItem("classId"),
            "value_ani_min": parseInt(document.getElementById('valueAniMin').value),
            "value_ani_max": parseInt(document.getElementById('valueAniMax').value),
            "value_tour_min": parseInt(document.getElementById('valueTourMin').value),
            "value_tour_max": parseInt(document.getElementById('valueTourMax').value),
            "value_cap_min": parseInt(document.getElementById('valueCapMin').value),
            "value_cap_max": parseInt(document.getElementById('valueCapMax').value),
            "value_env_min": parseInt(document.getElementById('valueEnvMin').value),
            "value_env_max": parseInt(document.getElementById('valueEnvMax').value),
            "value_ouv_min": parseInt(document.getElementById('valueOuvMin').value),
            "value_ouv_max": parseInt(document.getElementById('valueOuvMax').value)
        };
        data = JSON.stringify(jsonObj);

        console.log(data);

        postXMLHttp('/api?fct=lets_calc' +
            '&data=' + data, function (ret) {
            alert("LE CALCUL EST FINI : " + ret);
            //getFile();
        });

    }


    function letsCalcAll() {

        document.getElementById('patientezContainer').innerHTML="Calcul en cours...";

        let RoomName = localStorage.getItem("roomName");

        // regarder quels noyaux ont ete calculés :
        var classIds = [];
        for (let id = 1; id < 4; id++) {
            var i = -1;
            var http = new XMLHttpRequest();
            do {
                i++;
                var tmpPath = "sources/output/" + RoomName + "_" + id + "_" + i + "-viab-0.dat";
                console.log("tmpPath : " + tmpPath);
                http.open('HEAD', tmpPath, false);
                http.send();
            }
            while (http.status != 404);
            if (i > 0) {
                var numFile = i - 1;
                var path = "sources/output/" + RoomName + "_" + id + "_" + numFile + "-viab-0.dat";
                classIds.push(id)
            }
        }

        // trouver les nouveaux min et max :
        let valueAniMin = [];
        let valueAniMax = [];
        let valueTourMin = [];
        let valueTourMax = [];
        let valueCapMin = [];
        let valueCapMax = [];
        let valueEnvMin = [];
        let valueEnvMax = [];
        let valueOuvMin = [];
        let valueOuvMax = [];


        classIds.forEach(function (ids) {
            console.log("ids : " + ids);
            var cn = "";
            if (ids == 1) {
                cn = "Tourisme"
            }
            if (ids == 2) {
                cn = "Pecheur"
            }
            if (ids == 3) {
                cn = "Ecologiste"
            }

            console.log("cn = " + cn);

            newValueAniMin = parseInt(document.getElementById("valueAni" + cn + "SliderVal2").innerHTML);
            valueAniMin.push(newValueAniMin);

            newValueAniMax = parseInt(document.getElementById("valueAni" + cn + "SliderVal3").innerHTML);
            valueAniMax.push(newValueAniMax);

            newValueCapMin = parseInt(document.getElementById("valueCap" + cn + "SliderVal2").innerHTML);
            valueCapMin.push(newValueCapMin);

            newValueCapMax = parseInt(document.getElementById("valueCap" + cn + "SliderVal3").innerHTML);
            valueCapMax.push(newValueCapMax);

            newValueTourMin = parseInt(document.getElementById("valueTour" + cn + "SliderVal2").innerHTML);
            valueTourMin.push(newValueTourMin);

            newValueTourMax = parseInt(document.getElementById("valueTour" + cn + "SliderVal3").innerHTML);
            valueTourMax.push(newValueTourMax);

            newValueEnvMin = parseInt(document.getElementById("valueEnv" + cn + "SliderVal2").innerHTML);
            valueEnvMin.push(newValueEnvMin);

            newValueEnvMax = parseInt(document.getElementById("valueEnv" + cn + "SliderVal3").innerHTML);
            valueEnvMax.push(newValueEnvMax);

            newValueOuvMin = parseInt(document.getElementById("valueOuv" + cn + "SliderVal2").innerHTML);
            valueOuvMin.push(newValueOuvMin);

            newValueOuvMax = parseInt(document.getElementById("valueOuv" + cn + "SliderVal3").innerHTML);
            valueOuvMax.push(newValueOuvMax);


        });
        let boolAlert = true;
        // On prend le max des min et le min des max :
        let AniMax = valueAniMax.sort(function (a, b) {
            return a - b
        })[0];
        console.log("Ani max" + AniMax);
        let AniMin = valueAniMin.sort(function (a, b) {
            return b - a
        })[0];
        console.log("Ani min" + AniMin);

        let CapMax = valueCapMax.sort(function (a, b) {
            return a - b
        })[0];
        console.log("Cap max" + CapMax);
        let CapMin = valueCapMin.sort(function (a, b) {
            return b - a
        })[0];
        console.log("Cap min" + CapMin);

        let TourMax = valueTourMax.sort(function (a, b) {
            return a - b
        })[0];
        console.log("Tour max" + TourMax);
        let TourMin = valueTourMin.sort(function (a, b) {
            return b - a
        })[0];
        console.log("Tour min" + TourMin);

        let EnvMax = valueEnvMax.sort(function (a, b) {
            return a - b
        })[0];
        console.log("Env max" + EnvMax);
        let EnvMin = valueEnvMin.sort(function (a, b) {
            return b - a
        })[0];
        console.log("Env min" + EnvMin);

        let OuvMax = valueOuvMax.sort(function (a, b) {
            return a - b
        })[0];
        console.log("Ouv max" + OuvMax);
        let OuvMin = valueOuvMin.sort(function (a, b) {
            return b - a
        })[0];
        console.log("Ouv min" + OuvMin);


        if (AniMin < AniMax && CapMin < CapMax && TourMin < TourMax && EnvMin < EnvMax && OuvMin < OuvMax) {

            //Intersection non vide :

            alert("Votre intersection n'est pas vide ! Calcul de noyau en cours...");


            classIds.forEach(function (ids) {
                let nbFile = 0;
                let http = new XMLHttpRequest();
                let http2 = new XMLHttpRequest();
                do {
                    let tmpPath = "sources/output/" + localStorage.getItem("roomName") + "_" + ids + "_" + nbFile + "-viab-0.dat";
                    http.open('HEAD', tmpPath, false);
                    http.send();
                    nbFile = nbFile + 1;
                    let tmpPath2 = "sources/output/" + localStorage.getItem("roomName") + "_" + ids + "_" + nbFile + "-viab-0.dat";
                    http2.open('HEAD', tmpPath2, false);
                    http2.send();
                } while (http.status !== 404 || http2.status !== 404);
                nbFile= nbFile - 2;


                console.log(ids);
                var cn = "";
                if (ids === 1) {
                    cn = "Tourisme"
                }
                if (ids === 2) {
                    cn = "Pecheur"
                }
                if (ids === 3) {
                    cn = "Ecologiste"
                }

                var jsonObj = {
                    "room_name": localStorage.getItem("roomName"),
                    "class_id": ids.toString(),
                    "value_ani_min": parseInt(AniMin),
                    "value_ani_max": parseInt(AniMax),
                    "value_tour_min": parseInt(TourMin),
                    "value_tour_max": parseInt(TourMax),
                    "value_cap_min": parseInt(CapMin),
                    "value_cap_max": parseInt(CapMax),
                    "value_env_min": parseInt(EnvMin),
                    "value_env_max": parseInt(EnvMax),
                    "value_ouv_min": parseInt(OuvMin),
                    "value_ouv_max": parseInt(OuvMax)
                };
                let data = JSON.stringify(jsonObj);

                    postXMLHttp('/api?fct=lets_calc' +
                        '&data=' + data, function (ret) {
                        console.log(ret);

                        if (ret === "Ce noyau est vide !") {
                            alert("Le noyau : \"" + cn + "\" est  vide");
                            document.getElementById("recherche").hidden = false;

                        } else if (ret === "Votre noyau n'est pas vide !") {
                            alert("Le noyau : \"" + cn + "\" n'est pas vide");
                        }
                    });

                    do {
                        console.log(nbFile);
                        let tmpPath = "sources/output/" + localStorage.getItem("roomName") + "_" + ids + "_" + nbFile + "-viab-0.dat";
                        http.open('HEAD', tmpPath, false);
                        http.send();
                        sleep(1000)
                    }
                    while (http.status === 404);

            });
            sleep(3000);
            getAllFiles();

        } else {

            alert("Votre intersection est vide");
            document.getElementById("recherche").hidden = false
        }

        document.getElementById('patientezContainer').innerHTML="";

    }



function goToConclu() {
    let url = window.location.href;
    let newParam = url.split("?")[1].replace("result", "conclusion");
    window.location.href = "?" + newParam;
}