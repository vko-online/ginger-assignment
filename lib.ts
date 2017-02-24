// made a simle lib for ginger payments
// its super simple, and may have errors/mistakes
// dont punch =)

/**
 * Configurations for Task class
 * 
 * @interface IAdapterInterface
 */
interface IAdapterInterface {

    /**
     * Table title
     * 
     * @type {string}
     * @memberOf IAdapterInterface
     */
    title: string;
    
    /**
     * The ajax method
     * 
     * @type {string}
     * @memberOf IAdapterInterface
     */
    method: string;
    
    /**
     * Table columns to display
     * 
     * @type {string[]}
     * @memberOf IAdapterInterface
     */
    fields: string[];
    
    /**
     * Table extension DOM element
     * 
     * @returns {HTMLElement} 
     * 
     * @memberOf IAdapterInterface
     */
    meta?(): HTMLElement;
    
    /**
     * Endpoint for querying data
     * 
     * @type {string}
     * @memberOf IAdapterInterface
     */
    url: string;
    
    /**
     * Query parameters
     * 
     * @type {{}}
     * @memberOf IAdapterInterface
     */
    query: {};
    
    /**
     * You get data by yourself, you can modify, convert, do some strange things to it
     * so that Table class only consumes prettified data
     * 
     * @returns {Promise<any>} 
     * 
     * @memberOf IAdapterInterface
     */
    exec(): Promise<any>;
    
    /**
     * Table columns
     * 
     * @type {TableHeader[]}
     * @memberOf IAdapterInterface
     */
    tableHeaders: TableHeader[];
}

/**
 * Custom ajax lib
 * cuz of concept `dont use any lib`
 * remember :p ?)
 */
class Ajax {

    /**
     * Creates an instance of Ajax.
     * @param {string} url 
     * @param {string} method 
     * @param {(data: any) => void} callback 
     * 
     * @memberOf Ajax
     */
    constructor(private url: string, private method: string, private callback: (data: any) => void) {
        this.method = this.method.toUpperCase();
    }

    private x() {
        if (typeof XMLHttpRequest !== 'undefined') return new XMLHttpRequest();
        const versions = [
            "MSXML2.XmlHttp.6.0",
            "MSXML2.XmlHttp.5.0",
            "MSXML2.XmlHttp.4.0",
            "MSXML2.XmlHttp.3.0",
            "MSXML2.XmlHttp.2.0",
            "Microsoft.XmlHttp"
        ];
        let xhr;
        for (var i = 0; i < versions.length; i++) {
            try {
                xhr = new window['ActiveXObject'](versions[i]);
                break;
            } catch (e) { }
        }
        return xhr;
    }

    /**
     * Executes ajax with query
     * 
     * @param {Object} data query params
     * 
     * @memberOf Ajax
     */
    public exec(data: Object) {
        var query = [];
        for (var key in data) {
            query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
        }

        let x = this.x();
        if (this.url.indexOf('?') > -1 && query.length) {
            this.url += + query.join('&');
        } else if (this.url.indexOf('?') > -1 && !query.length) {

        } else if (this.url.indexOf('?') === -1 && query.length) {
            this.url += '?' + query.join('&');
        }
        x.open(this.method, this.url, true);
        x.onreadystatechange = () => {
            if (x.readyState == 4) this.callback(x.responseText)
        };
        if (this.method == 'POST')
            x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        x.send(data);
    }
}


/**
 * React components like thingy :)
 * Class representing `<table>` DOM element
 * Heavily recreates DOM elements, cuz its faster
 * I dont even remove event listeners, cuz they are reference-free
 * refer http://stackoverflow.com/a/12528067/2308005
 * 
 * @class Table
 */
class Table {
    private tableCaptionElement: HTMLElement;
    private tableMetaElement: HTMLElement;
    private tableContainer: HTMLElement;
    private tableHead: HTMLElement;
    private tableBody: HTMLElement;


    /**
     * Creates an instance of Table.
     * @param {HTMLElement} elem DOM element to with table will be attached
     * @param {string} caption Table title
     * @param {IAdapterInterface} adapter Table configuration
     * 
     * @memberOf Table
     */
    constructor(private elem: HTMLElement, private caption: string, private adapter: IAdapterInterface) {
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
        let $tr = document.createElement('tr');
        this.adapter.tableHeaders.forEach(tableHeader => $tr.appendChild(tableHeader.headerElement));
        this.tableHead.appendChild($tr);

        this.tableBody = document.createElement('tbody');
    }

    render() {
        this.adapter.exec().then((data: any) => {
            data.forEach(value => {
                let $tr = document.createElement('tr');
                let tableHeaderRowData = this.adapter.fields.map(field => value[field]);
                let cells = TableHeader.renderCell(tableHeaderRowData);
                cells.forEach(cell => $tr.appendChild(cell))
                this.tableBody.appendChild($tr);
            });
            this.tableMetaElement.textContent = `Items: ${data.length}`;
            if (this.adapter.meta) {
                this.tableMetaElement.appendChild(this.adapter.meta());
            }

            this.tableContainer.appendChild(this.tableHead);
            this.tableContainer.appendChild(this.tableBody);
            while (this.elem.firstChild) {
                this.elem.removeChild(this.elem.firstChild);
            }
            this.elem.appendChild(this.tableContainer);
        });
    }
}


/**
 * Table helper
 * It should contain all the additinal things table needs
 * Like searching, pagination, filtering columns, reordering, etc
 * But it's just assignment right?)
 * So i made it super simple
 * 
 * @class TableHeader
 */
class TableHeader {
    headerElement: HTMLElement;


    /**
     * Creates an instance of TableHeader.
     * @param {string} caption Text displayed on column header
     * 
     * @memberOf TableHeader
     */
    constructor(private caption: string) {
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
    static renderCell(rowData: string[]) {
        let cellElements = [];
        rowData.forEach(row => {
            let $td = document.createElement('td');
            $td.textContent = row;
            cellElements.push($td);
        });
        return cellElements;
    }
}


/**
 * Table initiation class
 * The Table class is not available for outside world, incapsulated
 * So the only way to use Table, is to create Task class with controls everything
 * Can be heavily overloaded in the future
 * 
 * @class Task
 */
class Task {

    /**
     * Creates an instance of Task.
     * @param {IAdapterInterface} config base configurations
     * 
     * @memberOf Task
     */
    constructor(private config: IAdapterInterface) { }
    render() {
        let elem = document.getElementById('appTable');
        let table = new Table(elem, this.config.title, this.config as IAdapterInterface);
        table.render();
    }
}
