$(document).ready(
    function () {
        initNewOppForm(0);
        //turn to inline mode
        $.fn.editable.defaults.mode = 'inline';
        $('#editoppName').editable();
        $('#editoppDate').editable();
        $('#editoppDesc').editable();
        $('#editoppSave').click(function() {
            saveEditOpp($("#editoppNumber").text());
        });
        $('#oppReadyButton').click(function() {
           markReadyforReview($('#oppNumber').text());
        });

       $('#editOppPanel').hide();
        $('#editOppPanel2').hide();
        $('#newOppPanel1').hide();
        $('#listOppPanel').show();

        $('#manageOpp').click(function () {
            getOppList(type);
            $('.table').tablesorter();
            $("#oppsMenu option[id='opplist']").attr("selected", "selected");
        });

        $('#bidTab').click(function() {
            getBidderList();
            getCategories($('#selectBidBiddderCategory'));
        });

        $('#empTab').click(function() {
            getEmployeeList();
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
        $('#docTemplatesBody').sortable();
        $('#oppTab').click(function () {
            showOppList(0);
        });

        $('#awTab').click(function () {
            showOppList(10);
        });

        $('#canTab').click(function () {
            showOppList(2);
        });

        $('#arcTab').click(function () {
            showOppList(1);
        });

        $('.oppListButton').click(function () {
            showOppList(0);
        });

        $('#oppEditButton').click(function () {
            showEditOpp($("#oppNumber").text());
        });

        $('#exitNewOpp').click(function () {
            $('#newOppPanel1').hide();
        });

        $('#uploadDocTemplates').click(function() {
            alert("uploading files...");
            opId = $('#oppNumber').text();
            uploadDocTemplates(opId);
            getDocTemplates(opId);
        });

        $('#clearDocTemplates').click(function () {
            $('#uploadDocTemplatesForm').reset();
        });

        $('.table').tablesorter();

        $("#selectFilterCategory").change(function () {
            //Storing the dropdown selection in category variable
            category= $('#selectFilterCategory option:selected').attr('id');
            getOppListbyCategory(category);
        });

        $("#selectNewCategory").change(function () {
            //Storing the dropdown selection in category variable
            category= $('#selectNewCategory option:selected').attr('id');
            //getOppListbyCategory(id);
        });

        $("#selectBidderCategory").change(function () {
            //Storing the dropdown selection in category variable
            category= $('#selectBidderCategory option:selected').attr('id');
            //getOppListbyCategory(id);
        });


        $('#formDescriptionInput').wysihtml5({
            "font-styles": true, //Font styling, e.g. h1, h2, etc. Default true
            "emphasis": true, //Italics, bold, etc. Default true
            "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
            "html": false, //Button which allows you to edit the generated HTML. Default false
            "link": true, //Button to insert a link. Default true
            "image": false, //Button to insert an image. Default true,
            "color": false, //Button to change color of font
            "blockquote": true, //Blockquote
         });

    });


function markReadyforReview(opId) {
    var xhr = new XMLHttpRequest();
    var url= "http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/update.php"
    xhr.open('POST', url);
    var formData = new FormData();
    formData.append("OpportunityID", opId);
    formData.append("Status", 7);
    xhr.onload = function () {
        if (xhr.status == 200) {
            var retval = xhr.responseText;
            console.log("processOp: " +  retval);
            var failed = retval.includes('failed');
            if (failed)
                return;
            else
                alert("Status changed to 'Ready for Review'");
        } else {
            alert('Unable update Opportunity ' + opId);
        }
        //alert("processed: " + opId);
    }
    xhr.send(formData);
}

function showOppView(opId) {
    $('#listOppPanel').hide();
    $('#newOppPanel1').hide();
    $('#editOppPanel2').hide();
    $('#editOppPanel').show();
    getOpportunity(opId);
    getDocTemplatesView(opId);
    $('#uploadDocTemplates').val(opId);
    makeBreadcrumb(2);
}

function showEditOpp(opId) {
    $('#listOppPanel').hide();
    $('#newOppPanel1').hide();
    $('#editOppPanel').hide();
    $('#editOppPanel2').show();
    getOpportunityEdit(opId);
    getDocTemplates(opId);
    $('#uploadDocTemplates').val(opId);
    makeBreadcrumb(3);
}

function saveEditOpp(opId) {
    var sortedIDs = $( "#docTemplatesBody" ).sortable( "toArray");
    alert("Saving changes to opportunity number " + opId);
}

function showNewOpp() {
    getLeadEvals();
    getCategories($('#selectNewCategory'))
    $('#newOppPanel1').show();
    $('#listOppPanel').hide();
    makeBreadcrumb(1);
}

function showOppList(type) {
    $('#newOppPanel1').hide();
    $('#editOppPanel').hide();
    $('#editOppPanel2').hide();
    switch (type) {
        case 1:
            $('#listOppPanel').hide();
            $('#listAROppPanel').show();
            $('#listCOppPanel').hide();
            $('#listAWOppPanel').hide();
            break;
        case 2:
            $('#listOppPanel').hide();
            $('#listAROppPanel').hide();
            $('#listCOppPanel').show();
            $('#listAWOppPanel').hide();
            break;
        case 10:
            $('#listOppPanel').hide();
            $('#listAROppPanel').hide();
            $('#listCOppPanel').hide();
            $('#listAWOppPanel').show();
            break;
        default:
            $('#listOppPanel').show();
            $('#listAROppPanel').hide();
            $('#listCOppPanel').hide();
            $('#listAWOppPanel').hide();
            break;
    }

    getOppList(type);  //refresh list everytime
    makeBreadcrumb();

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

function getOpportunityEdit(opId) {
    var xhr = new XMLHttpRequest();
    var url= "http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/read.php?OpportunityID="+opId;
    xhr.open('POST', url);

    xhr.onload = function () {
        if (xhr.status == 200) {
            var oppArray = JSON.parse(xhr.responseText);
            var catName = categoryArray.Category[oppArray.CategoryID].Name;
            $("#editoppNumber").text(oppArray.OpportunityID);
            $("#editoppDate").text(oppArray.ClosingDate);
            $("#editoppName").text(oppArray.Name);
            $("#editoppType").text(catName);
            $("#editoppDesc").html(oppArray.Description);
            $("#editoppScore").html("<a href='http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/getScoringCriteria.php?OpportunityID="+opId+"'>" +
                "View Scoring Criteria</a>");
        } else {
            alert('Unable to locate Opportunity '+ opId);
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
            var retval = xhr.responseText;
            var failed = retval.includes('error');
            if(failed)
               return;
            var docArray= JSON.parse(retval);
            var size = docArray.doctemplate.length;
            for(var i = 0; i< size; i++) {
                var template = docArray.doctemplate[i];
                var title = template.DocTitle;
                var docid = template.DocTemplateID;
                var name = template.DocTitle;
                var tempUrl = "https://docs.google.com/viewer?url=http://athena.ecs.csus.edu/~wildcard/data/files/" + template.DocTitle;
                if (template.Url != null) {
                    /*
                var row = "<tr><td>" + title + "</td><td>" + title + "</td><td>" + "Posted Date" + "</td><td>" +
                    "Delete" + "</td></tr>";
                    */
                var row = "<tr id='" + template.DocTemplateID + "'><td class='changeable'>" + template.DocTitle + "</td><td>" + "<a href ='" + tempUrl + "'>" +
                template.DocTitle + "</a></td><td>" + "Posted Date" +
                    "</td><td>" +
                    "<button onclick=\"deleteDoc(\'"+ opId + "\'," + "\'" + template.DocTemplateID + "\')\"" +
                    " class='btn btn-delete'><span class='glyphicon glyphicon-remove'" +
                    "aria-hidden='true'></span> Delete </button></td></tr>";
                    $('#docTemplatesBody').append(row);
                }
            }
            $('#docTemplatesBody').tablesorter();
            $("#docTempatesBody").trigger("update");
            $(".changeable").editable();

        } else {
            alert('Error retrieving Document Templates');
        }
    };
    xhr.send();
}


function getDocTemplatesView(opId) {
    $('#docTemplatesBodyView').empty();
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
                var tempUrl = "https://docs.google.com/viewer?url=http://athena.ecs.csus.edu/~wildcard/data/files/" + template.DocTitle;
                if (template.Url != null) {
                    var row = "<tr><td>" + template.DocTitle + "</td><td>" + "<a href ='" + tempUrl + "'>" +
                        template.DocTitle + "</a></td><td>" + "Posted Date" + "</td><td>temp</td></tr>";
                    $('#docTemplatesBodyView').append(row);
                }
            }
            $('#docTemplatesBodyView').tablesorter();
            $("#docTempatesBodyView").trigger("update");

        } else {
            alert('Error retrieving Document Templates');
        }
    };
    xhr.send();
}

function editDoc(opId, templateId) {
    event.preventDefault();
    alert("Edit OpId: " + opId + " templateId: " + templateId);
}
function deleteDoc(opId, templateId) {
    event.preventDefault();
    var xhr = new XMLHttpRequest();
    var url= "http://athena.ecs.csus.edu/~wildcard/php/api/doctemplate/delete.php";
    var formData = new FormData();
    formData.append('OpportunityID', opId);
    formData.append('doctemplateid',templateId);
    xhr.open("POST",url);
    xhr.onload = function () {
        if (xhr.status == 200) {
            alert("Deleted OpId: " + opId + " templateId: " + templateId);
        }
        else {
            alert("Failed to delete the document.");
        }
    }
    xhr.send();

}

function getOppList(type) {
    /*
    //Athena down 4.22.18
    var oppArray = fakelist;
    fillOppTable(oppArray,type);
    return;
    */

    $('#oppListTableBody').empty();
    var xhr = new XMLHttpRequest();
    var url = "http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/read.php";
    switch (type)  {
        case 1:
            url = url + "?status=1";
            break;
        case 2:
            url = url + "?status=2";
            break;
        case 10:
            url = url + "?status=10";
            break;
        default:
            url= url + "?status=0";
    }
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (xhr.status == 200) {
            //var oppArray = fakedata;
            var oppArray = JSON.parse(xhr.responseText);
            fillOppTable(oppArray, type);
        } else {
            alert("Error response");
        }
    };
    xhr.send();

}

function fillOppTable(oppArray,type) {
    var size = oppArray.opportunity.length;
    var tablename = "oppListTableBody";
    switch (type)  {
        case 1:
            tablename = "oppArListTableBody";
            break;
        case 2:
            tablename = "oppCListTableBody";
            break;
        case 10:
            tablename = "oppAwListTableBody";
            break;
    }
    for (var i = 0; i < size; i++) {
        var opp = oppArray.opportunity[i];
        var oppDesc = opp.Description;
        if (oppDesc.length > 100)
            oppDesc = oppDesc.substr(1, 100) + "...";
        try {
            var catName = categoryArray.Category[opp.CategoryID].Name;
        }catch(err) {
            var catName  = "Undefined";
        }

        var row = "<tr><td>" + catName + "</td></td><td>" + opp.OpportunityID + "</td><td>" + opp.Name +
            "</td><td>" + opp.ClosingDate + "</td><td>" + opp.LastEditDate + "</td><td>" + oppDesc + "</td><td>" +
            opp.StatusName + "</td><td>" +
            "<button onclick='showOppView(\"" + opp.OpportunityID + "\")' id='editOppButton' value='" + opp.OpportunityID + "' type='button' class='btn btn-primary'>" +
            "<span class='glyphicon glyphicon-eye-open' aria-hidden='true'></span> View</button></td></tr>";
        $("#" + tablename).append(row);
        $("#" + tablename).trigger("update");

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


function initNewOppForm(type) {
    getOppList(type);
    getCategories($('#selectFilterCategory'));
    makeBreadcrumb(0);
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
function uploadDocTemplates(opId) {
    /*upload other documents */
    var numfiles =  $('#uploadMFileName')[0].files.length;
    var file;
    var formData=new FormData();
    for(i=0;i<numfiles;i++){
        file = $('#uploadMFileName')[0].files[i];
        formData.append('filename[]', file,file.name);
        console.log(file.name);
    }
    formData.append('OpportunityID',opId);
    formData.append('submit','Upload Image');
    var xhr = new XMLHttpRequest();
    xhr.open('POST','http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/uploadDocArray.php');
    xhr.onload = function() {
        if(xhr.status == 200) {
            alert('File uploaded');
            console.log(xhr.responseText);
            $('#uploadMFileName').val("");
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
            var evalArray = JSON.parse(xhr.responseText);
            var size = evalArray.employee.length;
            for (var i = 0; i < size; i++) {
                var lead = evalArray.employee[i];
                var name = lead.first_name + " " + lead.last_name;
                $('#selectLead').append($('<option>', {value: lead.id, text: name}));
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
    var category = $('#selectNewCategory option:selected').attr('id');
    var jsonRecord =
        {"OpportunityID": opId,
            "ClosingDate":close,
            "LeadEvaluatorID":lead,
            "CategoryID": category,
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

function processOpportunity(opId) {
    var xhr = new XMLHttpRequest();
    var url= "http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/update.php"
    xhr.open('POST', url);
    var formData = new FormData();
    formData.append('OpportunityID', opId);
    formData.append('StatusID', "7");
    xhr.onload = function () {
        if (xhr.status == 200) {
            var retval = xhr.responseText;
            var failed = retval.includes('failed');
            if (failed)
                return;
            else
                alert("Status changed to 'Ready for Review'");
        } else {
            alert('Unable update Opportunity ' + opId);
        }
        //alert("processed: " + opId);
    }
    xhr.send(formData);
}


function makeBreadcrumb(type) {
    $('#breadcrumb').empty();
    $('#breadcrumb').append(staticBreadcrumb);
    switch (type) {
        case 1:
            $("#breadcrumb").append("<li><a onclick='showOppList()'>List Opportunities</a></li>");
            $("#breadcrumb").append("<li class='active'>Create Opportunity</li>")
            break;
        case 2:
            $("#breadcrumb").append("<li><a onclick='showOppList()'>List Opportunities</a></li>");
            $("#breadcrumb").append("<li class='active'>View Opportunity</li>")
            break;
        case 3:
            $("#breadcrumb").append("<li><a onclick='showOppList()'>List Opportunities</a></li>");
            $("#breadcrumb").append("<li class='active'>Edit Opportunity</li>")
            break;
        case 4:
            break;
        default:
            $("#breadcrumb").append("<li class=\"active\">List Opportunities</li>");
            break;
    }
}


var staticBreadcrumb = " <li><a href=\"home_page.html\">Home</a></li>\n";
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

var categoryArray = {"Category":[{"CategoryID":"0","Name":"None"},{"CategoryID":"1","Name":"Actuarial Services"},{"CategoryID":"2","Name":"Architecture & Engineering"},{"CategoryID":"3","Name":"Construction"},{"CategoryID":"4","Name":"Consulting"},{"CategoryID":"5","Name":"Health"},{"CategoryID":"6","Name":"Information Technology"},{"CategoryID":"7","Name":"Investments (Non-manager)"},{"CategoryID":"8","Name":"Legal Services - Outside Counsel"},{"CategoryID":"9","Name":"Mailing"},{"CategoryID":"10","Name":"Miscellaneous"},{"CategoryID":"11","Name":"Photography\/Video Services"},{"CategoryID":"12","Name":"Printing\/Reproduction\/Graphic Design"}]};
