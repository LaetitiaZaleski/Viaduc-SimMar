

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




var sliderAni = document.getElementById('slider-ani');

noUiSlider.create(sliderAni, {
    start: [500, 1000,10000, 15000],
    connect: [true, true, true, true, true],
    step: 20,
    range: {
        'min': [0],
        'max': [20000]
    }
});

var connect = sliderAni.querySelectorAll('.noUi-connect');
var classes = ['c-1-color', 'c-2-color', 'c-3-color', 'c-4-color', 'c-5-color'];

for (var i = 0; i < connect.length; i++) {
    connect[i].classList.add(classes[i]);
}

var sliderAniValues1 = document.getElementById('valueAniSliderVal1');
var sliderAniValues2 = document.getElementById('valueAniSliderVal2');
var sliderAniValues3 = document.getElementById('valueAniSliderVal3');
var sliderAniValues4 = document.getElementById('valueAniSliderVal4');


sliderAni.noUiSlider.on('update', function (values) {
    sliderAniValues1.innerHTML = values[0];
    sliderAniValues2.innerHTML = values[1];
    sliderAniValues3.innerHTML = values[2];
    sliderAniValues4.innerHTML = values[3];
});


var sliderCap = document.getElementById('slider-cap');

noUiSlider.create(sliderCap, {
    start: [0, 1000,10000, 30000],
    connect: [true, true, true, true, true],
    step: 20,
    range: {
        'min': [0],
        'max': [30000]
    }
});

connect = sliderCap.querySelectorAll('.noUi-connect');

for (var i = 0; i < connect.length; i++) {
    connect[i].classList.add(classes[i]);
}

var sliderCapValues1 = document.getElementById('valueCapSliderVal1');
var sliderCapValues2 = document.getElementById('valueCapSliderVal2');
var sliderCapValues3 = document.getElementById('valueCapSliderVal3');
var sliderCapValues4 = document.getElementById('valueCapSliderVal4');


sliderCap.noUiSlider.on('update', function (values) {
    sliderCapValues1.innerHTML = values[0];
    sliderCapValues2.innerHTML = values[1];
    sliderCapValues3.innerHTML = values[2];
    sliderCapValues4.innerHTML = values[3];
});

var sliderTour = document.getElementById('slider-tour');

noUiSlider.create(sliderTour, {
    start: [0, 1000,10000, 20000],
    connect: [true, true, true, true, true],
    step: 20,
    range: {
        'min': [0],
        'max': [20000]
    }
});

connect = sliderTour.querySelectorAll('.noUi-connect');

for (var i = 0; i < connect.length; i++) {
    connect[i].classList.add(classes[i]);
}

var sliderTourValues1 = document.getElementById('valueTourSliderVal1');
var sliderTourValues2 = document.getElementById('valueTourSliderVal2');
var sliderTourValues3 = document.getElementById('valueTourSliderVal3');
var sliderTourValues4 = document.getElementById('valueTourSliderVal4');


sliderTour.noUiSlider.on('update', function (values) {
    sliderTourValues1.innerHTML = values[0];
    sliderTourValues2.innerHTML = values[1];
    sliderTourValues3.innerHTML = values[2];
    sliderTourValues4.innerHTML = values[3];
});



var sliderEnv = document.getElementById('slider-env');

noUiSlider.create(sliderEnv, {
    start: [10, 20,70, 80],
    connect: [true, true, true, true, true],
    step: 5,
    range: {
        'min': [0],
        'max': [100]
    }
});

connect = sliderEnv.querySelectorAll('.noUi-connect');

for (var i = 0; i < connect.length; i++) {
    connect[i].classList.add(classes[i]);
}

var sliderEnvValues1 = document.getElementById('valueEnvSliderVal1');
var sliderEnvValues2 = document.getElementById('valueEnvSliderVal2');
var sliderEnvValues3 = document.getElementById('valueEnvSliderVal3');
var sliderEnvValues4 = document.getElementById('valueEnvSliderVal4');


sliderEnv.noUiSlider.on('update', function (values) {
    sliderEnvValues1.innerHTML = values[0];
    sliderEnvValues2.innerHTML = values[1];
    sliderEnvValues3.innerHTML = values[2];
    sliderEnvValues4.innerHTML = values[3];
});


var sliderOuv = document.getElementById('slider-ouv');

noUiSlider.create(sliderOuv, {
    start: [10, 20,30, 40],
    connect: [true, true, true, true, true],
    step: 5,
    range: {
        'min': [0],
        'max': [50]
    }
});

connect = sliderOuv.querySelectorAll('.noUi-connect');

for (var i = 0; i < connect.length; i++) {
    connect[i].classList.add(classes[i]);
}

var sliderOuvValues1 = document.getElementById('valueOuvSliderVal1');
var sliderOuvValues2 = document.getElementById('valueOuvSliderVal2');
var sliderOuvValues3 = document.getElementById('valueOuvSliderVal3');
var sliderOuvValues4 = document.getElementById('valueOuvSliderVal4');


sliderOuv.noUiSlider.on('update', function (values) {
    sliderOuvValues1.innerHTML = values[0];
    sliderOuvValues2.innerHTML = values[1];
    sliderOuvValues3.innerHTML = values[2];
    sliderOuvValues4.innerHTML = values[3];
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

    localStorage.setItem("AniFauxMin",document.getElementById('valueAniSliderVal1').innerText);
    localStorage.setItem("AniMin",document.getElementById('valueAniSliderVal2').innerText);
    localStorage.setItem("AniMax",document.getElementById('valueAniSliderVal3').innerText);
    localStorage.setItem("AniFauxMax",document.getElementById('valueAniSliderVal4').innerText);

    localStorage.setItem("CapFauxMin",document.getElementById('valueCapSliderVal1').innerText);
    localStorage.setItem("CapMin",document.getElementById('valueCapSliderVal2').innerText);
    localStorage.setItem("CapMax",document.getElementById('valueCapSliderVal3').innerText);
    localStorage.setItem("CapFauxMax",document.getElementById('valueCapSliderVal4').innerText);

    localStorage.setItem("TourFauxMin",document.getElementById('valueTourSliderVal1').innerText);
    localStorage.setItem("TourMin",document.getElementById('valueTourSliderVal2').innerText);
    localStorage.setItem("TourMax",document.getElementById('valueTourSliderVal3').innerText);
    localStorage.setItem("TourFauxMax",document.getElementById('valueTourSliderVal4').innerText);

    localStorage.setItem("EnvFauxMin",document.getElementById('valueEnvSliderVal1').innerText);
    localStorage.setItem("EnvMin",document.getElementById('valueEnvSliderVal2').innerText);
    localStorage.setItem("EnvMax",document.getElementById('valueEnvSliderVal3').innerText);
    localStorage.setItem("EnvFauxMax",document.getElementById('valueEnvSliderVal4').innerText);

    localStorage.setItem("OuvFauxMin",document.getElementById('valueOuvSliderVal1').innerText);
    localStorage.setItem("OuvMin",document.getElementById('valueOuvSliderVal2').innerText);
    localStorage.setItem("OuvMax",document.getElementById('valueOuvSliderVal3').innerText);
    localStorage.setItem("OuvFauxMax",document.getElementById('valueOuvSliderVal4').innerText);


    window.location.href = "?" + newParam;
}



