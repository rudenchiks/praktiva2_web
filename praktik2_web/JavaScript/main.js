document.addEventListener("DOMContentLoaded", function () {
    // Создаем таблицу при загрузке страницы
    createTable(buildings, 'list');

    // Находим кнопку "Найти" по её значению (value)
    let findButton = document.querySelector('input[value="Найти"]');

    // Добавляем обработчик события click для кнопки "Найти"
    if (findButton) {
        findButton.addEventListener("click", function () {
            // Получаем форму с фильтрами
            let filterForm = document.getElementById("filter");

            // Вызываем функцию filterTable с параметрами
            filterTable(buildings, 'list', filterForm);
        });
    }

    // Находим кнопку "Очистить фильтры" по её значению (value)
    let clearButton = document.querySelector('input[value="Очистить фильтры"]');

    // Добавляем обработчик события click для кнопки "Очистить фильтры"
    if (clearButton) {
        clearButton.addEventListener("click", function () {
            // Получаем форму с фильтрами
            let filterForm = document.getElementById("filter");

            // Вызываем функцию clearFilter с параметрами
            clearFilter('list', buildings, filterForm);
        });
    }

    // Инициализация полей сортировки
    let sortForm = document.getElementById("sort");
    if (sortForm && buildings.length > 0) {
        setSortSelects(buildings[0], sortForm);

        // Находим поле для первого уровня сортировки
        let fieldsFirst = document.getElementById("fieldsFirst");

        // Добавляем обработчик события change для первого уровня сортировки
        if (fieldsFirst) {
            fieldsFirst.addEventListener("change", function () {
                // Настраиваем поле для второго уровня сортировки
                changeNextSelect("fieldsSecond", fieldsFirst);
                // Настроим поле для третьего уровня сортировки
                changeNextSelect("fieldsThird", fieldsFirst, "fieldsSecond");
            });
        }

        // Находим поле для второго уровня сортировки
        let fieldsSecond = document.getElementById("fieldsSecond");

        // Добавляем обработчик события change для второго уровня сортировки
        if (fieldsSecond) {
            fieldsSecond.addEventListener("change", function () {
                // Настроим поле для третьего уровня сортировки
                changeNextSelect("fieldsThird", fieldsSecond);
            });
        }

        // Находим кнопку "Сортировать" по её значению (value)
        let sortButton = document.querySelector('input[value="Сортировать"]');

        // Добавляем обработчик события click для кнопки "Сортировать"
        if (sortButton) {
            sortButton.addEventListener("click", function () {
                // Вызываем функцию sortTable с параметрами
                sortTable('list', sortForm);
            });
        }

        // Находим кнопку "Сбросить сортировку" по её значению (value)
        let resetSortButton = document.querySelector('input[value="Сбросить сортировку"]');

        // Добавляем обработчик события click для кнопки "Сбросить сортировку"
        if (resetSortButton) {
            resetSortButton.addEventListener("click", function () {
                // Вызываем функцию resetSort с параметрами
                resetSort('list', sortForm);
            });
        }
    }
});

// Функция для создания одной опции в select
let createOption = (str, val) => {
    let item = document.createElement('option');
    item.text = str;
    item.value = val;
    return item;
};

// Функция для заполнения select опциями
let setSortSelect = (arr, sortSelect) => {
    // Создаем OPTION "Нет" и добавляем её в SELECT
    sortSelect.append(createOption('Нет', 0));

    // Перебираем все элементы массива и создаем OPTION для каждого
    for (let i in arr) {
        // Создаем OPTION из очередного элемента массива и добавляем в SELECT
        // Значение атрибута VAL увеличиваем на 1, так как значение 0 имеет опция "Нет"
        sortSelect.append(createOption(arr[i], Number(i) + 1));
    }
};

// Функция для формирования полей со списком для многоуровневой сортировки
let setSortSelects = (data, dataForm) => {
    // Выделяем ключи словаря в массив
    let head = Object.keys(data);

    // Находим все SELECT в форме
    let allSelect = dataForm.getElementsByTagName('select');

    // Перебираем все SELECT и заполняем их опциями
    for (let j = 0; j < allSelect.length; j++) {
        // Формируем очередной SELECT
        setSortSelect(head, allSelect[j]);

        // Все SELECT, кроме первого, делаем недоступными для изменения
        if (j > 0) {
            allSelect[j].disabled = true;
        }
    }
};

// Настроим поле для следующего уровня сортировки
let changeNextSelect = (nextSelectId, curSelect, prevSelectId = null) => {
    // Находим следующее поле SELECT
    let nextSelect = document.getElementById(nextSelectId);

    // Делаем следующее поле доступным
    nextSelect.disabled = false;

    // Копируем все опции из текущего SELECT в следующий
    nextSelect.innerHTML = curSelect.innerHTML;

    // Если указан предыдущий select, удаляем из следующего выбранные элементы
    if (prevSelectId) {
        let prevSelect = document.getElementById(prevSelectId);
        let selectedValue = prevSelect.value;

        // Удаляем опцию с индексом, равным значению текущего SELECT
        if (selectedValue != 0) {
            nextSelect.remove(selectedValue);
        }
    }

    // Если выбрана опция "Нет", делаем следующее поле недоступным
    if (curSelect.value == 0) {
        nextSelect.disabled = true;
    }

    // Убираем выбранные опции для каждого уровня сортировки
    disableUsedOptions(nextSelectId);
};

// Функция для деактивации уже выбранных опций на всех уровнях сортировки
let disableUsedOptions = (nextSelectId) => {
    // Находим все SELECT элементы
    let allSelect = document.querySelectorAll("select[id^='fields']");

    // Находим текущий SELECT
    let currentSelect = document.getElementById(nextSelectId);

    // Массив для хранения всех выбранных значений
    let usedValues = [];

    // Перебираем все SELECT элементы и добавляем выбранные значения в массив
    allSelect.forEach(select => {
        let selectedValue = select.value;
        if (selectedValue != 0 && !usedValues.includes(selectedValue)) {
            usedValues.push(selectedValue);
        }
    });

    // Перебираем все OPTION и отключаем те, которые уже были выбраны
    let options = currentSelect.options;
    for (let i = 0; i < options.length; i++) {
        if (usedValues.includes(options[i].value)) {
            options[i].disabled = true;
        } else {
            options[i].disabled = false;
        }
    }
};
