function resizeIframeRSNtop(iframe){
	iframe.height = iframe.contentWindow.document.body.scrollHeight + "px";
	//iframe.contentWindow.scrollTo(0,0);

	window.parent.parent.scrollTo(0, 0);
}

function resizeIframe(iframe) {
	iframe.height = iframe.contentWindow.document.body.scrollHeight + 50 + "px";
	//iframe.contentWindow.scrollTo(0,0);

	window.parent.parent.scrollTo(0, 0);

	//var oldURL = window.location.href;
	//var newURLwithoutTimeOutParam = oldURL.replace("&msg=timeout", "");

	//window.history.pushState('page2', 'Title', newURLwithoutTimeOutParam);
}


function resizeFAQWidget(){
	var iframe = document.getElementById('faq-iFrame');
	var AccordionHeight = iframe.contentWindow.document.getElementById('accordion-faq').offsetHeight;
	$(iframe).height(AccordionHeight);
	//iframe.contentWindow.scrollTo(0,0);

}