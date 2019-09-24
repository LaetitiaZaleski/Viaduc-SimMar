let addr = "";


function getXMLHttp(options, callback)
{
    let xhr= new XMLHttpRequest();
    xhr.open("GET", addr + options, true);
    //xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function() {
        if (xhr.status != 500) {
            callback(xhr.response);
        }
        else {
            alert("ERROR !");
        }
    };
    xhr.onerror = function () {
        alert("ERROR")
    }
}

function postXMLHttp(options, callback)
{
    let xhr= new XMLHttpRequest();
    xhr.open("POST", addr, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(options);
    xhr.onload = function() {
        if (xhr.status != 500)
            callback(xhr.response);
        else {
            alert("ERROR (Voir console)");
            console.log(xhr.responseText)
        }
    };

}


