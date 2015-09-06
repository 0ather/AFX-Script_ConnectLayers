var Garage = function(name) {
    var _name = name;
    var _cars = {};
    
    this.name = function() {
        return _name;
    }
    
    this.addCar = function(car) {
        _cars[car.name()] = car;
        
        return this;
    }
    
    this.cars = function() {
        return _cars;
    }
    
    this.containThisCar = function(car) {
        for (var i = 0; i < _cars.length; i++) {
            if (_cars[i] === car) {
                return true;
            }
        }
        return false;
    }
}
// ------------------------------------------------------
var Car = function(name, color) {
    var _name  = name;
    var _color = color;
    
    this.name = function() {
        return _name;
    }
    
    this.color = function() {
        return _color;
    }
    
    this.hasSameColorThan = function(otherCar) {
        return _color == otherCar.color();
    }
}
// ------------------------------------------------------

var Util = {
    createNullLayer: function(parms) {
        var layer = new Layer();
        
        // lalalalal
        
        return layer;
    }
};




// ------

var App = {
    run: function() {
        var myGarage = new Garage('super garage');
        var myGarage2 = new Garage('super garage 2');
        var p307 = new Car('Peugeot 307', 'blue');
        var R5 = new Car('Renault 5', 'red');

        myGarage.addCar(p307);
        myGarage.addCar(R5);

        myGarage2.addCar(p307);

        console.log('Cars in myGarage', myGarage.cars());
        console.log('Does p307 has same color than R5?', p307.hasSameColorThan(R5));
        console.log('Does myGarage contain R5?', myGarage.containThisCar(R5));
        console.log('Does myGarage2 contain R5?', myGarage2.containThisCar(R5));
    }
}

// ------------------------------------------------------


//App.run();













/**
  * GUI OBJECT
  *
  * @param: variable name of window
  * @param: title of the window
  * @param: type of window (palette, dialog, window)
  * @param: resizeable (true, false)
  *
  */

var GUI = function(title, type, resize) {
    // Variable protection
    var _title = title,
        _type = type,
        _resize = resize,
        _window;

    function panelGUI(thisObj) {
        return (thisObj instanceof Panel) ? thisObj : new Window(_type, _title, undefined, {resizeable:_resize});
    }

    function scriptGUI(thisObj) {
        _window = panelGUI(thisObj);
    
        if  (_window != null && _window instanceof Window){
            _window.center();
            _window.show();
        }
    }

    this.show = function() {
      scriptGUI(this);
    }
}

var MainWindow = function() {
    var _gui;

    this.load = function() {
        _gui = new GUI('Script Palette', 'palette', true);
        _gui.show();
    }
}


var App = function(settings) {

    var _settings = settings || {},
        _windows = {};

    this.run = function() {
        var mainWindow = new MainWindow();
        mainWindow.load();

        _windows.push(mainWindow);
    }
}


/** main.js **/
var app = new App({
    size: [100, 100]
});
app.run();
