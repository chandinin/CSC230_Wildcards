$(document).ready(function() {
	$("#main a[href^='http://']").attr("target","_blank");
	$("#main a[href^='https://']").attr("target","_blank");
	$("#main a[href^='http://']").attr("title","Opens in new window");
	$("#main a[href^='https://']").attr("title","Opens in new window");
	$("#main a[href$='.pdf']").attr("target","_blank");
	$("#main a[href$='.doc']").attr("target","_blank");
	$("#main a[href$='.docx']").attr("target","_blank");
	$("#main a[href$='.ppt']").attr("target","_blank");
	$("#main a[href$='.pptx']").attr("target","_blank");
	$("#main a[href$='.xls']").attr("target","_blank");
	$("#main a[href$='.xlsx']").attr("target","_blank");
});
