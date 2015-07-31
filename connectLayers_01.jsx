// Variables
var currentComp,
        time,
        compWidth,
        compHeight,
        selectedFromLayer,
        selectedToLayers,
        layersSize = [],
        layersPosition = [],
        nullsPosition = [],
        myPanel,
        layersLabels = ["None", "Red", "Yellow", "Aqua", "Pink", "Lavender", "Peach", "Sea Foam", "Blue", "Green", "Purple", "Orange", "Brown", "Fuschia", "Cyan", "Sandstone", "Dark Green"],
        GUIimagesPath = "file:///" + (new File($.fileName)).path,
        GUIimages = {
            imageLinkTypeFromOne: GUIimagesPath + "/linkTypeFromOne.png",
            imageLinkTypeAll: GUIimagesPath + "/linkTypeAll.png",
            imageLabels: [GUIimagesPath + "/label01.png", ]
        };

 // Layers Size, Layers Position, Layers Anchor Position
function getLayersProperty(i) {
         layersSize[i] = selectedLayers[i].sourceRectAtTime(time, false);
         layersPosition[i] = selectedLayers[i].transform.position.value;
 };

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

};

//Create Nulls
function createNulls(i) {
    if ( layersSize[i].top < 0 && layersSize[i].left < 0 ) {                          // Location: TOP-LEFT
        var positionX = layersPosition[i][0] - Math.abs( layersSize[i].left ) + layersSize[i].width/2,
                positionY = layersPosition[i][1] - Math.abs( layersSize[i].top ) + layersSize[i].height/2;
    } else if ( layersSize[i].top < 0 && layersSize[i].left > 0 ) {               // Location: TOP-RIGHT
        var positionX = layersPosition[i][0] + Math.abs( layersSize[i].left ) + layersSize[i].width/2,
                positionY = layersPosition[i][1] - Math.abs( layersSize[i].top ) + layersSize[i].height/2;
    } else if ( layersSize[i].top > 0 && layersSize[i].left < 0 ) {               // Location: BOTTOM-LEFT
        var positionX = layersPosition[i][0] - Math.abs( layersSize[i].left ) + layersSize[i].width/2,
                positionY = layersPosition[i][1] + Math.abs( layersSize[i].top ) + layersSize[i].height/2;
    } else {                                                                                            // Location: BOTTOM-RIGHT
        var positionX = layersPosition[i][0] + Math.abs( layersSize[i].left ) + layersSize[i].width/2,
                positionY = layersPosition[i][1] + Math.abs( layersSize[i].top ) + layersSize[i].height/2;
    };

    // Create Null Layer
    var newNull = currentComp.layers.addNull();
    // Give a Name
    newNull.name = "Null-"+selectedLayers[i].name;
    // Give a Label (color)
    newNull.label = selectedLayers[i].label;
    // Position: anchor point middle aligned
    newNull.transform.position.setValue ( [ positionX , positionY ] );
    // Parent the shape to the null: for later mouvements
    selectedLayers[i].parent = newNull;
    // Store Nulls position: for later shapes position
    nullsPosition[i] = newNull.transform.position.value;
};

//Create Shapes
function createShapes(i) {
    // Start Point for the Path: nulls position
    var pathBeginX = nullsPosition[i][0] - compWidth/2;
    var pathBeginY = nullsPosition[i][1] - compHeight/2;
    
    // Create Shape Layer
    var newShapeLayer = currentComp.layers.addShape();
    // Give a Name
    newShapeLayer.name = "Line-"+i;
    // Give a Label (color)
    newShapeLayer.label = selectedLayers[i].label;
    // Position: anchor point on Null
    newShapeLayer.transform.anchorPoint.setValue([ -selectedLayers[i].transform.position.value[0] , -selectedLayers[i].transform.position.value[1] ]);
    newShapeLayer.transform.position.setValue([ nullsPosition[i][0] , nullsPosition[i][1] ]);

    // Set Path Layer
    var shapeLayerContents = newShapeLayer.property("ADBE Root Vectors Group");
    var shapePathGroup = shapeLayerContents.addProperty("ADBE Vector Shape - Group");
    var shapePath = shapePathGroup.property("ADBE Vector Shape");
    // Draw vertices for the path
    var shapePathData = new Shape();
    shapePathData.vertices = [[pathBeginX ,pathBeginY], [pathBeginX+300 ,pathBeginY]];
    shapePath.setValue(shapePathData);
    // Settings for the path
    newShapeLayer.property("Contents").addProperty("ADBE Vector Graphic - Stroke").property("Color").setValue([1, 1, 1]);
    newShapeLayer.property("Contents").property("ADBE Vector Graphic - Stroke").property("ADBE Vector Stroke Width").setValue(10);
};
 
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
};

// --------------------
// UI

function clickLinkTypeFromOne() {
    init();
    //SELECT LAYERS PANEL
        
        //Add labels to dropdown ColorsList
        for (k=0;k<layersLabels.length;k++) {
            //FROM
            myPanel.grp.selectLayersPanel.fromPanel.fromGroup1.fromColorsList.add("item", layersLabels[k]);
            myPanel.grp.selectLayersPanel.fromPanel.fromGroup1.fromColorsList.items[k+1].image = GUIimagesPath + "/label"+(k+1)+".png";
            //TO
            myPanel.grp.selectLayersPanel.toPanel.toGroup1.toColorsList.add("item", layersLabels[k]);
            myPanel.grp.selectLayersPanel.toPanel.toGroup1.toColorsList.items[k+1].image = GUIimagesPath + "/label"+(k+1)+".png";
        };
    
        //Click fromSelectedButton
        myPanel.grp.selectLayersPanel.fromPanel.fromGroup1.fromSelectedButton.onClick = function() {
            if ( currentComp.selectedLayers.length==0 || currentComp.selectedLayers.length>1 ) {
                alert("Select one layer");
            } else {
                myPanel.grp.selectLayersPanel.fromPanel.fromGroup1.fromColorsList.selection = 0;
                selectedFromLayer = currentComp.selectedLayers;
                myPanel.grp.selectLayersPanel.fromPanel.fromGroup2.fromFeedback.text = selectedFromLayer.length+" selected layer";
            };
        };

        //Click toSelectedButton
        myPanel.grp.selectLayersPanel.toPanel.toGroup1.toSelectedButton.onClick = function() {
            if ( currentComp.selectedLayers.length==0 ) {
                alert("Select one layer");
            } else {
                myPanel.grp.selectLayersPanel.toPanel.toGroup1.toColorsList.selection = 0;
                selectedToLayer = currentComp.selectedLayers;
                myPanel.grp.selectLayersPanel.toPanel.toGroup2.toFeedback.text = currentComp.selectedLayers.length==1 ? selectedToLayer.length+" selected layer" : selectedToLayer.length+" selected layers";
            };
        };
    
        //Choose fromColorsList
        myPanel.grp.selectLayersPanel.fromPanel.fromGroup1.fromColorsList.onChange = function() {
            //Reset array
            selectedFromLayer.length = 0;

            //If no labels
            if ( myPanel.grp.selectLayersPanel.fromPanel.fromGroup1.fromColorsList.selection.index == 0 ) {
                selectedFromLayer.length = 0;
                myPanel.grp.selectLayersPanel.fromPanel.fromGroup2.fromFeedback.text = "0 selected layers";
                myPanel.grp.selectLayersPanel.fromPanel.fromGroup2.fromFeedback.text.characters = 20;
            } else {
                //Find layers with this label
                for (a=1; a<currentComp.layers.length+1; a++) {
                    if (selectedFromLayer.length > 1) {
                        alert("There are more than 1 layer with this label");
                        myPanel.grp.selectLayersPanel.fromPanel.fromGroup2.fromFeedback.text = "0 selected layers";
                        break;
                    } else if ( currentComp.layer(a).label+1 == myPanel.grp.selectLayersPanel.fromPanel.fromGroup1.fromColorsList.selection.index ) {
                        selectedFromLayer.push(currentComp.layer(a));
                        myPanel.grp.selectLayersPanel.fromPanel.fromGroup2.fromFeedback.text = selectedFromLayer.length+" selected layer";                      
                    };
                };
                if (selectedFromLayer.length == 0) {
                    alert("There are no layers with this label");
                    myPanel.grp.selectLayersPanel.fromPanel.fromGroup2.fromFeedback.text = "0 selected layers";
                };
            };
        };
    
        //Choose toColorsList
        myPanel.grp.selectLayersPanel.toPanel.toGroup1.toColorsList.onChange = function() {
            //Reset array
            selectedToLayer.length = 0;

            //If no labels
            if ( myPanel.grp.selectLayersPanel.toPanel.toGroup1.toColorsList.selection.index == 0 ) {
                selectedToLayer.length = 0;
                myPanel.grp.selectLayersPanel.toPanel.toGroup2.toFeedback.text = "0 selected layers";
            } else {
                //Find layers with this label
                for (b=1; b<currentComp.layers.length+1; b++) {
                    if ( currentComp.layer(b).label+1 == myPanel.grp.selectLayersPanel.toPanel.toGroup1.toColorsList.selection.index ) {
                        selectedToLayer.push(currentComp.layer(b));
                        myPanel.grp.selectLayersPanel.toPanel.toGroup2.toFeedback.text = selectedToLayer.length==1 ? selectedToLayer.length+" selected layer" : selectedToLayer.length+" selected layers";
                    };
                };
                if (selectedToLayer.length == 0) {
                    alert("There are no layers with this label");
                    myPanel.grp.selectLayersPanel.toPanel.toGroup2.toFeedback.text = "0 selected layers";
                };
            };
        };
};

function myScript(thisObj){
    function myScript_buildUI(thisObj){
        myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "My window name", undefined, {resizeable:true});
        
        res = "group{orientation:'column',\
                        linkTypePanel: Panel{text:'Link type', orientation:'row',\
                                linkTypeFromOne: IconButton{text:'linkTypeFromOne', helpTip:'Create lines from one object', image:'"+GUIimages.imageLinkTypeFromOne+"'},\
                                linkTypeAll: IconButton{text:'linkTypeAll', helpTip:'Create lines from all objects', image:'"+GUIimages.imageLinkTypeAll+"'},\
                                myIconButton: IconButton{text:'IconButton', image:'file:///C:/AFX_Scripts/ScriptUI%20Panels/AED_Groups/AED_Isolate.png'},\
                                myIconButton: IconButton{text:'IconButton', image:'file:///C:/AFX_Scripts/ScriptUI%20Panels/AED_Groups/AED_Isolate.png'},\
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
                                        },\
                                },\
                                toPanel: Panel{text:'Connect TO',\
                                        toGroup1: Group{text:'', orientation:'row',\
                                                toSelectedButton: Button{text:'Selected Layer'},\
                                                orText2: StaticText{text:'OR'},\
                                                toColorsList: DropDownList{properties:{items:['']}, size:[100, 25]},\
                                        },\
                                        toGroup2: Group{text:'', orientation:'row', alignment:['center', 'center'], alignChildren:['center', 'center'],\
                                                toFeedback: StaticText{text:'', characters:12},\
                                        },\
                                },\
                        },\
                }";

        myPanel.grp = myPanel.add(res);

      //--------------------
      //GENERAL SETTINGS
        
      //First hide connections panels
        myPanel.grp.selectLayersPanel.visible=false;
    
    //Setup panel sizing
    //    myPanel.layout.layout(true);
    //    myPanel.grp.minimumSize = myPanel.grp.size;
        
    //Make panel resizeable
        //myPanel.layout.resize();
        //myPanel.onResizing = myPanel.onResize = function(){this.layout.resize()};
        
    //--------------------
    //CLICK LINK TYPE PANEL
    
    //01
        myPanel.grp.linkTypePanel.linkTypeFromOne.onClick = function() {
            myPanel.grp.selectLayersPanel.visible=true;
            clickLinkTypeFromOne();
        };
    //02
        myPanel.grp.linkTypePanel.linkTypeAll.onClick = function() {
            myPanel.grp.selectLayersPanel.visible=true;
        };
        
        return myPanel;
    }
    var myScriptPal = myScript_buildUI (thisObj);
    
    if  (myScriptPal != null && myScriptPal instanceof Window){
        myScriptPal.center();
        myScriptPal.show();
    }
}

    myScript(this);