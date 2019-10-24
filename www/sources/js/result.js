

window.onload = function(){

    getPreference();

    setInterval(function () {
        let lastId = "0";
        if (document.getElementById('messageList').lastElementChild)
        {
            lastElemId = document.getElementById('messageList').lastElementChild.id;
            lastId =lastElemId.split("-")[2];
        }
        getNewMessage(lastId);

    }, 1000);
};

function getNewMessage(id) {

    getXMLHttp('/api?fct=get_message' +
        '&room_name=' + localStorage.getItem("roomName") +
        '&class_id=' +  localStorage.getItem("classId") +
        '&last_message_id=' + id,  function (ret) {
        //console.log(ret);

            obj = JSON.parse(ret);
        if (obj !== null && obj.length > 0){
            for (i=0 ; i< obj.length; i++ ){
                newMessage(obj[i].Id,obj[i].ClassName ,obj[i].Message, obj[i].Date)

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
            '&data=' + data,  function (ret) {
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



function getPreference() {

    getXMLHttp('/api?fct=get_preference' +
        '&room_name=' + localStorage.getItem("roomName"),  function (ret) {
        //console.log(ret);

        obj = JSON.parse(ret);
        if (obj !== null && obj.length > 0){
            for (i=0 ; i< obj.length; i++ ){
                //newMessage(obj[i].class_name,obj[i].ClassName ,obj[i].Message, obj[i].Date)
                setAllPreference(obj[i])

            }
        }


        //getFile();
    });
}

function setAllPreference(obj){

    document.getElementById(obj.class_name+"ValueAniMin").value = obj.preference.value_ani_min;
    document.getElementById(obj.class_name+"ValueAniMax").value = obj.preference.value_ani_max;
    document.getElementById(obj.class_name+"ValueCapMin").value = obj.preference.value_cap_min;
    document.getElementById(obj.class_name+"ValueCapMax").value = obj.preference.value_cap_max;
    document.getElementById(obj.class_name+"ValueEnvMin").value = obj.preference.value_env_min;
    document.getElementById(obj.class_name+"ValueEnvMax").value = obj.preference.value_env_max;
    document.getElementById(obj.class_name+"ValueOuvMin").value = obj.preference.value_ouv_min;
    document.getElementById(obj.class_name+"ValueOuvMax").value = obj.preference.value_ouv_max;
    document.getElementById(obj.class_name+"ValueTourMin").value = obj.preference.value_tour_min;
    document.getElementById(obj.class_name+"ValueTourMax").value = obj.preference.value_tour_max;

}

function letsCalc() {
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
        '&data=' + data,  function (ret) {
        alert("LE CALCUL EST FINI : " + ret);
        //getFile();
    });

}


function letsCalcAll() {

    RoomName = localStorage.getItem("roomName");

    // regarder quels noyaux ont ete calculés :
    var classIds = [];
    for (id=1; id<4; id++){
        var i = -1;
        var http = new XMLHttpRequest();
        do {
            i++;
            var tmpPath = "sources/output/"+RoomName+"_"+id+"_"+i+"-viab-0-bound.dat";
            console.log("tmpPath : " + tmpPath);
            http.open('HEAD', tmpPath, false);
            http.send();
        }
        while (http.status != 404);
        if (i > 0) {
            var numFile = i - 1;
            var path = "sources/output/"+RoomName+"_"+id+"_"+numFile+"-viab-0-bound.dat";
            classIds.push(id)
        }

    }

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


    classIds.forEach(function(ids) {
        console.log("ids : "+ ids);
        var cn = "";
        if (ids ==1){
            cn = "Maire"
        }
        if (ids ==2){
            cn = "Industriel"
        }
        if (ids ==3){
            cn = "Ecologiste"
        }

        console.log("cn = "+cn);

        newValueAniMin = parseInt(document.getElementById(cn+"ValueAniMin").value);
        valueAniMin.push(newValueAniMin);

        newValueAniMax = parseInt(document.getElementById(cn+"ValueAniMax").value);
        valueAniMax.push(newValueAniMax);

        newValueCapMin = parseInt(document.getElementById(cn+"ValueCapMin").value);
        valueCapMin.push(newValueCapMin);

        newValueCapMax = parseInt(document.getElementById(cn+"ValueCapMax").value);
        valueCapMax.push(newValueCapMax);

        newValueTourMin = parseInt(document.getElementById(cn+"ValueTourMin").value);
        valueTourMin.push(newValueTourMin);

        newValueTourMax = parseInt(document.getElementById(cn+"ValueTourMax").value);
        valueTourMax.push(newValueTourMax);

        newValueEnvMin = parseInt(document.getElementById(cn+"ValueEnvMin").value);
        valueEnvMin.push(newValueEnvMin);

        newValueEnvMax = parseInt(document.getElementById(cn+"ValueEnvMax").value);
        valueEnvMax.push(newValueEnvMax);

        newValueOuvMin = parseInt(document.getElementById(cn+"ValueOuvMin").value);
        valueOuvMin.push(newValueOuvMin);

        newValueOuvMax = parseInt(document.getElementById(cn+"ValueOuvMax").value);
        valueOuvMax.push(newValueOuvMax);

    });

    // On prend le max des min et le min des max :
    AniMax = valueAniMax.sort(function(a, b){return a-b})[0];
    console.log("Ani max" +AniMax);
    AniMin = valueAniMin.sort(function(a, b){return b-a})[0];
    console.log("Ani min" +AniMin);

    CapMax = valueCapMax.sort(function(a, b){return a-b})[0];
    console.log("Cap max" +CapMax);
    CapMin = valueCapMin.sort(function(a, b){return b-a})[0];
    console.log("Cap min" +CapMin);

    TourMax = valueTourMax.sort(function(a, b){return a-b})[0];
    console.log("Tour max" +TourMax);
    TourMin = valueTourMin.sort(function(a, b){return b-a})[0];
    console.log("Tour min" +TourMin);

    EnvMax = valueEnvMax.sort(function(a, b){return a-b})[0];
    console.log("Env max" +EnvMax);
    EnvMin = valueEnvMin.sort(function(a, b){return b-a})[0];
    console.log("Env min" +EnvMin);

    OuvMax = valueOuvMax.sort(function(a, b){return a-b})[0];
    console.log("Ouv max" +OuvMax);
    OuvMin = valueOuvMin.sort(function(a, b){return b-a})[0];
    console.log("Ouv min" +OuvMin);


    if (AniMin<AniMax && CapMin<CapMax && TourMin<TourMax && EnvMin<EnvMax && OuvMin<OuvMax){

        //Intersection non vide :

        alert("Votre intersection n'est pas vide !");
        classIds.forEach(function (ids) {

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
            console.log("ok 1")
            data = JSON.stringify(jsonObj);
            console.log("ok 2")
            console.log(data);
            console.log("ok 3")

            postXMLHttp('/api?fct=lets_calc' +
                '&data=' + data, function (ret) {
                alert("LE CALCUL EST FINI : " + ret);
                //getFile();
            });
        });
    }

    else{

        alert("Votre intersection est vide");
    }

}