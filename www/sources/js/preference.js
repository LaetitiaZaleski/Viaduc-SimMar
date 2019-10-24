

function letsFinish() {
    let url = window.location.href;
    let newParam = url.split("?")[1].replace("preference", "result")

    window.location.href = "?" + newParam;
}


