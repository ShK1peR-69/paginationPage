const FILENAME = "cars-";
const TABLE_ITEM_CLASS = "table__cell";
const FILES_COUNT = 5; // Количество файлов в директории (узнается от серверной части)
var saveFileContent = "";
let fileNumber = 0;
let requestIsCompleted = true; //Флаг для проверки завершения запроса

window.onload = function () {
    addInfoFromJSON();
};

/* Отправка запроса, получение ответа и отображение данных в таблицу */
async function addInfoFromJSON() {
    requestIsCompleted = false;
    fileNumber = fileNumber + 1;
    await fetch("data/" + (FILENAME + fileNumber) + ".json")
        .then((response) => {
            if (response.status !== 404) {
                addDataToTable(response);
                if (fileNumber >= FILES_COUNT) {
                    window.removeEventListener('scroll', scrollListener); // Удаление "слушателя"
                }
            } else {
                addInfoAboutNoneData();
                displayPreloader(false);
                window.removeEventListener('scroll', scrollListener);
            }
        })
        .then(() => {
            requestIsCompleted = true;
        });
}

/* Добавление данных об объекте в строку таблицы */
function addDataToTableRow(tableRow, car) {
    for (let key in car) {
        saveFileContent = JSON.stringify(car);
        let rowItem = document.createElement("div");
        rowItem.classList.add(TABLE_ITEM_CLASS);
        let content = car[key];
        if (content == null) {
            content = '-'; // "не указано"
        }
        let rowItemContent = document.createTextNode(content);
        rowItem.appendChild(rowItemContent);
        tableRow.appendChild(rowItem);
    }
    createSaveElem(car);
}

var dataContent = '';
for (let i = 0; i < 25; i++) {
    dataContent = dataContent + '{"Name":"ford ltd","Miles_per_Gallon":13,"Cylinders":8,' +
        '"Displacement":351,"Horsepower":158,"Weight_in_lbs":4363,' +
        '"Acceleration":13,"Year":"1973-01-01","Origin":"USA"} \n ';
}

function createSaveElem(el) {

    let btn_elem = "<button class='save_data_btn'>Сохранить</button>";
    for (let i = 0; i < 78; i++) {
        dataContent = dataContent + JSON.stringify(el) + "\n";
    }
    console.log("Length: " + dataContent.length);
    $("#saveButton").append(
        '<a href="data:text/plain;charset=utf-8,' +
        encodeURIComponent(dataContent) +
        '" download="cars-data.json">' + btn_elem + '</a>')
}

/* Добавление строки в таблицу из указанного файла "jsonObject" */
function createTableRow(jsonArr) {
    displayPreloader(true);
    for (let i = 0; i < jsonArr.length; i++) {
        let table = document.getElementById("table");
        let tableRow = document.createElement("div");

        tableRow.classList.add("table__row");
        addDataToTableRow(tableRow, jsonArr[i]);
        table.appendChild(tableRow);
    }
    displayPreloader(false);
}

function scrollListener() {
    let pageHeight = document.documentElement.clientHeight;
    let documentBottom = document.documentElement.getBoundingClientRect().bottom;

    if (pageHeight.toFixed() >= documentBottom.toFixed() - 5) {
        displayPreloader(true);
        if (requestIsCompleted) {
            addInfoFromJSON();
        }
    }
}

/* Если при первом запросе не будет подгружаемых данных, отображаем сообщение
* с текстом "Нет данных для отображения" */
function addInfoAboutNoneData() {
    let table = document.getElementById("table");

    if (table.children.length < 2) {
        let infoBlock = document.createElement("div");
        infoBlock.classList.add("none_data_info");
        infoBlock.innerText = "Нет данных для отображения";
        document.getElementsByTagName("body")[0].appendChild(infoBlock);
    }
}

/* Добавление данных в таблицу */
function addDataToTable(response) {
    response.json().then(data => createTableRow(data));
    window.addEventListener('scroll', scrollListener); // Добавление"слушателя"
}

/* Отображение прелоадера при подгрузке данных */
function displayPreloader(flag) {
    let preloader = document.getElementsByClassName("preloader")[0];
    if (flag === true) {
        preloader.style.display = 'flex';
    } else {
        preloader.style.display = 'none';
    }
}