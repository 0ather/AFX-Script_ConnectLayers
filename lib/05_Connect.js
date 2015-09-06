/** ============================================================
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
