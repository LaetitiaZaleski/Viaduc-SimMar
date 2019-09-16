function joinPreference() {
    let url = window.location.href;
    let newParam = url.split("?")[1].replace("settings", "preference")

    window.location.href = "?" + newParam;
}

function setSettings() {
    roomName = localStorage.getItem("roomName");
    classId = localStorage.getItem("classId");
    valuePeche =  document.getElementById('valuePeche').value;
    valueTortue =  document.getElementById('valueTortue').value;
    valuePoisson =  document.getElementById('valuePoisson').value;
    valueRepro =  document.getElementById('valueRepro').value;

    postXMLHttp('fct=set_settings' +
        '&room_name=' + roomName +
        '&class_id=' + classId +
        '&value_peche=' + valuePeche +
        '&value_tortue=' + valueTortue +
        '&value_poisson=' + valuePoisson +
        '&value_repro=' + valueRepro,  function (json) {
        joinPreference();
    });
}