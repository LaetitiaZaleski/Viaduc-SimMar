
// Update the current slider value (each time you drag the slider handle)


function setMyValue(elem){
    elem.parentElement.previousElementSibling.lastElementChild.innerHTML = elem.value;
}