var task1Config = {
    title: 'Callback button table',
    method: 'get',
    fields: ['id', 'amount', 'merchant'],
    url: 'http://localhost:3000/payments',
    query: {
        _limit: 20,
        _sort: 'amount',
        _order: 'DESC'
    },
    tableHeaders: [
        new TableHeader('ID'),
        new TableHeader('Merchant'),
        new TableHeader('Amount')
    ],
    exec: () => {
        return new Promise(function (resolve, reject) {
            var ajax = new Ajax(task1Config.url, task1Config.method, (data) => resolve(JSON.parse(
                data)));
            ajax.exec(task1Config.query);
        });
    },
    meta: function () {
        return paginationMeta(task1Config);
    }
};

var task2Config = {
    title: 'Promise button table',
    method: 'get',
    fields: ['id', 'amount', 'merchant'],
    url: 'http://localhost:3000/payments',
    query: {
        merchant_like: 'Ginder',
    },
    tableHeaders: [
        new TableHeader('ID'),
        new TableHeader('Merchant'),
        new TableHeader('Amount')
    ],
    exec: () => {
        return new Promise(function (resolve, reject) {
            var ajax = new Ajax(task2Config.url, task2Config.method, (data) => resolve(JSON.parse(
                data)));
            ajax.exec(task2Config.query);
        });
    },
    meta: () => {
        var $code = document.createElement('code');
        $code.style.display = 'block';
        $code.style.backgroundColor = '#eee';
        var ajax = new Ajax(task2Config.url, task2Config.method, null);
        var queryParams = [];
        for (var key in task2Config.query) {
            queryParams.push(encodeURIComponent(key) + '=' + encodeURIComponent(task2Config.query[key]));
        }
        $code.textContent = 'Requesting: ' + task2Config.url + '?' + queryParams.join('&');
        return $code;
    }
};

var task3Config = {
    title: 'Filter Payment-Method table',
    method: 'get',
    fields: ['id', 'amount', 'merchant'],
    url: 'http://localhost:3000/payments',
    query: {
        _limit: 20,
        _sort: 'amount',
        _order: 'DESC',
        method: 'ideal',
    },
    tableHeaders: [
        new TableHeader('ID'),
        new TableHeader('Merchant'),
        new TableHeader('Amount')
    ],
    exec: () => {
        return new Promise(function (resolve, reject) {
            var ajax = new Ajax(task3Config.url, task3Config.method, (data) => resolve(JSON.parse(
                data)));
            ajax.exec(task3Config.query);
        });
    },
    meta: () => {
        var $select = document.createElement('select');
        var options = ['ideal', 'creditcard', 'bank-transfer'];
        options.forEach(option => {
            var $option = document.createElement('option');
            $option.setAttribute('value', option);
            $option.textContent = option;
            if (option === task3Config.query.method)
                $option.setAttribute('selected', true);
            $select.appendChild($option);
        });
        $select.onchange = function (event) {
            task3Config.query.method = event.target.value;
            new Task(task3Config).render();
        }

        var $code = document.createElement('code');
        $code.style.display = 'block';
        $code.style.backgroundColor = '#eee';
        var queryParams = [];
        for (var key in task3Config.query) {
            queryParams.push(encodeURIComponent(key) + '=' + encodeURIComponent(task3Config.query[key]));
        }
        $code.textContent = 'Requesting: ' + task3Config.url + '?' + queryParams.join('&');

        var $container = document.createElement('div');
        $container.appendChild($select);
        $container.appendChild($code);

        return $container;
    }
};

function renderTask1() {
    new Task(task1Config).render();
}

function renderTask2() {
    new Task(task2Config).render();
}

function renderTask3() {
    var task3 = new Task(task3Config);
    task3.render();
}

function renderTask4() {
    var elem = document.getElementById('appTable');
    var ajax = new Ajax('/formTemplate.html', 'get', (data) => {
        var htmlObject = document.createElement('div');
        htmlObject.innerHTML = data;
        var $created = htmlObject.querySelector('#created');
        $created.value = new Date();
        while (elem.firstChild) {
            elem.removeChild(elem.firstChild);
        }
        elem.appendChild(htmlObject);
    });
    ajax.exec();
}

// the pagination should be done on Table class
// but for the sake of sample, i leave it here
function paginationMeta(config) {

    // initial page is 1 and cannot be less than 1
    config.query._page = config.query._page || 1;

    // btn control
    var $prevBtn = document.createElement('button');
    $prevBtn.textContent = 'prev';

    // disable btn if page less than 1
    if (config.query._page === 1)
        $prevBtn.setAttribute('disabled', true);
    else
        $prevBtn.removeAttribute('disabled');
    $prevBtn.onclick = function () {
        --config.query._page;
        new Task(config).render();
    }

    var $nextBtn = document.createElement('button');
    $nextBtn.textContent = 'next';
    // cannot disable $nextBtn
    // no access to X-Total-Count header

    $nextBtn.onclick = function () {
        ++config.query._page;
        new Task(config).render();
    }

    var $page = document.createElement('span');
    $page.textContent = config.query._page;

    var $container = document.createElement('div');

    $container.appendChild($prevBtn);
    $container.appendChild($page);
    $container.appendChild($nextBtn);

    return $container;
}