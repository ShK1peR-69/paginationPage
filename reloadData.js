const FILENAME = "cars-";
let fileNumber = 0;
let requestIsCompleted = true;

window.onload = async function () {
    displayPreloader(true);
    addInfoFromJSON();
};

/* Отправка запроса, получение ответа и отображение данных в таблицу */
async function addInfoFromJSON() {
    requestIsCompleted = false;
    await fetch("data/" + (FILENAME + ++fileNumber) + ".json")
        .then((response) => {
            if (response.status !== 404) {
                addDataToTable(response);
                if (fileNumber === 5) {
                    window.removeEventListener('scroll', scrollListener); // Удаление "слушателя"
                }
            } else {
                addInfoAboutNoneData();
                displayPreloader(false);
                window.removeEventListener('scroll', scrollListener); // Удаление "слушателя"
            }
        });
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

/* Добавление строки в таблицу из указанного файла "jsonObject" */
function readJSONData(jsonArr) {
    displayPreloader(true);
    setTimeout(function () {
        for (let i = 0; i < jsonArr.length; i++) {
            let table = document.getElementById("table");
            let tableRow = document.createElement("div");

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

    if (pageHeight.toFixed() === documentBottom.toFixed()) {
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
    response.json().then(data => readJSONData(data));
    window.addEventListener('scroll', scrollListener); // Добавление"слушателя"
    setTimeout(function () {
        requestIsCompleted = true;
    }, 500);
}