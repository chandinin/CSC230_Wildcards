$(document).ready(
    function () {
        getDocumentList();
        $('#manageOpp').click(function() {
            getDocumentList();
            $('.table').tablesorter();
            $("#oppsMenu option[id='opplist']").attr("selected", "selected");
        });
    });

//Get all Documents for the proposal from server
function getDocumentList() {

    $('#documentsTableBody').empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/proposal/getDocsList.php?proposalid='+19241,true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            fillDocumentTable(jsonArray);
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}

function fillDocumentTable(jsonArray){
    var start = 0;
    var elements_per_page = 7;
    var limit = elements_per_page;
    var size = jsonArray.doc.length;
    fillDocTable(start, limit);

    function fillDocTable(start, limit){
        for(var i=start;i<limit;i++) {
            var doc = jsonArray.doc[i];
            var row = "<tr><td>" + doc.DocTitle+ "</td><td><a class='btn btn-primary btn-sm' href='" + doc.Url  +
                "'><span class='glyphicon glyphicon-circle-arrow-down' aria-hidden='true'></span>   Download</a> ";
            $('#documentsTableBody').append(row);
            $("#documentsTableBody").trigger("update");
        }
    }

    $('#next').click(function(){
        var next = limit;
        if(size>next) {
            limit = limit + elements_per_page;
            $('#documentsTableBody').empty();
            fillOppTable(next,limit);
        }
    });

    $('#prev').click(function(){
        var pre = limit-(2*elements_per_page);
        if(pre >= 0) {
            limit = limit - elements_per_page;
            $('#documentsTableBody').empty();
            fillOppTable(pre,limit);
        }
    });


}