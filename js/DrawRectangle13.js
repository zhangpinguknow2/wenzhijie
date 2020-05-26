DrawRectangle = function(id, onMouseUp, className){    
      
    document.oncontextmenu=function() {    
       return true;    
    };  
          
    this.IMG = document.getElementById(id);    
      
    var masker = document.createElement("div");  
    masker.id = "mask_" + id;  
    var position = this.getAbsolutePosition(this.IMG);  
      
    masker.style.width = position.width + "px";  
    masker.style.height = position.height + "px";  
    masker.style.left = position.left;  
    masker.style.top = position.top;  
    masker.style["background-image"] = "url("+this.IMG.src+")";  
    masker.className = "imgmasker";  
  
    this.masker = masker;  
    this.IMG.parentNode.appendChild(masker);  
    this.IMG.parentNode.removeChild(this.IMG);  
      
    this.isDraw = false;    
    this.isMouseUp = true;    
    this.index = 0;    
    this.currentDrawRectangle = null;    
    this.className = className;    
    this.count = 1   
    this.cross = false
    this.RectangleDivs = [];
    this.rectangleList = [];
    this.temprectangle = {}
    this.tempCrossx = false
    this.tempCrossy = false
        
    this.debug = true;    
    
    this._onMouseUp = onMouseUp;    
        
    this.bindListener();    
};  
    
DrawRectangle.prototype = {    
    bindListener: function(){    
        
        this.masker.onmousemove = this.dragSize.bind(this);    
        this.masker.onmouseup = this.onMouseUp.bind(this);    
        this.masker.onmouseout = this.onMouseOut.bind(this);    
        this.masker.onmouseover = this.onMouseOver.bind(this);    
        this.masker.onmousedown = this.drawLayer.bind(this);    
        this.masker.onmouseup = this.onMouseUp.bind(this);    
    },   
    drawIdonmousemove: function(dom,evt) {
    		let domid = dom.id
    		let currentid = this.currentDrawRectangle.id
//  		console.log(domid)
//  		console.log(7788, currentid)
    		if (domid !== currentid) {
    			this.cross = true
    		} else {
    			this.cross = false
    			this.tempCrossx = false
    			this.tempCrossy = false
    		}
    },
    drawLayer: function(){    
        //this.IMG.setCapture(true);    
        this.isDraw = true;   
        this.cross = false;
        this.tempCrossx = false
        this.tempCrossy = false
        this.ismouseup = false;    
        this.index++;    
            
        var pos = this.getSourcePos();    
            
        var x = event.offsetX;     
        var y = event.offsetY;     
    
        var top = y + pos.top - 2;    
        var left = x + pos.left - 2;    
           
        var d = document.createElement("div");    
       // document.body.appendChild(d);  
        this.masker.appendChild(d);  
        d.style.border = "1px solid #ff0000";    
        d.style.width = 0;    
        d.style.height = 0;    
        d.style.overflow = "hidden";    
        d.style.position = "absolute";    
        d.style.left = left + "px";  
        d.style.top = top + "px";   
        d.style.opacity = 0.5;  
          
        d.style["z-index"] = 2;  
        if(this.className) {    
            d.className = this.className;    
        }    
        d.id = "draw" + this.index;
        if (this.debug) {    
            d.innerHTML = "<div class='innerbg'>x:" + x + ",y:" + y + "..</div>";    
        }    
            
        this.currentDrawRectangle = d;    
            
        this.RectangleDivs[this.index] = {    
            left: left,    
            top: top,    
            el: d    
        };    
    },    
    getSourcePos: function(){    
        return this.getAbsolutePosition(this.masker);    
    },    
    dragSize: function(){ 
        if (this.isDraw && !this.cross) {  
            if (!(event.srcElement.tagName.toLowerCase() == "div" && event.srcElement.className == "imgmasker"))     
                return;    
                
            var pos = this.getSourcePos();    
            var img_x = pos.top;     
            var img_y = pos.left;     
            var x = event.offsetX;    
            var y = event.offsetY;    
            var drawW = (x + img_x) - this.RectangleDivs[this.index].left;    
            var drawH = (y + img_y) - this.RectangleDivs[this.index].top;    
            this.currentDrawRectangle.style.width = (drawW > 0 ? drawW : -drawW) + "px";    
            this.currentDrawRectangle.style.height = (drawH > 0 ? drawH : -drawH) + "px";   
            if (drawW < 0) {    
                this.currentDrawRectangle.style.left = (x + img_x) + "px";     
            }    
            if (drawH < 0) {    
                this.currentDrawRectangle.style.top = (y + img_y) + "px";      
            }    
                
            if (this.debug) {    
            		this.temprectangle = {
            			id: this.count,
            			drawW: drawW,
            			drawH: drawH,
            			x: x,
            			y: y,
            			left: this.RectangleDivs[this.index].left,
            			top: this.RectangleDivs[this.index].top,
            			bottom: this.RectangleDivs[this.index].top + drawH,
            			right: this.RectangleDivs[this.index].left + drawW
            		}
//          		console.log(this.temprectangle)
//          		console.log('drawW:' + drawW + ';drawH:' + drawH + ';x:' + x + ';y:' + y + ';rect:' + this.RectangleDivs[this.index].left)
                var icon = document.createElement('div')
                icon.className = 'deleteIcon'
                icon.innerHTML = 'X'
                icon.onclick = function(event) {
                		let deleteid = parseInt(icon.parentNode.id.substr(4,1))
                		icon.parentNode.remove()
                		this.rectangleList.splice(deleteid-1, 1)
                		console.log(223, this.rectangleList)
                }.bind(this)
                this.currentDrawRectangle.innerHTML = "<div class='innerbg'>"+this.count
                "</div>";    
                this.currentDrawRectangle.append(icon)
            }    
                
        }    
        else {    
            return false;    
        }    
    },    
        
    stopDraw: function(){    
        this.isDraw = false;    
    },    
        
    onMouseOut: function(){    
        if (!this.isMouseUp) {    
            this.isDraw = false;    
        }    
    },    
        
    onMouseUp: function(){    
        this.isDraw = false;    
        this.isMouseUp = true;    
        //this.IMG.releaseCapture();   
        let deleteid = null
       	let offsetw = this.currentDrawRectangle.offsetWidth
       	if (offsetw < 5) {
       		this.currentDrawRectangle.remove()
       		this.index = this.index - 1
       		return
       	}
        this.rectangleList.forEach(function(item, index){
        		let curleft = this.temprectangle.left
        		let curright = this.temprectangle.right
        		let curtop = this.temprectangle.top
        		let curbottom = this.temprectangle.bottom
        		let curdrawH = this.temprectangle.drawH
        		let curdrawW = this.temprectangle.drawW
        		let temp = 0
        		if (curleft > curright) {
        			temp = curleft
        			curleft = curright
        			curright = temp
        		}
        		if (curtop > curbottom) {
        			temp = curtop
        			curtop = curbottom
        			curbottom = temp
        		}
        		let boolx = curleft<item.left && curright > item.right
        		let booly = curtop<item.top && curbottom > item.bottom
        		console.log(1112, boolx, booly, curtop, curbottom)
        		if (boolx && booly){
        			deleteid = item.id
        			this.currentDrawRectangle.remove()
        		}
        }.bind(this))
        this.rectangleList.push(this.temprectangle)
        console.log(66,this.rectangleList)
    		this.count = this.count + 1
        if(this._onMouseUp) {    
            this._onMouseUp.call(this, this.currentDrawRectangle);   
            this.currentDrawRectangle.onmousemove = this.drawIdonmousemove.bind(this,this.currentDrawRectangle)
            this.cross = false
            this.tempCrossx = false
            this.tempCrossy = false
        }    
    },    
        
    onMouseOver: function(){    
        if (!this.isMouseUp) {    
            this.isDraw = true;    
        }    
    },    
        
    getAbsolutePosition: function(obj){    
        var t = obj.offsetTop;    
        var l = obj.offsetLeft;    
        var w = obj.offsetWidth;    
        var h = obj.offsetHeight;    
            
        while (obj = obj.offsetParent) {    
            t += obj.offsetTop;    
            l += obj.offsetLeft;    
        }    
            
        return {    
            top: t,    
            left: l,    
            width: w,    
            height: h    
        };  
    }    
};   