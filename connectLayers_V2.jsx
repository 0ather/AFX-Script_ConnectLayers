/** ============================================================
    *
    * TODO
    *
    * When script is opened in a panel, without comps/layers, then create comp + layer, doesn't refresh the variables and can't click any button
    * If new links are build, ask if he wants the same master null
    * Check is the lines are created previously
    *
*/

/** ============================================================
    *
    * VARIABLES
    * 
    * Global
    *
*/

var currentComp,
    time,
    compWidth,
    compHeight;

/*  *
    * Layers
    *
*/

var selectedFromLayer = [],
    selectedToLayer = [],
    selectedLayers = [],
    layersSize = [],
    layersPosition = [],
    newNull = [],
    newShapeLayer = [],
    nullsPosition = [],
    prevLayersPosition = [];

/*  *
    * GUI
    *
*/

var connectLayersPalette,
    selectedLayersInfoWindow,
    linkTypeState,
    layersLabels = ["None", "Red", "Yellow", "Aqua", "Pink", "Lavender", "Peach", "Sea Foam", "Blue", "Green", "Purple", "Orange", "Brown", "Fuschia", "Cyan", "Sandstone", "Dark Green"],
    GUIimagesPath = "file:///" + (new File($.fileName)).path +"/Scripts/(connectLayers_UI)",
    GUIimages = {
        imageLinkTypeFromOne: GUIimagesPath + "/linkTypeFromOne.png",
        imageLinkTypeAll: GUIimagesPath + "/linkTypeAll.png",
        imageLayerType: [
                            GUIimagesPath + "/layer_adjustmentLayer.png",
                            GUIimagesPath + "/layer_audioLayer.png",
                            GUIimagesPath + "/layer_cameraLayer.png",
                            GUIimagesPath + "/layer_guideLayer.png",
                            GUIimagesPath + "/layer_imageSequence.png",
                            GUIimagesPath + "/layer_lightLayer.png",
                            GUIimagesPath + "/layer_placeholder.png",
                            GUIimagesPath + "/layer_precomp.png",
                            GUIimagesPath + "/layer_shapeLayer.png",
                            GUIimagesPath + "/layer_solidLayer.png",
                            GUIimagesPath + "/layer_stillLayer.png",
                            GUIimagesPath + "/layer_textLayer.png",
                            GUIimagesPath + "/layer_trackmatteLayer.png",
                            GUIimagesPath + "/layer_videoLayer.png"
                        ]
    };

    
/** ============================================================
    * 
    * 
    * 
    *
*/
    
/*
 // Align Anchor Point
// MIDDLE MIDDLE
function alignAnchorMM(i) { 
    var anchorPointX = layersSize[i].left + layersSize[i].width/2 ,
            anchorPointY = layersSize[i].top + layersSize[i].height/2,
            positionX = layersPosition[i][0] - Math.abs( layersSize[i].left ) + layersSize[i].width/2,
            positionY = layersPosition[i][1] - Math.abs( layersSize[i].top ) + layersSize[i].height/2;
            
    
        selectedLayers[i].transform.anchorPoint.setValue ( [ anchorPointX , anchorPointY ] );
        selectedLayers[i].transform.position.setValue ( [ positionX , positionY ] );

        layersPosition[i] = selectedLayers[i].transform.position.value;

};*/

 
//lineFromOneToOther
function lineFromOneToOther(i) {
     
};
 
 
// Init
function init() {
app.beginUndoGroup("monApp");

    currentComp = app.project.activeItem;
    
    if (currentComp == null ) { alert("You need a composition"); }

    else {

        layersSize.length = 0,
        layersPosition.length = 0,
        nullsPosition.length = 0,
        selectedFromLayer.length = 0,
        selectedToLayer.length = 0,
        selectedLayers.length = 0,
        newNull.length = 0,
        newShapeLayer.length = 0,
        prevLayersPosition.length = 0,
        time = currentComp.time,
        compWidth = currentComp.width,
        compHeight = currentComp.height;
       
        /*for (i=0; i<selectedLayers.length; i++) {
            getLayersProperty(i);
            createNulls(i);
            createShapes(i);
                //alert(selectedLayers[i].label);
        };*/
    };

app.endUndoGroup();
};/** ============================================================
    *
    * FIND LAYER TYPE
    *
    * @param: layers to check
    *
*/

//var currentComp = app.project.activeItem;
//var selectedLayers = currentComp.selectedLayers;

var resultArray = [];

// for ( var l=0;l<selectedLayers.length;l++ ) {
// 	resultArray[l] = selectedLayers[l].index + ")" + layerType(selectedLayers[l]);
// }

// alert("Layer types :\r" + resultArray.toString().replace(new RegExp(",","g"), "\r"));



function layerType(layerObj) {
	try{
		var curLayer, instanceOfArray, result;
		function avLayerType(lObj){
			try {
				var l = lObj,
					lSource = l.source,
					lMainSource = lSource.mainSource;

				if ( !l.hasVideo ) {
					//return "AudioLayer";
					return GUIimages.imageLayerType[1];
				} else if ( lSource instanceof CompItem ) {
					//return "PreCompLayer";
					return GUIimages.imageLayerType[7];
				} else if ( lSource.frameDuration < 1 ) {
					if ( lMainSource instanceof PlaceholderSource ) {
						//return "PlaceholderVideoLayer"
						return GUIimages.imageLayerType[6];
					} else if ( lSource.name.toString().indexOf("].") != (-1) ) {
						//return "ImageSequenceLayer";
						return GUIimages.imageLayerType[4];
					} else {
						//return "VideoLayer";
						return GUIimages.imageLayerType[13];
					}
				} else if ( lSource.frameDuration == 1 ) {
					if ( lMainSource instanceof PlaceholderSource ) {
						//return "PlaceholderStillLayer";
						return GUIimages.imageLayerType[6];
					} else if ( lMainSource.color ) {
						//return "SolidLayer";
						return GUIimages.imageLayerType[9];
					} else {
						//return "StillLayer";
						return GUIimages.imageLayerType[10];
					}
				}
			} catch ( err ) { alert(err.line.toString() + "\r" + err.toString()) }
		}
		curLayer = layerObj;
		instanceOfArray = [AVLayer, CameraLayer, LightLayer, ShapeLayer, TextLayer];
		for (var a=0; a<instanceOfArray.length;a++) {
			if ( curLayer.guideLayer ) {
				//return "GuideLayer";
				return GUIimages.imageLayerType[3];
			} else if ( curLayer.isTrackMatte ) {
				//return "TrackMatteLayer";
				return GUIimages.imageLayerType[12];
			} else if ( curLayer.adjustmentLayer ) {
				//return "AdjustmentLayer";
				return GUIimages.imageLayerType[0];
			} else if ( curLayer instanceof instanceOfArray[a] ) {
				result = instanceOfArray[a].name;
				//alert(result);
				if ( result=="CameraLayer" ) {
					return GUIimages.imageLayerType[2];
				} else if ( result=="LightLayer" ) {
					return GUIimages.imageLayerType[5];
				} else if ( result=="ShapeLayer" ) {
					return GUIimages.imageLayerType[8];
				} else if ( result=="TextLayer" ) {
					return GUIimages.imageLayerType[11];
				}
				break;
			}
		}
		if ( result == "AVLayer" ) {
			result = avLayerType(curLayer);
		}
		return result;
	} catch ( err ) { alert(err.line.toString() + "\r" + err.toString()) }
}/** ============================================================
    *
    * GUI
    *
    ============================================================
    *
    * WINDOW SELECTED LAYERS INFOS
    * Display in a window the names of the selected layers
    *
    * @param: window content, item in array
    * @return: window info selected layers
    *
*/

function funcSelectedLayersInfoWindow(content) {
    // Create Window Object
    selectedLayersInfoWindow = new Window ("window", "titre seconde palette", undefined, {resizeable:true});
    selectedLayersInfoWindow.maximumSize.height = 300;

    // Window main title
    var mainTitle = selectedLayersInfoWindow.add ('statictext', undefined, 'Selected layers list');

    // Window content panel
    var mainPanel = selectedLayersInfoWindow.add ('panel {alignChildren: "left"}');
    var contentGroup = mainPanel.add ('group {orientation: "column"}');

    // Create content (layer name and his image)
    for (var i = 0; i<content.length; i++) {
        var layerTypeImage = layerType(content[i]);

        // Line group
        var lineGroup = contentGroup.add ('group {alignment: "left", orientation: "row"}')
        lineGroup.add ('image', undefined, File(layerTypeImage));
        lineGroup.add ('statictext', undefined, content[i].name);

        //Fix content position when scrolling to the top
        if ( i==0 ) {
            lineGroup.margins.top = 10;
        }
    }

    var scrollbar = mainPanel.add ('scrollbar {stepdelta: 2}');
    scrollbar.visible = false;

    //Move the contentGroup with scrolling
    scrollbar.onChanging = function() {
        contentGroup.location.y = -1 * this.value;
    }

    //Position gui elements
    selectedLayersInfoWindow.onShow = function() {
        mainPanel.size.height = selectedLayersInfoWindow.size.height-60;

        //If more than 9 items in content, show scrollbar
        if ( content.length > 9 ) {
            //Check characters number for each items and resizing the window if needed
            for ( var j=0; j<content.length; j++ ) {
                if ( content[j].name.length > 14 ) {
                    selectedLayersInfoWindow.size.width += 20;
                    mainPanel.size.width += 20;
                    contentGroup.size.width += 20;
                }
            }
            //Scrollbar visibility and size
            scrollbar.visible = true;
            scrollbar.size.height = selectedLayersInfoWindow.size.height-80;
            scrollbar.size.width = 16;
            scrollbar.location = [mainPanel.size.width-30, 8];
            scrollbar.maxvalue = contentGroup.size.height - mainPanel.size.height + 15;

            //Fix content position when scrolling to the top
            contentGroup.location.y -= 10;
        }
    }

    selectedLayersInfoWindow.layout.layout(true);
    selectedLayersInfoWindow.minimumSize = selectedLayersInfoWindow.size;

    return selectedLayersInfoWindow;
};

/**
    *
    * WINDOW SCRIPT PALETTE
    * Display the script as a palette and a panel
    *
*/

function connectLayersGUI(thisObj){
    function connectLayersGUI_buildUI(thisObj){
        connectLayersPalette = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Connect Layers", undefined, {resizeable:true});
        
        scriptGUI = "linkTypePanel: Panel{text:'Link type', orientation:'row',\
                                linkTypeFromOne: IconButton{text:'linkTypeFromOne', helpTip:'Create lines from one object', image:'"+GUIimages.imageLinkTypeFromOne+"'},\
                                linkTypeAll: IconButton{text:'linkTypeAll', helpTip:'Create lines from all objects', image:'"+GUIimages.imageLinkTypeAll+"'},\
                        },\
                        selectLayersPanel: Panel{text:'', orientation:'column',\
                                fromPanel: Panel{text:'Connect FROM',\
                                        fromGroup1: Group{text:'', orientation:'row',\
                                                fromSelectedButton: Button{text:'Selected Layer'},\
                                                orText: StaticText{text:'OR'},\
                                                fromColorsList: DropDownList{properties:{items:['']}, size:[100, 25]},\
                                        },\
                                        fromGroup2: Group{text:'', orientation:'row',\
                                                fromFeedback: StaticText{text:'', characters:12},\
                                                fromFeedbackInfos: Button{text:'?', size:[15,15]},\
                                                fromRemove: Button{text:'x', size:[15,15]},\
                                        },\
                                },\
                                toPanel: Panel{text:'Connect TO',\
                                        toGroup1: Group{text:'', orientation:'row',\
                                                toSelectedButton: Button{text:'Selected Layer'},\
                                                orText2: StaticText{text:'OR'},\
                                                toColorsList: DropDownList{properties:{items:['']}, size:[100, 25]},\
                                        },\
                                        toGroup2: Group{text:'', orientation:'row', alignment:['center', 'center'], alignChildren:['center', 'center'],\
                                                toFeedback: StaticText{text:'', characters:14},\
                                                toFeedbackInfos: Button{text:'?', size:[15,15]},\
                                                toRemove: Button{text:'x', size:[15,15]},\
                                        },\
                                },\
                        },\
                        buildGroup: Group{text:'', orientation:'column',\
                                advancedGroup: Group{text:'', orientation:'row',\
                                        hideNullCheckbox: Checkbox{text:'Hide Null layers', value:1},\
                                        hideLayersCheckbox: Checkbox{text:'Hide layers', value:0},\
                                },\
                                buildButton: Button{text:'Build connections', name:'ok'},\
                        }";

        connectLayersPalette = connectLayersPalette.add(scriptGUI);

      //--------------------
      //GENERAL SETTINGS
        
      //First hide connections panels
        connectLayersPalette.selectLayersPanel.visible=false;
        connectLayersPalette.selectLayersPanel.fromPanel.fromGroup2.visible=false;
        connectLayersPalette.selectLayersPanel.toPanel.toGroup2.visible=false;
        connectLayersPalette.buildGroup.visible=false;
    
    //Setup panel sizing
        connectLayersPalette.layout.layout(true);
        connectLayersPalette.minimumSize = connectLayersPalette.grp.size;
        
    //Make panel resizeable
        //connectLayersPalette.layout.resize();
        //connectLayersPalette.onResizing = connectLayersPalette.onResize = function(){this.layout.resize()};
        
        return connectLayersPalette;
    }
    var connectLayersGUIPal = connectLayersGUI_buildUI (thisObj);
    
    if  (connectLayersGUIPal != null && connectLayersGUIPal instanceof Window){
        connectLayersGUIPal.center();
        connectLayersGUIPal.show();
    }
}


// Show connectLayersGUI
connectLayersGUI(this);
/** ============================================================
    *
    * GUI buttons interaction
    *
    ============================================================
    *
    * CLICK LINK TYPE PANEL
    *
    * 01 - Links from one layer to others
    * 02 - Links all layers
    *
*/

function clickButtonsLinkTypeGUI() {  
    //01
        connectLayersPalette.grp.linkTypePanel.linkTypeFromOne.onClick = function() {
            linkTypeState = 0;

            connectLayersPalette.grp.selectLayersPanel.visible=true;
            connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup2.visible=false;
            connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup2.visible=false;

            clickLinkTypeFromOne();
        }
    //02
        connectLayersPalette.grp.linkTypePanel.linkTypeAll.onClick = function() {
            linkTypeState = 1;

            //connectLayersPalette.grp.selectLayersPanel.visible=true;
        }
}

/**
    *
    * CLICK LINK TYPE FROM ONE
    * Actions for link type from one (layer selection panel)
    *
*/

function clickLinkTypeFromOne() {
    init();
    //SELECT LAYERS PANEL

        //Add labels to dropdown ColorsList
        for (k=0;k<layersLabels.length;k++) {
            //FROM
            connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup1.fromColorsList.add("item", layersLabels[k]);
            connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup1.fromColorsList.items[k+1].image = GUIimagesPath + "/label"+(k+1)+".png";
            //TO
            connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup1.toColorsList.add("item", layersLabels[k]);
            connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup1.toColorsList.items[k+1].image = GUIimagesPath + "/label"+(k+1)+".png";
        }

        //Click fromSelectedButton
        connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup1.fromSelectedButton.onClick = function() {
            if ( currentComp.selectedLayers.length==0 || currentComp.selectedLayers.length>1 ) {
                alert("Select one layer");
            } else {
                connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup1.fromColorsList.selection = 0;
                selectedFromLayer = currentComp.selectedLayers;

                connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup2.fromFeedback.text = selectedFromLayer.length+" selected layer";
                connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup2.visible = true;

                clickBuildButton();
            }
        }

        //Click toSelectedButton
        connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup1.toSelectedButton.onClick = function() {
            if ( currentComp.selectedLayers.length==0 ) {
                alert("Select one layer");
            } else {
                connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup1.toColorsList.selection = 0;
                selectedToLayer = currentComp.selectedLayers;

                connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup2.toFeedback.text = currentComp.selectedLayers.length==1 ? selectedToLayer.length+" selected layer" : selectedToLayer.length+" selected layers";
                connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup2.visible = true;

                clickBuildButton();
            }
        }
    
        //Choose fromColorsList
        connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup1.fromColorsList.onChange = function() {
            //Reset array
            selectedFromLayer.length = 0;

            //If no labels
            if ( connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup1.fromColorsList.selection.index == 0 ) {
                selectedFromLayer.length = 0;
                connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup2.fromFeedback.text = "0 selected layers";
            } else {
                //Find layers with this label
                for (a=1; a<currentComp.layers.length+1; a++) {
                    if (selectedFromLayer.length > 1) {
                        alert("There are more than 1 layer with this label");
                        connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup2.fromFeedback.text = "0 selected layers";
                        break;
                    } else if ( currentComp.layer(a).label+1 == connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup1.fromColorsList.selection.index ) {
                        selectedFromLayer.push(currentComp.layer(a));
                        connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup2.fromFeedback.text = selectedFromLayer.length+" selected layer";
                        connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup2.visible = true;

                        clickBuildButton();
                    }
                }
                if (selectedFromLayer.length == 0) {
                    alert("There are no layers with this label");
                    connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup1.fromColorsList.selection = 0;
                    connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup2.fromFeedback.text = "0 selected layers";
                }
            }
        }
    
        //Choose toColorsList
        connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup1.toColorsList.onChange = function() {
            //Reset array
            selectedToLayer.length = 0;

            //If no labels
            if ( connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup1.toColorsList.selection.index == 0 ) {
                selectedToLayer.length = 0;
                connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup2.toFeedback.text = "0 selected layers";
            } else {
                //Find layers with this label
                for (b=1; b<currentComp.layers.length+1; b++) {
                    if ( currentComp.layer(b).label+1 == connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup1.toColorsList.selection.index ) {
                        selectedToLayer.push(currentComp.layer(b));
                        connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup2.toFeedback.text = selectedToLayer.length==1 ? selectedToLayer.length+" selected layer" : selectedToLayer.length+" selected layers";
                        connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup2.visible = true;

                        clickBuildButton();
                    }
                }
                if (selectedToLayer.length == 0) {
                    alert("There are no layers with this label");
                    connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup1.toColorsList.selection = 0;
                    connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup2.toFeedback.text = "0 selected layers";
                }
            }
        }
    
        //Click fromFeedbackInfos
        connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup2.fromFeedbackInfos.onClick = function() {
           var win = funcSelectedLayersInfoWindow(selectedFromLayer);
           win.show();
        }

        //Click toFeedbackInfos
        connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup2.toFeedbackInfos.onClick = function() {
            var win = funcSelectedLayersInfoWindow(selectedToLayer);
            win.show();
        }

        //Click fromRemove
        connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup2.fromRemove.onClick = function() {
            selectedFromLayer.length = 0;
            connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup1.fromColorsList.selection = 0;
            connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup2.fromFeedback.text = "0 selected layer";
            connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup2.visible = false;
        }

        //Click toRemove
        connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup2.toRemove.onClick = function() {
            selectedToLayer.length = 0;
            connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup1.toColorsList.selection = 0;
            connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup2.toFeedback.text = "0 selected layer";
            connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup2.visible = false;
        }
}


/**
    *
    * CLICK BUILD BUTTON
    * Do it!
    *
*/

function clickBuildButton() {
    app.beginUndoGroup("monApp2");
    //Click Link Type 01
    if ( linkTypeState == 0 && ( selectedFromLayer.length == 1 && selectedToLayer.length > 0 ) ) {
        connectLayersPalette.grp.buildGroup.visible=true;
        connectLayersPalette.grp.buildGroup.buildButton.onClick = function() {
            //alert("Build!");
            initDraw("linkTypeFromOne");
        }
    } else if ( linkTypeState == 1 ) {

    }
    app.endUndoGroup();
}


// Init clicks GUI
clickButtonsLinkTypeGUI();/** ============================================================
    *
    * CONNECT LAYERS
    *
    ============================================================
    *
    * GET LAYERS SIZE, LAYERS POSITION AND LAYERS ANCHOR
    * For a later use (positioning the nulls, start and end of line path)
    *
    * @param: loop variable
    *
*/

function getLayersProperty(i) {
    layersSize[i] = selectedLayers[i].sourceRectAtTime(time, false);
    layersPosition[i] = selectedLayers[i].transform.position.value;
 }


/**
    *
    * CREATE NULL OBJECTS
    * Create a null object at the middle of layers
    *
    * @param: loop variable
    * @param: overwrite existing parent null
    *
*/

function createNulls(i, overwriteNull) {
    // Find layer location
    //
    //       TL | TR
    //      ____|____
    //          |
    //       BL | BR
    
    if ( layersSize[i].top < 0 && layersSize[i].left < 0 )                  // Location: TOP-LEFT
    {                          
        var positionX = layersPosition[i][0] - Math.abs( layersSize[i].left ) + layersSize[i].width/2,
            positionY = layersPosition[i][1] - Math.abs( layersSize[i].top ) + layersSize[i].height/2;

    } else if ( layersSize[i].top < 0 && layersSize[i].left > 0 )           // Location: TOP-RIGHT
    {               
        var positionX = layersPosition[i][0] + Math.abs( layersSize[i].left ) + layersSize[i].width/2,
            positionY = layersPosition[i][1] - Math.abs( layersSize[i].top ) + layersSize[i].height/2;

    } else if ( layersSize[i].top > 0 && layersSize[i].left < 0 )           // Location: BOTTOM-LEFT
    {               
        var positionX = layersPosition[i][0] - Math.abs( layersSize[i].left ) + layersSize[i].width/2,
            positionY = layersPosition[i][1] + Math.abs( layersSize[i].top ) + layersSize[i].height/2;

    } else                                                                  // Location: BOTTOM-RIGHT
    {
        var positionX = layersPosition[i][0] + Math.abs( layersSize[i].left ) + layersSize[i].width/2,
            positionY = layersPosition[i][1] + Math.abs( layersSize[i].top ) + layersSize[i].height/2;

    };

    // Create Null Layer
    newNull[i] = currentComp.layers.addNull();

    // Give a Name
    newNull[i].name = "Null-"+selectedLayers[i].name;

    // Give a Label (color)
    newNull[i].label = selectedLayers[i].label;

    // Give a comment
    newNull[i].comment = "-- null layer controler";

    // Position: anchor point middle aligned
    newNull[i].transform.position.setValue ( [ positionX , positionY ] );

    if ( overwriteNull == true ) {
        // Parent the shape to the null: for later mouvements
        selectedLayers[i].parent = newNull[i];
    } else {
        newNull[i].parent = selectedLayers[i].parent;
    }

    // Store Nulls position: for later shapes position
    nullsPosition[i] = newNull[i].transform.position.value;
}


/**
    *
    * CREATE SHAPES
    * Create a shape path from one object to the other
    *
    * @param: loop variable
    *
*/

function createShapesFromOne(i) {
    // Start Point for the Path: middle of comp = anchor point
    var pathBeginX = 0,
        pathBeginY = 0;
    
    // Create Shape Layer
    newShapeLayer[i] = currentComp.layers.addShape();
    // Give a Name
    newShapeLayer[i].name = "Line-"+i;
    // Give a Label (color)
    newShapeLayer[i].label = selectedLayers[i].label;
    // Position: anchor point on First Null = from layer
    newShapeLayer[i].transform.position.setValue([ nullsPosition[0][0] , nullsPosition[0][1] ]);

    // Set Path Layer
    var shapeLayerContents = newShapeLayer[i].property("ADBE Root Vectors Group");
    var shapePathGroup = shapeLayerContents.addProperty("ADBE Vector Shape - Group");
    var shapePath = shapePathGroup.property("ADBE Vector Shape");
    // Draw vertices for the path
    var shapePathData = new Shape();
    shapePathData.vertices = [[pathBeginX ,pathBeginY], [pathBeginX+100 ,pathBeginY]];
    shapePath.setValue(shapePathData);
    // Settings for the path
    newShapeLayer[i].property("Contents").addProperty("ADBE Vector Graphic - Stroke").property("Color").setValue([1, 1, 1]);
    newShapeLayer[i].property("Contents").property("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Width").setValue(10);
}


/**
    *
    * CREATE EXPRESSIONS
    * Create expressions on path to set the x scale, rotation and position
    *
    * @param: loop variable
    *
*/

function expressionShapesFromOne(i) {
    //Expression on x scale (length of line)
    newShapeLayer[i].transform.scale.expression =
        'var startPoint = thisComp.layer("'+newNull[0].name+'").transform.position;\
var endPoint = thisComp.layer("'+newNull[i+1].name+'").transform.position;\
var length = length(startPoint, endPoint);\
\
[length, 100];';

    //Expression on position (parent the line to the main null)
    newShapeLayer[i].transform.position.expression =
        'thisComp.layer("'+newNull[0].name+'").transform.position;';

    //Expression on rotation (to face the null destination)
    newShapeLayer[i].transform.rotation.expression =
    'var startX = thisComp.layer("'+newNull[0].name+'").transform.position[0];\
var startY = thisComp.layer("'+newNull[0].name+'").transform.position[1];\
var endX = thisComp.layer("'+newNull[i+1].name+'").transform.position[0];\
var endY = thisComp.layer("'+newNull[i+1].name+'").transform.position[1];\
var deltaX = endX - startX;\
var deltaY = endY - startY;\
\
Math.atan2(deltaY, deltaX) * 180 / Math.PI;';
}


/**
    *
    * CREATE MASTER NULL
    * Master Null to control stroke width and color
    *
    * @param: use existing master null
    * @param: existing null index
    *
*/

function masterNull(useExistingMasterNull, id) {
    if ( useExistingMasterNull == true ) {
        var masterNull = currentComp.layer(id);

        // Link controls
        for ( var i = 0; i<newShapeLayer.length; i++ ) {
            newShapeLayer[i].property("Contents").property("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Width").expression =
            'thisComp.layer("'+masterNull.name+'").effect("'+masterNull.Effects(1).name+'")("Slider")';
            newShapeLayer[i].property("Contents").property("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Color").expression =
            'thisComp.layer("'+masterNull.name+'").effect("'+masterNull.Effects(2).name+'")("Color")';
        }
    } else {
        // Create Null Layer
        var newMasterNull = currentComp.layers.addNull();
        // Give a Name
        newMasterNull.name = "MASTER-Null";
        // Give a Label (color)
        newMasterNull.label = 2;
        // Give a comment
        newMasterNull.comment = "MASTER CONTROL - Change stroke width and color";

        // Add controls
        newMasterNull.Effects.addProperty("ADBE Slider Control");
        newMasterNull.Effects.addProperty("ADBE Color Control");
        newMasterNull.Effects(1).name = "Stroke Width";
        newMasterNull.Effects(1)(1).setValue(10);
        newMasterNull.Effects(2).name = "Stroke Color";
        newMasterNull.Effects(2)(1).setValue([1,1,1,1]);

        // Link controls
        for ( var i = 0; i<newShapeLayer.length; i++ ) {
            newShapeLayer[i].property("Contents").property("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Width").expression =
            'thisComp.layer("'+newMasterNull.name+'").effect("'+newMasterNull.Effects(1).name+'")("Slider")';
            newShapeLayer[i].property("Contents").property("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Color").expression =
            'thisComp.layer("'+newMasterNull.name+'").effect("'+newMasterNull.Effects(2).name+'")("Color")';
        }
    }
}

/**
    *
    * HIDE LAYERS
    *
*/

function checkboxesHide() {
    // Hide nulls ?
    if ( connectLayersPalette.grp.buildGroup.advancedGroup.hideNullCheckbox.value == 1 ) {
        for ( var i = 0; i < newNull.length; i++ ) {
            newNull[i].shy = 1;
        }
        currentComp.hideShyLayers = 1;
    }

    // Hide layers ?
    if ( connectLayersPalette.grp.buildGroup.advancedGroup.hideLayersCheckbox.value == 1 ) {
        for ( var i = 0; i < selectedLayers.length; i++ ) {
            selectedLayers[i].shy = 1;
        }
        currentComp.hideShyLayers = 1;
    }
}


/**
    *
    * INITIALIZE DRAWING LINES
    *
*/

function initDraw(type) {
    // Concat selectedFromLayer and selectedToLayer into one array
    selectedLayers = selectedFromLayer.concat(selectedToLayer);

    // If user has built lines, we need to check if we are not creating the same lines
    // if ( prevLayersPosition.length > 0 ) {
    //     for ( var a = 0; a < selectedLayers.length; a++ ) {
    //         for ( var b = 0; b < prevLayersPosition.length; b++ ) {
                
    //         }
    //     }
    // }

    // Actions for link type from one layer
    if ( type == "linkTypeFromOne" ) {
        alert("click build and launch init");

        for ( var a = 0; a < selectedLayers.length; a++ ) {
            alert(selectedLayers[a].name);
        }
        if ( prevLayersPosition.length > 0 ) {
            for ( var b = 0; b < prevLayersPosition.length; b++ ) {
                alert(prevLayersPosition[b].name);
            }
        }

        /**
         *
         * First loop to get layers property (size and position)
         *
         */

        for ( var i=0; i<selectedLayers.length; i++ ) {
            getLayersProperty(i);
        }




        /**
         *
         * Second loop for nulls creation
         *
         */

        // Check if null was created previously
        for ( var i=0; i<selectedLayers.length; i++ ) {
            // If no parent, user didn't create one and he never used the script
            if ( selectedLayers[i].parent == null ) {
                createNulls(i, true);
            }
            // If one parent, check if created by script
            else if ( selectedLayers[i].parent.comment == "-- null layer controler" ) {
                continue;
            }
            // If one parent but created by user
            else {
                if ( confirm(selectedLayers[j].name + "is already linked to a null layer ("+selectedLayers[i].parent+"). Do you want to overwrite it?") == true ) {
                    createNulls(i, true);
                } else {
                    createNulls(i, false);
                }
            }
        }


        /**
         *
         * Third loop for shapes creation
         *
         */





         // At the end of the loop, check if the line is already created
        if ( prevLayersPosition.length > 0) {
            // Check if same FROM layer (by name and by index)
            if ( selectedLayers[0].name == prevLayersPosition[0].name && selectedLayers[0].index == prevLayersPosition[0].index ) {
                for ( var j = 1; j < selectedLayers.length; j++ ) {
                    for ( var k = 1; k < prevLayersPosition.length; k++ ) {
                        if ( selectedLayers[j].name == prevLayersPosition[k].name ) {
                            alert("same layers detected : selected layer = "+selectedLayers[j].name+"  and prev layer = "+prevLayersPosition[k].name);
                            prevLayersPosition = selectedLayers;
                        }
                    }
                }
            }
        } else {
            prevLayersPosition = selectedLayers;

            for ( var i = 0; i < selectedLayers.length - 1; i++ ) {
                createShapesFromOne(i);
                expressionShapesFromOne(i);
            }
        }








        checkboxesHide();

        /**
         *
         * Fourth loop for master null
         *
         */

        // Check if MASTER NULL was created previously
        for ( var i = 1; i < currentComp.layers.length+1; i++ ) {
            // If yes, ask confirm for overwriting the master null
            if ( currentComp.layer(i).comment == "MASTER CONTROL - Change stroke width and color" ) {
                if ( confirm("A Master Null is in your composition. Do you want to use the same settings for your new lines?") == true ) {
                    masterNull(true, currentComp.layer(i).index);
                    break;
                } else {
                    masterNull(false, 0);
                    break;
                }
            }
            // If no, create masterNull
            else if ( i == currentComp.layers.length ) {
                masterNull(false, 0);
                break;
            }
        }
    }
}
