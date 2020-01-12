let addr = "";



var importances = ["ImportanceAniMin", "ImportanceAniMax", "ImportanceTourMin", "ImportanceTourMax",
    "ImportanceCapMin", "ImportanceCapMax", "ImportanceEnvMin", "ImportanceEnvMax", "ImportanceOuvMin",
    "ImportanceOuvMax"];

var importancesText = ["Le nombre minimum d'animaux: ", "Le nombre maximum d'animaux: ", "Le nombre minimum de touristes: ", "Le nombre maximum de touristes: ",
    "La valeur maximale du capital: ", "La valeur minimale du capital: ", "L'effort minimum de restauration de l'environnement: ", "L'effort maximum de restauration de l'environnement: ",
    "La portion du parc maximale fermée au tourisme: ", "La portion du parc minimale fermée au tourisme: "];

var importancesVals = ["{{.ValueAniMin}}", "{{.ValueAniMax}}", "{{.ValueTourMin}}", "{{.ValueTourMax}}",
    "{{.ValueCapMin}}", "{{.ValueCapMax}}", "{{.ValueEnvMin}}", "{{.ValueEnvMax}}", "{{.ValueOuvMin}}",
    "{{.ValueOuvMax}}"];

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function setMinMaxRoles() {
    localStorage.setItem("nonvides", "-1");
    roles = ["Maire", "Ecologiste", "Pecheur"];
    for(var i = 0; i<roles.length; i++){
        localStorage.setItem(roles[i]+"oldAniFauxMin", -1);
        localStorage.setItem(roles[i]+"oldAniMin", -1);
        localStorage.setItem(roles[i]+"oldAniMax", -1);
        localStorage.setItem(roles[i]+"oldAniFauxMax", -1);
        localStorage.setItem(roles[i]+"oldImpAniMax", -1);

        localStorage.setItem(roles[i]+"oldCapFauxMin", -1);
        localStorage.setItem(roles[i]+"oldCapMin", -1);
        localStorage.setItem(roles[i]+"oldCapMax", -1);
        localStorage.setItem(roles[i]+"oldCapFauxMax", -1);
        localStorage.setItem(roles[i]+"oldImpCapMax", -1);

        localStorage.setItem(roles[i]+"oldTourFauxMin", -1);
        localStorage.setItem(roles[i]+"oldTourMin", -1);
        localStorage.setItem(roles[i]+"oldTourMax", -1);
        localStorage.setItem(roles[i]+"oldTourFauxMax", -1);
        localStorage.setItem(roles[i]+"oldImpTourMax", -1);

        localStorage.setItem(roles[i]+"oldEnvFauxMin", -1);
        localStorage.setItem(roles[i]+"oldEnvMin", -1);
        localStorage.setItem(roles[i]+"oldEnvMax", -1);
        localStorage.setItem(roles[i]+"oldEnvFauxMax", -1);
        localStorage.setItem(roles[i]+"oldImpEnvMax", -1);

        localStorage.setItem(roles[i]+"oldOuvFauxMin", -1);
        localStorage.setItem(roles[i]+"oldOuvMin", -1);
        localStorage.setItem(roles[i]+"oldOuvMax", -1);
        localStorage.setItem(roles[i]+"oldOuvFauxMax", -1);
        localStorage.setItem(roles[i]+"oldImpOuvMax", -1);
    }

}


window.onload = function () {
    $('[data-toggle="tooltip"]').tooltip();
};

function getXMLHttp(options, callback)
{
    let xhr= new XMLHttpRequest();
    xhr.open("GET", addr + options, true);
    //xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function() {
        if (xhr.status != 500) {
            callback(xhr.response);
        }
        else {
            alert("ERROR !");
        }
    };
    xhr.onerror = function () {
        alert("ERROR")
    }

}

function postXMLHttp(options, callback)
{
    let xhr= new XMLHttpRequest();
    xhr.open("POST", options, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(options);
    xhr.onload = function() {
        if (xhr.status != 500)
            callback(xhr.response);
        else {
            alert("ERROR (Voir console)");
            console.log(xhr.responseText)
        }
    };

}





