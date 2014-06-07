/**
 * Created by zcmo on 4/7/2014.
 */

var Qizi = require("./qizi.js");


module.exports = Qipan;


function Qipan(){
    // constants
    this._rectnum = 10;
    this.rectnum = this._rectnum;


    //addMouseListener(new ML());
    //addMouseMotionListener(new MML());
    //setLayout(new BorderLayout() );
    //controlPanel=new ControlPanel();

    //setSize(getWidth(),size);
    //add(controlPanel,"East");

    //setSize(getWidth(),size);
    //add(controlPanel,"East");

    this.start();


}



Qipan.prototype = {
    constructor : Qipan,
    start : function(){
        this.map = createArray(this.rectnum,this.rectnum);// stone board
        this.num = 0; // number of stones
        this.currentTurn = Qizi._black;
    },
    play : function(x,y){ //mousePressed
        // condition
        if(x<0 || x >= this.rectnum || y< 0 || y >= this.rectnum || this.map[x][y]!= undefined ){
            return;
        }

        // real stuff
        this.num ++;
        var qizi = new Qizi(x,y,this.currentTurn);
        this.map[x][y] = qizi;
        if(this.currentTurn == Qizi._black){
            this.currentTurn = Qizi._white;
        }
        else this.currentTurn = Qizi._black;
        this.tizi(x,y);
        if(this.allDead(qizi).length!=0){
            this.map[x][y] = undefined;
            console.info("kill youself");
            if(this.currentTurn == Qizi._black) this.currentTurn = Qizi._white;
            else this.currentTurn = Qizi._black;
            return;
        }
        this.paintTXT();
    },
    tizi: function(x,y){
        var qizi = this.map[x][y];
        if(qizi === undefined) return;

        var color = qizi.color;
        var v = this.around(qizi);

        for(var i=0; i<v.length;i++){
            var q = v[i];
            if(q.color == color) continue;
            //remove all dead stone if it is in different color.
            var dead = this.allDead(q);
            this.removeAll(dead);
            if(dead.length!=0){
                // potentially save past stone status in here
            }
        }

    },

    // Private methods, but can't find a way to put it.

    removeAll:function(v){
       for(var i=0; i< v.length;i++){
            console.log("v is "+v);
            var q = v[i];
            this.map[q.x][q.y] = undefined;

        }
    },

    around: function(qizi){ // get top, down, left and right
        var v = [];
        var xdir = [0,0,1,-1];
        var ydir = [1,-1,0,0];
        for(var i=0; i<xdir.length;i++){
            var xl = qizi.x + xdir[i];
            var yl = qizi.y + ydir[i];
            console.log("xl:"+xl+" yl:"+yl);
            if(xl<0 || xl >= this.rectnum || yl< 0 || yl >= this.rectnum || this.map[xl][yl]== undefined ){
                 continue;
            }
            v.push(this.map[xl][yl]);
        }
        return v;
    },

    sideByBlank: function(qizi){ // empty or not
        var xdir = [0,0,1,-1];
        var ydir = [1,-1,0,0];
        for(var i=0; i<xdir.length;i++){
            var xl = qizi.x + xdir[i];
            var yl = qizi.y + ydir[i];
            if(xl<0 || xl >= this.rectnum || yl< 0 || yl >= this.rectnum   ){
                continue;
            }
            if(this.map[xl][yl] == undefined){
                return true;
            }
        }
        return false;
    },

    allDead: function(q){
        var v = new Array();
        v.push(q);
        var count = 0;
        while(true){
            var origsize = v.length;
            for(var i=count;i<origsize;i++){
                var qizi = v[i];
                if(this.sideByBlank(qizi)){
                    return new Array();
                }
                var around = this.around(qizi);
                for(var j=0;j<around.length;j++){
                    var a =  around[j];
                    if(a.color != qizi.color){
                        continue;
                    }
                    if(v.indexOf(a)<0){
                        v.push(a);
                    }
                }
            }
            if(origsize == v.length) break;
            else count = origsize;
        }
        return v;
    },
    paintTXT: function(){
        var string = "";
        string += " |0|1|2|3|4|5|6|7|8|9|\n";
        for(var i = 0; i<this.rectnum;i++){
            string += i;
            string += "|";

            for(var j=0;j<this.rectnum;j++){

                //modify to case
                if(this.map[i][j]== undefined){
                    string += " ";
                }
                else if (this.map[i][j].color == Qizi._black){
                    string += "x";
                }
                else if (this.map[i][j].color == Qizi._white){
                    string += "o";
                }
                string += "|" ;
            }
            string += "\n";
        }
        console.info(string);
    }

}

// Helper functions
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }
    return arr;
}


function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}