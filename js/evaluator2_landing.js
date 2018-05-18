var employeeName = localStorage.getItem("employeeName");
var opportunityName;
//Onstart
$(document).ready(
    function () {
        document.getElementById("employeeName").innerHTML = employeeName;
        getOppList();
        $(".table").tablesorter();
        getCategories();
        $('#manageOpp').click(function() {
            getOppList();
            $("#oppsMenu option[id='opplist']").attr("selected", "selected");
        });
    });

//Get all opportunity list from server
function getOppList() {
    $('#oppListTableBody').empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/read.php?Status=4',true);
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

//Get opportunity list given an categoryid
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
            var opp = jsonArray.opportunity[i];
            var row ="<tr>"+"</td><td>" + opp.OpportunityID+ "</td><td>"
                + "<a href='javascript:showOppDetails(\"" + opp.OpportunityID + '","' + opp.Name + "\")'>" +
                opp.Name + "</a></td><td>"+ opp.ProposalCount + "<td>"+ new Date(opp.ClosingDate).toDateString()+ "<td>"
                + opp.StatusName + " <td>" +  "<button onclick='showOppDetails(\"" +
                opp.OpportunityID + '","'+ opp.Name+ "\")' id='editOppButton' value='\" + opp.OpportunityID + \"' type='button' " +
                "class='btn btn-primary btn-sm'>" +
                "View</button></td>";
            $('#oppListTableBody').tablesorter();
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

//get all categories to populate dropdown
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

//Fill dropdown with categories
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

//Capture the category id of the selection from user
$(document).ready(function () {
    $("#selectCategory").change(function () {
        //Storing the dropdown selection in category variable
        var category= $('#selectCategory option:selected').attr('id');
        getOppListbyID(category);

    });
});

//Show opportunity detail page
function showOppDetails(opId, oppName) {
    localStorage.setItem("opportunityName",oppName);
    localStorage.setItem("opportunityID",opId);
    window.location.replace("eval2_list_proposals.html");
}



