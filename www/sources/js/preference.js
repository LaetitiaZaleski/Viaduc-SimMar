

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

var sliderAniValues = document.getElementById('valueAniSliderVal');


sliderAni.noUiSlider.on('update', function (values) {
    sliderAniValues.innerHTML = values.join(' - ');
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

var sliderCapValues = document.getElementById('valueCapSliderVal');


sliderCap.noUiSlider.on('update', function (values) {
    sliderCapValues.innerHTML = values.join(' - ');
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

var sliderTourValues = document.getElementById('valueTourSliderVal');


sliderTour.noUiSlider.on('update', function (values) {
    sliderTourValues.innerHTML = values.join(' - ');
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

var sliderEnvValues = document.getElementById('valueEnvSliderVal');


sliderEnv.noUiSlider.on('update', function (values) {
    sliderEnvValues.innerHTML = values.join(' - ');
});


var sliderOuv = document.getElementById('slider-ouv');

noUiSlider.create(sliderOuv, {
    start: [10, 20,70, 80],
    connect: [true, true, true, true, true],
    step: 5,
    range: {
        'min': [0],
        'max': [100]
    }
});

connect = sliderOuv.querySelectorAll('.noUi-connect');

for (var i = 0; i < connect.length; i++) {
    connect[i].classList.add(classes[i]);
}

var sliderOuvValues = document.getElementById('valueOuvSliderVal');


sliderOuv.noUiSlider.on('update', function (values) {
    sliderOuvValues.innerHTML = values.join(' - ');
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



