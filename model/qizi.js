/**
 * Created by zcmo on 4/7/2014.
 */


module.exports = Qizi;



function Qizi(x,y,color){
    //static constants (so call)

    this.x = x;
    this.y = y;
    this.color = color;
}


Qizi.prototype = {
    constructor : Qizi,
    toString : function(){
        color = (this.color == this._black?"black":"white");
        return "["+(this.x)+","+(this.y)+"]:"+color;
    }

}

// Static values
Qizi._black = 0;
Qizi._white = 1;
