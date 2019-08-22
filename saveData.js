window.onload = function () {
    createSaveElem();
}

function createSaveElem(){
    let btn_elem = "<button class='save_data_btn'>Сохранить</button>";
    var dataContent = addDataToJSONFile();
    $("#saveButton").append(
        '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' +
        encodeURIComponent(saveFileContent) +
        '" download="cars-data.json">' + btn_elem + '</a>')
}

function getJSONData(){

    return "some_js";
}

function addDataToJSONFile(jsonObj){
    return jsonObj;
}
