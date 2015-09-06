var Settings = {
	system: {
		null_layer_comment: '-- null controller'
	},	

	gui: {
		images: {
			toto: 'base64'
		}
	}
};

var GuiElements = {
	
	getImage: function(key) {
		return GUIimagesPath + Settings.gui.images[key];
	},

	getImageAsObject: function(key) {
		return new Image(Settings.gui.images[key]);
	}
};

var App = {
	init: function() {
		// charger valeurs (et valeurs par defaut)
	},

	run: function() {
		App.init();
		App.load();
	},

	/**
	 *
	 */
	load: {
		Gui.load();
	}
}





// Settings.system.null_layer_comment;




// GuiElements.getImage("toto")




App.run()