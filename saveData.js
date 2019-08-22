var dataContent = '{"Name": "chevrolet chevelle malibu", "Miles_per_Gallon": 18}';

window.onload = function () {
    createSaveElem();
}

function createSaveElem() {
    let btn_elem = "<button class='save_data_btn'>Сохранить</button>";
    dataContent = dataContent + "\n" + saveFileContent;
    $("#saveButton").append(
        '<a href="data:text/plain;charset=utf-8,%EF%BB%BF' +
        encodeURIComponent(dataContent) +
        '" download="cars-data.json">' + btn_elem + '</a>')
}