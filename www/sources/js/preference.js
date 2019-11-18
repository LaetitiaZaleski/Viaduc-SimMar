$("#valueAni").slider({});
$("#valueAni").on("slide", function(slideEvt) {
    $("#valueAniSliderVal").text(slideEvt.value);
});
$("#valueCap").slider({});
$("#valueCap").on("slide", function(slideEvt) {
    $("#valueCapSliderVal").text(slideEvt.value);
});
$("#valueTour").slider({});
$("#valueTour").on("slide", function(slideEvt) {
    $("#valueTourSliderVal").text(slideEvt.value);
});
$("#valueEnv").slider({});
$("#valueEnv").on("slide", function(slideEvt) {
    $("#valueEnvSliderVal").text(slideEvt.value);
});
$("#valueOuv").slider({});
$("#valueOuv").on("slide", function(slideEvt) {
    $("#valueOuvSliderVal").text(slideEvt.value);
});




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



function letsFinish() {
    let url = window.location.href;
    let newParam = url.split("?")[1].replace("preference", "result");

    window.location.href = "?" + newParam;
}

function letsNotEmpty() {
    let url = window.location.href;
    let newParam = url.split("?")[1].replace("preference", "nonvide");

    window.location.href = "?" + newParam;
}

function letsNotEmpty2(){
    let url = window.location.href;
    let newParam = url.split("?")[1].replace("nonvide", "nonvidep2");

    var importances = ["ImportanceAniMin", "ImportanceAniMax", "ImportanceTourMin", "ImportanceTourMax",
        "ImportanceCapMin", "ImportanceCapMax", "ImportanceEnvMin", "ImportanceEnvMax", "ImportanceOuvMin",
        "ImportanceOuvMax"];

    for (var i= 0; i < importances.length; i++) {
        var imp =importances[i];
        console.log(imp);
        var e = document.getElementById(imp);
        localStorage.setItem(imp,e.options[e.selectedIndex].text);
    }



    window.location.href = "?" + newParam;
}

