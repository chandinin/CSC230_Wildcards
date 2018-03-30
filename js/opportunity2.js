$(document).ready(
    function () {
        initNewOppForm();
        $('#newOpp').hide();
        $('#manageOpp').click(function() {
            getOppList();

            $('.table').tablesorter();
            $("#oppsMenu option[id='opplist']").attr("selected", "selected");
        });

        $('.datepicker').datepicker();

        $('#saveNewOpp').click(function() {
            saveOpportunity();
        });
        $('#showNewOpp').click(function (){
            $('#newOpp').show();
            $('#oppList').hide();
        });

        $('#editOpp').hide();
        $('#oppList').show();
        $('#exitNewOpp').click(function() {
            $('#newOpp').hide();
            $('#newOppForm')[0].reset();
            $("#oppList").show();
        });

        $('#clearNewOpp').click(function() {
            $('#newOppForm')[0].reset();
        })
    });

function saveJunk() {





    $('clearFile').click(function() {

    });


    $('#exitNewOpp').click(function() {
        $('#newOpp').hide();
        $('#oppButtons').show();
    });

    //  $('#showEditOpp').hide();  //hiding for 1st pass through
    $('#showEditOpp').click(function() {
        $('#editOpp').show();
        $('#oppButtons').hide();
    });

    $("div.bhoechie-tab-menu>div.list-group>a").click(function(e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
    });

}

function showOpp() {
    alert("this is the opp");
}


function getOppList() {

    $('#oppListTable').empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/read.php',true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = fakedata;
           // var jsonArray = JSON.parse(xhr.responseText);
            var size = jsonArray.opportunity.length;
            for(var i=0;i<size;i++) {
                var opp = jsonArray.opportunity[i];
                var row = "<tr><td>" + opp.OpportunityID + "</td><td>" + "<a href='javascript:showOpp()'>" + opp.Name +
                    "</a></td><td>" + opp.ClosingDate + "</td><td>" + opp.Description + "</td></tr>";
                $('#oppListTable').append(row);
                $("#oppListTable").trigger("update");
            }
        } else {
            alert("Error response");
        }
    };
    xhr.send();

}

function initNewOppForm() {
    getLeadEvals();
    getOppList();
}

function uploadAllDocs() {
    /* Upload scoring criteria*/

        var file = $('#criteriaFile')[0].files[0];
        var opid = $('#formIdInput').val();
        console.log(file.name);
        var formData=new FormData();
        formData.append('ScoringCategoryBlob',file,file.name);
        formData.append('OpportunityID', opid);
        formData.append('filename', file.name);
        var xhr = new XMLHttpRequest();
        xhr.open('POST','http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/uploadScoringCriteria.php');
        //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
            if(xhr.status == 200) {
                alert('Scoring File uploaded');
            } else {
                alert('Error uploading scoring file');
            }
        };
        xhr.send(formData);

        /*upload other documents
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

        */
}

function getLeadEvals() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/employee/read.php',true);
	xhr.onload = function() {
		if (xhr.status == 200) {
			var jsonArray = JSON.parse(xhr.responseText);
			var size = jsonArray.employee.length;
			for(var i=0;i<size;i++) {
				var lead = jsonArray.employee[i];
				var name = lead.first_name + " " + lead.last_name;
                $('select').append($('<option>', {value:lead.id, text:name }));
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
    var senddate = convertDate(close);
    var jsonRecord =
			{"OpportunityID":opId,
                "Name":name,
				"ClosingDate":close,
				"LeadEvaluatorID":lead,
				"LowestBid":10000,
				"Description":desc};
    var xhr = new XMLHttpRequest();
    xhr.open('POST','http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/create.php',true);
    xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=utf-8');  //Creates an  error
    xhr.onload = function() {
        if (xhr.status == 200) {
            alert(xhr.responseText);
            uploadAllDocs();
        } else {
        	alert("Error saving opportunity");
        }
    };
    var jsonString = JSON.stringify(jsonRecord);
    xhr.send(jsonString);
    console.log("Wrote Json: " + jsonString);
}

function submitDocList() {

}


function getDocList() {

}

function convertDate(dateString) {
    var thedate = new Date(dateString);
    var newdate = thedate.getFullYear() + "-" + (thedate.getMonth()+1) + "-" + thedate.getDay() +
                    " " + thedate.getHours() + ":" + thedate.getMinutes() + ":" + thedate.getSeconds();
    return newdate;
}

var fakedata ={
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






