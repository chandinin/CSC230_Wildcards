//On Start
var opportunityID;
$(document).ready(
    function () {
        var oppName = localStorage.getItem("opportunityName");
        document.getElementById("opportunityName").innerHTML = oppName;
        getProposalList();
        $('#listOppPanel').show();
        $('#proposalListTable tr').click(function() {
            showOpp();
        });
    });

//get proposal list based on opportunity id
function getProposalList() {
    opportunityID = localStorage.getItem("opportunityID");
    $('#proposalListTableBody').empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/proposal/read.php?OpportunityID='+opportunityID,true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            fillProposalTable(jsonArray);
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}

//Fill proposal table and pagination logic
function fillProposalTable(jsonArray){
    var start = 0;
    var elements_per_page = 7;
    var limit = elements_per_page;
    var size = jsonArray.proposal.length;
    fillOppTable(start, limit);

    function fillOppTable(start, limit){
        for(var i=0;i<size;i++) {
            var proposal = jsonArray.proposal[i];
            var row ="<tr>"+"</td><td>"+ proposal.BidderName + "<td>" + "<a href='javascript:showProposalDetails(\"" + proposal.ProposalID + "\")'>" +  proposal.ProposalID + "</a></td><td>"
                + new Date(proposal.CreatedDate).toDateString()+ "<td>" + proposal.StatusName + "<td>" +  "<button onclick='showProposalDetails(\"" + proposal.ProposalID + "\")' id='editOppButton' value='\" + proposal.ProposalID + \"' type='button' " +
                "class='btn btn-primary btn-sm'>" +
                "View</button></td>";

            $('#proposalListTableBody').append(row);
            $("#proposalListTableBody").trigger("update");
        }
    }
    //next
    $('#next').click(function(){
        var next = limit;
        if(size>next) {
            limit = limit + elements_per_page;
            $('#proposalListTableBody').empty();
            console.log(next +' -next- '+limit);
            fillOppTable(next,limit);
        }
    });
//prev
    $('#prev').click(function(){
        var pre = limit-(2*elements_per_page);
        if(pre >= 0) {
            limit = limit - elements_per_page;
            console.log(pre +' -pre- '+limit);
            $('#proposalListTableBody').empty();
            fillOppTable(pre,limit);
        }
    });
}

//Store proposal id to pass to next screen to get a list of documents
function showProposalDetails(id) {
    localStorage.setItem("proposalId",id);
    window.location.replace("list_documents.html");
}

//function to complete processing opportunity
function completeOpportunityEval() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/proposal/AllPropsAcceptRejectByOpp.php?opportunityID='+opportunityID,true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            if(jsonArray.result == true){
                alert("update successful");
            }
            else{
                alert("Unable to update opportunity status, please try again!");
            }
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}
