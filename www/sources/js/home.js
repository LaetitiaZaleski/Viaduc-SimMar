function joinRoom() {

    let roomId = document.getElementById('room-id').value;
    let roomName = document.getElementById('room-name').value;
    let classId = document.getElementById('class-id').value;
    if (roomId.length == 0 || (roomId == "0" && roomName.length == 0) ||
        classId.length == 0 || classId == "0") {

        alert("Erreur de selection !");
        return;
    } else if (roomId == "0" && roomName.length > 0) {
        roomId = roomName;
    }

    window.location.href = "?p=rules&n=" + roomId + "&c=" + classId;
}

function joinSettings() {
    let url = window.location.href;
    let newParam = url.split("?")[1].replace("explications", "settings");
    setFPRoles();

    window.location.href = "?" + newParam;
}


function joinExplications() {
    let url = window.location.href;
    let newParam = url.split("?")[1].replace("rules", "explications");

    window.location.href = "?" + newParam;
}