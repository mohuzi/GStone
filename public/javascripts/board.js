// bad stuff
CanvasRenderingContext2D.prototype.drawLine = function (x1, y1, x2, y2) {
    this.beginPath();
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
    this.stroke();
};

CanvasRenderingContext2D.prototype.drawCircle = function (x, y, r, color) {
    this.beginPath();
    // x y r 0 2pi
    this.arc(x,y,r,0,2*Math.PI);
    this.stroke();
    this.fillStyle=color;
    this.fill();
};

// Model
function Model(modelInput){
    // dependencies
    this.rectnum = modelInput.rectnum;


    this.map = undefined;
    //used for update
    this.views = new Array();
}

Model.prototype = {
    setMap: function(map){
        this.map = map;
        this.updateViews();
    },
    updateViews: function(){
        this.views.forEach(function(view){
            view.update();
        });
    },
    addView: function(view){
        this.views.push(view);
    }
}


// View
function BoardView(model){
    // Create the canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 500;
    canvas.height = 500;

    // members
    this.model = model;
    this.canvas = canvas;
    this.ctx = ctx;
    this.wSpacing = canvas.width/(model.rectnum+1);;
    this.hSpacing = canvas.height/(model.rectnum+1);;



    // Default
    document.querySelector("#boardView").appendChild(canvas);
}

BoardView.prototype = {
    drawBoard: function(){
        var rectnum = this.model.rectnum;
        var width = this.canvas.width;
        var height = this.canvas.height;
        var wSpacing = width/(rectnum+1);
        var hSpacing = height/(rectnum+1);
        this.ctx.strokeRect(0,0,width,height);
        // vertical lines
        for(var i=wSpacing;i<width;i += wSpacing){
            this.ctx.drawLine(i,hSpacing,i,height-hSpacing);
        }
        for(var j=hSpacing;j<height;j += hSpacing){
            this.ctx.drawLine(wSpacing,j,width-wSpacing,j);
        }
    },
    drawStone: function(x,y,color){
        switch (color){
            case 0:
                color = "black";
                break;
            case 1:
                color = "white";
                break;
            default:
                break;
        }
        var rectnum = this.model.rectnum;
        var width = this.canvas.width;
        var height = this.canvas.height;
        var wSpacing = width/(rectnum+1);
        var hSpacing = height/(rectnum+1);
        var px = wSpacing + x*wSpacing;
        var py = hSpacing + y*hSpacing;
        this.ctx.drawCircle(px,py,wSpacing/3,color);
    },
    clear:function(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    },

    update: function(){
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        this.drawBoard();
        if(this.model.map == undefined) return;
        for(var i=0;i<this.model.map.length;i++){
            for(var j=0; j<this.model.map[i].length;j++){
                var stone = this.model.map[i][j];
                if(stone==undefined)continue;
                this.drawStone(stone.x,stone.y,stone.color);
            }
        }
    },
    pixelToPlace: function(px,py){
        return {x:Math.round((px-this.wSpacing)/this.wSpacing),
                y:Math.round((py- this.hSpacing)/this.hSpacing)};
    }

}



//addEventListener();




// main (loop)

var model ;
var board ;



// Controller
var socket = io.connect(document.URL);

socket.on('connected', function(data){
    model = new Model(data);
    var board = new BoardView(model);
    model.addView(board);
    board.drawBoard();
    board.canvas.onclick = function(e){
        var boardPoint =  board.pixelToPlace(e.offsetX, e.offsetY);
        console.log("pan.play("+boardPoint.x+","+boardPoint.y+");");
        socket.emit('play',board.pixelToPlace(e.offsetX, e.offsetY));
    };
});

socket.on('update', function (data) {
    model.setMap(data);
    socket.emit('my other event', { my: 'data' });
});





