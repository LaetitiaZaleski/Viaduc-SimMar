/*window.onload = function(){

    critTab=["Ani","Cap","Tour","Env","Ouv"];
    roleTab = ["Maire","Ecologiste","Pecheur"];
    maxTab =[20000,20000,20000,100,50];

    for(var i=0; i<critTab.length; i++){
        for(var j=0; j<roleTab.length; j++) {
            id = "slider-" + critTab[i] + "-" + roleTab[j];

            vals = [localStorage.getItem(roleTab[j] +critTab[i]+"FauxMin"), localStorage.getItem(roleTab[j] +critTab[i]+"Min"),
                localStorage.getItem(roleTab[j] +critTab[i]+"Max"), localStorage.getItem(roleTab[j] +critTab[i]+"FauxMax")];

            setSlider(id, vals,maxTab[i]);
          //  console.log(id);
        }
    }


};

function setSlider(sliderId, sliderVals,max){
   // console.log(sliderVals);
    var sliderAni = document.getElementById(sliderId);
    if (sliderVals[sliderVals.length-1]< 110){
    }

 /*   noUiSlider.create(sliderAni, {
        start: sliderVals,
        connect: [true, true, true, true, true],
        step: 10,
        range: {
            'min': [0],
            'max': [max]
        }
    });
*/
/*
    var connect = sliderAni.querySelectorAll('.noUi-connect');
    var classes = ['c-1-color', 'c-2-color', 'c-3-color', 'c-4-color', 'c-5-color'];

    for (var i = 0; i < connect.length; i++) {
        connect[i].classList.add(classes[i]);
    }

}
*/