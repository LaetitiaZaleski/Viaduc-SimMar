function joinRoom() {

    let roomId = document.getElementById('room-id').value;
    let roomName = document.getElementById('room-name').value;
    let classId = document.getElementById('class-id').value;
    if (roomId.length == 0 || (roomId == "0" && roomName.length == 0) ||
        classId.length == 0 || classId == "0") {

        alert("Erreur de selection !");
        return;
    }
    location.replace("?p=rules&n=" + roomName + "&c=" + classId);
}