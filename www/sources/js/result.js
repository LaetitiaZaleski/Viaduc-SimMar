

window.onload = function(){

    setInterval(function () {
        lastElemId = document.getElementById('messageList').lastElementChild.id;
        getNewMessage(lastElemId.split("-")[2]);
    }, 1000);
};

function getNewMessage(id) {

    getXMLHttp('/api?fct=get_message' +
        '&last_message_id=' + id,  function (ret) {
        obj = JSON.parse(ret);
        //getFile();
    });
}

function sendMessage() {
        var jsonObj = {
            "room_name": localStorage.getItem("roomName"),
            "class_id": localStorage.getItem("classId"),
            "message": document.getElementById('send-message').value
        };
        data = JSON.stringify(jsonObj);

        console.log(data);

        postXMLHttp('/api?fct=send_message' +
            '&data=' + data,  function (ret) {
           //Append le nouveau message
            //getFile();
        });

}

function newMessage(id, message, date) {
    let newLi = document.createElement("li");
    newLi.id = "message-id-" + id;
    let textLi = document.createTextNode("(" + date + ") " + name + " : " + message);
    newLi.appendChild(textLi);
    document.getElementById("messageList").appendChild(newLi);
}