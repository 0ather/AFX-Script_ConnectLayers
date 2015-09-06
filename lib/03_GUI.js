/** ============================================================
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
        
        scriptGUI = "group{orientation:'column',\
                        linkTypePanel: Panel{text:'Link type', orientation:'row',\
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
                        },\
                }";

        connectLayersPalette.grp = connectLayersPalette.add(scriptGUI);

      //--------------------
      //GENERAL SETTINGS
        
      //First hide connections panels
        connectLayersPalette.grp.selectLayersPanel.visible=false;
        connectLayersPalette.grp.selectLayersPanel.fromPanel.fromGroup2.visible=false;
        connectLayersPalette.grp.selectLayersPanel.toPanel.toGroup2.visible=false;
        connectLayersPalette.grp.buildGroup.visible=false;
    
    //Setup panel sizing
        connectLayersPalette.layout.layout(true);
        connectLayersPalette.grp.minimumSize = connectLayersPalette.grp.size;
        
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
