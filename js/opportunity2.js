$(document).ready(
    function () {
        initNewOppForm();
        $('#editOppPanel').hide();
        $('#newOppPanel1').hide();
        $('.datepicker').datepicker();
        $('#listOppPanel').show();

        $('#manageOpp').click(function () {
            getOppList();
            $('.table').tablesorter();
            $("#oppsMenu option[id='opplist']").attr("selected", "selected");
        });


        $('#saveNewOpp').click(function () {
            saveOpportunity();
        });

        $('#showNewOpp').click(function () {
            showNewOpp();
        });

        $('#exitNewOpp').click(function () {
            $('#newOppForm')[0].reset();
            showOppList();
        });

        $('#clearNewOpp').click(function () {
            $('#newOppForm')[0].reset();
        });
/*
        $('#oppListTable tr').click(function () {
            showOpp();
        });
*/
        $('#oppTab').click(function () {
            showOppList();
        });
        $('.oppListButton').click(function () {
            showOppList();
        });

        $('#editOppButton').click(function () {
            showEditOpp();
        });

        $('#exitNewOpp').click(function () {
            $('#newOppPanel1').hide();
        });

        $('#uploadDocTemplates').click(function() {
            uploadDocTemplates();
        });

        $('#clearDocTemplates').click(function () {
            $('#uploadDocTemplatesForm').reset();
        });

        $('.table').tablesorter();
    });

function showEditOpp(opId) {
    //alert("Editing: " + oppId);
    $('#listOppPanel').hide();
    $('#newOppPanel1').hide();
    $('#editOppPanel').show();
    getOpportunity(opId);
    getDocTemplates(opId);
    $('#uploadDocTemplates').val(opId);
    $('.table').tablesorter();
}

function showNewOpp() {
    getLeadEvals();
    $('#newOppPanel1').show();
    $('#listOppPanel').hide();

}

function showOppList() {
    getOppList();  //refresh list everytime
    $('#newOppPanel1').hide();
    $('#editOppPanel').hide();
    $('#listOppPanel').show();
}

function saveJunk() {
    $('clearFile').click(function () {
    });
}


function getOpportunity(opId) {
var xhr = new XMLHttpRequest();
    var url= "http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/read.php?OpportunityID="+opId;
    xhr.open('POST', url);
    xhr.onload = function () {
    if (xhr.status == 200) {
        var jsonArray = JSON.parse(xhr.responseText);
        $("#oppNumber").text(jsonArray.OpportunityID);
        $("#oppDate").text(jsonArray.ClosingDate);
        $("#oppName").text(jsonArray.Name);
        $("#oppType").text("Type");
        $("#oppDesc").text(jsonArray.Description);
    } else {
        alert('');
    }
};
xhr.send();
}

function getDocTemplates(opId) {
    $('#docTemplatesBody').empty();
    var xhr = new XMLHttpRequest();
    var url= "http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/getDocTemplates.php?OpportunityID="+opId;
    xhr.open('GET',url);
    xhr.onload = function () {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            var size = jsonArray.doctemplate.length;
            for(var i = 0; i< size; i++) {
                var template = jsonArray.doctemplate[i];
                if (template.Url != null) {
                    var row = "<tr><td>" + template.DocTitle + "</td><td><a class='btn btn-primary btn-lg' href='" + template.Url +
                        "'><span class='glyphicon glyphicon-circle-arrow-down' aria-hidden='true'></span>   Download</a> " +
                        "<button class='btn btn-delete btn-lg'><span class='glyphicon glyphicon-remove'" +
                        "aria-hidden='true'></span> Delete </button></td></tr>";
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
    xhr.open('GET', 'http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/read.php', true);
    xhr.onload = function () {
        if (xhr.status == 200) {
            //var jsonArray = fakedata;
            var jsonArray = JSON.parse(xhr.responseText);
            var size = jsonArray.opportunity.length;
            for (var i = 0; i < size; i++) {
                var opp = jsonArray.opportunity[i];
                var row = "<tr><td></td></td><td>" + opp.OpportunityID + "</td><td>" + opp.Name +
                    "</td><td>" + opp.ClosingDate + "</td><td>" + opp.Description + "</td><td>" +
                    "Status</td><td>" +
                    "<button onclick='showEditOpp(\"" + opp.OpportunityID + "\")' id='editOppButton' value='" + opp.OpportunityID + "' type='button' class='btn btn-primary btn-lg'>" +
                    "<span class='glyphicon glyphicon-eye-open' aria-hidden='true'></span> View</button></td></tr>";
                $('#oppListTableBody').append(row);
                $("#oppListTableBody").trigger("update");

            }
        } else {
            alert("Error response");
        }
    };
    xhr.send();

}

function initNewOppForm() {
    getOppList();
}

function uploadScoring(file, opId) {
    /* Upload scoring criteria*/
    console.log(file.name);
    var formData = new FormData();
    formData.append('OpportunityID', opId);
    formData.append('filename', file, file.name);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/uploadScoringCriteria.php');
    //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        if (xhr.status == 200) {
            alert('Scoring File uploaded');
        } else {
            alert('Error uploading scoring file');
        }
    };
    xhr.send(formData);
}
function uploadDocTemplates() {
    /*upload other documents */
    var numfiles =  $('#uploadMFileName')[0].files.length;
    var file;
    var formData=new FormData();
    for(i=0;i<numfiles;i++){
        file = $('#uploadMFileName')[0].files[i];
        formData.append('upload[]', file,file.name);
        console.log(file.name);
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST','http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/update.php');
    xhr.onload = function() {
        if(xhr.status == 200) {
            alert('File uploaded');
        } else {
        alert('Error uploading file');
        }
    };
    xhr.send(formData);
}

function getLeadEvals() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://athena.ecs.csus.edu/~wildcard/php/api/employee/read.php', true);
    xhr.onload = function () {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            var size = jsonArray.employee.length;
            for (var i = 0; i < size; i++) {
                var lead = jsonArray.employee[i];
                var name = lead.first_name + " " + lead.last_name;
                $('select').append($('<option>', {value: lead.id, text: name}));
            }
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}

function saveOpportunity() {
    var scoreFile = $('#criteriaFile')[0].files[0];
    var opId = $('#formIdInput').val();
    var name = $('#formNameInput').val();
    var desc = $('#formDescriptionInput').val();
    var close = $('#close_date').val() + " " + $('#close_time').val();
    var lead = parseInt($('#selectLead').val());
    var jsonRecord =
        {"OpportunityID": opId,
            "ClosingDate":close,
            //"ScoringCategoryBlob":null,
            "LeadEvaluatorID":lead,
            "Name":name,
            "LowestBid":"0",
            "Description":desc,
            "Status":"New"
        };

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/create.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=utf-8');  //Creates an  error
    xhr.onload = function () {
        if (xhr.status == 200) {
            var retval = xhr.responseText;
            var failed = retval.includes("failed");
            if(!failed) {
                uploadScoring(scoreFile,opId);
                showEditOpp(opId);
            }
            else
                alert("Failed to create new opportunity");
        } else {
            alert("500: Server error saving opportunity");
        }
    };
    var jsonString = JSON.stringify(jsonRecord);
    xhr.send(jsonString);
    console.log("Wrote Json: " + jsonString);
}

var fakelist = {
    "opportunity": [{
        "OpportunityID": "",
        "ClosingDate": "0000-00-00 00:00:00",
        "ScoringCategoryBlob": null,
        "LeadEvaluatorID": null,
        "Name": "",
        "LowestBid": "10000",
        "Description": ""
    },
        {
            "OpportunityID": "1",
            "ClosingDate": "2019-01-01 12:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "3",
            "Name": null,
            "LowestBid": "10000",
            "Description": null
        },
        {
            "OpportunityID": "1111",
            "ClosingDate": "0000-00-00 00:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "1",
            "Name": "1111 Name Here",
            "LowestBid": "10000",
            "Description": "1111 Description is here"
        },
        {
            "OpportunityID": "2",
            "ClosingDate": "2019-02-14 12:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "2",
            "Name": null,
            "LowestBid": "3000",
            "Description": null
        },
        {
            "OpportunityID": "2018-12",
            "ClosingDate": "0000-00-00 00:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "3",
            "Name": "name",
            "LowestBid": "10000",
            "Description": "desc"
        },
        {
            "OpportunityID": "2018-5544",
            "ClosingDate": "0000-00-00 00:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "1",
            "Name": "Chance to win big",
            "LowestBid": "10000",
            "Description": "This is a really big chance"
        },
        {
            "OpportunityID": "2018-5555",
            "ClosingDate": "0000-00-00 00:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "1",
            "Name": "Chance to win big",
            "LowestBid": "10000",
            "Description": "This is a really big chance"
        },
        {
            "OpportunityID": "2018-909",
            "ClosingDate": "0000-00-00 00:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "3",
            "Name": "Great Opportunity",
            "LowestBid": "10000",
            "Description": "Great Description"
        },
        {
            "OpportunityID": "211-0056",
            "ClosingDate": "0000-00-00 00:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "3",
            "Name": "This is my opportunity",
            "LowestBid": "10000",
            "Description": "Describe"
        },
        {
            "OpportunityID": "2222",
            "ClosingDate": "0000-00-00 00:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "2",
            "Name": "2222 Opportunity",
            "LowestBid": "10000",
            "Description": "2222 Description"
        },
        {
            "OpportunityID": "2243-9987",
            "ClosingDate": "0000-00-00 00:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "1",
            "Name": "Name is here",
            "LowestBid": "10000",
            "Description": "Description is here"
        },
        {
            "OpportunityID": "2294-888",
            "ClosingDate": "0000-00-00 00:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "1",
            "Name": "Opname2",
            "LowestBid": "10000",
            "Description": "opdesc2"
        },
        {
            "OpportunityID": "25",
            "ClosingDate": null,
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": null,
            "Name": null,
            "LowestBid": null,
            "Description": null
        },
        {
            "OpportunityID": "26",
            "ClosingDate": "2019-02-14 12:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "2",
            "Name": "Opp_25",
            "LowestBid": "23014",
            "Description": "FOOBAR************"
        },
        {
            "OpportunityID": "34234",
            "ClosingDate": "0000-00-00 00:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "2",
            "Name": "name",
            "LowestBid": "10000",
            "Description": "desc"
        },
        {
            "OpportunityID": "4444 ",
            "ClosingDate": "0000-00-00 00:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "1",
            "Name": "4444 Oppname",
            "LowestBid": "10000",
            "Description": "4444 Desc"
        },
        {
            "OpportunityID": "54321",
            "ClosingDate": "0000-00-00 00:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "2",
            "Name": "name",
            "LowestBid": "10000",
            "Description": "desc"
        },
        {
            "OpportunityID": "777777",
            "ClosingDate": "2018-12-01 15:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "1",
            "Name": "777Opp",
            "LowestBid": "10000",
            "Description": "777Desc"
        },
        {
            "OpportunityID": "99999",
            "ClosingDate": "0000-00-00 00:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "2",
            "Name": "9999 Opportunity",
            "LowestBid": "10000",
            "Description": "9999 Description"
        },
        {
            "OpportunityID": "tst-zz",
            "ClosingDate": "0000-00-00 00:00:00",
            "ScoringCategoryBlob": null,
            "LeadEvaluatorID": "3",
            "Name": "This is a great one",
            "LowestBid": "10000",
            "Description": "Buy now or dont"
        }]
};

var fakesubmit= {"OpportunityID":"266",
    "ClosingDate":"2019-02-14 12:00:00",
    "ScoringCategoryBlob":null,
    "LeadEvaluatorID":"2",
    "Name":"Opp_266",
    "LowestBid":"0",
    "Description":"this is it************",
    "Status":"New"
};






