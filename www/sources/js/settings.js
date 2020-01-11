function joinPreference() {
    let url = window.location.href;
    let newParam = url.split("?")[1].replace("settings", "preference");

    window.location.href = "?" + newParam;
}

function setSettings() {
    var jsonObj = {
        "room_name": localStorage.getItem("roomName"),
        "class_id": localStorage.getItem("classId"),
        "value_peche": parseInt(document.getElementById('valuePeche').value),
        "value_tortue": parseInt(document.getElementById('valueTortue').value),
        "value_poisson": parseInt(document.getElementById('valuePoisson').value),
        "value_repro": parseInt(document.getElementById('valueRepro').value)
    };
    data = JSON.stringify(jsonObj);

    postXMLHttp('api?fct=set_settings' +
        '&data=' + data,  function (json) {
        joinPreference();
    });
}