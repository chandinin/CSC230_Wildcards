var staticDialogContent = new Object;
var currentAjaxDialog = "<all>";

function createQuicktip(id, heading, msg, width) {
	if ( heading == null || heading == '')
	{
		heading = "Information";
	}
	createDialog(id, id, id, msg, heading, width, true );
	
	if ((typeof TeaLeaf != "undefined") && (typeof TeaLeaf.Event != "undefined") && (typeof TeaLeaf.Event.tlAddCustomEvent != "undefined"))
	{
		TeaLeaf.Event.tlAddCustomEvent("viewQuicktip", { 'heading': heading }); 
	}
}

function createDialog(loc, id, anchor, msg, heading, width, solo) {		
	if (solo && currentDialog != null) {
		currentDialog.dismissDialog();
	}
	
	if (msg != null)
	{
		staticDialogContent[id] = msg;		
	}
	var content = staticDialogContent[id];
	
	Ept.createSimpleDialog(
			{
				headingText:heading,
				bodyText:msg,
				width:width,
				movable:true,
				lockFocus:true,	
				returnFocus:'#'+loc,
				underlayer: false
			});
}

function createAjaxDialog(url, loc, id, heading, anchor, width, solo) {
	
	if (solo) {
		currentAjaxDialog = anchor;
	} else {
		currentAjaxDialog = "<all>";
	}
	
	$j.get(url, function(data){
		  if (anchor == currentAjaxDialog || currentAjaxDialog == "<all>") {
			  staticDialogContent[id] = data;
			  createDialog(loc, id, heading, anchor, w, solo);
		  }
		});
}

function closeDialog(id, anchor) {
	$j('#dialog_' + id).remove();
	$j('#' + anchor).focus();
}

function addStaticDialogContent(id, msg) {
	staticDialogContent[id] = msg;
}