function findNonVideMulti() {

    document.getElementById('patientezContainer').innerHTML="Calcul en cours, merci de patienter quelques minutes...";

    // regarder quels noyaux ont ete calculés :
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

    var httpw = new XMLHttpRequest();
    var pathwait = "sources/output/" + localStorage.getItem("roomName") + "_" + "wait.txt";
    httpw.open('HEAD', pathwait, false);
    httpw.send();


    if(httpw.status == 404){

        RoomName = localStorage.getItem("roomName");

        // creation du fichier wait.txt

        getXMLHttp('/api?fct=create_wait' +
            '&room_name=' + RoomName,
            function (ret) {
            });



        console.log(classIds);

        // trouver les nouveaux min et max :
        var valueAniMin = [];
        var valueAniMax = [];
        var valueTourMin = [];
        var valueTourMax = [];
        var valueCapMin = [];
        var valueCapMax = [];
        var valueEnvMin = [];
        var valueEnvMax = [];
        var valueOuvMin = [];
        var valueOuvMax = [];

        // trouver les nouveaux pasMin et pasMax :
        var pasAniMin = [];
        var pasAniMax = [];
        var pasTourMin = [];
        var pasTourMax = [];
        var pasCapMin = [];
        var pasCapMax = [];
        var pasEnvMin = [];
        var pasEnvMax = [];
        var pasOuvMin = [];
        var pasOuvMax = [];

        // trouver les nouvelles importances :
        var impAniMin = [];
        var impAniMax = [];
        var impTourMin = [];
        var impTourMax = [];
        var impCapMin = [];
        var impCapMax = [];
        var impEnvMin = [];
        var impEnvMax = [];
        var impOuvMin = [];
        var impOuvMax = [];


        classIds.forEach(function (ids) {
            console.log("ids : " + ids);
            var cn = "";
            if (ids === 1) {
                cn = "Maire"
            }
            if (ids === 2) {
                cn = "Pecheur"
            }
            if (ids === 3) {
                cn = "Ecologiste"
            }

            console.log("cn = " + cn);

            newValueAniMin = parseInt(document.getElementById("valueAni" + cn + "SliderVal2").innerHTML);
            valueAniMin.push(newValueAniMin);
            console.log("newValueAniMin");
            console.log(newValueAniMin);

            newValueAniMax = parseInt(document.getElementById("valueAni" + cn + "SliderVal3").innerHTML);
            valueAniMax.push(newValueAniMax);
            console.log("newValueAniMax");
            console.log(newValueAniMax);

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


            newPasAniMin = newValueAniMin - parseInt(document.getElementById("valueAni" + cn + "SliderVal1").innerHTML);
            pasAniMin.push(newPasAniMin);
            console.log("newPasAniMin");
            console.log(newPasAniMin);

            newPasAniMax = parseInt(document.getElementById("valueAni" + cn + "SliderVal4").innerHTML) - newValueAniMax;
            pasAniMax.push(newPasAniMax);

            newPasCapMin = newValueCapMin - parseInt(document.getElementById("valueCap" + cn + "SliderVal1").innerHTML);
            pasCapMin.push(newPasCapMin);

            newPasCapMax = parseInt(document.getElementById("valueCap" + cn + "SliderVal4").innerHTML) - newValueCapMax;
            pasCapMax.push(newPasCapMax);

            newPasTourMin = newValueTourMin - parseInt(document.getElementById("valueTour" + cn + "SliderVal1").innerHTML);
            pasTourMin.push(newPasTourMin);

            newPasTourMax = parseInt(document.getElementById("valueTour" + cn + "SliderVal4").innerHTML) - newValueTourMax;
            pasTourMax.push(newPasTourMax);

            newPasEnvMin = newValueEnvMin - parseInt(document.getElementById("valueEnv" + cn + "SliderVal1").innerHTML);
            pasEnvMin.push(newPasEnvMin);

            newPasEnvMax = parseInt(document.getElementById("valueEnv" + cn + "SliderVal4").innerHTML) - newValueEnvMax;
            pasEnvMax.push(newPasEnvMax);

            newPasOuvMin = newValueOuvMin - parseInt(document.getElementById("valueOuv" + cn + "SliderVal1").innerHTML);
            pasOuvMin.push(newPasOuvMin);

            newPasOuvMax = parseInt(document.getElementById("valueOuv" + cn + "SliderVal4").innerHTML) - newValueOuvMax;
            pasOuvMax.push(newPasOuvMax);


            newImpAniMin = isImp(document.getElementById("impAniMin" + cn).innerHTML);
            impAniMin.push(newImpAniMin);

            newImpAniMax = isImp(document.getElementById("impAniMax" + cn).innerHTML);
            impAniMax.push(newImpAniMax);

            newImpCapMin = isImp(document.getElementById("impCapMin" + cn).innerHTML);
            impCapMin.push(newImpCapMin);

            newImpCapMax = isImp(document.getElementById("impCapMax" + cn).innerHTML);
            impCapMax.push(newImpCapMax);

            newImpTourMin = isImp(document.getElementById("impTourMin" + cn).innerHTML);
            impTourMin.push(newImpTourMin);

            newImpTourMax = isImp(document.getElementById("impTourMax" + cn).innerHTML);
            impTourMax.push(newImpTourMax);

            newImpEnvMin = isImp(document.getElementById("impEnvMin" + cn).innerHTML);
            impEnvMin.push(newImpEnvMin);

            newImpEnvMax = isImp(document.getElementById("impEnvMax" + cn).innerHTML);
            impEnvMax.push(newImpEnvMax);

            newImpOuvMin = isImp(document.getElementById("impOuvMin" + cn).innerHTML);
            impOuvMin.push(newImpOuvMin);

            newImpOuvMax = isImp(document.getElementById("impOuvMax" + cn).innerHTML);
            impOuvMax.push(newImpOuvMax);

        });

        let Values = [[valueAniMin, valueAniMax.slice(0, valueAniMin.length)], [valueCapMin, valueCapMax.slice(0, valueCapMin.length)], [valueTourMin, valueTourMax.slice(0, valueTourMin.length)],
            [valueEnvMin, valueEnvMax.slice(0, valueEnvMin.length)], [valueOuvMin, valueOuvMax.slice(0, valueEnvMin.length)]];
        let Pas = [[pasAniMin, pasAniMax], [pasCapMin, pasCapMax], [pasTourMin, pasTourMax], [pasEnvMin, pasEnvMax], [pasOuvMin, pasOuvMax]];
        let Importances = [[impAniMin, impAniMax], [impCapMin, impCapMax], [impTourMin, impTourMax], [impEnvMin, impEnvMax], [impOuvMin, impOuvMax]];
        let LSid = ["Ani", "Cap", "Tour", "Env", "Ouv"];


        for (var crit = 0; crit < Values.length; crit++) {
            console.log(LSid[crit]);
            console.log(Values[crit]);
            console.log(Values[crit][0]);
            console.log(Values[crit][1]);
            console.log(Pas[crit]);
            console.log(Importances[crit]);

            findInter(Values[crit][0], Pas[crit][0], Importances[crit][0], Values[crit][1], Pas[crit][1], Importances[crit][1], LSid[crit])
        }
        console.log("lets go get pref !");
        getPrefs(false);
    }
    else{
        do { // si le fichier a été créé on attend qu'il disparaisse
            sleep((Math.random()+1)*3000);
            var pathwait = "sources/output/" + localStorage.getItem("roomName") + "_" + "wait.txt";
            httpw.open('HEAD', pathwait, false);
            httpw.send();
            console.log("j'attends");
        } while (httpw.status !== 404);

        var gNumFiles = getNumFile();
        /* TODO :
            copier et renommers les fichiers solutions des qu'on les fabrique
            for numfile while =! 404 on affiche :
            pour afficher getfilebyName(name)

            get file */
        classIds.forEach(function (ids) {
            var name = "solution"+k;
            getFileBynum(gNumFiles[k],name,ids)
        });


    }


}

function getNumFile() {

}

function findInter(Mins,pasMins, impMins, Maxs,pasMaxs, impMaxs,LSid) {


    // On prend le max des min et le min des max :
    console.log(Maxs);
    let Max = Math.min(...Maxs);
    console.log("max" + Max);
    let Min = Math.max(...Mins);
    console.log("min" + Min);
    let newMins = [];
    let newMaxs = [];
    let newPasMins = [];
    let newPasMaxs = [];
    let newImpMins = [];
    let newImpMaxs = [];

    if (Min < Max) { // cas 1
        console.log("cas1");
        if (isSameImp(impMins)) { // cas 1.1
            localStorage.setItem(LSid + "Min", Min);
            console.log(LSid + "Min"+ Min);
            tmp= Min-Math.min(...pasMins);
            console.log(tmp);
            localStorage.setItem(LSid + "FauxMin", tmp);
            console.log(LSid + "FauxMin");
            console.log(Min-Math.min(...pasMins));
            console.log("cas1.1");



        } else { // cas 1.2
            console.log("cas1.2");
            // parcours de imp et mins, nouveau tab avec les importants, min = le max des importants
            for (var i = 0; i < Mins.length; i++) {
                if (parseInt(impMins[i]) === 100) {
                    newMins.push(Mins[i]);
                    newPasMins.push(pasMins[i])
                }

            }
            let newMin= Math.max(...newMins);
            console.log("newMin");
            console.log(newMin);
            localStorage.setItem(LSid + "Min", newMin);
            localStorage.setItem(LSid + "FauxMin", newMin-Math.min(...pasMins));
        }


        if (isSameImp(impMaxs)) { // cas 1.1
            localStorage.setItem(LSid + "Max", Max);
            localStorage.setItem(LSid + "FauxMax", Max+Math.min(...pasMaxs));
        } else { // cas 1.2
            // parcours de imp et maxs, nouveau tab avec les importants, max = le min des importants
            for (var j = 0; j < Mins.length; j++) {
                if (parseInt(impMaxs[j]) === 100) {
                    newMaxs.push(Mins[j]);
                    newPasMaxs.push(pasMaxs[j])
                }
            }
            let newMax = Math.min(...newMaxs);
            localStorage.setItem(LSid + "Max", newMax +Math.min(...pasMaxs))
        }
        localStorage.setItem("Importance"+LSid + "Min",Math.max(...impMins));
        localStorage.setItem("Importance"+LSid + "Max",Math.min(...impMaxs));



    } else { //cas 2
        console.log("cas2");
        let newMins =[];
        let newPasMins = [];
        let newImpMins = [];

            if (isSameImp(impMins)){ // rien est important  ou tout est important
                 newMins = Mins;
                 newPasMins = pasMins;
                 newImpMins = impMins;
            } else {
                for (var k = 0; k < Mins.length; k++) {
                    if (parseInt(impMins[k]) === 100) {
                        newMins.push(Mins[k]);
                        newPasMins.push(pasMins[k]);
                        newImpMins.push("100");
                    }
                }
            }


        let newMaxs = [];
        let newPasMaxs = [];
        let newImpMaxs = [];
            if (isSameImp(impMaxs)){ // rien est important  ou tout est important
                 newMaxs = Maxs;
                 newPasMaxs = pasMaxs;
                 newImpMaxs = impMaxs;
            } else {
                for (var l = 0; l < Mins.length; l++) {
                    if (parseInt(impMaxs[l]) === 100) {
                        newMaxs.push(Maxs[l]);
                        newPasMaxs.push(pasMaxs[l]);
                        newImpMaxs.push("100");
                    }
                }
            }
            console.log("param equite : ");
            console.log(newMins);
            console.log(newPasMins);
            console.log(newMaxs);
            console.log(newPasMaxs);
            equite(newMins, newPasMins, newImpMins, newMaxs, newPasMaxs, newImpMaxs,LSid);
    }



}

function equite(Mins,pasMins,impMins,Maxs,pasMaxs,impMaxs,LSid){ // equite individuelle
    console.log("equite");
    console.log(LSid);
    console.log("Mins");
    console.log(Mins);
    console.log("Maxs");
    Maxs=Maxs.slice(0, Mins.length);
    console.log(Maxs);
    console.log(pasMins);
    console.log(pasMaxs);
    console.log(impMins);
    console.log(impMaxs);
    min = Math.max(...Mins);
    max = Math.min(...Maxs);
    while(min>=max){
        console.log(Mins);
        console.log(Maxs);
        for(var i = 0; i<Mins.length; i++){
            Mins[i]= Mins[i] - pasMins[i]
        }
        for(var j = 0; j<Mins.length; j++){
            Maxs[i]= Maxs[i] + pasMaxs[i]
        }
        min = Math.max(...Mins);
        max = Math.min(...Maxs);
        sleep(1000)
    }

    console.log(min);
    console.log(max);

    localStorage.setItem(LSid + "Min", min);
    localStorage.setItem(LSid + "FauxMin", min - Math.min(...pasMins));
    localStorage.setItem("Importance"+LSid + "Min",Math.max(...impMins));

    localStorage.setItem(LSid + "Max", max);
    localStorage.setItem(LSid + "FauxMax", max + Math.max(...pasMaxs));
    localStorage.setItem("Importance"+LSid + "Max",Math.max(...impMaxs));


}





function isSameImp(impTab){ // renvoit vrai si toute les importances sont les memes, faux sinon
    var isSame = true;
    for (var i=1; isSame&&i<impTab.length; i++) {//tant qu'on a des elements et qu'il ont la même valeur
        isSame = (impTab[0] === impTab[i]); //tous les elements continuent à avoir la même valeur si l'élément courant à la même valeur que le premier
    }
    return isSame
// on sort de la boucle parce que un test à échoué et on a false
// soit on a été au bout et on a true
}

function isImp(idImp){
    if (idImp == " peu important "){
        return 1
    }
    else{
        return 100
    }
}


