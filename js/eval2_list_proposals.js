//On Start
var opportunityID;
$(document).ready(
    function () {
        var oppName = localStorage.getItem("opportunityName");
        document.getElementById("opportunityName").innerHTML = oppName;
        getProposalList();
        $('#listProposalPanel1').show();
        $('#listProposalPanel2').hide();
        $('#proposalListTable tr').click(function() {
            showOpp();
        });

        //Proposal tab click
        $('#proposalTab').click(function () {
            var oppName = localStorage.getItem("opportunityName");
            document.getElementById("opportunityName").innerHTML = oppName;
            getProposalList();
            $('#listProposalPanel1').show();
            $('#listProposalPanel2').hide();
            $('#proposalListTable tr').click(function() {
                showOpp();
            });
        });

        //Fee calculation tab click
        $('#feeTab').click(function () {
            var oppName = localStorage.getItem("opportunityName");
            getProposalListWithFee();
            document.getElementById("oppName").innerHTML = oppName;
            $('#listProposalPanel1').hide();
            $('#listProposalPanel2').show();
        });
    });

//get proposal list based on opportunity id
//TODO add status = eval 1 closed also as a filter
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

//get proposal list based on opportunity id
//TODO add status = eval 2 closed also as a filter
function getProposalListWithFee() {
    opportunityID = localStorage.getItem("opportunityID");
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

//Fill proposal Fee table and pagination logic
function fillProposalFeeTable(jsonArray){
    var start = 0;
    var elements_per_page = 7;
    var limit = elements_per_page;
    var size = jsonArray.proposal.length;
    fillOppTable(start, limit);

    function fillOppTable(start, limit){
        for(var i=0;i<size;i++) {
            var proposal = jsonArray.proposal[i];
            var row ="<tr>"+"</td><td>"+ proposal.BidderName + "<td>" +  proposal.ProposalID + "</a></td><td>"
                 + proposal.FinalTotalScore + "<td>" +  "<button onclick='calculateFee(\"" + proposal.ProposalID + "\")' id='editOppButton' value='\" + proposal.ProposalID + \"' type='button' " +
                "class='btn btn-primary btn-sm'>" +
                "<span class='glyphicon glyphicon-triangle-right'></span>Calculate Final Score</button><td>" + "<button onclick='awardContract(\"" + proposal.ProposalID + "\")' id='editOppButton' value='\" + proposal.ProposalID + \"' type='button' " +
                "class='btn btn-accept btn-sm'>" +
                "<span class='glyphicon glyphicon-ok-sign'></span>Award Contract</button></td>";

            $('#proposalListFeeTableBody').append(row);
            $("#proposalListFeeTableBody").trigger("update");
        }
    }
    //next
    $('#next').click(function(){
        var next = limit;
        if(size>next) {
            limit = limit + elements_per_page;
            $('#proposalListFeeTableBody').empty();
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
            $('#proposalListFeeTableBody').empty();
            fillOppTable(pre,limit);
        }
    });
}

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

//function to complete processing opportunity
function completeOpportunityEval() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/proposal/AllPropsAcceptRejectByOpp.php?opportunityID='+opportunityID,true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var jsonArray = JSON.parse(xhr.responseText);
            if(jsonArray.result){
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

//calculate fee using lowest fee proposal, proposer's fee proposal and total possible points
function calculateFee(proposalID){
    localStorage.setItem("proposalID",proposalID);
    window.location.replace("fee_calculation.html")
}