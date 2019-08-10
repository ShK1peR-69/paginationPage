window.onload = function () {
    let a = 1;
    displayPreloader(true);
    addInfoFromJSON(a);

    /* Добавление "слушателя" при скролле в конец страницы для подгрузки новых данных */
    window.addEventListener('scroll', function () {
        let scrollHeight = document.documentElement.scrollHeight;
        let pageHeight = document.documentElement.clientHeight;
        let topHeight = document.documentElement.scrollTop;
        if ((topHeight + pageHeight).toFixed() === scrollHeight.toFixed()) {
            addInfoFromJSON(++a);
        }
    });
};

/* Передаем название нужного файла JSON, в ответ получаем массив данных из соотетствующего файла JSON */
function addInfoFromJSON(file_num) {
    let request = new XMLHttpRequest();
    let filename = "cars-";
    request.open("GET", "data/" + (filename + file_num) + ".json", true);
    request.onreadystatechange = function () {
        if (this.readyState === this.DONE) {
            /* Удаляем обработчик после того, как он получает конечный статус */
            request.onreadystatechange = null;
            if (request.status !== 404) {
                displayPreloader(true);
                readJSONData(JSON.parse(request.responseText));
            } else {
                displayPreloader(false);
                let table = document.getElementById("table");
                /* Если при первом запросе не будет подгружаемых данных, отображаем сообщение
                * с текстом "Нет данных для отображения" */
                if (table.children.length < 2) {
                    let info_block = document.createElement("div");
                    info_block.classList.add("none_data_info");
                    info_block.innerText = "Нет данных для отображения";
                    document.getElementsByTagName("body")[0].appendChild(info_block);
                }
                return false;
            }
        }
    };
    request.send();
}

/* Добавление данных об объекте в строку таблицы */
function createTableRow(table_row, car) {
    let table_item_class = "table__cell";
    for (let key in car) {
        let row_item = document.createElement("div");
        row_item.classList.add(table_item_class);
        let content = car[key];
        if (content == null) {
            content = '-'; // "не указано"
        }
        let row_item_content = document.createTextNode(content);
        row_item.appendChild(row_item_content);
        table_row.appendChild(row_item);
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
    for (let i = 0; i < jsonArr.length; i++) {
        let table = document.getElementById("table");
        let table_row = document.createElement("div");
        table_row.classList.add("table__row");
        createTableRow(table_row, jsonArr[i]);
        table.appendChild(table_row);
    }
}