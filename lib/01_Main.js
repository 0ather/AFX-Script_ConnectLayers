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
};