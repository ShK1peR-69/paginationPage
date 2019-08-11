const FILENAME = "cars-";
let fileNumber = 0;
let requestIsCompleted = true;

window.onload = async function () {
    displayPreloader(true);
    addInfoFromJSON();
};

/* Отправка запроса, получение ответа и отображение данных в таблицу */
function addInfoFromJSON() {
    requestIsCompleted = false;
    new Promise(async () => {
        let response = await fetch("data/" + (FILENAME + ++fileNumber) + ".json");
        if (response.status !== 404) {
            response.json().then(data => readJSONData(data));
            window.addEventListener('scroll', scrollListener); // Добавление"слушателя"
            setTimeout(function () {
                requestIsCompleted = true;
            }, 500);
        } else {
            addInfoAboutNoneData();
            displayPreloader(false);
            window.removeEventListener('scroll', scrollListener); // Удаление "слушателя"
        }
    })
}

/* Добавление данных об объекте в строку таблицы */
function createTableRow(table_row, car) {
    let tableItemClass = "table__cell";

    for (let key in car) {
        let rowItem = document.createElement("div");
        rowItem.classList.add(tableItemClass);
        let content = car[key];
        if (content == null) {
            content = '-'; // "не указано"
        }
        let row_item_content = document.createTextNode(content);
        rowItem.appendChild(row_item_content);
        table_row.appendChild(rowItem);
    }
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

/* Добавление данных в таблицу из указанного файла "jsonObject" */
function readJSONData(jsonArr) {
    displayPreloader(true);
    setTimeout(function () {
        for (let i = 0; i < jsonArr.length; i++) {
            let table = document.getElementById("table");

            let tableRow = document.createElement("div");
            if (i === 0) {
                tableRow.style.color = 'red';
                tableRow.style.fontSize = '20px';
            }
            tableRow.classList.add("table__row");
            createTableRow(tableRow, jsonArr[i]);
            table.appendChild(tableRow);
        }
        displayPreloader(false);
    }, 500);
}

function scrollListener() {
    let pageHeight = document.documentElement.clientHeight;

    let documentBottom = document.documentElement.getBoundingClientRect().bottom;

    if (documentBottom <= (pageHeight + 5)) {
        if (requestIsCompleted) {
            addInfoFromJSON();
        }
    }
}

function addInfoAboutNoneData() {
    let table = document.getElementById("table");

    /* Если при первом запросе не будет подгружаемых данных, отображаем сообщение
    * с текстом "Нет данных для отображения" */
    if (table.children.length < 2) {
        let infoBlock = document.createElement("div");
        infoBlock.classList.add("none_data_info");
        infoBlock.innerText = "Нет данных для отображения";
        document.getElementsByTagName("body")[0].appendChild(infoBlock);
    }
}