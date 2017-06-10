var ele = document.getElementById("test");
var container = document.getElementById("container");
var cell = document.getElementById("tresize");


ele.addEventListener("mousedown", function( event ) {
    console.log(event);

    function handler(event){
        console.log(event);
        cell.style.width = (event.x - 38) + "px";
        ele.style.left = (event.x - 4)+ "px";         
    }

    container.addEventListener("mousemove", handler);

    container.addEventListener("mouseup", function(){
        console.log("saa");
        container.removeEventListener("mousemove", handler);
    }); 

});

(function(factory){
    window.dom = factory();
})(function(){
    
    if(typeof Array.prototype.indexOf !== "function") {
        Array.prototype.indexOf = function(item) {
            for(var i = 0; i < this.length; i++) {
                if (this[i] === item) {
                    return i;
                }
            }
            return -1;
        };
    }

    function Dome(els) {
        for(var i = 0; i < els.length; i++ ) {
            this[i] = els[i];
        }
        this.length = els.length;
    }

    window.dom = dom;
    
    var dom = { 
        get:function(selector) {
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

        create: function(tagName, attrs) {
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

    Dome.prototype.map = function(callback) {
        var results = [], i = 0;
        for ( ; i < this.length; i++) {
            results.push(callback.call(this, this[i], i));
        }
        return results;
    };

    Dome.prototype.mapOne = function (callback) {
        var m = this.map(callback);
        return m.length > 1 ? m : m[0];
    };

    Dome.prototype.forEach = function(callback) {
        this.map(callback);
        return this;
    };

    Dome.prototype.text = function(text) {
        if (typeof text !== "undefined") {
            return this.forEach(function(el) {
                el.innerText = text;
            });
        } else {
            return this.mapOne(function(el) {
                return el.innerText;
            });
        }
    };

    Dome.prototype.html = function(html) {
        if (typeof html !== "undefined") {
            this.forEach(function(el) {
                el.innerHTML = html;
            });
            return this;
        } else {
            return this.mapOne(function(el) {
                return el.innerHTML;
            });
        }
    };

    Dome.prototype.addClass = function(classes) {
        var className = "";
        if (typeof classes !== "string") {
            for (var i = 0; i < classes.length; i++) {
                className += " " + classes[i];
            }
        } else {
            className = " " + classes;
        }
        return this.forEach(function(el) {
            el.className += className;
        });
    };

    Dome.prototype.removeClass = function(clazz) {
        return this.forEach(function(el) {
            var cs = el.className.split(" "), i;
    
            while ( (i = cs.indexOf(clazz)) > -1) { 
                cs = cs.slice(0, i).concat(cs.slice(++i));
            }
            el.className = cs.join(" ");
        }); 
    };

    Dome.prototype.attr = function(attr, val) {
        if (typeof val !== "undefined") {
            if(typeof attr === "object") {
                this.forEach(function(val, attr){
                    el.setAttribute(attr, val);    
                });
            } else {
                return this.forEach(function(el) {
                    el.setAttribute(attr, val);
                });
            }
        } else {
            return this.mapOne(function(el) {
                return el.getAttribute(attr);
            });
        }
    };

    Dome.prototype.append = function(els) {
        return this.forEach(function(parEl, i) {
            var _refParent;
            els.forEach(function(childEl) {
                if (i > 0) {
                    childEl = childEl.cloneNode(true); 
                }
                
                parEl.appendChild(childEl);
            }); 
        }); 
    };

    Dome.prototype.prepend = function(els, specific) {
        return this.forEach(function(parEl, i) {
            var childEl,
                _refParent,
                j;
            
            if(typeof specific !== "undefined") {
                for(j=0; j<parEl.children.length; j++){
                    if(parEl.children[j].id === specific) {
                        _refParent = parEl.children[j];
                    }
                }
            } else {
                _refParent = parEl.firstChild;
            }

            for (j = els.length -1; j > -1; j--) {
                childEl = (i > 0) ? els[j].cloneNode(true) : els[j];
                //parEl.insertBefore(childEl, parEl.firstChild);
                parEl.insertBefore(childEl, _refParent);
                
            }
        }); 
    };

    Dome.prototype.remove = function() {
        return this.forEach(function(el) {
            return el.parentNode.removeChild(el);
        });
    };

    Dome.prototype.bBox = function() {
        var obj;
        this.forEach(function(ele){
            obj = {
                width: ele.clientWidth,
                height: ele.clientHeight,
                offsetTop: ele.offsetTop,
                offsetLeft: ele.offsetLeft
            };
        });
        return obj;
    };

    Dome.prototype.on = (function() {
        if (document.addEventListener) {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el.addEventListener(evt, fn, false);
                });
            };
        } else if (document.attachEvent)  {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el.attachEvent("on" + evt, fn);
                });
            };
        } else {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el["on" + evt] = fn;
                });
            };
        }
    }());

    Dome.prototype.off = (function() {
        if (document.removeEventListener) {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el.removeEventListener(evt, fn, false);
                });
            };
        } else if (document.detachEvent)  {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el.detachEvent("on" + evt, fn);
                });
            };
        } else {
            return function(evt, fn) {
                return this.forEach(function(el) {
                    el["on" + evt] = null;
                });
            };
        }
    }());   

    return dom;
});



(function(){
    
    var proto;
    function Excel(container, row, col){
        this.parent = dom.get(container);
        this.table = dom.create("table");
        this.table.attr("border", 1);
        this.parent.append(this.table);
        this.counter = 0;
        this.rowCounts = 0;
        this.colCounts = col;
        this.storage = {};

        //console.log(this.table.bBox());
        for(var i=0; i<row; i++) {
            var tr = this.addRow(),
                td,
                id;
            //this.addCol(tr, i);
            for(var k=0; k<col; k++) {
                if(i === 0 && k !== 0){
                    td = dom.create("td");
                    td.text(this.colHead(k));
                    td.addClass("col-head");
                    id = this.init("col");
                    td.attr("id", id);
                    this.storage[id] = td;
                } else if(i === 0 && k === 0){
                    td = dom.create("td");
                    td.text("");
                } else if(i !== 0 && k === 0){
                    td = dom.create("td");
                    td.text(i);
                } else {
                    td = dom.create("td");
                    
                }
                
                tr.append(td);    
            }
        }

        this.colHandler();
    }

    //global referencd storage
    window.Excel = Excel;
    
    proto = Excel.prototype;
    
    proto.init = function(prefix) {
        var id = [prefix, (++this.counter)].join("-");
        return id;
    };

    proto.colHead = function(counts) {
        var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        counts = counts || this.colCounts;
        
        if(counts <= 26) {
            return alpha[counts-1];
        } else {
            var _i = Math.ceil(counts/25),
                _j = counts%25;
            
            
            if(_j ===0 && (_i*25 == counts)){
                _j = 25;
            }
            return [alpha[_i-2], alpha[_j-1]].join("");
        }
    };


    proto.addRow = function(isAppend = true, row) {
        //TODO
        var tr = dom.create("tr"),
            id = this.init("row");

        tr.attr("id", id);
        tr.addClass("new-rows");
        this.storage[id] = tr;
        this.rowCounts ++;
        
        if(isAppend)
            this.table.append(tr);
        else
            this.table.prepend(tr, row);

        // for(var k=0; k<this.colCounts; k++) {
        //     tr.append(dom.create("td"));
        // }

        //console.log(this.table.bBox());
        if(this.rowCounts > 1)
            this.rowlHandler( id, tr.bBox().width, tr.bBox().offsetTop, tr.bBox().offsetLeft);
        return tr;    
    };

    proto.removeRow = function() {
        //TODO
    };

    proto.addCol = function(tr, obj) {
        //TODO
        var allRows = dom.get(".new-rows"),
            td,
            id,
            isColHead = true,
            that = this;

        
        allRows.forEach(function(ele) {
            td = dom.create("td");
            if(isColHead){
                td.text(that.colHead(that.colCounts++));
                td.addClass("col-head");
                id = that.init("col");
                td.attr("id", id);
            }
            isColHead = false;
            var xx =  dom.get(ele);
            xx.append(td);  
        });

        this.colHandler();
    };

    proto.removeCol = function() {
        //TODO
    };

    proto.rowlHandler = function(mapid, w, t, l) {
        //TODO
        var handler = dom.create("div"),
            tableBox = this.table.bBox(),
            that = this;

        handler.addClass("handler");
        handler.attr("data-mapid", mapid);
        handler.addClass("row");                     

        handler[0].style.width = w - 28 + "px";   
        handler[0].style.height = "5px";
        handler[0].style.top = tableBox.offsetTop + 23 + t + 2 + "px";
        handler[0].style.left = tableBox.offsetLeft + l + 28 + "px";
        that.parent.append(handler);

        handler.on("mousedown", function( event ) {
            var mapid = this.getAttribute("data-mapid"),
                oppTr = that.storage[mapid],
                fisrtTd = oppTr[0].firstChild,
                oppTrBbox = oppTr.bBox(),
                allHandlers = dom.get(".handler.row");

            function helper(event){
                if(event.y > tableBox.offsetTop+45){
                    fisrtTd.style.height = (event.y - 
                                            oppTrBbox.offsetTop - 
                                            tableBox.offsetTop) + "px";

                    allHandlers.forEach(function(ele){
                       var _mapid = ele.getAttribute("data-mapid"),
                            rowbBox = that.storage[_mapid].bBox();
                        ele.style.top = rowbBox.height + 
                                        tableBox.offsetTop + 
                                        rowbBox.offsetTop  - 3 +"px";
                    });
                }
            }

            that.parent.on("mousemove", helper);

            that.parent.on("mouseup", function(){
                that.parent.off("mousemove", helper);
            }); 

        });
    };

    proto.colHandler = function() {
        //TODO
        var oldCols = dom.get(".handler.col");
        oldCols.forEach(function(ele){
            ele.remove();
        });

        var cols = dom.get(".col-head"),
            tableBox = this.table.bBox(),
            that = this;
        
        console.log(cols);

        cols.forEach(function(ele){
            //removing exisiting col handlers
            var handler = dom.create("div");

            handler.addClass("handler col");
            handler.attr("data-mapid", ele.id);                

            handler[0].style.width = "4px";   
            handler[0].style.height = tableBox.height + "px";
            handler[0].style.top = tableBox.offsetTop + "px";
            handler[0].style.left =  ele.clientWidth + ele.offsetLeft + 6 + "px";
            that.parent.append(handler);

            handler.on("mousedown", function( event ) {
                var mapid = this.getAttribute("data-mapid"),
                    oppTd = dom.get("#" + mapid),
                    oppTdBbox = oppTd.bBox(),
                    allHandlers = dom.get(".handler.col");

                function helper(event){
                    oppTd[0].style.width = (event.x - 
                                            oppTdBbox.offsetLeft - 
                                            tableBox.offsetLeft) + "px";

                    allHandlers.forEach(function(ele){
                        var _mapid = ele.getAttribute("data-mapid"),
                            rowbBox = dom.get("#"+_mapid).bBox();
                        ele.style.left = rowbBox.offsetLeft + 
                                         rowbBox.width + 3 +
                                         "px";
                    });
                }

                that.parent.on("mousemove", helper);

                that.parent.on("mouseup", function(){
                    that.parent.off("mousemove", helper);
                }); 

            });
        });

    };

    var ecl = new Excel(".wrapper", 5,5);    

    //ecl.addRow(); //1
    // ecl.addRow(); //2
    // ecl.addRow(false); //3
    // ecl.addRow(false, "row-2"); //4
    ecl.addCol();
})();
