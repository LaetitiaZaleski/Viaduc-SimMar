

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
    let url = window.location.href;
    let newParam = url.split("?")[1].replace("preference", "result");

    window.location.href = "?" + newParam;
}

function letsNotEmpty() {
    let url = window.location.href;
    let newParam = url.split("?")[1].replace("preference", "nonvide");

    window.location.href = "?" + newParam;
}



