$(document).ready(
    function () {
        getOppList();
        getCategories();
        $('.datepicker').datepicker();

        $('#manageOpp').click(function() {
            getOppList();

            $('.table').tablesorter();
            $("#oppsMenu option[id='opplist']").attr("selected", "selected");
        });
        $('#oppListTable tr').click(function() {
            showOpp();
        });
    });

//Get opportunity list from server
function getOppList() {

    $('#oppListTableBody').empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/read.php',true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            fillOppTable(jsonArray);
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}

//Get opportunity list given an id
function getOppListbyID(id) {

    $('#oppListTableBody').empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/read.php?CategoryID='+id,true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            fillOppTable(jsonArray);
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}
//Logic for pagination & fill table
function fillOppTable(jsonArray){

    var start = 0;
    var elements_per_page = 7;
    var limit = elements_per_page;
    var size = jsonArray.opportunity.length;
    fillOppTable(start, limit);

    function fillOppTable(start, limit){
        for(var i=start;i<limit;i++) {
            fillOppTable(jsonArray);
            var opp = jsonArray.opportunity[i];
            var row ="<tr>"+"</td><td>" + opp.OpportunityID+ "</td><td>" + "<a href='javascript:showOppDetails()'>" +  opp.Name + "</a></td><td>"
                + opp.ClosingDate + "<td>"+ opp.Status + " <td>" +  "<button onclick='completeOpportunityEval(\"" + opp.OpportunityID + "\")' id='editOppButton' value='\" + opp.OpportunityID + \"' type='button' class='btn btn-primary btn-sm'>" +
                "Complete</button></td>";
            $('#oppListTableBody').append(row);
            $("#oppListTableBody").trigger("update");
        }
    }
    $('#next').click(function(){
        var next = limit;
        if(size>next) {
            limit = limit + elements_per_page;
            $('#oppListTableBody').empty();
            fillOppTable(next,limit);
        }
    });

    $('#prev').click(function(){
        var pre = limit-(2*elements_per_page);
        if(pre >= 0) {
            limit = limit - elements_per_page;
            $('#oppListTableBody').empty();
            fillOppTable(pre,limit);
        }
    });
}

//TODO write logic to get categories.
function getCategories(){

    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/getOppCategoryList.php',true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            fillCategoryDropdown(jsonArray);
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}

//Fill dropdown
function fillCategoryDropdown(jsonArray){
    var start = 0;
    var select = document.getElementById("selectCategory")
    var size = jsonArray.Category.length;

    for(var i=start;i<size;i++) {
        var option = document.createElement("OPTION");
        txt = document.createTextNode(jsonArray.Category[i].Name);
        option.appendChild(txt);
        option.setAttribute("value", jsonArray.Category[i].Name)
        option.setAttribute("id", jsonArray.Category[i].CategoryID)
        select.insertBefore(option, select.lastChild);
    }
}

$(document).ready(function () {
    $("#selectCategory").change(function () {
        //Storing the dropdown selection in category variable
        category= $('#selectCategory option:selected').attr('id');
        getOppListbyID(category);
    });
});

//Show opportunity detail page
function showOppDetails() {
    //place holder screen
    window.location.replace("Opportunity_new.html")
    //TODO write screen logic for proposal screen
}

//Function to update opportunity status
function completeOpportunityEval(opId) {

    alert(opId);
    //TODO
    //Write logic to update opportunity status to complete.
}