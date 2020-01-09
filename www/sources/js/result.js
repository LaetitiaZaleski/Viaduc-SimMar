

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
        console.log(obj);
        console.log(obj.length);
        if ( obj.length > 0){

            for (indice=0 ;indice<obj.length; indice++ ){
                console.log(indice);
                console.log(obj[indice]);
                setAllPreference(obj[indice])
            }
        }


        //getFile();
    });
}

function setAllPreference(obj){

    let Val1 =[obj.preference.value_ani_faux_min,obj.preference.value_ani_min,obj.preference.value_ani_max, obj.preference.value_ani_faux_max];
    let Id1 = "slider-Ani" + "-" + obj.class_name;
    let spanId1 = "valueAni"+obj.class_name+"SliderVal";

    console.log(Id1);
    setValues(spanId1, Val1);
    setSlider(Id1,Val1);
    setImp("impAniMin"+obj.class_name, obj.preference.imp_ani_min);
    setImp("impAniMax"+obj.class_name, obj.preference.imp_ani_max);

    let Val2 =[obj.preference.value_cap_faux_min,obj.preference.value_cap_min,obj.preference.value_cap_max, obj.preference.value_cap_faux_max];
    let Id2 = "slider-Cap" + "-" + obj.class_name;
    let spanId2 = "valueCap"+obj.class_name+"SliderVal";
    setValues(spanId2, Val2);
    setSlider(Id2,Val2,30000);
    setImp("impCapMin"+obj.class_name, obj.preference.imp_cap_min);
    setImp("impCapMax"+obj.class_name, obj.preference.imp_cap_max);


    let Val3 =[obj.preference.value_tour_faux_min,obj.preference.value_tour_min,obj.preference.value_tour_max, obj.preference.value_tour_faux_max];
    let Id3 = "slider-Tour" + "-" + obj.class_name;
    let spanId3 = "valueTour"+obj.class_name+"SliderVal";
    setValues(spanId3, Val3);
    setSlider(Id3,Val3);
    setImp("impTourMin"+obj.class_name, obj.preference.imp_tour_min);
    setImp("impTourMax"+obj.class_name, obj.preference.imp_tour_max);


    let Val4 =[obj.preference.value_env_faux_min,obj.preference.value_env_min,obj.preference.value_env_max, obj.preference.value_env_faux_max];
    let Id4 =  id = "slider-Env" + "-" + obj.class_name;
    let spanId4 = "valueEnv"+obj.class_name+"SliderVal";
    setValues(spanId4, Val4);
    setSlider(Id4,Val4,50);
    setImp("impEnvMin"+obj.class_name, obj.preference.imp_env_min);
    setImp("impEnvMax"+obj.class_name, obj.preference.imp_env_max);


    let Val5 =[obj.preference.value_ouv_faux_min,obj.preference.value_ouv_min,obj.preference.value_ouv_max, obj.preference.value_ouv_faux_max];
    let Id5 = "slider-Ouv" + "-" + obj.class_name;
    let spanId5 = "valueOuv"+obj.class_name+"SliderVal";
    setValues(spanId5, Val5);
    setSlider(Id5,Val5,100);
    setImp("impOuvMin"+obj.class_name, obj.preference.imp_ouv_min);
    setImp("impOuvMax"+obj.class_name, obj.preference.imp_ouv_max);
}



function setSlider(sliderId, sliderVals,max=20000){
    // console.log(sliderVals);
    var sliderAni = document.getElementById(sliderId);
    if (sliderVals[sliderVals.length-1]< 110){
    }

    noUiSlider.create(sliderAni, {
        start: sliderVals,
        connect: [true, true, true, true, true],
        step: 10,
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

}
function setValues(spanId, sliderVals) {
    for(i=1; i<=sliderVals.length;i++){

        id_i = spanId+i.toString();
        console.log(id_i);
        document.getElementById(id_i).innerHTML = sliderVals[(i-1)].toString()
    }

}

function setImp(idImp, imp){
    if(imp ===1){
        document.getElementById(idImp).innerHTML = " peu important ";
    }
    else{
        document.getElementById(idImp).innerHTML = " important ";
    }
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
            console.log("ok 1");
            data = JSON.stringify(jsonObj);
            console.log("ok 2");
            console.log(data);
            console.log("ok 3");

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