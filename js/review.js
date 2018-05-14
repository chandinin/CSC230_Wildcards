$(document).ready(
    function () {
        initNewOppForm();
       $('#editOppPanel').hide();
        $('#listOppPanel').show();

        $('#manageOpp').click(function () {
            getOppList();
            $('.table').tablesorter();
            $("#oppsMenu option[id='opplist']").attr("selected", "selected");
        });

        $('#oppTab').click(function () {
            showOppList();
        });
        $('.oppListButton').click(function () {
            showOppList();
        });

        $('#editOppButton').click(function () {
            showEditOpp();
        });

        $('.table').tablesorter();

        $("#selectFilterCategory").change(function () {
            //Storing the dropdown selection in category variable
            category= $('#selectFilterCategory option:selected').attr('id');
            getOppListbyCategory(category);
        });

        $('#oppReviewedButton').click(function() {
            var opId = $('#oppNumber').text();
            processOpportunity(opId);
        });
    });


function processOpportunity(opId) {
    var xhr = new XMLHttpRequest();
    var url= "http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/update.php"
    xhr.open('POST', url);
    var formData = new FormData();
    var formData = {"OpportunityID":"" + opId + "","Status":8};
    xhr.onload = function () {
        if (xhr.status == 200) {
            var retval = xhr.responseText;
            console.log("processOp: " +  retval);
            var failed = retval.includes('failed');
            if (failed)
                return;
            else
                alert("Status changed to 'Ready for Approval'");
        } else {
            alert('Unable update Opportunity ' + opId);
        }
        //alert("processed: " + opId);
    }
    xhr.send(JSON.stringify(formData));
}

function showEditOpp(opId) {
    $('#listOppPanel').hide();
    $('#newOppPanel1').hide();
    $('#editOppPanel').show();
    getOpportunity(opId);
    getDocTemplates(opId);
    $('#uploadDocTemplates').val(opId);
    $('.table').tablesorter();
}


function showOppList() {
    getOppList();  //refresh list everytime
    $('#newOppPanel1').hide();
    $('#editOppPanel').hide();
    $('#listOppPanel').show();
}

function getOpportunity(opId) {
var xhr = new XMLHttpRequest();
    var url= "http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/read.php?OpportunityID="+opId;
    xhr.open('POST', url);

    xhr.onload = function () {
    if (xhr.status == 200) {
        var oppArray = JSON.parse(xhr.responseText);
        var catName = categoryArray.Category[oppArray.CategoryID].Name;
        $("#oppNumber").text(oppArray.OpportunityID);
        $("#oppDate").text(oppArray.ClosingDate);
        $("#oppName").text(oppArray.Name);
        $("#oppType").text(catName);
        $("#oppDesc").html(oppArray.Description);
        $("#oppScore").html("<a href='http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/getScoringCriteria.php?OpportunityID="+opId+"'>" +
            "View Scoring Criteria</a>");
    } else {
        alert('Unable to locate Opportunity '+ opId);
    }
};
xhr.send();
}

var oppStat = {"OppStatus":[{"StatusID":"0","Name":"New"},{"StatusID":"3","Name":"Published"},{"StatusID":"4","Name":"Eval 1 Closed"},{"StatusID":"5","Name":"Eval 2 Closed"},{"StatusID":"6","Name":"Closed"},{"StatusID":"7","Name":"Ready for Review"},{"StatusID":"8","Name":"Ready for Approval"},{"StatusID":"9","Name":"Modify"}]};
function getDocTemplates(opId) {
    $('#docTemplatesBody').empty();
    var xhr = new XMLHttpRequest();
    var url= "http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/getDocTemplates.php?OpportunityID="+opId;
    xhr.open('GET',url);
    xhr.onload = function () {
        if (xhr.status == 200) {
            var retval = xhr.responseText;
            var failed = retval.includes('error');
            if(failed)
               return;
            var docArray= JSON.parse(retval);
            var size = docArray.doctemplate.length;
            for(var i = 0; i< size; i++) {
                var template = docArray.doctemplate[i];
                if (template.Url != null) {
                    var row = "<tr><td>" + template.DocTitle + "</td><td><a href ='" + template.Url + "'>" +
                    template.DocTitle + "</a></td><td>" + opId +
                        "</td></tr>";
                    $('#docTemplatesBody').append(row);
                    $("#docTempatesBody").trigger("update");
                }
            }

        } else {
            alert('Error retrieving Document Templates');
        }
    };
    xhr.send();
}
function getOppList() {
    $('#oppListTableBody').empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/read.php?status=7', true);
    xhr.onload = function () {
        if (xhr.status == 200) {
            //var oppArray = fakedata;
            var oppArray = JSON.parse(xhr.responseText);
            fillOppTable(oppArray);
        } else {
            alert("Error response");
        }
    };
    xhr.send();

}

function fillOppTable(oppArray) {
    var size = oppArray.opportunity.length;
    for (var i = 0; i < size; i++) {
        var opp = oppArray.opportunity[i];
        try {
            var catName = categoryArray.Category[opp.CategoryID].Name;
        }catch(err) {
            var catName  = "Undefined";
        }

        var row = "<tr><td>" + catName + "</td></td><td>" + opp.OpportunityID + "</td><td>" + opp.Name +
            "</td><td>" + opp.ClosingDate + "</td><td>" + opp.LastEditDate + "</td><td>" + opp.Description + "</td><td>" +
           opp.StatusName + "</td><td>" +
            "<button onclick='showEditOpp(\"" + opp.OpportunityID + "\")' id='editOppButton' value='" + opp.OpportunityID + "' type='button' class='btn btn-primary btn-lg'>" +
            "<span class='glyphicon glyphicon-eye-open' aria-hidden='true'></span> View</button></td></tr>";
        $('#oppListTableBody').append(row);
        $("#oppListTableBody").trigger("update");

    }
}

function getOppListbyCategory(category) {
    url = 'http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/read.php';
    if(category !=="0")
        url = url + '?CategoryID='+category;
    $('#oppListTableBody').empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET',url,true);
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


function initNewOppForm() {
    getOppList();
    getCategories($('#selectFilterCategory'));
}







//get all categories to populate dropdown
function getCategories(select){
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/getOppCategoryList.php',true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var catArray = JSON.parse(xhr.responseText);
            console.log(xhr.responseText);
            fillCategoryDropdown(catArray,select);
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}

//Fill dropdown with categories
function fillCategoryDropdown(catArray, select){
    var start = 0;
    //var select = document.getElementById("selectCategory")
    var size = catArray.Category.length;

    for(var i=start;i<size;i++) {
        var option = document.createElement("OPTION");
        txt = document.createTextNode(catArray.Category[i].Name);
        option.appendChild(txt);
        option.setAttribute("value", catArray.Category[i].Name)
        option.setAttribute("id", catArray.Category[i].CategoryID)
          select.append(option);
    }
}

function getStatusText(statId) {
    //Bug in get status so just return statId for now
    return statId;
   intId = parseInt(statId);
   statText = statusArray.OppStatus[intId];
   return statText;
}

var categoryArray = {"Category":[{"CategoryID":"0","Name":"None"},{"CategoryID":"1","Name":"Actuarial Services"},{"CategoryID":"2","Name":"Architecture & Engineering"},{"CategoryID":"3","Name":"Construction"},{"CategoryID":"4","Name":"Consulting"},{"CategoryID":"5","Name":"Health"},{"CategoryID":"6","Name":"Information Technology"},{"CategoryID":"7","Name":"Investments (Non-manager)"},{"CategoryID":"8","Name":"Legal Services - Outside Counsel"},{"CategoryID":"9","Name":"Mailing"},{"CategoryID":"10","Name":"Miscellaneous"},{"CategoryID":"11","Name":"Photography\/Video Services"},{"CategoryID":"12","Name":"Printing\/Reproduction\/Graphic Design"}]};

var statusArray ={"OppStatus":[{"StatusID":"0","Name":"New"},{"StatusID":"3","Name":"Published"},{"StatusID":"4","Name":"Eval 1 Closed"},{"StatusID":"5","Name":"Eval 2 Closed"},{"StatusID":"6","Name":"Closed"},{"StatusID":"7","Name":"Ready for Review"},{"StatusID":"8","Name":"Ready for Approval"},{"StatusID":"9","Name":"Modify"}]};
