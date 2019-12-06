
window.onload = function(){
    getImportances2();

};

// TODO get preferences from class dans l'API



function getImportances2(){

    for (let i= 0; i < importances.length; i++) {
        let imp1 =importances[i];
        let min = localStorage.getItem(imp1); //$('#' + imp).val()
        let liElem = $("<li>");
        let spanTextElem = $("<span>");
        let spanTextElem2 = $("<span>");
        spanTextElem.text(importancesText[i]+ "0");
        spanTextElem2.text("100");
        if (min === "important") {
            let inputElem = $("<input  id=\"ex1\" data-slider-id='ex1Slider' type=\"text\" data-slider-min=\"0\" data-slider-max=\"100\" data-slider-step=\"1\" data-slider-value=\"50\" data-slider-tooltip=\"show\"/>");
            liElem.append(spanTextElem, inputElem, spanTextElem2);
            inputElem.slider({});

            $('#liste-important').append(liElem);
        } else if (min === "très important") {
            let inputElem = $("<input id=\"ex1\" data-slider-id='ex1Slider' type=\"text\" data-slider-min=\"0\" data-slider-max=\"100\" data-slider-step=\"1\" data-slider-value=\"25\"/>");
            liElem.append(spanTextElem, inputElem, spanTextElem2);
            inputElem.slider({});
            $('#liste-tres-important').append(liElem);
        }
    }


    // data-slider-value="{{.ValueTortue}}" onchange="setMyValue(this);calc();"
    // window.location.href = "?" + newParam;
}