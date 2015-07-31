// Variables
var currentComp,
        time,
        initOn,
        compWidth,
        compHeight,
        selectedLayers,
        selectedFromLayer,
        selectedToLayers,
        layersSize = [],
        layersPosition = [],
        nullsPosition = [],
        layersLabels = ["None", "Red", "Yellow", "Aqua", "Pink", "Lavender", "Peach", "Sea Foam", "Blue", "Green", "Purple", "Orange", "Brown", "Fuschia", "Cyan", "Sandstone", "Dark Green"],
        imageLinkTypeFromOne = (new File($.fileName)).path + "/linkTypeFromOne.png",
        imageLinkTypeAll = (new File($.fileName)).path + "/linkTypeAll.png";

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

    currentComp = app.project.activeItem,
    selectedLayers = currentComp.selectedLayers;
    
    alert(selectedLayers);
    
    if (currentComp == null ) { initOn = 0; alert("You need a composition"); }
    else if (selectedLayers == null || selectedLayers.length < 2) { initOn = 0; alert("You have to select at least 2 layers"); }
    else {
        initOn = 1,
        layersSize.length = 0,
        layersPosition.length = 0,
        nullsPosition.length = 0,
        time = currentComp.time,
        compWidth = currentComp.width,
        compHeight = currentComp.height;
        
        for (i=0; i<selectedLayers.length; i++) {
            getLayersProperty(i);
            createNulls(i);
            createShapes(i);
                //alert(selectedLayers[i].label);
        };
    };
app.endUndoGroup();
};

// --------------------
// UI

function myScript(thisObj){
    function myScript_buildUI(thisObj){
        var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "My window name", undefined, {resizeable:true});
        
        res = "group{orientation:'column',\
                    linkTypePanel: Panel{text:'Link type', orientation:'row',\
                        linkTypeFromOne: IconButton{text:'linkTypeFromOne', image:'file:///"+imageLinkTypeFromOne+"'},\
                        linkTypeAll: IconButton{text:'linkTypeAll', image:'file:///"+imageLinkTypeAll+"'},\
                        myIconButton: IconButton{text:'IconButton', image:'file:///C:/AFX_Scripts/ScriptUI%20Panels/AED_Groups/AED_Isolate.png'},\
                        myIconButton: IconButton{text:'IconButton', image:'file:///C:/AFX_Scripts/ScriptUI%20Panels/AED_Groups/AED_Isolate.png'},\
                    },\
                    selectLayersPanel: Panel{text:'', orientation:'column',\
                        fromGroup: Panel{text:'Connect FROM', orientation:'row',\
                            fromSelectedButton: Button{text:'Selected Layer'},\
                            orText: StaticText{text:'OR'},\
                            fromColorsList: DropDownList{properties:{items:['']}, size:[100, 25]},\
                            fromFeedback: StaticText{text:'0 selected layers'},\
                        },\
                        toGroup: Panel{text:'Connect TO', orientation:'row',\
                            toSelectedButton: Button{text:'Selected Layer'},\
                            orText2: StaticText{text:'OR'},\
                            toColorsList: DropDownList{properties:{items:['']}, size:[100, 25]},\
                            toFeedback: StaticText{text:'0 selected layers'},\
                        },\
                    },\
                }";

        myPanel.grp = myPanel.add(res);
        
        //--------------------
        //LINK TYPE PANEL
        
        //01
        
        //02
        
        //03
        
        //04
        
        //05
        
        
        //--------------------
        //SELECT LAYERS PANEL
        
        //CONNECT FROM
        
        //Add labels to dropdown fromColorsList
        for (k=0;k<layersLabels.length;k++) {
            myPanel.grp.selectLayersPanel.fromGroup.fromColorsList.add("item", layersLabels[k]);
        };
    
        //Click fromSelectedButton
        myPanel.grp.selectLayersPanel.fromGroup.fromSelectedButton.onClick = function() {
            if ( currentComp.selectedLayers.length==0 || currentComp.selectedLayers.length>1 ) {
                alert("Select one layer");
            } else {
                selectedFromLayer = currentComp.selectedLayers;
                myPanel.grp.selectLayersPanel.fromGroup.fromFeedback.text = selectedFromLayer.length+" selected layer";
            };
        };
        
        //CONNECT TO

        //Add labels to dropdown toColorsList
        for (l=0;l<layersLabels.length;l++) {
            myPanel.grp.selectLayersPanel.toGroup.toColorsList.add("item", layersLabels[l]);
        };
    
        //Click toSelectedButton
        myPanel.grp.selectLayersPanel.toGroup.toSelectedButton.onClick = function() {
            if ( currentComp.selectedLayers.length==0 ) {
                alert("Select one layer");
            } else if ( currentComp.selectedLayers.length==1 ) {
                selectedToLayer = currentComp.selectedLayers;
                myPanel.grp.selectLayersPanel.toGroup.toFeedback.text = selectedToLayer.length+" selected layer";
            } else {
                selectedToLayer = currentComp.selectedLayers;
                myPanel.grp.selectLayersPanel.toGroup.toFeedback.text = selectedToLayer.length+" selected layers";
            };
        };
    
      //--------------------
      //GENERAL SETTINGS
        
      //First hide connections panels
        myPanel.grp.selectLayersPanel.visible=false;
    
    //Setup panel sizing
    //    myPanel.layout.layout(true);
    //    myPanel.grp.minimumSize = myPanel.grp.size;
        
    //Make panel resizeable
        myPanel.layout.resize();
        myPanel.onResizing = myPanel.onResize = function(){this.layout.resize()};
        
    //--------------------
    //CLICK
    
        myPanel.grp.linkTypePanel.linkTypeFromOne.onClick = function() {
            init();
            if (initOn==1) {
                myPanel.grp.selectLayersPanel.visible=true;
            };
        };
        myPanel.grp.linkTypePanel.linkTypeAll.onClick = function() {
            init();
            if (initOn==1) {
                myPanel.grp.selectLayersPanel.visible=true;
            };
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