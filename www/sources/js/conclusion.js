window.onload = function(){

    getRecapPreferences("Tourisme");
    getRecapPreferences("Pecheur");
    getRecapPreferences("Ecologiste");
};


function getRecapPreferences(class_name) {
    let file_name = "";
    let http = new XMLHttpRequest();
    let path = "";
    for (let i = 0; i<3; i++){ // 0 premier noyau calc, 1 : avant nego, 2 : après nego


        file_name = class_name +"_"+i+".json";

        http = new XMLHttpRequest();
        path = "input/"+file_name;
        http.open('HEAD', file_name, false);
        http.send();
        if (http.status !== 404) {
            console.log("********************* i = "+i+" *********************");
            console.log(file_name);
             getXMLHttp('/api?fct=get_recap_preference' +
                    '&file_name=' + file_name, function (ret) {
                    //console.log(ret);

                    obj = JSON.parse(ret);

                    RecapAllPreferences(obj,class_name, i, true);

             });
            }
    }

}

function RecapAllPreferences(preference,class_name, i) {

    let Val1 = [preference.value_ani_faux_min, preference.value_ani_min, preference.value_ani_max, preference.value_ani_faux_max];
    let Id1 = "slider-Ani" + "-" + class_name+"-"+ i;
    let spanId1 = "valueAni" + class_name + "SliderVal";

    console.log(Id1);
    setValues(spanId1, Val1, i);
    setSlider(Id1, Val1);

    let Val2 = [preference.value_cap_faux_min, preference.value_cap_min, preference.value_cap_max, preference.value_cap_faux_max];
    let Id2 = "slider-Cap" + "-" + class_name+"-"+ i;
    let spanId2 = "valueCap" + class_name + "SliderVal";
    setValues(spanId2, Val2, i);
    setSlider(Id2, Val2,100000);


    let Val3 = [preference.value_tour_faux_min, preference.value_tour_min, preference.value_tour_max, preference.value_tour_faux_max];
    let Id3 = "slider-Tour" + "-" + class_name+"-"+ i;
    let spanId3 = "valueTour" + class_name + "SliderVal";
    setValues(spanId3, Val3, i);
    setSlider(Id3, Val3);

    let Val4 = [preference.value_env_faux_min, preference.value_env_min, preference.value_env_max, preference.value_env_faux_max];
    console.log(Val4);
    let Id4 = "slider-Env" + "-" + class_name+"-"+ i;
    let spanId4 = "valueEnv" + class_name + "SliderVal";
    setValues(spanId4, Val4, i);
    console.log(Val4);
    setSlider(Id4, Val4, 10);
    console.log(Val4);

    let Val5 = [preference.value_ouv_faux_min, preference.value_ouv_min, preference.value_ouv_max, preference.value_ouv_faux_max];
    let Id5 = "slider-Ouv" + "-" + class_name+"-"+ i;
    let spanId5 = "valueOuv" + class_name + "SliderVal";
    setValues(spanId5, Val5, i);
    setSlider(Id5, Val5, 50);
}


function setValues(spanId, sliderVals, i) {
    console.log(sliderVals);
    for (let j = 1; j <= sliderVals.length; j++) {
        id_i = spanId + j.toString()+"_"+i;
        console.log(id_i);
        document.getElementById(id_i).innerHTML = sliderVals[(j - 1)].toString()
    }
}

function setSlider(sliderId, sliderVals, max = 10000) {
    console.log(sliderId);
    var sliderAni = document.getElementById(sliderId);

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
}