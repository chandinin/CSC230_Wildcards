//On Start
$(document).ready(
    function () {
        getProposalList();
        $('#listOppPanel').show();

        $('#proposalListTable tr').click(function() {
            showOpp();
        });
    });

//get proposal list based on opportunity id
function getProposalList() {
    var opportunityID = localStorage.getItem("opportunityID");
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
            var row ="<tr>"+"</td><td>" + proposal.OpportunityID+ "</td><td>" + "<a href='javascript:showProposalDetails(\"" + proposal.ProposalID + "\")'>" +  proposal.ProposalID + "</a></td><td>"
                + proposal.Status + "</td>";
                "Complete</button></td>";
            $('#proposalListTableBody').append(row);
            $("#proposalListTableBody").trigger("update");
        }
    }
    $('#next').click(function(){
        var next = limit;
        if(size>next) {
            limit = limit + elements_per_page;
            $('#proposalListTableBody').empty();
            console.log(next +' -next- '+limit);
            fillOppTable(next,limit);
        }
    });

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
