export default function DrawRectangle (id, onMouseUp, className){

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
  },
  drawIdonmousemove: function(dom,evt) {
      let domid = dom.id
      let currentid = this.currentDrawRectangle.id
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
          let endx = drawW > 0 ? x : this.RectangleDivs[this.index].left
          let endy = drawH > 0 ? y : this.RectangleDivs[this.index].top
          this.currentDrawRectangle.style.width = (drawW > 0 ? drawW : -drawW) + "px";
          this.currentDrawRectangle.style.height = (drawH > 0 ? drawH : -drawH) + "px";
          let startx = parseInt(this.currentDrawRectangle.style.left)
          let starty = parseInt(this.currentDrawRectangle.style.top)
          let rectW = parseInt(this.currentDrawRectangle.style.width)
          let rectH = parseInt(this.currentDrawRectangle.style.height)
          if (drawW < 0) {
              this.currentDrawRectangle.style.left = (x + img_x) + "px";
          }
          if (drawH < 0) {
              this.currentDrawRectangle.style.top = (y + img_y) + "px";
          }

          if (this.debug) {
              this.temprectangle = {
                id: this.count,
                rectW: rectW,
                rectH: rectH,
                startx: startx,
                starty: starty,
                endx: endx,
                endy: endy,
                dot1: {x:startx, y:starty},
                dot2: {x:endx, y: starty},
                dot3: {x:startx, y:endy},
                dot4: {x:endx, y:endy}
              }
              var icon = document.createElement('div')
              icon.className = 'deleteIcon'
              icon.innerHTML = 'X'
              icon.onclick = function(event) {
                  let deleteid = parseInt(icon.parentNode.id.substring(4))
                  icon.parentNode.remove()
                  this.rectangleList = this.rectangleList.filter(item => {
                    return item.id !== deleteid
                  })
                  this._onMouseUp.call(this, this);
                  console.log(223, deleteid, this.rectangleList)
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
      let deleteid = 0
      //this.IMG.releaseCapture();
       let offsetw = this.currentDrawRectangle.offsetWidth
       if (offsetw <= 5) {
         deleteid = parseInt(this.currentDrawRectangle.id.substring(4))
         this.currentDrawRectangle.remove()
         this.RectangleDivs.splice(deleteid, 1)
         this.index = this.index - 1
         return
       }
      this.rectangleList.forEach(function(item, index){
        let result = this.isOverlap(this.temprectangle,item)
        if (result) {
          this.currentDrawRectangle.remove()
          deleteid = this.currentDrawRectangle.id
        }
      }.bind(this))

      this.rectangleList.push(this.temprectangle)
      if (deleteid) {
        deleteid = parseInt(deleteid.substring(4))
        this.rectangleList.splice(this.rectangleList.length-1, 1)
        console.log(2222264, deleteid, this.rectangleList)
      }
      console.log(66,this.rectangleList)
      this.count = this.count + 1
      if(this._onMouseUp) {
          this._onMouseUp.call(this, this);
          this.currentDrawRectangle.onmousemove = this.drawIdonmousemove.bind(this,this.currentDrawRectangle)
          this.cross = false
          this.tempCrossx = false
          this.tempCrossy = false
      }
  },
  isOverlap: function(rect1, rect2) {
    let r1dot1x = rect1.dot1.x
    let r1dot1y = rect1.dot1.y
    let r1dot2x = rect1.dot2.x
    let r1dot2y = rect1.dot2.y
    let r1dot3x = rect1.dot3.x
    let r1dot3y = rect1.dot3.y
    let r1dot4x = rect1.dot4.x
    let r1dot4y = rect1.dot4.y

    let r2dot1x = rect2.dot1.x
    let r2dot1y = rect2.dot1.y
    let r2dot2x = rect2.dot2.x
    let r2dot2y = rect2.dot2.y
    let r2dot3x = rect2.dot3.x
    let r2dot3y = rect2.dot3.y
    let r2dot4x = rect2.dot4.x
    let r2dot4y = rect2.dot4.y
    let r1minx = Math.min(r1dot1x,r1dot2x,r1dot3x,r1dot4x)
    let r1maxx = Math.max(r1dot1x,r1dot2x,r1dot3x,r1dot4x)
    let r1miny = Math.min(r1dot1y,r1dot2y,r1dot3y,r1dot4y)
    let r1maxy = Math.max(r1dot1y,r1dot2y,r1dot3y,r1dot4y)
    let r2dot1,r2dot2,r2dot3,r2dot4 = false
    if (r2dot1x>r1minx && r2dot1x<r1maxx) {
      if(r2dot1y>r1miny && r2dot1y<r1maxy) {
        r2dot1 = true
      } else {
        r2dot1 = false
      }
    }
    if (r2dot2x>r1minx && r2dot2x<r1maxx) {
      if(r2dot2y>r1miny && r2dot2y<r1maxy) {
        r2dot2 = true
      } else {
        r2dot2 = false
      }
    }
    if (r2dot3x>r1minx && r2dot3x<r1maxx) {
      if(r2dot3y>r1miny && r2dot3y<r1maxy) {
        r2dot3 = true
      } else {
        r2dot3 = false
      }
    }
    if (r2dot4x>r1minx && r2dot4x<r1maxx) {
      if(r2dot4y>r1miny && r2dot4y<r1maxy) {
        r2dot4 = true
      } else {
        r2dot4 = false
      }
    }
    console.log(767886, r2dot1|| r2dot2 || r2dot3 || r2dot4)
    return r2dot1|| r2dot2 || r2dot3 || r2dot4
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
          // top: t,
          // left: l,
          top: 0,
          left: 0,
          width: w,
          height: h
      };
  }
};
