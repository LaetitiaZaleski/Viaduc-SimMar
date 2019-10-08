

window.onload = function(){

    getPreference();

    setInterval(function () {
        let lastId = "0";
        if (document.getElementById('messageList').lastElementChild)
        {
            lastElemId = document.getElementById('messageList').lastElementChild.id;
            lastId =lastElemId.split("-")[2];
        }
        getNewMessage(lastId);

    }, 1000);
};

function getNewMessage(id) {

    getXMLHttp('/api?fct=get_message' +
        '&room_name=' + localStorage.getItem("roomName") +
        '&class_id=' +  localStorage.getItem("classId") +
        '&last_message_id=' + id,  function (ret) {
        //console.log(ret);

            obj = JSON.parse(ret);
        if (obj !== null && obj.length > 0){
            for (i=0 ; i< obj.length; i++ ){
                newMessage(obj[i].Id,obj[i].ClassName ,obj[i].Message, obj[i].Date)

            }
        }


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

function newMessage(id, name, message, date) {
    let newLi = document.createElement("li");
    newLi.id = "message-id-" + id;
    let textLi = document.createTextNode("(" + date + ") " + name + " : " + message);
    newLi.appendChild(textLi);
    document.getElementById("messageList").appendChild(newLi);
}



function getPreference() {

    getXMLHttp('/api?fct=get_preference' +
        '&room_name=' + localStorage.getItem("roomName"),  function (ret) {
        //console.log(ret);

        obj = JSON.parse(ret);
        if (obj !== null && obj.length > 0){
            for (i=0 ; i< obj.length; i++ ){
                //newMessage(obj[i].class_name,obj[i].ClassName ,obj[i].Message, obj[i].Date)
                setAllPreference(obj[i])

            }
        }


        //getFile();
    });
}

function setAllPreference(obj){
    console.log(obj);
    document.getElementById(obj.class_name+"ValueAniMin").value = obj.preference.value_ani_min;
    document.getElementById(obj.class_name+"ValueAniMax").value = obj.preference.value_ani_max;
    document.getElementById(obj.class_name+"ValueCapMin").value = obj.preference.value_cap_min;
    document.getElementById(obj.class_name+"ValueCapMax").value = obj.preference.value_cap_max;
    document.getElementById(obj.class_name+"ValueTourMin").value = obj.preference.value_tour_min;
    document.getElementById(obj.class_name+"ValueTourMax").value = obj.preference.value_tour_max;
    document.getElementById(obj.class_name+"ValueEnvMin").value = obj.preference.value_env_min;
    document.getElementById(obj.class_name+"ValueEnvMax").value = obj.preference.value_env_max;
    document.getElementById(obj.class_name+"ValueOuvMin").value = obj.preference.value_ouv_min;
    document.getElementById(obj.class_name+"ValueOuvMax").value = obj.preference.value_ouv_max;

}