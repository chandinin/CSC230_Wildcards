var proposalID = localStorage.getItem("proposalID");

$(document).ready(
    function () {
        document.getElementById("proposal").innerHTML = proposalID;
        getBidderDetails();
        getScoringCriteria();
    });

//calculate fee with lowest proposal fee, proposers fee and total possible points
function calculateFee(){
    var lowestFeeProposal = document.getElementById("lowestFee").value;
    var proposerFee = document.getElementById("feeProposal").value;
    var totalPossiblePoints = document.getElementById("totalPossiblePoints").value;

    if(lowestFeeProposal == "" || proposerFee == "" || totalPossiblePoints == ""){
        alert("Please enter all fields!");
    }
    else if(proposerFee < 1){
        alert("invalid Proposers Fee value!");
    }
    else{
        var feeProposalScore = (lowestFeeProposal/proposerFee)*totalPossiblePoints;
     document.getElementById("feeProposalScore").innerHTML = feeProposalScore;
     updateProposalTotalScore(feeProposalScore);
    }
}
//Update final proposal score
function updateProposalTotalScore(feeProposalScore){
    var updateProposalScore = {"ProposalID":proposalID,"FinalTotalScore":feeProposalScore};

    var updateProposal = JSON.stringify(updateProposalScore);
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://athena.ecs.csus.edu/~wildcard/php/api/proposal/update.php",true);
    xhttp.onload = function () {
        if (xhttp.status == 200) {
            alert("Proposal Score updated!")
        } else {
            alert("Error seeking clarification!")
        }
    }
    xhttp.send(updateProposal);
}

//get bidder details based on proposal id
function getBidderDetails() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/proposal/getBidder.php?ProposalID='+proposalID,true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var bidderDetails = JSON.parse(xhr.responseText);
            bidderName = bidderDetails.first_name +" " + bidderDetails.last_name;
            document.getElementById("bidderName").innerHTML = bidderName;
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}

function getScoringCriteria(){
    var opportunityID = localStorage.getItem("opportunityID");
    var xhr = new XMLHttpRequest();
    xhr.open('GET','http://athena.ecs.csus.edu/~wildcard/php/api/opportunity/getScoringCriteria.php?OpportunityID='+opportunityID,true);
    xhr.onload = function() {
        if (xhr.status == 200) {
            var scoringCriteria = JSON.parse(xhr.responseText);
            document.getElementById("scorCriteriaDoc").innerHTML = scoringCriteria;
        } else {
            alert("Error response");
        }
    };
    xhr.send();
}