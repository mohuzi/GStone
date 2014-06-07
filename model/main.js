/**
 * Created by zcmo on 4/2/2014.
 */


var Qizi = require("./qizi.js")
var Qipan = require("./qipan.js");


function MyClass () { // constructor function
    var privateVariable = "foo";

    this.publicVariable = "bar";

    this.privilegedMethod = function () {
        console.info(privateVariable);
    };
}

MyClass.prototype.publicMethod = function () {
    console.info(this.publicVariable);
    //console.info(this.privilegedMethod());

};

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;
    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }
    return arr;
}


//--------- MAIN ------------------

//MyClass.staticProperty = "baz";
//var myInstance = new MyClass();
//myInstance.publicMethod();
var arraarr = createArray(3,3);

var pan = new Qipan();
pan.paintTXT();


pan.play(1,1);
pan.play(0,1);
pan.play(5,9);
pan.play(2,1);
pan.play(5,8);
pan.play(1,0);
pan.play(5,7);
pan.play(1,2);






