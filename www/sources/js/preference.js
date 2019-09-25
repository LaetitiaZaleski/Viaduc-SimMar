function getVals(){
    // Get slider values
    var parent = this.parentNode;
    var slides = parent.getElementsByTagName("input");
    var slide1 = parseFloat( slides[0].value );
    var slide2 = parseFloat( slides[1].value );
    // Neither slider will clip the other, so make sure we determine which is larger
    if( slide1 > slide2 ){ var tmp = slide2; slide2 = slide1; slide1 = tmp; }

    var displayElement = parent.getElementsByClassName("rangeValues")[0];
    displayElement.innerHTML = slide1 + " - " + slide2;
}

window.onload = function(){
    // Initialize Sliders
    var sliderSections = document.getElementsByClassName("range-slider");
    for( var x = 0; x < sliderSections.length; x++ ){
        var sliders = sliderSections[x].getElementsByTagName("input");
        for( var y = 0; y < sliders.length; y++ ){
            if( sliders[y].type ==="range" ){
                sliders[y].oninput = getVals;
                // Manually trigger event first time to display values
                sliders[y].oninput();
            }
        }
    }
};

function letsCalc() {
        roomName = localStorage.getItem("roomName");
        classId = localStorage.getItem("classId");
        ValueAniMin =  document.getElementById('valueAniMin').value;
        ValueAniMax =  document.getElementById('valueAniMax').value;
        ValueTourMin =  document.getElementById('valueTourMin').value;
        ValueTourMax =  document.getElementById('valueTourMax').value;
        ValueCapMin =  document.getElementById('valueCapMin').value;
        ValueCapMax =  document.getElementById('valueCapMax').value;

        ValueEnvMin =  document.getElementById('valueEnvMin').value;
        ValueEnvMax =  document.getElementById('valueEnvMax').value;
        ValueOuvMin =  document.getElementById('valueOuvMin').value;
        ValueOuvMax =  document.getElementById('valueOuvMax').value;

        console.log('&room_name=' + roomName +
            '&class_id=' + classId +
            '&value_ani_min=' + ValueAniMin +
            '&value_ani_max=' + ValueAniMax +
            '&value_tour_min=' + ValueTourMin +
            '&value_tour_max=' + ValueTourMax +
            '&value_cap_min=' + ValueCapMin +
            '&value_cap_max=' + ValueCapMax +
            '&value_env_min=' + ValueEnvMin +
            '&value_env_max=' + ValueEnvMax +
            '&value_ouv_min=' + ValueOuvMin +
            '&value_ouv_max=' + ValueOuvMax);

        postXMLHttp('/api?fct=lets_calc' +
            '&room_name=' + roomName +
            '&class_id=' + classId +
            '&value_ani_min=' + ValueAniMin +
            '&value_ani_max=' + ValueAniMax +
            '&value_tour_min=' + ValueTourMin +
            '&value_tour_max=' + ValueTourMax +
            '&value_cap_min=' + ValueCapMin +
            '&value_cap_max=' + ValueCapMax +
            '&value_env_min=' + ValueEnvMin +
            '&value_env_max=' + ValueEnvMax +
            '&value_ouv_min=' + ValueOuvMin +
            '&value_ouv_max=' + ValueOuvMax
             ,  function (ret) {
            alert("LE CALCUL EST FINI. ret = " + ret);
            //getFile();
        });

}

function letsDraw() {

    var data = [{
        type: "mesh3d",
        x: [0, 1, 2, 0],
        y: [0, 0, 1, 2],
        z: [0, 2, 0, 1],
        i: [0, 0, 0, 1],
        j: [1, 2, 3, 2],
        k: [2, 3, 1, 3],
        intensity: [0, 0.33, 0.66, 1],
        colorscale: [
            [0, 'rgb(255, 0, 0)'],
            [0.5, 'rgb(0, 255, 0)'],
            [1, 'rgb(0, 0, 255)']
        ]
    }
    ];

    Plotly.plot('myDiv', data, {}, {showSendToCloud: true});
}
