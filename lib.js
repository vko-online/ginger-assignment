// made a simle lib for ginger payments
// its super simple, and may have errors/mistakes
// dont punch =)
/**
 * Custom ajax lib
 * cuz of concept `dont use any lib`
 * remember :p ?)
 */
var Ajax = (function () {
    /**
     * Creates an instance of Ajax.
     * @param {string} url
     * @param {string} method
     * @param {(data: any) => void} callback
     *
     * @memberOf Ajax
     */
    function Ajax(url, method, callback) {
        this.url = url;
        this.method = method;
        this.callback = callback;
        this.method = this.method.toUpperCase();
    }
    Ajax.prototype.x = function () {
        if (typeof XMLHttpRequest !== 'undefined')
            return new XMLHttpRequest();
        var versions = [
            "MSXML2.XmlHttp.6.0",
            "MSXML2.XmlHttp.5.0",
            "MSXML2.XmlHttp.4.0",
            "MSXML2.XmlHttp.3.0",
            "MSXML2.XmlHttp.2.0",
            "Microsoft.XmlHttp"
        ];
        var xhr;
        for (var i = 0; i < versions.length; i++) {
            try {
                xhr = new window['ActiveXObject'](versions[i]);
                break;
            }
            catch (e) { }
        }
        return xhr;
    };
    /**
     * Executes ajax with query
     *
     * @param {Object} data query params
     *
     * @memberOf Ajax
     */
    Ajax.prototype.exec = function (data) {
        var _this = this;
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }
        var x = this.x();
        if (this.url.indexOf('?') > -1 && query.length) {
            this.url += +query.join('&');
        }
        else if (this.url.indexOf('?') > -1 && !query.length) {
        }
        else if (this.url.indexOf('?') === -1 && query.length) {
            this.url += '?' + query.join('&');
        }
        x.open(this.method, this.url, true);
        x.onreadystatechange = function () {
            if (x.readyState == 4)
                _this.callback(x.responseText);
        };
        if (this.method == 'POST')
            x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        x.send(data);
    };
    return Ajax;
}());
/**
 * React components like thingy :)
 * Class representing `<table>` DOM element
 * Heavily recreates DOM elements, cuz its faster
 * I dont even remove event listeners, cuz they are reference-free
 * refer http://stackoverflow.com/a/12528067/2308005
 *
 * @class Table
 */
var Table = (function () {
    /**
     * Creates an instance of Table.
     * @param {HTMLElement} elem DOM element to with table will be attached
     * @param {string} caption Table title
     * @param {IAdapterInterface} adapter Table configuration
     *
     * @memberOf Table
     */
    function Table(elem, caption, adapter) {
        this.elem = elem;
        this.caption = caption;
        this.adapter = adapter;
        this.tableCaptionElement = document.createElement('caption');
        this.tableCaptionElement.textContent = caption;
        this.tableCaptionElement.style.textAlign = 'left';
        this.tableMetaElement = document.createElement('div');
        this.tableMetaElement.style.color = 'grey';
        this.tableMetaElement.style.fontSize = '12px';
        this.tableMetaElement.style.cssFloat = 'right';
        this.tableMetaElement.style.textAlign = 'right';
        this.tableCaptionElement.appendChild(this.tableMetaElement);
        if (this.adapter.meta) {
            this.tableMetaElement.appendChild(this.adapter.meta());
        }
        this.tableContainer = document.createElement('table');
        this.tableContainer.setAttribute('border', '1');
        this.tableContainer.setAttribute('width', '800px');
        this.tableContainer.appendChild(this.tableCaptionElement);
        this.tableHead = document.createElement('thead');
        var $tr = document.createElement('tr');
        this.adapter.tableHeaders.forEach(function (tableHeader) { return $tr.appendChild(tableHeader.headerElement); });
        this.tableHead.appendChild($tr);
        this.tableBody = document.createElement('tbody');
    }
    Table.prototype.render = function () {
        var _this = this;
        this.adapter.exec().then(function (data) {
            data.forEach(function (value) {
                var $tr = document.createElement('tr');
                var tableHeaderRowData = _this.adapter.fields.map(function (field) { return value[field]; });
                var cells = TableHeader.renderCell(tableHeaderRowData);
                cells.forEach(function (cell) { return $tr.appendChild(cell); });
                _this.tableBody.appendChild($tr);
            });
            _this.tableMetaElement.textContent = "Items: " + data.length;
            if (_this.adapter.meta) {
                _this.tableMetaElement.appendChild(_this.adapter.meta());
            }
            _this.tableContainer.appendChild(_this.tableHead);
            _this.tableContainer.appendChild(_this.tableBody);
            while (_this.elem.firstChild) {
                _this.elem.removeChild(_this.elem.firstChild);
            }
            _this.elem.appendChild(_this.tableContainer);
        });
    };
    return Table;
}());
/**
 * Table helper
 * It should contain all the additinal things table needs
 * Like searching, pagination, filtering columns, reordering, etc
 * But it's just assignment right?)
 * So i made it super simple
 *
 * @class TableHeader
 */
var TableHeader = (function () {
    /**
     * Creates an instance of TableHeader.
     * @param {string} caption Text displayed on column header
     *
     * @memberOf TableHeader
     */
    function TableHeader(caption) {
        this.caption = caption;
        this.headerElement = document.createElement('th');
        this.headerElement.textContent = caption;
    }
    /**
     * Displays row data
     *
     * @static
     * @param {string[]} rowData the string values to show on row
     * @returns
     *
     * @memberOf TableHeader
     */
    TableHeader.renderCell = function (rowData) {
        var cellElements = [];
        rowData.forEach(function (row) {
            var $td = document.createElement('td');
            $td.textContent = row;
            cellElements.push($td);
        });
        return cellElements;
    };
    return TableHeader;
}());
/**
 * Table initiation class
 * The Table class is not available for outside world, incapsulated
 * So the only way to use Table, is to create Task class with controls everything
 * Can be heavily overloaded in the future
 *
 * @class Task
 */
var Task = (function () {
    /**
     * Creates an instance of Task.
     * @param {IAdapterInterface} config base configurations
     *
     * @memberOf Task
     */
    function Task(config) {
        this.config = config;
    }
    Task.prototype.render = function () {
        var elem = document.getElementById('appTable');
        var table = new Table(elem, this.config.title, this.config);
        table.render();
    };
    return Task;
}());
