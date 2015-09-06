/** ============================================================
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
}