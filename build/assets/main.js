"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * few methods to do dom operation
 */
(function (factory) {
    window.dom = factory();
})(function () {

    if (typeof Array.prototype.indexOf !== "function") {
        Array.prototype.indexOf = function (item) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === item) {
                    return i;
                }
            }
            return -1;
        };
    }

    function Dome(els) {
        for (var i = 0; i < els.length; i++) {
            this[i] = els[i];
        }
        this.length = els.length;
    }

    window.dom = dom;

    var dom = {
        get: function get(selector) {
            var els;

            if (typeof selector === "string") {
                els = document.querySelectorAll(selector);
            } else if (selector.length) {
                els = selector;
            } else {
                els = [selector];
            }
            return new Dome(els);
        },

        create: function create(tagName, attrs) {
            var el = new Dome([document.createElement(tagName)]);
            if (attrs) {
                if (attrs.className) {
                    el.addClass(attrs.className);
                    delete attrs.className;
                }
                if (attrs.text) {
                    el.text(attrs.text);
                    delete attrs.text;
                }
                for (var key in attrs) {
                    if (attrs.hasOwnProperty(key)) {
                        el.attr(key, attrs[key]);
                    }
                }
            }
            return el;
        }
    };

    Dome.prototype.map = function (callback) {
        var results = [],
            i = 0;
        for (; i < this.length; i++) {
            results.push(callback.call(this, this[i], i));
        }
        return results;
    };

    Dome.prototype.mapOne = function (callback) {
        var m = this.map(callback);
        return m.length > 1 ? m : m[0];
    };

    Dome.prototype.forEach = function (callback) {
        this.map(callback);
        return this;
    };

    Dome.prototype.text = function (text) {
        if (typeof text !== "undefined") {
            return this.forEach(function (el) {
                el.innerText = text;
            });
        } else {
            return this.mapOne(function (el) {
                return el.innerText;
            });
        }
    };

    Dome.prototype.html = function (html) {
        if (typeof html !== "undefined") {
            this.forEach(function (el) {
                el.innerHTML = html;
            });
            return this;
        } else {
            return this.mapOne(function (el) {
                return el.innerHTML;
            });
        }
    };

    Dome.prototype.addClass = function (classes) {
        var className = "";
        if (typeof classes !== "string") {
            for (var i = 0; i < classes.length; i++) {
                className += " " + classes[i];
            }
        } else {
            className = " " + classes;
        }
        return this.forEach(function (el) {
            el.className += className;
        });
    };

    Dome.prototype.removeClass = function (clazz) {
        return this.forEach(function (el) {
            var cs = el.className.split(" "),
                i;

            while ((i = cs.indexOf(clazz)) > -1) {
                cs = cs.slice(0, i).concat(cs.slice(++i));
            }
            el.className = cs.join(" ");
        });
    };

    Dome.prototype.attr = function (attr, val) {
        if (typeof val !== "undefined") {
            if ((typeof attr === "undefined" ? "undefined" : _typeof(attr)) === "object") {
                this.forEach(function (val, attr) {
                    el.setAttribute(attr, val);
                });
            } else {
                return this.forEach(function (el) {
                    el.setAttribute(attr, val);
                });
            }
        } else {
            return this.mapOne(function (el) {
                return el.getAttribute(attr);
            });
        }
    };

    Dome.prototype.append = function (els) {
        return this.forEach(function (parEl, i) {
            var _refParent;
            els.forEach(function (childEl) {
                if (i > 0) {
                    childEl = childEl.cloneNode(true);
                }

                parEl.appendChild(childEl);
            });
        });
    };

    Dome.prototype.prepend = function (els, specific) {
        return this.forEach(function (parEl, i) {
            var childEl, _refParent, j;

            if (typeof specific !== "undefined") {
                for (j = 0; j < parEl.children.length; j++) {
                    if (parEl.children[j].id === specific) {
                        _refParent = parEl.children[j];
                    }
                }
            } else {
                _refParent = parEl.firstChild;
            }

            for (j = els.length - 1; j > -1; j--) {
                childEl = i > 0 ? els[j].cloneNode(true) : els[j];
                //parEl.insertBefore(childEl, parEl.firstChild);
                parEl.insertBefore(childEl, _refParent);
            }
        });
    };

    Dome.prototype.remove = function () {
        return this.forEach(function (el) {
            return el.parentNode.removeChild(el);
        });
    };

    Dome.prototype.bBox = function () {
        var obj;
        this.forEach(function (ele) {
            obj = {
                width: ele.clientWidth,
                height: ele.clientHeight,
                offsetTop: ele.offsetTop,
                offsetLeft: ele.offsetLeft
            };
        });
        return obj;
    };

    Dome.prototype.on = function () {
        if (document.addEventListener) {
            return function (evt, fn) {
                return this.forEach(function (el) {
                    el.addEventListener(evt, fn, false);
                });
            };
        } else if (document.attachEvent) {
            return function (evt, fn) {
                return this.forEach(function (el) {
                    el.attachEvent("on" + evt, fn);
                });
            };
        } else {
            return function (evt, fn) {
                return this.forEach(function (el) {
                    el["on" + evt] = fn;
                });
            };
        }
    }();

    Dome.prototype.off = function () {
        if (document.removeEventListener) {
            return function (evt, fn) {
                return this.forEach(function (el) {
                    el.removeEventListener(evt, fn, false);
                });
            };
        } else if (document.detachEvent) {
            return function (evt, fn) {
                return this.forEach(function (el) {
                    el.detachEvent("on" + evt, fn);
                });
            };
        } else {
            return function (evt, fn) {
                return this.forEach(function (el) {
                    el["on" + evt] = null;
                });
            };
        }
    }();

    return dom;
});

/**
 * Excel operation
 */

(function () {

    var proto;
    /**
     * Constructor fuctions, which take 3 parameters
     * @param {*} container - the place where you want to set exel app 
     * @param {*} row - number of rows
     * @param {*} col - number of cols
     */
    function Excel(container, row, col) {
        this.parent = dom.get(container);
        this.table = dom.create("table");
        this.table.attr("border", 1);
        this.table.attr("contenteditable", 1);
        this.parent.append(this.table);
        this.counter = 0;
        this.rowCounts = 0;
        this.colCounts = col;
        this.storage = {};

        for (var i = 0; i < row; i++) {
            var tr,
                td,
                id,
                that = this;

            tr = dom.create("tr"), id = this.init("row");
            tr.addClass("opt-row");

            if (i > 0) tr.addClass("opt-handler-row");

            tr.attr("id", id);
            this.rowCounts++;
            this.table.append(tr);

            for (var k = 0; k < col; k++) {
                if (i === 0 && k !== 0) {
                    td = dom.create("td");
                    td.text(this.colHead(k));
                    td.addClass("col-head");
                    id = this.init("col");
                    td.attr("id", id);
                    this.storage[id] = td;
                } else if (i === 0 && k === 0) {
                    td = dom.create("td");
                    td.text("");
                } else if (i !== 0 && k === 0) {
                    td = dom.create("td");
                    td.text(i);
                } else {
                    td = dom.create("td");
                    td.attr("contenteditable", "true");
                    td.on("focusout", function () {
                        that.rowlHandler();
                        that.colHandler();
                    });
                }

                tr.append(td);
            }
        }

        this.rowlHandler();
        this.colHandler();
    }

    //global referencd storage
    window.Excel = Excel;

    proto = Excel.prototype;

    proto.init = function (prefix) {
        var id = [prefix, ++this.counter].join("-");
        return id;
    };

    /**
     * helper function which return column heading
     * like A, b, ... AA, AB, ... ZZ
     */
    proto.colHead = function (counts) {
        var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        counts = counts || this.colCounts;

        if (counts <= 26) {
            return alpha[counts - 1];
        } else {
            var _i = Math.ceil(counts / 25),
                _j = counts % 25;

            if (_j === 0 && _i * 25 == counts) {
                _j = 25;
            }
            return [alpha[_i - 2], alpha[_j - 1]].join("");
        }
    };

    /**
     * A helper function which helps to add row
     * at the end of table
     */
    proto.addRow = function () {
        //TODO - append row at specific location

        var tr = dom.create("tr"),
            id = this.init("row"),
            td,
            that = this;

        tr.attr("id", id);
        tr.addClass("opt-row opt-handler-row");

        this.table.append(tr);

        for (var k = 0; k < this.colCounts; k++) {
            td = dom.create("td");
            if (k === 0) td.text(this.rowCounts);

            td.attr("contenteditable", "true");
            td.on("focusout", function () {
                that.rowlHandler();
                that.colHandler();
            });
            tr.append(td);
        }

        this.rowCounts++;
        return tr;
    };

    proto.removeRow = function () {
        //TODO
    };

    /**
     * A helper function which helps to add 
     * columns
     */
    proto.addCol = function (tr, obj) {
        //TODO - Add column at specific location
        var allRows = dom.get(".opt-row"),
            td,
            id,
            isColHead = true,
            that = this;

        allRows.forEach(function (ele) {
            td = dom.create("td");
            if (isColHead) {
                td.text(that.colHead(that.colCounts++));
                td.addClass("col-head");
                id = that.init("col");
                td.attr("id", id);
            } else {
                td.attr("contenteditable", "true");
                td.on("focusout", function () {
                    that.rowlHandler();
                    that.colHandler();
                });
            }
            isColHead = false;
            var xx = dom.get(ele);
            xx.append(td);
        });

        this.rowlHandler();
        this.colHandler();
    };

    proto.removeCol = function () {
        //TODO
    };

    /**
     * To resize row, this function helps to create a handler 
     */
    proto.rowlHandler = function () {
        //TODO - few bugs are present, need to solve

        //remove all the existing rows handler before creating new one
        dom.get(".handler.row").remove();
        var rows = dom.get(".opt-handler-row"),
            tableBox = this.table.bBox(),
            that = this;

        rows.forEach(function (ele) {
            var handler = dom.create("div");

            handler.addClass("handler row");
            handler.attr("data-mapid", ele.id);

            handler[0].style.width = tableBox.width + "px";
            handler[0].style.height = "5px";
            handler[0].style.top = ele.clientHeight + ele.offsetTop + tableBox.offsetTop + "px";
            handler[0].style.left = tableBox.offsetLeft + "px";
            that.parent.append(handler);

            handler.on("mousedown", function (event) {
                var mapid = this.getAttribute("data-mapid"),
                    oppTr = dom.get("#" + mapid),
                    fisrtTd = oppTr[0].firstChild,
                    oppTrBbox = oppTr.bBox(),
                    allHandlers = dom.get(".handler.row");

                function helper(event) {
                    fisrtTd.style.height = event.y - oppTrBbox.offsetTop - tableBox.offsetTop + "px";

                    allHandlers.forEach(function (ele) {
                        var _mapid = ele.getAttribute("data-mapid"),
                            rowbBox = dom.get("#" + _mapid).bBox();
                        ele.style.top = rowbBox.height + tableBox.offsetTop + rowbBox.offsetTop - 3 + "px";
                    });
                }

                that.parent.on("mousemove", helper);

                that.parent.on("mouseup", function () {
                    that.parent.off("mousemove", helper);
                    that.colHandler();
                });
            });
        });
    };

    /**
     *  To resize column, this function helps to create a handler
     */
    proto.colHandler = function () {
        //TODO - few bugs are present, need to solve

        dom.get(".handler.col").remove();
        var cols = dom.get(".col-head"),
            tableBox = this.table.bBox(),
            that = this;

        cols.forEach(function (ele) {
            //removing exisiting col handlers
            var handler = dom.create("div");

            handler.addClass("handler col");
            handler.attr("data-mapid", ele.id);

            handler[0].style.width = "4px";
            handler[0].style.height = tableBox.height + "px";
            handler[0].style.top = tableBox.offsetTop + "px";
            handler[0].style.left = ele.clientWidth + ele.offsetLeft + 6 + "px";
            that.parent.append(handler);

            handler.on("mousedown", function (event) {
                var mapid = this.getAttribute("data-mapid"),
                    oppTd = dom.get("#" + mapid),
                    oppTdBbox = oppTd.bBox(),
                    allHandlers = dom.get(".handler.col");

                function helper(event) {
                    oppTd[0].style.width = event.x - oppTdBbox.offsetLeft - tableBox.offsetLeft + "px";

                    allHandlers.forEach(function (ele) {
                        var _mapid = ele.getAttribute("data-mapid"),
                            rowbBox = dom.get("#" + _mapid).bBox();
                        ele.style.left = rowbBox.offsetLeft + rowbBox.width + 3 + "px";
                    });
                }

                that.parent.on("mousemove", helper);

                that.parent.on("mouseup", function () {
                    that.parent.off("mousemove", helper);
                    that.rowlHandler();
                });
            });
        });
    };

    /**
     * convert all the table data into CSV format
     */
    proto.exportTableToCSV = function (filename) {
        var csv = [];
        var rows = document.querySelectorAll("table tr");

        for (var i = 0; i < rows.length; i++) {
            var row = [],
                cols = rows[i].querySelectorAll("td, th");

            for (var j = 1; j < cols.length; j++) {
                row.push(cols[j].innerText);
            }csv.push(row.join(","));
        }

        // Download CSV file
        console.log(csv.join("\n"));
        this.downLoadFile(csv.join("\n"));
    };

    proto.exportTableToJSON = function () {
        var json = {},
            dataObj = {},
            rows = document.querySelectorAll("table tr"),
            colHeading = rows[0].querySelectorAll("td, th");

        for (var i = 1; i < rows.length; i++) {
            var row = [],
                cols = rows[i].querySelectorAll("td, th");

            dataObj = {};
            for (var j = 1; j < cols.length; j++) {
                dataObj[colHeading[j].innerText] = cols[j].innerText;
            }
            json[i] = dataObj;
        }

        // Download JSON file
        console.log(JSON.stringify(json, null, 4));
        this.downLoadFile(json);
    };

    proto.downLoadFile = function () {
        //ToDO
    };

    //initialize the excel app
    var ecl = new Excel(".wrapper", 5, 5);

    ecl.addCol();
    ecl.addCol();
    ecl.addRow();
    ecl.addCol();

    /**
     * button actions
     */
    dom.get(".btn.bold").on("click", function (e) {
        e.preventDefault();
        document.execCommand('bold');
    });

    dom.get(".btn.italic").on("click", function (e) {
        e.preventDefault();
        document.execCommand('italic');
    });

    dom.get(".btn.underline").on("click", function (e) {
        e.preventDefault();
        document.execCommand('underline');
    });

    dom.get(".btn.rows").on("click", function (e) {
        e.preventDefault();
        ecl.addRow();
    });

    dom.get(".btn.columns").on("click", function (e) {
        e.preventDefault();
        ecl.addCol();
    });

    dom.get(".btn.download-json").on("click", function (e) {
        e.preventDefault();
        ecl.exportTableToJSON();
    });

    dom.get(".btn.download-csv").on("click", function (e) {
        e.preventDefault();
        ecl.exportTableToCSV();
    });
})();