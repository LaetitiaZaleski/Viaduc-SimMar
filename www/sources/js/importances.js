window.onload = function () {

        setInterval(function () {

        setNbPlayers();
        isEveryoneStillHere(); //regarde si tout le monde est là vis a vis des final files
        // si non mettre ceux qui sont partit à -1


        let revenu = qlqEstRevenu();
        // si il est revenu : final file et tt le monde n'est pas à -1
        if (revenu.length !== 0) {
            console.log("********revenu est pas vide: ****************");
            console.log(revenu);
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
                            }
                        }
                    }
                });
                //remettre son FP au bon numero :
                setFPRole_i(revenu[i]);
            }
        }

    })

};


function letsFinish() {
        //setPref(gNumFiles[gFinalFiles[0]]);
    document.getElementById('patientezContainer').innerHTML="Enregistrement des préférences...";
        getImportances();
        setImportances();
        console.log(RoomName);
        console.log(ClassId);
        console.log(nbFile);
        console.log(nbFile);

        getXMLHttp('/api?fct=rename_file' +
        '&room_name=' + RoomName + '&class_id=' + ClassId +
        '&file_id=' + nbFile + '&last_id=' + nbFile + '&bool_finalfile=' + "true", function (ret) {
        });



        sleep(1000);

        let url = window.location.href;
        let newParam = url.split("?")[1].replace("importances", "result");
        window.location.href = "?" + newParam;

}


function getImportances(){
    for (let i= 0; i < importances.length; i++) {
        let imp = importances[i];

        let checked = document.getElementById(imp).checked;

        if(checked){
            localStorage.setItem(imp,100); //$('#' + imp).val()
        }else {
            localStorage.setItem(imp,1);
        }
    }
    // window.location.href = "?" + newParam;
}




function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}