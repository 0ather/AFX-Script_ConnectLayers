// Variables
app.beginUndoGroup("monApp");
var currentComp = app.project.activeItem,
        checkExistingComp,
        time,
        compWidth,
        compHeight,
        selectedLayers,
        layersSize = [],
        layersPosition = [],
        nullsPosition = [];

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
    layersSize.length = 0;
    layersPosition.length = 0;
    nullsPosition.length = 0;
    
    //if ( selectedLayers.length<2 ) {
    //        alert("You have to select 2 layers");
   // } else {
        for (i=0; i<selectedLayers.length; i++) {
            getLayersProperty(i);
            createNulls(i);
            createShapes(i);
            //alert(selectedLayers[i].label);
            
        };
   // };
};


function myScript(thisObj){
    function myScript_buildUI(thisObj){
        var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "My window name", undefined, {resizeable:true});
        
        res = "group{orientation:'column',\
                    groupOne: Group{orientation:'column',\
                        myButton: Button{text:'Button Visible Name'},\
                        myCheckbox: Checkbox{},\
                        myRadioButton: RadioButton{},\
                        myDropDownList: DropDownList{properties:{items:['Item 1', 'Item 2', 'Item 3']}},\
                        myProgressBar: Progressbar{value:50},\
                    },\
                    groupTwo: Group{orientation:'column',\
                        myIconButton: IconButton{text:'IconButton', image:'file:///C:/AFX_Scripts/ScriptUI%20Panels/AED_Groups/AED_Isolate.png'},\
                        myIconButton: IconButton{text:'IconButton', image:'file:///C:/AFX_Scripts/ScriptUI%20Panels/AED_Groups/AED_Isolate.png'},\
                        myIconButton: IconButton{text:'IconButton', image:'file:///C:/AFX_Scripts/ScriptUI%20Panels/AED_Groups/AED_Isolate.png'},\
                        myImage: Image{text:'Image', image:'file:///C:/AFX_Scripts/ScriptUI%20Panels/AED_Groups/AED_Isolate.png'},\
                        myStaticText: StaticText{text:'my Static Text'},\
                        myEditText: EditText{text:'my Edit Text'},\
                        mySlider: Slider{text:'my Slider'},\
                        myScrollBar: Scrollbar{text:'my Scrollbar'},\
                    },\
                }";
        
        myPanel.grp = myPanel.add(res);
        
        return myPanel;
    }
    var myScriptPal = myScript_buildUI (thisObj);
    
    if  (myScriptPal != null && myScriptPal instanceof Window){
        myScriptPal.center();
        myScriptPal.show();
    }
}


if (currentComp == null ) { alert("You need a composition"); } 
else { 
    time = currentComp.time,
    compWidth = currentComp.width,
    compHeight = currentComp.height;
    selectedLayers = currentComp.selectedLayers;
    init();
    myScript(this);
}
app.endUndoGroup();