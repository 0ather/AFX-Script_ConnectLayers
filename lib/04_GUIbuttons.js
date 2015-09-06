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
clickButtonsLinkTypeGUI();