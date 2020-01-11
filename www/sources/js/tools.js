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


function setMinMaxRoles() {

    roles = ["Maire", "Ecologiste", "Pecheur"];
    for(var i = 0; i<roles.length; i++){
        localStorage.setItem(roles[i]+"AniFauxMin", 0);
        localStorage.setItem(roles[i]+"AniMin", 0);
        localStorage.setItem(roles[i]+"AniMax", 0);
        localStorage.setItem(roles[i]+"AniFauxMax", 0);

        localStorage.setItem(roles[i]+"CapFauxMin", 0);
        localStorage.setItem(roles[i]+"CapMin", 0);
        localStorage.setItem(roles[i]+"CapMax", 0);
        localStorage.setItem(roles[i]+"CapFauxMax", 0);

        localStorage.setItem(roles[i]+"TourFauxMin", 0);
        localStorage.setItem(roles[i]+"TourMin", 0);
        localStorage.setItem(roles[i]+"TourMax", 0);
        localStorage.setItem(roles[i]+"TourFauxMax", 0);

        localStorage.setItem(roles[i]+"EnvFauxMin", 0);
        localStorage.setItem(roles[i]+"EnvMin", 0);
        localStorage.setItem(roles[i]+"EnvMax", 0);
        localStorage.setItem(roles[i]+"EnvFauxMax", 0);

        localStorage.setItem(roles[i]+"OuvFauxMin", 0);
        localStorage.setItem(roles[i]+"OuvMin", 0);
        localStorage.setItem(roles[i]+"OuvMax", 0);
        localStorage.setItem(roles[i]+"OuvFauxMax", 0);

        localStorage.setItem(roles[i]+"NumFile", -1);
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





