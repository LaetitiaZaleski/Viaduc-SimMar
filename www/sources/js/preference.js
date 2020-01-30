

$("#valueAni").slider({});
$("#valueAni").on("slide", function(slideEvt) {
    $("#tortues").attr('data-original-title',slideEvt.value);
    $(".popover-header").text(slideEvt.value);
    $("#valueAniSliderVal").text(slideEvt.value);
});
$("#valueCap").slider({});
$("#valueCap").on("slide", function(slideEvt) {
    $("#capital").attr('data-original-title',slideEvt.value);
    $(".popover-header").text(slideEvt.value);
    $("#valueCapSliderVal").text(slideEvt.value);
});
$("#valueTour").slider({});
$("#valueTour").on("slide", function(slideEvt) {
    $("#touristes").attr('data-original-title',slideEvt.value);
    $(".popover-header").text(slideEvt.value);
    $("#valueTourSliderVal").text(slideEvt.value);
});
$("#valueEnv").slider({});
$("#valueEnv").on("slide", function(slideEvt) {
    $("#environnement").attr('data-original-title',slideEvt.value);
    $(".popover-header").text(slideEvt.value);
    $("#valueEnvSliderVal").text(slideEvt.value);
});
$("#valueOuv").slider({});
$("#valueOuv").on("slide", function(slideEvt) {
    $("#ouvert").attr('data-original-title',slideEvt.value);
    $(".popover-header").text(slideEvt.value);
    $("#valueOuvSliderVal").text(slideEvt.value);
});

$('[data-toggle="popover"]').popover({
    trigger: 'focus',
    html:true
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
    setValuesLS();
    let url = window.location.href;
    let newParam = url.split("?")[1].replace("preference", "importances");
    window.location.href = "?" + newParam;
}

function letsNotEmpty() {
    setValuesLS();

    sleep(1000);
    let url = window.location.href;
    let newParam = url.split("?")[1].replace("preference", "nonvide");
    window.location.href = "?" + newParam;

}

function setNumFile() {

    let RoomName = localStorage.getItem("roomName");
    let ClassId = localStorage.getItem("classId");
    let i = 0;
    var http = new XMLHttpRequest();

    do {
        let tmpPath = "sources/output/" + RoomName + "_" + ClassId + "_" + i + "-viab-0-bound.dat";
        http.open('HEAD', tmpPath, false);
        http.send();
        i++;
    }
    while (http.status !== 404);
    let numFile = i - 1;
    localStorage.setItem("numFile",numFile);

}


function setValuesLS() {

    localStorage.setItem("oldAniFauxMin", document.getElementById('valueAniSliderVal1').innerText);
    localStorage.setItem("oldAniMin", document.getElementById('valueAniSliderVal2').innerText);
    localStorage.setItem("oldAniMax", document.getElementById('valueAniSliderVal3').innerText);
    localStorage.setItem("oldAniFauxMax", document.getElementById('valueAniSliderVal4').innerText);

    localStorage.setItem("oldCapFauxMin", document.getElementById('valueCapSliderVal1').innerText);
    localStorage.setItem("oldCapMin", document.getElementById('valueCapSliderVal2').innerText);
    localStorage.setItem("oldCapMax", document.getElementById('valueCapSliderVal3').innerText);
    localStorage.setItem("oldCapFauxMax", document.getElementById('valueCapSliderVal4').innerText);

    localStorage.setItem("oldTourFauxMin", document.getElementById('valueTourSliderVal1').innerText);
    localStorage.setItem("oldTourMin", document.getElementById('valueTourSliderVal2').innerText);
    localStorage.setItem("oldTourMax", document.getElementById('valueTourSliderVal3').innerText);
    localStorage.setItem("oldTourFauxMax", document.getElementById('valueTourSliderVal4').innerText);

    localStorage.setItem("oldEnvFauxMin", document.getElementById('valueEnvSliderVal1').innerText);
    localStorage.setItem("oldEnvMin", document.getElementById('valueEnvSliderVal2').innerText);
    localStorage.setItem("oldEnvMax", document.getElementById('valueEnvSliderVal3').innerText);
    localStorage.setItem("oldEnvFauxMax", document.getElementById('valueEnvSliderVal4').innerText);

    localStorage.setItem("oldOuvFauxMin", document.getElementById('valueOuvSliderVal1').innerText);
    localStorage.setItem("oldOuvMin", document.getElementById('valueOuvSliderVal2').innerText);
    localStorage.setItem("oldOuvMax", document.getElementById('valueOuvSliderVal3').innerText);
    localStorage.setItem("oldOuvFauxMax", document.getElementById('valueOuvSliderVal4').innerText);

    console.log("lkkok");



    localStorage.setItem("AniFauxMin", document.getElementById('valueAniSliderVal1').innerText);
    localStorage.setItem("AniMin", document.getElementById('valueAniSliderVal2').innerText);
    localStorage.setItem("AniMax", document.getElementById('valueAniSliderVal3').innerText);
    localStorage.setItem("AniFauxMax", document.getElementById('valueAniSliderVal4').innerText);

    localStorage.setItem("CapFauxMin", document.getElementById('valueCapSliderVal1').innerText);
    localStorage.setItem("CapMin", document.getElementById('valueCapSliderVal2').innerText);
    localStorage.setItem("CapMax", document.getElementById('valueCapSliderVal3').innerText);
    localStorage.setItem("CapFauxMax", document.getElementById('valueCapSliderVal4').innerText);

    localStorage.setItem("TourFauxMin", document.getElementById('valueTourSliderVal1').innerText);
    localStorage.setItem("TourMin", document.getElementById('valueTourSliderVal2').innerText);
    localStorage.setItem("TourMax", document.getElementById('valueTourSliderVal3').innerText);
    localStorage.setItem("TourFauxMax", document.getElementById('valueTourSliderVal4').innerText);

    localStorage.setItem("EnvFauxMin", document.getElementById('valueEnvSliderVal1').innerText);
    localStorage.setItem("EnvMin", document.getElementById('valueEnvSliderVal2').innerText);
    localStorage.setItem("EnvMax", document.getElementById('valueEnvSliderVal3').innerText);
    localStorage.setItem("EnvFauxMax", document.getElementById('valueEnvSliderVal4').innerText);

    localStorage.setItem("OuvFauxMin", document.getElementById('valueOuvSliderVal1').innerText);
    localStorage.setItem("OuvMin", document.getElementById('valueOuvSliderVal2').innerText);
    localStorage.setItem("OuvMax", document.getElementById('valueOuvSliderVal3').innerText);
    localStorage.setItem("OuvFauxMax", document.getElementById('valueOuvSliderVal4').innerText);



}

