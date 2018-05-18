//On Start
var opportunityID = localStorage.getItem("opportunityID");
var oppStatus;
$(document).ready(
    function () {
        var oppName = localStorage.getItem("opportunityName");
        document.getElementById("opportunityName").innerHTML = oppName;
        $(".table").tablesorter();
        getProposalList();
/*  todo      if(oppStatus != 5){
            $('#revealFeeButton').hide();
        }*/
        $('#proposalListTable tr').click(function() {
            showOpp();
        });
    });

//get proposal list based on opportunity id and proposal status 15, 25, 30, 60, 65
function getProposalList() {
    $('#proposalListTableBody').empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET',' http://athena.ecs.csus.edu/~wildcard/php/api/proposal/read.php?Status=15&OpportunityID='+opportunityID,true);
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

//get proposal list based on opportunity id
function getProposalListWithFee() {
    $('#proposalListTableBody').empty();
    var xhr = new XMLHttpRequest();
    xhr.open('GET',' http://athena.ecs.csus.edu/~wildcard/php/api/proposal/read.php?Status=65&OpportunityID='+opportunityID,true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            fillProposalFeeTable(jsonArray);
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
        for(var i=start;i<limit;i++){
            var proposal = jsonArray.proposal[i];
            var row ="<tr>"+"</td><td>"+ proposal.BidderName + "<td>" + "<a href='javascript:showProposalDetails(\"" + proposal.ProposalID + "\")'>" +  proposal.ProposalID + "</a></td><td>"
                + proposal.TechnicalScore + "<td>" + new Date(proposal.CreatedDate).toDateString()+ "<td>" + proposal.StatusName + "<td>" +  "<button onclick='showProposalDetails(\"" + proposal.ProposalID + "\")' id='editOppButton' value='\" + proposal.ProposalID + \"' type='button' " +
                "class='btn btn-primary btn-sm'>" +
                "View</button></td>";
            $('#proposalListTableBody').tablesorter();
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



//Award contract button
function awardContract(proposalID){
    var params = {"ProposalID":proposalID,
        "ContractAwarded":1};
    var myJson = JSON.stringify(params);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://athena.ecs.csus.edu/~wildcard/php/api/proposal/update.php",true);
    xhttp.onload = function () {
        if (xhttp.status == 200) {
            alert("Contract awarded to proposal: " +proposalID);
            //update the proposal status based on min opp score
            updateProposalStatus();
        } else {
            alert("Error awarding contract");
        }
    }
    xhttp.send(myJson);
}

//Store proposal id to pass to next screen to get a list of documents
function showProposalDetails(id) {
    localStorage.setItem("proposalId",id);
    window.location.replace("eval2_list_documents.html");
}

//TODO change the end point for eval 2
//function to complete processing opportunity
function completeOpportunityEval() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/proposal/AllPropsAcceptRejectByOpp.php?opportunityID='+opportunityID,true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            if(jsonArray.result){
                alert("update successful");
                //Reveal fee after all proposals in the opportunity have been evluated
                //Todo oppStatus = jsonArray.status
                $('#revealFeeButton').show();
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

function revealFee() {
    localStorage.setItem("opportunityID",opportunityID);
    window.location.replace("reveal_fee.html")
}

